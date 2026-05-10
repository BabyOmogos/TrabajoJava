import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, 'data', 'polizas.json');

const PORT = process.env.PORT || 3001;

const MATRICULA_LETTERS = 'BCDEFGHJKLMNPRSTVWXYZ';

function serverValidate(p) {
  const errors = [];
  if (!/^ID\d{5}$/.test(p.id_poliza)) errors.push('id_poliza inválido');
  const v = Number(p.vigencia);
  if (!Number.isInteger(v) || v < 1 || v > 21) errors.push('vigencia debe estar entre 1 y 21');
  const plateRe = new RegExp(`^[0-9]{4}[${MATRICULA_LETTERS}]{3}$`);
  if (!plateRe.test(String(p.matricula || '').toUpperCase())) errors.push('matrícula inválida');
  const ec = Number(p.edad_coche);
  if (!Number.isInteger(ec) || ec < 0 || ec > 10) errors.push('edad_coche entre 0 y 10');
  const et = Number(p.edad_tomador);
  if (!Number.isInteger(et) || et < 18 || et > 90) errors.push('edad_tomador entre 18 y 90');
  const cil = Number(p.cilindrada);
  if (!Number.isFinite(cil) || cil <= 0) errors.push('cilindrada inválida');
  const nCil = Number(p.cilindros);
  if (!Number.isInteger(nCil) || nCil < 1) errors.push('cilindros inválido');
  const peso = Number(p.peso);
  if (!Number.isFinite(peso) || peso <= 0) errors.push('peso inválido');
  if (!['Manual', 'Automática'].includes(p.transmision)) errors.push('transmisión inválida');
  if (!['Combustión', 'Eléctrico'].includes(p.comb_electrico)) errors.push('comb_electrico inválido');
  const s = Number(p.siniestro);
  if (![0, 1].includes(s)) errors.push('siniestro debe ser 0 o 1');
  return errors;
}

function normalizePoliza(body) {
  return {
    id_poliza: String(body.id_poliza || '').trim(),
    vigencia: Number(body.vigencia),
    matricula: String(body.matricula || '').trim().toUpperCase(),
    edad_coche: Number(body.edad_coche),
    edad_tomador: Number(body.edad_tomador),
    cilindrada: Number(body.cilindrada),
    cilindros: Number(body.cilindros),
    transmision: body.transmision,
    comb_electrico: body.comb_electrico,
    peso: Number(body.peso),
    siniestro: Number(body.siniestro),
  };
}

async function readPolizas() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writePolizas(arr) {
  await fs.writeFile(DATA_PATH, JSON.stringify(arr, null, 2), 'utf8');
}

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

app.get('/polizas', async (_req, res) => {
  try {
    const data = await readPolizas();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.get('/polizas/:id_poliza', async (req, res) => {
  try {
    const data = await readPolizas();
    const p = data.find((x) => x.id_poliza === req.params.id_poliza);
    if (!p) return res.status(404).json({ error: 'Póliza no encontrada' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.post('/polizas', async (req, res) => {
  try {
    const body = normalizePoliza(req.body);
    const err = serverValidate(body);
    if (err.length) return res.status(400).json({ errors: err });

    const data = await readPolizas();
    if (data.some((x) => x.id_poliza === body.id_poliza)) {
      return res.status(409).json({ error: 'Ya existe una póliza con ese id_poliza' });
    }
    if (data.some((x) => x.matricula === body.matricula)) {
      return res.status(409).json({ error: 'Ya existe esa matrícula' });
    }
    data.push(body);
    await writePolizas(data);
    res.status(201).json(body);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.put('/polizas/:id_poliza', async (req, res) => {
  try {
    const id = req.params.id_poliza;
    const data = await readPolizas();
    const idx = data.findIndex((x) => x.id_poliza === id);
    if (idx === -1) return res.status(404).json({ error: 'Póliza no encontrada' });

    const prev = data[idx];
    const body = normalizePoliza({ ...req.body, id_poliza: prev.id_poliza, matricula: prev.matricula });
    const err = serverValidate(body);
    if (err.length) return res.status(400).json({ errors: err });

    data[idx] = body;
    await writePolizas(data);
    res.json(body);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.delete('/polizas/:id_poliza', async (req, res) => {
  try {
    const data = await readPolizas();
    const next = data.filter((x) => x.id_poliza !== req.params.id_poliza);
    if (next.length === data.length) return res.status(404).json({ error: 'Póliza no encontrada' });
    await writePolizas(next);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

function aplicarFiltros(lista, q) {
  const { transmision, comb_electrico, siniestro } = q;
  return lista.filter((p) => {
    if (transmision && transmision !== 'todos' && p.transmision !== transmision) return false;
    if (comb_electrico && comb_electrico !== 'todos' && p.comb_electrico !== comb_electrico) return false;
    if (siniestro !== undefined && siniestro !== '' && siniestro !== 'todos') {
      if (Number(p.siniestro) !== Number(siniestro)) return false;
    }
    return true;
  });
}

app.get('/estadisticas', async (req, res) => {
  try {
    const data = await readPolizas();
    const filtradas = aplicarFiltros(data, req.query);
    const n = filtradas.length;
    const con = filtradas.filter((p) => p.siniestro === 1).length;
    const sin = n - con;
    const pctCon = n ? (con / n) * 100 : 0;
    const pctSin = n ? (sin / n) * 100 : 0;
    const mediaEdadCoche =
      n === 0 ? 0 : filtradas.reduce((a, p) => a + p.edad_coche, 0) / n;
    const mediaEdadTomador =
      n === 0 ? 0 : filtradas.reduce((a, p) => a + p.edad_tomador, 0) / n;

    res.json({
      total: n,
      conSiniestro: con,
      sinSiniestro: sin,
      porcentajeConSiniestro: Math.round(pctCon * 100) / 100,
      porcentajeSinSiniestro: Math.round(pctSin * 100) / 100,
      mediaEdadCoche: Math.round(mediaEdadCoche * 100) / 100,
      mediaEdadTomador: Math.round(mediaEdadTomador * 100) / 100,
    });
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.listen(PORT, () => {
  console.log(`API pólizas en http://localhost:${PORT}`);
});

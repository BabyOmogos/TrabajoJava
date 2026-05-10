import { useEffect, useState } from 'react';
import { getPolizas, postPoliza } from '../api.js';
import { useValidacion } from '../context/ValidationContext.jsx';
import TablaPolizas from '../components/TablaPolizas.jsx';
import PolizaFormFields from '../components/PolizaFormFields.jsx';

const vacioAlta = {
  id_poliza: '',
  vigencia: '',
  matricula: '',
  edad_coche: '',
  edad_tomador: '',
  cilindrada: '',
  cilindros: '',
  transmision: 'Manual',
  comb_electrico: 'Combustión',
  peso: '',
  siniestro: 0,
};

export default function AltaPoliza() {
  const { validarPoliza } = useValidacion();
  const [polizas, setPolizas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorLista, setErrorLista] = useState('');

  const [alta, setAlta] = useState(vacioAlta);
  const [msgAlta, setMsgAlta] = useState('');
  const [errAlta, setErrAlta] = useState('');

  async function recargar() {
    setCargando(true);
    setErrorLista('');
    try {
      const data = await getPolizas();
      setPolizas(data);
    } catch (e) {
      setErrorLista(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    recargar();
  }, []);

  async function onAlta(e) {
    e.preventDefault();
    setErrAlta('');
    setMsgAlta('');
    const datos = {
      ...alta,
      vigencia: Number(alta.vigencia),
      edad_coche: Number(alta.edad_coche),
      edad_tomador: Number(alta.edad_tomador),
      cilindrada: Number(alta.cilindrada),
      cilindros: Number(alta.cilindros),
      peso: Number(alta.peso),
      siniestro: Number(alta.siniestro),
      matricula: alta.matricula.trim().toUpperCase(),
      id_poliza: alta.id_poliza.trim(),
    };
    const v = validarPoliza(datos, { modo: 'alta' });
    if (v.length) {
      setErrAlta(v.join(' '));
      return;
    }
    try {
      await postPoliza(datos);
      setMsgAlta('Póliza creada correctamente.');
      setAlta(vacioAlta);
      await recargar();
    } catch (err) {
      setErrAlta(err.message);
    }
  }

  return (
    <>
      <h1>Alta de póliza</h1>

      <form className="section" onSubmit={onAlta}>
        <PolizaFormFields data={alta} onChange={setAlta} lockIdMatricula={false} />
        {errAlta && <p className="error">{errAlta}</p>}
        {msgAlta && <p className="msg">{msgAlta}</p>}
        <button type="submit">Dar de alta</button>
      </form>

      <h2>Pólizas actuales</h2>
      {cargando && <p>Cargando…</p>}
      {errorLista && <p className="error">{errorLista}</p>}
      {!cargando && !errorLista && <TablaPolizas polizas={polizas} />}
    </>
  );
}

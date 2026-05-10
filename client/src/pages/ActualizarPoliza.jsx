import { useEffect, useState } from 'react';
import { getPoliza, getPolizas, putPoliza } from '../api.js';
import { useValidacion } from '../context/ValidationContext.jsx';
import TablaPolizas from '../components/TablaPolizas.jsx';
import PolizaFormFields from '../components/PolizaFormFields.jsx';

export default function ActualizarPoliza() {
  const { validarPoliza } = useValidacion();
  const [polizas, setPolizas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorLista, setErrorLista] = useState('');

  const [idBuscar, setIdBuscar] = useState('');
  const [edit, setEdit] = useState(null);
  const [msgEdit, setMsgEdit] = useState('');
  const [errEdit, setErrEdit] = useState('');

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

  async function cargarParaEditar(e) {
    e.preventDefault();
    setErrEdit('');
    setMsgEdit('');
    setEdit(null);
    try {
      const p = await getPoliza(idBuscar.trim());
      setEdit({ ...p });
    } catch (err) {
      setErrEdit(err.message);
    }
  }

  async function onGuardarEdicion(e) {
    e.preventDefault();
    if (!edit) return;
    setErrEdit('');
    setMsgEdit('');
    const datos = {
      ...edit,
      vigencia: Number(edit.vigencia),
      edad_coche: Number(edit.edad_coche),
      edad_tomador: Number(edit.edad_tomador),
      cilindrada: Number(edit.cilindrada),
      cilindros: Number(edit.cilindros),
      peso: Number(edit.peso),
      siniestro: Number(edit.siniestro),
    };
    const v = validarPoliza(datos, { modo: 'edicion' });
    if (v.length) {
      setErrEdit(v.join(' '));
      return;
    }
    try {
      await putPoliza(edit.id_poliza, datos);
      setMsgEdit('Cambios guardados.');
      await recargar();
    } catch (err) {
      setErrEdit(err.message);
    }
  }

  return (
    <>
      <h1>Actualizar póliza</h1>

      <form className="section" onSubmit={cargarParaEditar} style={{ maxWidth: '360px' }}>
        <label>
          Identificador a editar
          <input value={idBuscar} onChange={(e) => setIdBuscar(e.target.value)} />
        </label>
        {errEdit && !edit && <p className="error">{errEdit}</p>}
        <button type="submit" className="secondary">
          Cargar datos
        </button>
      </form>

      {edit && (
        <form className="section" onSubmit={onGuardarEdicion}>
          <PolizaFormFields data={edit} onChange={setEdit} lockIdMatricula />
          {errEdit && <p className="error">{errEdit}</p>}
          {msgEdit && <p className="msg">{msgEdit}</p>}
          <button type="submit">Guardar cambios</button>
        </form>
      )}

      <h2>Pólizas actuales</h2>
      {cargando && <p>Cargando…</p>}
      {errorLista && <p className="error">{errorLista}</p>}
      {!cargando && !errorLista && <TablaPolizas polizas={polizas} />}
    </>
  );
}

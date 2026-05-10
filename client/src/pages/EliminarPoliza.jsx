import { useEffect, useState } from 'react';
import { deletePoliza, getPolizas } from '../api.js';
import TablaPolizas from '../components/TablaPolizas.jsx';

export default function EliminarPoliza() {
  const [polizas, setPolizas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorLista, setErrorLista] = useState('');

  const [idBorrar, setIdBorrar] = useState('');
  const [msgBorrar, setMsgBorrar] = useState('');

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

  async function onBorrarPorId(e) {
    e.preventDefault();
    setMsgBorrar('');
    const id = idBorrar.trim();
    if (!id) return;
    if (!window.confirm(`¿Eliminar la póliza ${id}?`)) return;
    try {
      await deletePoliza(id);
      setMsgBorrar('Póliza eliminada.');
      setIdBorrar('');
      await recargar();
    } catch (err) {
      setMsgBorrar(err.message);
    }
  }

  async function eliminarDeTabla(id) {
    if (!window.confirm(`¿Eliminar la póliza ${id}?`)) return;
    try {
      await deletePoliza(id);
      setMsgBorrar('Póliza eliminada.');
      await recargar();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <h1>Eliminar póliza</h1>

      <form className="section" onSubmit={onBorrarPorId} style={{ maxWidth: '360px' }}>
        <label>
          Identificador
          <input value={idBorrar} onChange={(e) => setIdBorrar(e.target.value)} />
        </label>
        <button type="submit" className="danger">
          Eliminar
        </button>
        {msgBorrar && <p className="msg">{msgBorrar}</p>}
      </form>

      <h2>Listado (eliminar desde la tabla)</h2>
      {cargando && <p>Cargando…</p>}
      {errorLista && <p className="error">{errorLista}</p>}
      {!cargando && !errorLista && <TablaPolizas polizas={polizas} onEliminar={eliminarDeTabla} />}
    </>
  );
}

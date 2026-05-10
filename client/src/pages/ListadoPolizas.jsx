import { useEffect, useState } from 'react';
import { getPolizas } from '../api.js';
import TablaPolizas from '../components/TablaPolizas.jsx';

export default function ListadoPolizas() {
  const [polizas, setPolizas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorLista, setErrorLista] = useState('');

  useEffect(() => {
    let activo = true;
    (async () => {
      setCargando(true);
      setErrorLista('');
      try {
        const data = await getPolizas();
        if (activo) setPolizas(data);
      } catch (e) {
        if (activo) setErrorLista(e.message);
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  return (
    <>
      <h1>Listado de pólizas</h1>

      {cargando && <p>Cargando pólizas…</p>}
      {errorLista && <p className="error">{errorLista}</p>}
      {!cargando && !errorLista && <TablaPolizas polizas={polizas} />}
    </>
  );
}

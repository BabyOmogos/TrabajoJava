import { useEffect, useState } from 'react';
import { getEstadisticas } from '../api.js';

const inicialFiltros = {
  transmision: 'todos',
  comb_electrico: 'todos',
  siniestro: 'todos',
};

export default function Estadisticas() {
  const [filtros, setFiltros] = useState(inicialFiltros);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setCargando(true);
      setError('');
      try {
        const data = await getEstadisticas(filtros);
        if (!cancel) setStats(data);
      } catch (e) {
        if (!cancel) setError(e.message);
      } finally {
        if (!cancel) setCargando(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [filtros]);

  return (
    <>
      <h1>Estadísticas</h1>

      <div className="filters">
        <label>
          Transmisión
          <select
            value={filtros.transmision}
            onChange={(e) => setFiltros({ ...filtros, transmision: e.target.value })}
          >
            <option value="todos">Todos</option>
            <option>Manual</option>
            <option>Automática</option>
          </select>
        </label>
        <label>
          Combustión / Eléctrico
          <select
            value={filtros.comb_electrico}
            onChange={(e) => setFiltros({ ...filtros, comb_electrico: e.target.value })}
          >
            <option value="todos">Todos</option>
            <option>Combustión</option>
            <option>Eléctrico</option>
          </select>
        </label>
        <label>
          Siniestro
          <select
            value={filtros.siniestro}
            onChange={(e) => setFiltros({ ...filtros, siniestro: e.target.value })}
          >
            <option value="todos">Todos</option>
            <option value="1">Sí</option>
            <option value="0">No</option>
          </select>
        </label>
      </div>

      {cargando && <p>Cargando…</p>}
      {error && <p className="error">{error}</p>}

      {stats && !cargando && (
        <div className="stats-grid">
          <div className="stat-card">
            Total pólizas (filtro)
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card">
            % con siniestro
            <strong>{stats.porcentajeConSiniestro} %</strong>
          </div>
          <div className="stat-card">
            % sin siniestro
            <strong>{stats.porcentajeSinSiniestro} %</strong>
          </div>
          <div className="stat-card">
            Media edad coche
            <strong>{stats.mediaEdadCoche}</strong>
          </div>
          <div className="stat-card">
            Media edad tomador
            <strong>{stats.mediaEdadTomador}</strong>
          </div>
          <div className="stat-card">
            Pólizas con siniestro (nº)
            <strong>{stats.conSiniestro}</strong>
          </div>
          <div className="stat-card">
            Pólizas sin siniestro (nº)
            <strong>{stats.sinSiniestro}</strong>
          </div>
        </div>
      )}
    </>
  );
}

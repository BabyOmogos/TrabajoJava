import { NavLink, Route, Routes } from 'react-router-dom';
import ListadoPolizas from './pages/ListadoPolizas.jsx';
import AltaPoliza from './pages/AltaPoliza.jsx';
import ActualizarPoliza from './pages/ActualizarPoliza.jsx';
import EliminarPoliza from './pages/EliminarPoliza.jsx';
import Estadisticas from './pages/Estadisticas.jsx';

const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

export default function App() {
  return (
    <>
      <nav className="app-nav">
        <NavLink end to="/" className={linkClass}>
          Listado
        </NavLink>
        <NavLink to="/alta" className={linkClass}>
          Alta
        </NavLink>
        <NavLink to="/actualizar" className={linkClass}>
          Actualizar
        </NavLink>
        <NavLink to="/eliminar" className={linkClass}>
          Eliminar
        </NavLink>
        <NavLink to="/estadisticas" className={linkClass}>
          Estadísticas
        </NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<ListadoPolizas />} />
          <Route path="/alta" element={<AltaPoliza />} />
          <Route path="/actualizar" element={<ActualizarPoliza />} />
          <Route path="/eliminar" element={<EliminarPoliza />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
        </Routes>
      </main>
    </>
  );
}

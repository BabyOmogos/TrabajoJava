export default function TablaPolizas({ polizas, onEliminar }) {
  const mostrarAcciones = typeof onEliminar === 'function';
  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Vigencia (meses)</th>
            <th>Matrícula</th>
            <th>Edad del coche (años)</th>
            <th>Edad del tomador (años)</th>
            <th>Cilindrada (cm³)</th>
            <th>Cilindros</th>
            <th>Transmisión</th>
            <th>Tipo de motor</th>
            <th>Peso (kg)</th>
            <th>¿Siniestro?</th>
            {mostrarAcciones && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {polizas.map((p) => (
            <tr key={p.id_poliza}>
              <td>{p.id_poliza}</td>
              <td>{p.vigencia}</td>
              <td>{p.matricula}</td>
              <td>{p.edad_coche}</td>
              <td>{p.edad_tomador}</td>
              <td>{p.cilindrada}</td>
              <td>{p.cilindros}</td>
              <td>{p.transmision}</td>
              <td>{p.comb_electrico}</td>
              <td>{p.peso}</td>
              <td>{p.siniestro === 1 ? 'Sí' : 'No'}</td>
              {mostrarAcciones && (
                <td>
                  <button type="button" className="danger" onClick={() => onEliminar(p.id_poliza)}>
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

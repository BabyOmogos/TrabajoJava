export default function PolizaFormFields({ data, onChange, lockIdMatricula = false }) {
  const set = (patch) => onChange({ ...data, ...patch });

  return (
    <>
      <label>
        Identificador
        <input
          value={data.id_poliza}
          onChange={(e) => set({ id_poliza: e.target.value })}
          placeholder="ID00001"
          disabled={lockIdMatricula}
        />
      </label>
      <label>
        Vigencia (meses)
        <input
          type="number"
          min={1}
          max={21}
          value={data.vigencia}
          onChange={(e) => set({ vigencia: e.target.value })}
        />
      </label>
      <label>
        Matrícula
        <input
          value={data.matricula}
          onChange={(e) => set({ matricula: e.target.value })}
          placeholder="1234BCD"
          disabled={lockIdMatricula}
        />
      </label>
      <label>
        Edad del coche (años)
        <input
          type="number"
          min={0}
          max={10}
          value={data.edad_coche}
          onChange={(e) => set({ edad_coche: e.target.value })}
        />
      </label>
      <label>
        Edad del tomador (años)
        <input
          type="number"
          min={18}
          max={90}
          value={data.edad_tomador}
          onChange={(e) => set({ edad_tomador: e.target.value })}
        />
      </label>
      <label>
        Cilindrada (cm³)
        <input type="number" value={data.cilindrada} onChange={(e) => set({ cilindrada: e.target.value })} />
      </label>
      <label>
        Cilindros
        <input
          type="number"
          min={1}
          value={data.cilindros}
          onChange={(e) => set({ cilindros: e.target.value })}
        />
      </label>
      <label>
        Transmisión
        <select value={data.transmision} onChange={(e) => set({ transmision: e.target.value })}>
          <option>Manual</option>
          <option>Automática</option>
        </select>
      </label>
      <label>
        Tipo de motor
        <select value={data.comb_electrico} onChange={(e) => set({ comb_electrico: e.target.value })}>
          <option>Combustión</option>
          <option>Eléctrico</option>
        </select>
      </label>
      <label>
        Peso (kg)
        <input type="number" value={data.peso} onChange={(e) => set({ peso: e.target.value })} />
      </label>
      <label>
        ¿Siniestro?
        <select
          value={data.siniestro}
          onChange={(e) => set({ siniestro: Number(e.target.value) })}
        >
          <option value={0}>No</option>
          <option value={1}>Sí</option>
        </select>
      </label>
    </>
  );
}

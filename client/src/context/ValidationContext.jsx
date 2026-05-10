import { createContext, useContext } from 'react';

const ValidationContext = createContext(null);

const LETRAS_MATRICULA = 'BCDEFGHJKLMNPRSTVWXYZ';

const regexIdPoliza = /^ID\d{5}$/;
const regexMatricula = new RegExp(`^[0-9]{4}[${LETRAS_MATRICULA}]{3}$`);

function validarPoliza(datos, { modo } = { modo: 'alta' }) {
  const errores = [];
  if (modo === 'alta') {
    if (!regexIdPoliza.test((datos.id_poliza || '').trim())) {
      errores.push('El identificador debe tener el formato IDXXXXX (5 dígitos).');
    }
    if (!regexMatricula.test((datos.matricula || '').trim().toUpperCase())) {
      errores.push(
        'Matrícula: 4 números y 3 letras (sin espacios), letras permitidas según enunciado.'
      );
    }
  }

  const v = Number(datos.vigencia);
  if (datos.vigencia === '' || Number.isNaN(v) || !Number.isInteger(v) || v < 1 || v > 21) {
    errores.push('La vigencia debe ser un entero entre 1 y 21 meses.');
  }

  if (modo === 'alta' || modo === 'edicion') {
    const m = (datos.matricula || '').trim().toUpperCase();
    if (modo === 'edicion' && m && !regexMatricula.test(m)) {
      errores.push('Matrícula no válida.');
    }
  }

  const ec = Number(datos.edad_coche);
  if (datos.edad_coche === '' || Number.isNaN(ec) || !Number.isInteger(ec) || ec < 0 || ec > 10) {
    errores.push('La edad del coche debe ser entre 0 y 10.');
  }

  const et = Number(datos.edad_tomador);
  if (datos.edad_tomador === '' || Number.isNaN(et) || !Number.isInteger(et) || et < 18 || et > 90) {
    errores.push('La edad del tomador debe ser entre 18 y 90 años.');
  }

  const cil = Number(datos.cilindrada);
  if (datos.cilindrada === '' || Number.isNaN(cil) || cil <= 0) {
    errores.push('Cilindrada obligatoria y mayor que 0.');
  }

  const nCil = Number(datos.cilindros);
  if (datos.cilindros === '' || Number.isNaN(nCil) || !Number.isInteger(nCil) || nCil < 1) {
    errores.push('Cilindros: entero mayor o igual que 1.');
  }

  const peso = Number(datos.peso);
  if (datos.peso === '' || Number.isNaN(peso) || peso <= 0) {
    errores.push('Peso obligatorio y mayor que 0.');
  }

  if (!['Manual', 'Automática'].includes(datos.transmision)) {
    errores.push('Transmisión: Manual o Automática.');
  }
  if (!['Combustión', 'Eléctrico'].includes(datos.comb_electrico)) {
    errores.push('Tipo motor: Combustión o Eléctrico.');
  }

  const s = Number(datos.siniestro);
  if (![0, 1].includes(s)) {
    errores.push('Siniestro: Sí (1) o No (0).');
  }

  return errores;
}

const validationValue = {
  regexIdPoliza,
  regexMatricula,
  LETRAS_MATRICULA,
  validarPoliza,
};

export function ValidationProvider({ children }) {
  return (
    <ValidationContext.Provider value={validationValue}>{children}</ValidationContext.Provider>
  );
}

export function useValidacion() {
  const ctx = useContext(ValidationContext);
  if (!ctx) throw new Error('useValidacion debe usarse dentro de ValidationProvider');
  return ctx;
}

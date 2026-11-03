import assert from "node:assert/strict";
import { test } from "node:test";
import { PERIODOS, periodoValido, promedio } from "./periodos.js";

// 2026-11-02 es lunes. Buenos Aires está 3 horas detrás de UTC.
const ahora = new Date("2026-11-02T18:00:00Z");

test("periodoValido: acepta los de la API y cae en semana con cualquier otro valor", () => {
  assert.equal(periodoValido("mes"), "mes");
  assert.equal(periodoValido("anio"), "anio");
  assert.equal(periodoValido("siglo"), "semana");
  assert.equal(periodoValido(undefined), "semana");
  assert.equal(periodoValido("toString"), "semana");
});

test("etiqueta semana: inicial del día", () => {
  assert.equal(PERIODOS.semana.etiqueta("2026-11-02"), "L");
  assert.equal(PERIODOS.semana.etiqueta("2026-11-01"), "D");
});

test("etiqueta mes: el día 1 y cada 5, el resto vacío", () => {
  assert.equal(PERIODOS.mes.etiqueta("2026-11-01"), "1");
  assert.equal(PERIODOS.mes.etiqueta("2026-11-05"), "5");
  assert.equal(PERIODOS.mes.etiqueta("2026-11-30"), "30");
  assert.equal(PERIODOS.mes.etiqueta("2026-11-07"), "");
});

test("etiqueta anio: inicial del mes", () => {
  assert.equal(PERIODOS.anio.etiqueta("2026-03"), "M");
  assert.equal(PERIODOS.anio.etiqueta("2026-11"), "N");
});

test("promedio semana: no cuenta los días futuros", () => {
  const barras = [
    { fecha: "2026-11-01", cafe_ml: 60 },
    { fecha: "2026-11-02", cafe_ml: 30 },
    { fecha: "2026-11-03", cafe_ml: 900 },
  ];
  assert.equal(promedio(barras, "cafe_ml", "semana", ahora), 45);
});

test("promedio: redondea a un decimal", () => {
  const barras = [
    { fecha: "2026-10-31", cafe_ml: 10 },
    { fecha: "2026-11-01", cafe_ml: 10 },
    { fecha: "2026-11-02", cafe_ml: 11 },
  ];
  assert.equal(promedio(barras, "cafe_ml", "mes", ahora), 10.3);
});

test("promedio anio: el mes actual cuenta entero y los siguientes no", () => {
  const barras = [
    { fecha: "2026-10", cafe_ml: 100 },
    { fecha: "2026-11", cafe_ml: 50 },
    { fecha: "2026-12", cafe_ml: 999 },
  ];
  assert.equal(promedio(barras, "cafe_ml", "anio", ahora), 75);
});

test("promedio: sin barras pasadas da 0", () => {
  assert.equal(promedio([{ fecha: "2026-11-03", cafe_ml: 5 }], "cafe_ml", "semana", ahora), 0);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { agruparPorDia, dia, hora, tituloDia } from "./formato.js";

// 2026-11-02 es lunes. Buenos Aires está 3 horas detrás de UTC.
const ahora = new Date("2026-11-02T18:00:00Z");

test("hora: 24 horas en horario de Buenos Aires", () => {
  assert.equal(hora("2026-11-02T17:56:00Z"), "14:56");
  assert.equal(hora("2026-11-02T03:05:00Z"), "00:05");
});

test("dia: un café de las 23:30 no pasa al día siguiente", () => {
  assert.equal(dia("2026-11-03T02:30:00Z"), "2026-11-02");
  assert.equal(dia("2026-11-03T03:00:00Z"), "2026-11-03");
});

test("tituloDia: Hoy, Ayer y el resto", () => {
  assert.equal(tituloDia("2026-11-02", ahora), "Hoy");
  assert.equal(tituloDia("2026-11-01", ahora), "Ayer");
  assert.equal(tituloDia("2026-10-26", ahora), "Lunes 26 de octubre");
});

test("tituloDia: agrega el año si no es el actual", () => {
  assert.equal(tituloDia("2025-12-24", ahora), "Miércoles 24 de diciembre de 2025");
});

test("tituloDia: cerca de medianoche, hoy sigue siendo el día de Buenos Aires", () => {
  const casiMedianoche = new Date("2026-11-03T02:30:00Z"); // 23:30 del 2/11 en Buenos Aires
  assert.equal(tituloDia("2026-11-02", casiMedianoche), "Hoy");
});

test("agruparPorDia: junta los cafés consecutivos del mismo día y respeta el orden", () => {
  const cafes = [
    { id: 4, created_at: "2026-11-02T20:00:00Z" },
    { id: 3, created_at: "2026-11-02T15:00:00Z" },
    { id: 2, created_at: "2026-11-01T15:00:00Z" },
    { id: 1, created_at: "2026-10-30T15:00:00Z" },
  ];
  const grupos = agruparPorDia(cafes);

  assert.deepEqual(
    grupos.map((g) => [g.dia, g.cafes.map((c) => c.id)]),
    [
      ["2026-11-02", [4, 3]],
      ["2026-11-01", [2]],
      ["2026-10-30", [1]],
    ],
  );
});

test("agruparPorDia: un día partido entre dos tandas queda en un solo grupo", () => {
  const tanda1 = [{ id: 3, created_at: "2026-11-02T20:00:00Z" }];
  const tanda2 = [{ id: 2, created_at: "2026-11-02T15:00:00Z" }, { id: 1, created_at: "2026-11-01T15:00:00Z" }];

  const grupos = agruparPorDia([...tanda1, ...tanda2]);

  assert.equal(grupos.length, 2);
  assert.deepEqual(grupos[0].cafes.map((c) => c.id), [3, 2]);
});

test("agruparPorDia: lista vacía", () => {
  assert.deepEqual(agruparPorDia([]), []);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { NIVELES, colorNivel, nivel } from "./niveles.js";

test("nivel: un día sin cafés es 0 aunque el máximo sea chico", () => {
  assert.equal(nivel(0, 5), 0);
  assert.equal(nivel(0, 1), 0);
});

test("nivel: el día con más cafés es el nivel más alto", () => {
  assert.equal(nivel(5, 5), 4);
  assert.equal(nivel(1, 1), 4);
});

test("nivel: los valores intermedios redondean hacia arriba", () => {
  assert.equal(nivel(1, 5), 1);
  assert.equal(nivel(3, 5), 3);
  assert.equal(nivel(1, 100), 1);
});

test("colorNivel: mezcla el naranja con el borde según el nivel", () => {
  assert.equal(colorNivel(0), "color-mix(in srgb, var(--color-acento) 0%, var(--color-borde))");
  assert.equal(colorNivel(4), "color-mix(in srgb, var(--color-acento) 100%, var(--color-borde))");
});

test("NIVELES: un porcentaje por nivel, de 0 a 4", () => {
  assert.equal(NIVELES.length, 5);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { avanzarResorte, enReposo, inclinacionObjetivo, INCLINACION } from "./resorte.js";

const quieto = { angulo: 0, velocidadAngular: 0 };

test("inclinacionObjetivo: 0 sin velocidad, signo de la dirección y nunca pasa de INCLINACION", () => {
  assert.equal(inclinacionObjetivo(0), 0);
  assert.ok(inclinacionObjetivo(300) > 0);
  assert.ok(inclinacionObjetivo(-300) < 0);
  assert.ok(Math.abs(inclinacionObjetivo(1e6)) <= INCLINACION);
});

test("avanzarResorte: sin objetivo ni velocidad se queda quieto", () => {
  assert.deepEqual(avanzarResorte(quieto, 0, 0.016), quieto);
});

test("avanzarResorte: sin tiempo no cambia nada", () => {
  const estado = { angulo: 5, velocidadAngular: 2 };
  assert.deepEqual(avanzarResorte(estado, 10, 0), estado);
});

test("avanzarResorte: converge al objetivo", () => {
  let estado = quieto;
  for (let i = 0; i < 120; i++) estado = avanzarResorte(estado, 12, 1 / 60);
  assert.ok(Math.abs(estado.angulo - 12) < 0.05);
});

test("avanzarResorte: al soltar (objetivo 0) vuelve a 0 y queda en reposo", () => {
  let estado = { angulo: 15, velocidadAngular: 0 };
  for (let i = 0; i < 180; i++) estado = avanzarResorte(estado, 0, 1 / 60);
  assert.ok(enReposo(estado, 0));
});

test("enReposo: false si el ángulo, la velocidad o el objetivo siguen siendo notables", () => {
  assert.equal(enReposo(quieto, 0), true);
  assert.equal(enReposo({ angulo: 1, velocidadAngular: 0 }, 0), false);
  assert.equal(enReposo({ angulo: 0, velocidadAngular: 3 }, 0), false);
  assert.equal(enReposo(quieto, 1), false);
});

# AGENT.md — Reglas de trabajo

Antes de hacer cualquier cosa, leer `README.md` (stack y reglas del proyecto) y `MEMORY.md` (estado actual y features pendientes).

## Flujo obligatorio por feature

1. **Entender el pedido.** Viene como descripción en el chat o como una de las "Features pendientes" de `MEMORY.md`. Una feature es algo como: "el usuario puede acceder a la web y agregar una entrada de un café nuevo".
2. **Crear el plan** con la skill `/implementar-feature <feature>`. La skill solo planifica: no modifica ningún archivo.
3. **Preguntar** las dudas y casos límite que el plan deje abiertos. No asumir.
4. **Esperar la aprobación explícita del usuario.** Sin aprobación no se escribe código.
5. **Arrancar:** anotar en `MEMORY.md`, en "Estado actual", cuál es la feature en curso.
6. **Implementar con TDD**: test que falla → código mínimo para que pase → refactor si hace falta.
7. **Verificar:** correr toda la suite de tests. Tiene que pasar completa.
8. **Actualizar `MEMORY.md`:** borrar la feature de "Features pendientes", limpiar "Feature en curso", anotar decisiones y errores con su solución. Si la feature agregó o cambió un endpoint, agregar una fila a la tabla de pruebas del `README.md`.
9. **Commitear** solo cuando el usuario lo acepte (ver abajo). Hasta entonces los cambios quedan sin commitear para que el usuario los revise.

## Principios de código

- Escribir el **mínimo e indispensable**. Nada de sobreingeniería: sin capas, abstracciones, patrones ni dependencias que la feature no necesite.
- No agregar funcionalidades que no estén en el plan aprobado.
- Respetar el stack y las reglas de `README.md`. No agregar librerías fuera del stack sin preguntar.
- Si algo del plan cambia a mitad de camino, parar y consultar.

## Tests (TDD)

- **API:** tests de feature de Laravel (PHPUnit) con base SQLite en memoria.
- **Web:** solo los tests que hagan falta para la lógica de la feature; preguntar antes de sumar una librería de testing.
- Nunca borrar ni debilitar un test para que pase.

## Commits

- **No commitear hasta que el usuario lo acepte** (pedido del 2026-11-01).
- Un commit por feature terminada, con todos los tests pasando y `MEMORY.md` ya actualizado.
- Mensaje corto, en español, indicando la feature. Ej: `feat: agregar un café nuevo desde la web`.
- No commitear `.env`, `vendor/` ni `node_modules/`.
- No hacer push ni cambiar de rama sin que se lo pidan.

## MEMORY.md

- Es el único lugar con el estado del trabajo: feature en curso, features pendientes, decisiones, errores y soluciones.
- No debe superar **~50 líneas**. Si se llena, resumir o borrar lo viejo y mantener solo lo útil.

## Pedir permiso antes de

- Instalar paquetes nuevos.
- Borrar archivos o cambiar la estructura de carpetas.
- Cambiar la base de datos de forma que se pierdan datos.
- Tocar cualquier cosa fuera de la feature aprobada.

## Datos que el agente debe preguntar (no inventar)

- Equivalencias exactas de tamaños a ml (chico, mediano, grande) para café y leche.
- Gramos por cucharadita de azúcar.
- Lista de tipos de café disponibles.
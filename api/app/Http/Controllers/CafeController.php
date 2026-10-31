<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Endpoints REST de los cafés.
 */
class CafeController extends Controller
{
    /**
     * Resume los cafés de hoy: cantidad y totales de ml y gramos.
     *
     * @return \Illuminate\Http\JsonResponse Totales del día (200), en cero si no hay cafés.
     */
    public function hoy()
    {
        $hoy = Cafe::whereDate('created_at', today());

        return response()->json([
            'total' => $hoy->count(),
            'cafe_ml' => (int) $hoy->sum('cafe_ml'),
            'leche_ml' => (int) $hoy->sum('leche_ml'),
            'azucar_g' => (int) $hoy->sum('azucar_g'),
        ]);
    }

    /**
     * Registra un café nuevo y calcula sus ml y gramos según el tipo.
     *
     * @param  Request  $request  Datos: tipo, cucharaditas y nota opcional.
     * @return \Illuminate\Http\JsonResponse El café creado (201); 422 si la validación falla.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'tipo' => ['required', Rule::in(array_keys(Cafe::TIPOS))],
            'cucharaditas' => 'required|integer|min:0|max:10',
            'nota' => 'nullable|string|max:1000',
        ]);

        [$cafeMl, $lecheMl] = Cafe::TIPOS[$datos['tipo']];

        $cafe = Cafe::create($datos + [
            'cafe_ml' => $cafeMl,
            'leche_ml' => $lecheMl,
            'azucar_g' => $datos['cucharaditas'] * Cafe::GRAMOS_POR_CUCHARADITA,
        ]);

        return response()->json($cafe, 201);
    }
}

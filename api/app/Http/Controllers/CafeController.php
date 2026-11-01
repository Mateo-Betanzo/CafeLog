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
     * Totales por día de los últimos 10 días (incluido hoy), del más viejo al más nuevo.
     *
     * @return \Illuminate\Http\JsonResponse `{"dias": [{fecha, cafe_ml, leche_ml, azucar_g}]}` (200);
     *                                        los días sin cafés vienen en cero.
     */
    public function resumen()
    {
        $porDia = Cafe::where('created_at', '>=', today()->subDays(9))
            ->get()
            ->groupBy(fn (Cafe $cafe) => $cafe->created_at->toDateString());

        $dias = collect(range(9, 0))->map(function (int $atras) use ($porDia) {
            $fecha = today()->subDays($atras)->toDateString();
            $cafes = $porDia->get($fecha, collect());

            return [
                'fecha' => $fecha,
                'cafe_ml' => (int) $cafes->sum('cafe_ml'),
                'leche_ml' => (int) $cafes->sum('leche_ml'),
                'azucar_g' => (int) $cafes->sum('azucar_g'),
            ];
        });

        return response()->json(['dias' => $dias]);
    }

    /**
     * Devuelve el detalle de un café.
     *
     * @param  int  $id  Id del café.
     * @return \Illuminate\Http\JsonResponse El café (200); 404 si no existe.
    */
    public function show(int $id)
    {
        return response()->json(Cafe::findOrFail($id));
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

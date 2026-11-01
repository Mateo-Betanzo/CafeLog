<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
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
     * Totales de café, leche y azúcar por barra, según el periodo calendario actual.
     *
     * - `semana` (por defecto): de lunes a domingo, una barra por día.
     * - `mes`: del 1 al último día del mes, una barra por día.
     * - `anio`: de enero a diciembre, una barra por mes (fecha `Y-m`).
     *
     * Las barras sin cafés (incluidos los días futuros) vienen en cero.
     *
     * @param  Request  $request  Parámetro opcional `periodo`.
     * @return \Illuminate\Http\JsonResponse `{"barras": [{fecha, cafe_ml, leche_ml, azucar_g}]}` (200); 422 si el periodo es inválido.
     */
    public function resumen(Request $request)
    {
        $periodo = $request->validate(['periodo' => 'in:semana,mes,anio'])['periodo'] ?? 'semana';

        [$inicio, $fin, $paso, $formato] = match ($periodo) {
            'semana' => [today()->startOfWeek(), today()->endOfWeek(), '1 day', 'Y-m-d'],
            'mes' => [today()->startOfMonth(), today()->endOfMonth(), '1 day', 'Y-m-d'],
            'anio' => [today()->startOfYear(), today()->endOfYear(), '1 month', 'Y-m'],
        };

        $porBarra = Cafe::whereBetween('created_at', [$inicio, $fin])
            ->get()
            ->groupBy(fn (Cafe $cafe) => $cafe->created_at->format($formato));

        $barras = collect(CarbonPeriod::create($inicio, $paso, $fin))->map(function (Carbon $dia) use ($porBarra, $formato) {
            $fecha = $dia->format($formato);
            $cafes = $porBarra->get($fecha, collect());

            return [
                'fecha' => $fecha,
                'cafe_ml' => (int) $cafes->sum('cafe_ml'),
                'leche_ml' => (int) $cafes->sum('leche_ml'),
                'azucar_g' => (int) $cafes->sum('azucar_g'),
            ];
        });

        return response()->json(['barras' => $barras]);
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

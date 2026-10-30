<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CafeController extends Controller
{
    public function store(Request $request)
    {
        $datos = $request->validate([
            'tipo' => ['required', Rule::in(array_keys(Cafe::TIPOS))],
            'cucharaditas' => 'required|integer|min:0|max:10',
            'lugar' => 'required|string|max:255',
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

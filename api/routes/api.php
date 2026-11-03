<?php

use App\Http\Controllers\CafeController;
use Illuminate\Support\Facades\Route;

Route::get('cafes/hoy', [CafeController::class, 'hoy']);
Route::get('cafes/resumen', [CafeController::class, 'resumen']);
Route::get('cafes/calor', [CafeController::class, 'calor']);
Route::get('cafes/tipos', [CafeController::class, 'tipos']);
Route::apiResource('cafes', CafeController::class)->only(['index', 'show', 'store']);

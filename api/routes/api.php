<?php

use App\Http\Controllers\CafeController;
use Illuminate\Support\Facades\Route;

Route::get('cafes/hoy', [CafeController::class, 'hoy']);
Route::apiResource('cafes', CafeController::class)->only(['show', 'store']);

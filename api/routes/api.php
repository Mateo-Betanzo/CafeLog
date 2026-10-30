<?php

use App\Http\Controllers\CafeController;
use Illuminate\Support\Facades\Route;

Route::apiResource('cafes', CafeController::class)->only(['store']);

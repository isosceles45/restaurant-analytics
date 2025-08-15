<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\TopRestaurantsController;

Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

Route::get('/restaurants/{id}/analytics', [AnalyticsController::class, 'getRestaurantAnalytics']);
Route::get('/top-restaurants', [TopRestaurantsController::class, 'index']);
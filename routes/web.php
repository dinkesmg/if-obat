<?php

use App\Http\Controllers\FarmakesController;
use App\Http\Controllers\KfaController;
use App\Http\Controllers\MappingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::prefix('farmakes')->as('farmakes.')->group(function () {
    Route::get('/', [FarmakesController::class, 'index'])->name('list');
    Route::get('data', [FarmakesController::class, 'getAllFarmakes'])->name('data');
    Route::get('upload', [FarmakesController::class, 'upload'])->name('upload.data');
    Route::post('upload/data', [FarmakesController::class, 'uploadFarmakes'])->name('upload.data.proses');
});
Route::prefix('kfa')->as('kfa.')->group(function () {
    // Route::get('api', [KfaController::class, 'apiFarmasi'])->name('api');
    Route::get('api', [KfaController::class, 'api'])->name('api');
    Route::get('/', [KfaController::class, 'index'])->name('list');
    Route::prefix('data')->as('data.')->group(function () {
        Route::get('full', [KfaController::class, 'kfaFullResp'])->name('full');
    });
});
Route::prefix('mapping')->as('mapping.')->group(function () {
    Route::get('/', [MappingController::class, 'index'])->name('list');
    Route::post('/simpan', [MappingController::class, 'store'])->name('list.store');
});
require __DIR__ . '/auth.php';

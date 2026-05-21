<?php

use App\Http\Controllers\Api\V1\MenuSectionController;
use App\Http\Middleware\isAuthorisedMiddleware;
use Illuminate\Support\Facades\Route;


Route::prefix('menu')
    ->middleware(isAuthorisedMiddleware::class)
    ->group(function () {
        Route::get('/mine', [\App\Http\Controllers\Api\V1\MenuController::class, 'myMenus']);

        Route::post('/make', [\App\Http\Controllers\Api\V1\MenuController::class, 'makeMenu']);

        Route::prefix('{slug}')->group(function () {

            Route::get('/', [\App\Http\Controllers\Api\V1\MenuController::class, 'show']);
            Route::post('/details', [\App\Http\Controllers\Api\V1\MenuController::class, 'storeMenuDetails']);

            Route::prefix('contact')->group(function () {
                Route::post('/', [\App\Http\Controllers\Api\V1\MenuContactController::class, 'store']);
            });

            Route::delete('/', [\App\Http\Controllers\Api\V1\MenuController::class, 'destroy']);



            Route::prefix('section')->controller(MenuSectionController::class)->group(function () {
                Route::post('/create', 'creatSection');
                Route::put('/{sectionId}/update-name', 'updateSectionName');
                Route::delete('/{sectionId}', 'deleteSection');


                Route::prefix('/{sectionId}/variant')->group(function () {
                    Route::post('/create', 'createSectionVariant');
                    Route::put('/{variantId}/update', 'uodateSectionVariant');
                    Route::delete('/{variantId}', 'deleteSectionVariant');
                });


                Route::prefix('{sectionId}/item')->group(function(){
                    Route::post('/create', 'createSectionItem');
                    Route::put('/{itemId}/update', 'updateSectionItem');
                    Route::delete('/{itemId}', 'deleteSectionItem');

                });
            });
        });
    });





Route::prefix('auth')->group(function () {
    Route::post('/create-get-user', [\App\Http\Controllers\Api\V1\AuthController::class, 'createGetUser']);
});

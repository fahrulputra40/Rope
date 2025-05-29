<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->post("/rope/update", [\Fahrul\Rope\RopeController::class, "index"]);
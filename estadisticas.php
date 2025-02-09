<?php
require 'vendor/autoload.php';

// Configuración de Supabase
$supabaseUrl = 'https://gpdexqhhxladxvwchofu.supabase.co';
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZGV4cWhoeGxhZHh2d2Nob2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MjM3OTMsImV4cCI6MjA1NDI5OTc5M30.lC8ryRSfyZVPRTqVZYGdkM6jeV3n-emK_YFi1Le3atY';

header('Content-Type: application/json');

try {
    // Crear cliente Supabase
    $supabase = new CreateClient($supabaseUrl, $supabaseKey);

    // Consultar datos semanales
    $semanal = $supabase
        ->from('contacto')
        ->select('EXTRACT(week FROM fecha_contacto) as semana, COUNT(*) as cantidad')
        ->groupBy('semana')
        ->execute();

    // Consultar datos mensuales
    $mensual = $supabase
        ->from('contacto')
        ->select('EXTRACT(month FROM fecha_contacto) as mes, COUNT(*) as cantidad')
        ->groupBy('mes')
        ->execute();

    // Preparar respuesta
    $response = [
        'semanal' => $semanal['data'],
        'mensual' => $mensual['data']
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
}
?>
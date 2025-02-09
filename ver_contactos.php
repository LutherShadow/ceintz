<?php
require 'vendor/autoload.php'; // Asegúrate de tener instalada la librería de Supabase

use Supabase\SupaBaseClient;

// Configuración de Supabase
$url = "https://gpdexqhhxladxvwchofu.supabase.co";
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZGV4cWhoeGxhZHh2d2Nob2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MjM3OTMsImV4cCI6MjA1NDI5OTc5M30.lC8ryRSfyZVPRTqVZYGdkM6jeV3n-emK_YFi1Le3atY";

$supabase = new SupaBaseClient($url, $apiKey);

$response = $supabase->from('contacto')->select('*')->execute();

if ($response['error']) {
    echo json_encode(['success' => false, 'message' => 'Error al obtener contactos', 'error' => $response['error']]);
} else {
    echo json_encode(['success' => true, 'data' => $response['data']]);
}
?>

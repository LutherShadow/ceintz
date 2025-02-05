<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuración de la base de datos
$host = '127.0.0.1';
$dbname = 'u318449100_admCEINTZ';
$username = 'u318449100_RegistrodeAs2';
$password = 'aP-FF2Bc3UL8$q.';
$charset = 'utf8';

try {
    // Crear conexión usando PDO
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=$charset", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare("SELECT ID_Usuario, Nombre_Usuario, Usuario, Contrasena, correo FROM usuario");
    $stmt->execute();

    // Obtener los resultados como un array asociativo
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver los datos en formato JSON
    echo json_encode($usuarios, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // Manejo de errores y devolver como JSON
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

// Cerrar conexión
$conn = null;
?>

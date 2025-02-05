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

    $response = [];

    // Consultar datos semanales
    $sql_semanal = "SELECT WEEK(Fecha_Contacto) AS semana, COUNT(*) AS cantidad FROM contacto GROUP BY semana";
    $stmt_semanal = $conn->query($sql_semanal);
    $semanal = $stmt_semanal->fetchAll(PDO::FETCH_ASSOC);
    $response['semanal'] = $semanal;

    // Consultar datos mensuales
    $sql_mensual = "SELECT MONTH(Fecha_Contacto) AS mes, COUNT(*) AS cantidad FROM contacto GROUP BY mes";
    $stmt_mensual = $conn->query($sql_mensual);
    $mensual = $stmt_mensual->fetchAll(PDO::FETCH_ASSOC);
    $response['mensual'] = $mensual;

    // Devolver las estadísticas como JSON
    echo json_encode($response, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // Manejo de errores
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al obtener las estadísticas: ' . $e->getMessage()]);
}

// Cerrar conexión
$conn = null;
?>

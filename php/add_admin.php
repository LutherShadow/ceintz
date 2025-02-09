<?php
// Configuración de la conexión a la base de datos
$host = "127.0.0.1";
$dbname = "u318449100_admCEINTZ";
$username = "u318449100_RegistrodeAs2";
$password = "aP-FF2Bc3UL8$q.";

$conn = new mysqli($host, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    error_log('Conexión fallida: ' . $conn->connect_error);
    die(json_encode(['success' => false, 'message' => 'Conexión fallida: ' . $conn->connect_error]));
}

// Obtener los datos JSON enviados
$data = json_decode(file_get_contents("php://input"), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log('Error al decodificar JSON');
    die(json_encode(['success' => false, 'message' => 'Error al decodificar JSON']));
}

$nombre = isset($data['nombre_admin']) ? $data['nombre_admin'] : '';
$usuario = isset($data['usuario_admin']) ? $data['usuario_admin'] : '';
$contrasena = isset($data['contrasena_admin']) ? $data['contrasena_admin'] : '';

// Validar que los campos no estén vacíos
if (empty($nombre) || empty($usuario) || empty($contrasena)) {
    error_log('Todos los campos son obligatorios');
    die(json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']));
}

// Insertar el nuevo administrador
$sql = "INSERT INTO administrador (Nombre_Admin, Usuario_Admin, Contrasena_Admin) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log('Error al preparar la consulta: ' . $conn->error);
    die(json_encode(['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error]));
}

$stmt->bind_param("sss", $nombre, $usuario, $contrasena);

if ($stmt->execute()) {
    error_log('Administrador agregado exitosamente');
    echo json_encode(['success' => true]);
} else {
    error_log('Error al ejecutar la consulta: ' . $stmt->error);
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

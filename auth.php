<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    // Redirigir al inicio de sesión si no hay una sesión activa
    header('Location: login.php');
    exit();
}
?>
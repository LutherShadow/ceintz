<<<<<<< HEAD
<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    // Redirigir al inicio de sesión si no hay una sesión activa
    header('Location: login.php');
    exit();
}
=======
<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    // Redirigir al inicio de sesión si no hay una sesión activa
    header('Location: login.php');
    exit();
}
>>>>>>> 94c21dd0d80bee8c8120cd1b0e1fd16bb3bc905b
?>
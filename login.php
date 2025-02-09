<?php
require 'vendor/autoload.php';
session_start();

$error_message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userInput = htmlspecialchars(trim($_POST['username']));
    $passInput = htmlspecialchars(trim($_POST['password']));

    if (empty($userInput) || empty($passInput)) {
        $error_message = "Por favor, complete todos los campos.";
    } else {
        // Initialize Supabase client
        $supabase = new CreateClient(
            getenv('SUPABASE_URL'),
            getenv('SUPABASE_KEY')
        );

        try {
            // Check admin credentials
            $adminQuery = $supabase
                ->from('administrador')
                ->select('*')
                ->eq('Usuario_Admin', $userInput)
                ->eq('Contrasena_Admin', $passInput)
                ->execute();

            // Check user credentials
            $userQuery = $supabase
                ->from('usuario')
                ->select('*')
                ->eq('Usuario', $userInput)
                ->eq('Contrasena', $passInput)
                ->execute();

            if (!empty($adminQuery['data'])) {
                $_SESSION['user_type'] = 'admin';
                $_SESSION['user_id'] = $adminQuery['data'][0]['ID_Admin'];
                header("Location: CEINTZ.php");
                exit();
            } elseif (!empty($userQuery['data'])) {
                $_SESSION['user_type'] = 'user';
                $_SESSION['user_id'] = $userQuery['data'][0]['ID_Usuario'];
                header("Location: CEINTZusu.php");
                exit();
            } else {
                $error_message = "Nombre de usuario o contraseña incorrectos.";
            }
        } catch (Exception $e) {
            $error_message = "Error de conexión: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión - CEINTZ</title>
    
    <!-- External Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/trefoil.js"></script>
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="./css/header.css">
    <link rel="icon" href="" type="image/x-icon">
    <style>
        /* Estilos generales */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "Poppins", sans-serif;
            background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('../img/fondo.jpg') no-repeat center center fixed;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .loader {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .container {
            display: none;
            position: relative;
            width: 100%;
            min-height: 100vh;
            overflow: hidden;
        }

        .text-container {
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            color: white;
            z-index: 10;
            width: 80%;
            max-width: 800px;
        }

        h1 {
            font-size: 2rem;
            margin: 0;
            padding: 0;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .forms-container {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .signin-signup {
            position: absolute;
            top: 50%;
            left: 75%;
            transform: translate(-50%, -50%);
            width: 50%;
            transition: 1s 0.7s ease-in-out;
            display: grid;
            grid-template-columns: 1fr;
            z-index: 5;
        }

        form {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 0 5rem;
            transition: all 0.2s 0.7s;
            overflow: hidden;
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }

        form.sign-in-form {
            z-index: 2;
        }

        .title {
            font-size: 2.2rem;
            color: #007BFF;
            margin-bottom: 10px;
        }

        .input-field {
            max-width: 380px;
            width: 100%;
            background-color: #f0f0f0;
            margin: 10px 0;
            height: 55px;
            border-radius: 55px;
            display: grid;
            grid-template-columns: 15% 85%;
            padding: 0 0.4rem;
            position: relative;
        }

        .input-field i {
            text-align: center;
            line-height: 55px;
            color: #acacac;
            transition: 0.5s;
            font-size: 1.1rem;
        }

        .input-field input {
            background: none;
            outline: none;
            border: none;
            line-height: 1;
            font-weight: 600;
            font-size: 1.1rem;
            color: #333;
        }

        .input-field input::placeholder {
            color: #aaa;
            font-weight: 500;
        }

        .btn {
            width: 150px;
            background-color: #007BFF;
            border: none;
            outline: none;
            height: 49px;
            border-radius: 49px;
            color: #fff;
            text-transform: uppercase;
            font-weight: 600;
            margin: 10px 0;
            cursor: pointer;
            transition: 0.5s;
        }

        .btn:hover {
            background-color: #0056b3;
        }

        .error-message {
            color: red;
            font-size: 0.9rem;
            margin-top: 10px;
        }

        .panels-container {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
        }

        .panel {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: space-around;
            text-align: center;
            z-index: 6;
        }

        .left-panel {
            pointer-events: all;
            padding: 3rem 17% 2rem 12%;
        }

        .image {
            width: 100%;
            transition: transform 1.1s ease-in-out, width 0.5s ease-in-out;
            transition-delay: 0.4s;
        }
    </style>
</head>
<body>
    <!-- Loader -->
    <div class="loader" id="loader">
        <l-trefoil
            size="120"
            stroke="4"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="1.4"
            color="blue">
        </l-trefoil>
    </div>

    <!-- Contenedor principal -->
    <div class="container" id="container">
        <!-- Texto principal -->
        <div class="text-container">
            <h1><b>Centro de Emprendimiento Innovación y Negocios del Instituto Tecnológico Superior de Zacapoaxtla (CEINTZ)</b></h1>
        </div>

        <!-- Formulario de inicio de sesión -->
        <div class="forms-container">
            <div class="signin-signup">
                <form action="" method="POST" class="sign-in-form" id="loginForm">
                    <h2 class="title">Iniciar sesión</h2>
                    <?php if (!empty($error_message)): ?>
                        <p class="error-message"><?php echo $error_message; ?></p>
                    <?php endif; ?>
                    <div class="input-field">
                        <i class="fas fa-user"></i>
                        <input type="text" name="username" placeholder="Nombre de usuario" id="username" required>
                    </div>
                    <div class="input-field">
                        <i class="fas fa-lock"></i>
                        <input type="password" name="password" placeholder="Contraseña" id="password" required>
                    </div>
                    <input type="submit" value="Iniciar sesión" class="btn solid">
                </form>
            </div>
        </div>

        <!-- Panel de imagen -->
        <div class="panels-container">
            <div class="panel left-panel">
                <img src="img/LOGO_Ceintz.png" class="image" alt="CEINTZ Logo">
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script>
        // Redirigir al login después de la animación
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('container').style.display = 'flex';
        }, 2000);
    </script>
</body>
</html>
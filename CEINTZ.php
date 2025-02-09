<?php
// Incluir la lógica para verificar la sesión
session_start();
if (!isset($_SESSION['user_id'])) {
    // Redirigir al inicio de sesión si no hay una sesión activa
    header('Location: index.html');
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CEINTZ</title>

    <!-- Supabase -->
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <script src="./config/supabase.js" type="module"></script>
    
    <!-- Inicialización de Supabase -->
    <script>
        // Inicializar Supabase antes de cualquier otro script
        const supabaseUrl = 'https://gpdexqhhxladxvwchofu.supabase.co'
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZGV4cWhoeGxhZHh2d2Nob2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MjM3OTMsImV4cCI6MjA1NDI5OTc5M30.lC8ryRSfyZVPRTqVZYGdkM6jeV3n-emK_YFi1Le3atY'
        window.supabase = supabase.createClient(supabaseUrl, supabaseKey)
    </script>

    <!-- Otros scripts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>
    
    <!-- Nuestro script principal -->
    <script src="./js/CEINTZ.js"></script>
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="icon" href="img/Image.ico" type="image/x-icon">
    <link rel="stylesheet" href="./css/header.css">
    <link rel="stylesheet" href="./css/CEINTZ.css">
</head>
<body>
    <header>
        <div class="logo-container">
            <img src="./img/gob_mx.png" alt="Logo Gobierno">
            <img src="./img/educacion_logo.png" alt="Logo Educación">
            <img src="./img/Logo-TecNM.png" alt="Logo TecNM">
            <img src="./img/ITSZ1.png" alt="Logo ITSZ">
        </div>
    </header>

    <div class="container" id="container" style="display: none;">
        <div class="content-container">
            <!-- Administradores -->
            <div class="table-container" id="tableOption1">
                <h3>Administradores</h3>
                <form onsubmit="addAdmin(event)">
                    <label for="nombreAdmin">Nombre:</label>
                    <input type="text" id="nombreAdmin" name="nombreAdmin" required>

                    <label for="usuarioAdmin">Usuario:</label>
                    <input type="text" id="usuarioAdmin" name="usuarioAdmin" required>

                    <label for="contrasenaAdmin">Contraseña:</label>
                    <input type="password" id="contrasenaAdmin" name="contrasenaAdmin" required>

                    <button type="submit">Agregar Administrador</button>
                </form>

                <table id="adminTable">
                    <thead>
                        <tr>
                            <th>ID Admin</th>
                            <th>Nombre Admin</th>
                            <th>Usuario Admin</th>
                            <th>Contraseña</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <!-- Usuarios -->
            <div class="table-container" id="formOption2">
                <h3>Tabla de Usuarios</h3>
                <form onsubmit="addUser(event)">
                    <label for="nombreUsuario">Nombre:</label>
                    <input type="text" id="nombreUsuario" name="nombreUsuario" required>

                    <label for="usuario">Usuario:</label>
                    <input type="text" id="usuario" name="usuario" required>

                    <label for="contrasenaUsuario">Contraseña:</label>
                    <input type="password" id="contrasenaUsuario" name="contrasenaUsuario" required>

                    <label for="correo">Correo:</label>
                    <input type="email" id="correo" name="correo" required>

                    <button type="submit">Agregar Usuario</button>
                </form>
                <table id="userTable">
                    <thead>
                        <tr>
                            <th>ID Usuario</th>
                            <th>Nombre Usuario</th>
                            <th>Usuario</th>
                            <th>Contraseña</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <!-- Contactos -->
            <div class="table-container" id="formOption3">
                <h3>Contactos</h3>
                <button onclick="exportTableToExcel()">Descargar en Excel</button>
                <table id="contactTable" border="1" cellpadding="5" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID Contacto</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Dudas</th>
                            <th>Teléfono</th>
                            <th>Fecha de Contacto</th>
                            <th>Horario de Contacto</th>
                            <th>Estatus</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <!-- Estadísticas -->
            <div class="form-container" id="formOption4">
                <h3>Estadísticas de Formularios</h3>
                <table border="1" cellpadding="5" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Semana</th>
                            <th>Cantidad de Formularios Enviados</th>
                        </tr>
                    </thead>
                    <tbody id="semanalTable"></tbody>
                </table>

                <button onclick="downloadPDF()">Descargar Estadísticas en PDF</button>

                <div class="chart-container">
                    <canvas id="weeklyChart"></canvas>
                    <canvas id="monthlyChart"></canvas>
                </div>
            </div>
        </div>

        <div class="right-container">
            <button onclick="toggleDisplay('tableOption1')">Administradores</button>
            <button onclick="toggleDisplay('formOption2')">Usuarios</button>
            <button onclick="toggleDisplay('formOption3')">Contactos de CEINTZ</button>
            <button onclick="toggleDisplay('formOption4')">Estadisticas</button>
            <button onclick="logout()">Cerrar Sesión</button>
        </div>
    </div>

    <script>
        // Inicializar funciones después de que el DOM esté listo
        document.addEventListener('DOMContentLoaded', function() {
            if (window.supabase) {
                fetchAdmins();
                fetchUsers();
                fetchContacts();
            } else {
                console.error('Supabase no está inicializado correctamente');
            }
        });
    </script>
</body>
</html>
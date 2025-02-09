<?php
// Incluir la lógica para verificar la sesión
session_start();
if (!isset($_SESSION['user_id'])) {
    // Redirigir al inicio de sesión si no hay una sesión activa
    header('Location: login.php'); // Asegúrate de tener una página login.html
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CEINTZ</title>
    
    <!-- External Scripts -->
    <!--<script src="https://kit.fontawesome.com/64d58efce2.js" crossorigin="anonymous"></script>-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.css"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/trefoil.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
    
    <!-- Stylesheets -->
    <link rel="icon" href="img/Image.ico" type="image/x-icon">
    <link rel="stylesheet" href="./css/header.css">
    <link rel="stylesheet" href="./css/CEINTZusu.css">
    
    <!-- Supabase -->
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    
    <!-- Nuestros scripts -->
    <script>
        // Inicializar Supabase globalmente
        const supabaseUrl = 'https://gpdexqhhxladxvwchofu.supabase.co'
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZGV4cWhoeGxhZHh2d2Nob2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MjM3OTMsImV4cCI6MjA1NDI5OTc5M30.lC8ryRSfyZVPRTqVZYGdkM6jeV3n-emK_YFi1Le3atY'
        window.supabase = supabase.createClient(supabaseUrl, supabaseKey)
    </script>
    <script src="./js/CEINTZusu.js" defer></script>
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
            <!-- Contactos -->
            <div class="table-container" id="formOption3">
                <h3>Contactos</h3>
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
                    <tbody>
                        <!-- Aquí se insertarán las filas de la tabla dinámicamente -->
                    </tbody>
                </table>
            </div>

            <!-- Estadísticas -->
            <div class="form-container" id="formOption4">
                <h3>Estadísticas de Formularios</h3>
                <table id="contactTable" border="1" cellpadding="5" cellspacing="0">
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
            <button onclick="toggleDisplay('formOption3')">Contactos de CEINTZ</button>
            <button onclick="toggleDisplay('formOption4')">Estadisticas</button>
            <button onclick="logout()">Cerrar Sesión</button>
        </div>
    </div>

    <script src="./js/CEINTZusu.js"></script>
</body>
</html>
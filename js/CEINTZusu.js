// Función para obtener y mostrar contactos
function fetchContacts() {
    fetch('ver_contactos.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('contactTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Limpiar tabla

            // Insertar cada contacto como una fila en la tabla
            data.forEach(contact => {
                const row = tableBody.insertRow();

                row.insertCell(0).innerText = contact.ID_Contacto;
                row.insertCell(1).innerText = contact.Nombre;
                row.insertCell(2).innerText = contact.Correo;
                row.insertCell(3).innerText = contact.Dudas || 'N/A';
                row.insertCell(4).innerText = contact.Telefono || 'N/A';
                row.insertCell(5).innerText = contact.Fecha_Contacto;
                row.insertCell(6).innerText = contact.Horario_Contacto;
                const estatusCell = row.insertCell(7);
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = contact.estatus == 1; // Marcado solo si estatus es 1 (true)
                checkbox.addEventListener('change', () => updateStatus(contact.ID_Contacto, checkbox.checked));
                estatusCell.appendChild(checkbox);
            });
        })
        .catch((error) => {
            console.error('Error al obtener los contactos:', error);
        });
}
function updateStatus(contactId, status) {
    fetch('actualizar_estatus.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ID_Contacto: contactId, estatus: status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Estatus actualizado correctamente');
        } else {
            console.error('Error al actualizar el estatus');
        }
    })
    .catch(error => {
        console.error('Error al realizar la petición:', error);
    });
}
// Llamar a la función para cargar los contactos al cargar la página
window.onload = fetchContacts;

// Función para obtener el nombre del mes
function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

// Obtener datos de las estadísticas
fetch('estadisticas.php')
.then(response => response.json())
.then(data => {
    // Mostrar datos semanales en la tabla
    const semanalTable = document.getElementById('semanalTable');
    data.semanal.forEach(item => {
        const row = semanalTable.insertRow();
        row.insertCell(0).innerText = `Semana ${item.semana}`;
        row.insertCell(1).innerText = item.cantidad;
    });

    // Datos para la gráfica semanal
    const weeklyLabels = data.semanal.map(item => `Semana ${item.semana}`);
    const weeklyData = data.semanal.map(item => item.cantidad);

    // Crear gráfica semanal
    const weeklyChart = new Chart(document.getElementById('weeklyChart'), {
        type: 'bar',
        data: {
            labels: weeklyLabels,
            datasets: [{
                label: 'Formularios Enviados por Semana',
                data: weeklyData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Semanas' }},
                y: { beginAtZero: true, title: { display: true, text: 'Cantidad' }}
            }
        }
    });

    // Datos para la gráfica mensual
    const monthlyLabels = data.mensual.map(item => getMonthName(item.mes));
    const monthlyData = data.mensual.map(item => item.cantidad);

    // Crear gráfica mensual
    const monthlyChart = new Chart(document.getElementById('monthlyChart'), {
        type: 'line',
        data: {
            labels: monthlyLabels,
            datasets: [{
                label: 'Formularios Enviados por Mes',
                data: monthlyData,
                fill: true,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Meses' }},
                y: { beginAtZero: true, title: { display: true, text: 'Cantidad' }}
            }
        }
    });
})
.catch(error => console.error('Error:', error));

// Función para descargar el PDF con las gráficas
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Agregar el título
    pdf.setFontSize(18);
    pdf.text("Estadísticas de Formularios", 10, 10);

    // Convertir las gráficas a imágenes y agregarlas al PDF
    const weeklyChartCanvas = document.getElementById('weeklyChart');
    const monthlyChartCanvas = document.getElementById('monthlyChart');

    // Esperar a que las imágenes estén listas
    const weeklyChartImg = await chartToImage(weeklyChartCanvas);
    const monthlyChartImg = await chartToImage(monthlyChartCanvas);

    // Agregar la gráfica semanal al PDF
    pdf.setFontSize(14);
    pdf.text("Formularios Enviados por Semana", 10, 20);
    pdf.addImage(weeklyChartImg, 'PNG', 10, 30, 180, 70);  // Ajustar tamaño en el PDF

    // Agregar la gráfica mensual al PDF
    pdf.text("Formularios Enviados por Mes", 10, 110);
    pdf.addImage(monthlyChartImg, 'PNG', 10, 120, 180, 70);  // Ajustar tamaño en el PDF

    // Descargar el PDF
    pdf.save("Estadisticas_Formularios.pdf");
}

// Función auxiliar para convertir el canvas de una gráfica a imagen
function chartToImage(canvas) {
    return new Promise((resolve) => {
        const imgData = canvas.toDataURL('image/png');
        resolve(imgData);
    });
}

function toggleDisplay(sectionId) {
    document.querySelectorAll('.form-container, .table-container').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function logout() {
    // Aquí podrías agregar una llamada a un archivo PHP para destruir la sesión en el servidor
    fetch('index.php')  // Opcional: si tienes un archivo PHP para cerrar sesión en el servidor
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Sesión cerrada. Redirigiendo al inicio de sesión...");
                window.location.href = 'index.php';  // Redirige al inicio de sesión
            } else {
                alert("Hubo un problema al cerrar sesión.");
            }
        })
        .catch(error => {
            console.error("Error al cerrar sesión:", error);
            window.location.href = 'index.php';  // Redirige al inicio de sesión en caso de error
        });
}

setTimeout(() => {
    document.getElementById('container').style.display = 'flex';
}, 2000);
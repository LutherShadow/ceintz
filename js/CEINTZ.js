// Función para agregar un nuevo administrador
function addAdmin(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    
    const formData = {
        nombre_admin: document.getElementById('nombreAdmin').value.trim(),
        usuario_admin: document.getElementById('usuarioAdmin').value.trim(),
        contrasena_admin: document.getElementById('contrasenaAdmin').value.trim()
    };

    // Validación básica
    if (!formData.nombre_admin || !formData.usuario_admin || !formData.contrasena_admin) {
        alert('Por favor, complete todos los campos');
        return;
    }

    fetch('add_admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(data.message);
            document.getElementById('adminForm').reset();
            fetchAdmins(); // Actualizar la tabla de administradores
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la solicitud: ' + error.message);
    });
}

// Función para obtener y mostrar los administradores desde la base de datos
function fetchAdmins() {
    fetch('ver_admins.php') // Asegúrate de que la ruta esté correcta
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('adminTable');
        table.innerHTML = '<tr><th>ID Admin</th><th>Nombre Admin</th><th>Usuario Admin</th><th>Contraseña</th><th>Acciones</th></tr>'; // Reiniciar tabla

        data.forEach(admin => {
            const row = table.insertRow();
            row.insertCell(0).innerText = admin.ID_Admin;
            row.insertCell(1).innerText = admin.Nombre_Admin;
            row.insertCell(2).innerText = admin.Usuario_Admin;
            row.insertCell(3).innerText = admin.Contrasena_Admin;
            row.insertCell(4).innerHTML = `<button onclick="deleteAdmin(${admin.ID_Admin})">Eliminar</button>`; // Agregar botón de eliminación
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Llama a la función fetchAdmins al cargar la página
document.addEventListener("DOMContentLoaded", fetchAdmins);

// Función para eliminar un administrador
function deleteAdmin(adminId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este administrador?")) return;

    fetch('delete_admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id_admin: adminId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Administrador eliminado exitosamente.');
            fetchAdmins(); // Actualizar la tabla después de eliminar
        } else {
            alert('Error al eliminar el administrador: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    function addUser(event) {
    event.preventDefault();

    const formData = {
        nombre_usuario: document.getElementById('nombreUsuario').value.trim(),
        usuario: document.getElementById('usuario').value.trim(),
        contrasena: document.getElementById('contrasenaUsuario').value.trim(),
        correo: document.getElementById('correo').value.trim()
    };

    // Validación básica
    if (!formData.nombre_usuario || !formData.usuario || !formData.contrasena || !formData.correo) {
        alert('Por favor, complete todos los campos');
        return;
    }

    fetch('add_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    throw new Error(text);
                }
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(data.message || 'Usuario agregado exitosamente');
            // Limpiar el formulario
            document.getElementById('nombreUsuario').value = '';
            document.getElementById('usuario').value = '';
            document.getElementById('contrasenaUsuario').value = '';
            document.getElementById('correo').value = '';
            // Recargar la lista de usuarios
            fetchUsers();
        } else {
            throw new Error(data.message || 'Error al agregar el usuario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la solicitud: ' + error.message);
    });
}

// Función para obtener y mostrar los usuarios
function fetchUsers() {
    fetch('ver_users.php')
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    throw new Error(text);
                }
            });
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.querySelector('#userTable tbody');
        if (!tableBody) {
            throw new Error('No se encontró el elemento tbody en la tabla');
        }
        
        tableBody.innerHTML = ''; // Limpiar solo el tbody

        data.forEach(user => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = user.ID_Usuario;
            row.insertCell(1).textContent = user.Nombre_Usuario;
            row.insertCell(2).textContent = user.Usuario;
            
            const passwordCell = row.insertCell(3);
            passwordCell.innerHTML = `
                <input type="password" value="${user.Contrasena}" class="password-field" readonly>
                <button onclick="togglePasswordVisibility(this)">👁️</button>
            `;

            row.insertCell(4).textContent = user.correo;
            row.insertCell(5).innerHTML = `
                <button onclick="deleteUser(${user.ID_Usuario})" class="delete-btn">Eliminar</button>
            `;
        });
    })
    .catch(error => {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar la lista de usuarios: ' + error.message);
    });
}

// Asegúrate de que fetchUsers se llame cuando se carga la página
document.addEventListener('DOMContentLoaded', fetchUsers);

// Función para eliminar usuario
function deleteUser(userId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }

    fetch('delete_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id_usuario: userId
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Usuario eliminado exitosamente');
            fetchUsers(); // Recargar la lista de usuarios
        } else {
            throw new Error(data.message || 'Error al eliminar el usuario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el usuario: ' + error.message);
    });
}
    
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------    
    // Función para actualizar el estatus
function updateStatus(contactId, estatus) {
    fetch('actualizar_estatus.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ID_Contacto: contactId, estatus: estatus })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Estatus actualizado correctamente');
        } else {
            console.error('Error al actualizar el estatus:', data.message || 'No se pudo actualizar');
        }
    })
    .catch(error => {
        console.error('Error al realizar la petición:', error);
    });
}

// Función para obtener y mostrar contactos
function fetchContacts() {
    fetch('ver_contactos.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('contactTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Limpiar tabla

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
                checkbox.checked = contact.estatus == 1;
                checkbox.addEventListener('change', () => updateStatus(contact.ID_Contacto, checkbox.checked));
                estatusCell.appendChild(checkbox);
            });
        })
        .catch((error) => {
            console.error('Error al obtener los contactos:', error);
        });
}

// Llamar a la función para cargar los contactos al cargar la página
window.onload = fetchContacts;

// Función para exportar la tabla a Excel con encabezado azul y ajuste de ancho de columnas
function exportTableToExcel() {
    const table = document.getElementById('contactTable');
    const wb = XLSX.utils.table_to_book(table, { sheet: "Contactos" });

    // Aplicar estilo al encabezado
    const ws = wb.Sheets["Contactos"];
    const range = XLSX.utils.decode_range(ws['!ref']);

    // Colorear encabezado de azul y ajustar el contenido al ancho
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
            fill: { fgColor: { rgb: "1E90FF" } }, // Fondo azul
            font: { bold: true, color: { rgb: "FFFFFF" } } // Texto blanco en negrita
        };
    }

    // Ajuste automático de ancho de columnas
    const columnWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxWidth = 10; // Ancho mínimo
        for (let R = range.s.r; R <= range.e.r; ++R) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = ws[cellAddress];
            if (cell && cell.v) {
                const cellWidth = cell.v.toString().length + 2; // Ajustar ancho basado en longitud de contenido
                if (cellWidth > maxWidth) maxWidth = cellWidth;
            }
        }
        columnWidths.push({ wch: maxWidth });
    }
    ws['!cols'] = columnWidths; // Aplicar ancho de columnas

    // Guardar el archivo
    XLSX.writeFile(wb, 'Contactos.xlsx');
}

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

        // Crear gráfica semanal con color rojo
        const weeklyChart = new Chart(document.getElementById('weeklyChart'), {
            type: 'bar',
            data: {
                labels: weeklyLabels,
                datasets: [{
                    label: 'Formularios Enviados por Semana',
                    data: weeklyData,
                    backgroundColor: 'rgba(255, 0, 0, 0.6)',  // Rojo semitransparente
                    borderColor: 'rgba(255, 0, 0, 1)',  // Rojo intenso para el borde
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Semanas', color: '#000', font: { weight: 'bold' }},
                        ticks: { color: '#000', font: { weight: 'bold' }}  // Letras negras intensas en eje x
                    },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Cantidad', color: '#000', font: { weight: 'bold' }},
                        ticks: { color: '#000', font: { weight: 'bold' }}  // Letras negras intensas en eje y
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#000',  // Color negro intenso en leyenda
                            font: { weight: 'bold' }
                        }
                    }
                }
            }
        });

        // Datos para la gráfica mensual
        const monthlyLabels = data.mensual.map(item => getMonthName(item.mes));
        const monthlyData = data.mensual.map(item => item.cantidad);

        // Crear gráfica mensual con color negro intenso
        const monthlyChart = new Chart(document.getElementById('monthlyChart'), {
            type: 'line',
            data: {
                labels: monthlyLabels,
                datasets: [{
                    label: 'Formularios Enviados por Mes',
                    data: monthlyData,
                    fill: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',  // Negro semitransparente
                    borderColor: 'rgba(0, 0, 0, 1)',  // Negro intenso para la línea
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Meses', color: '#000', font: { weight: 'bold' }},
                        ticks: { color: '#000', font: { weight: 'bold' }}  // Letras negras intensas en eje x
                    },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Cantidad', color: '#000', font: { weight: 'bold' }},
                        ticks: { color: '#000', font: { weight: 'bold' }}  // Letras negras intensas en eje y
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#000',  // Color negro intenso en leyenda
                            font: { weight: 'bold' }
                        }
                    }
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

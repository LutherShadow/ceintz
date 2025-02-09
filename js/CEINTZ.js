// Al inicio del archivo
function checkSupabaseInitialized() {
    if (!window.supabase) {
        console.error('Supabase no está inicializado');
        return false;
    }
    return true;
}

// Make functions global
window.addAdmin = async function(event) {
    event.preventDefault();
    if (!checkSupabaseInitialized()) return;
    
    const formData = {
        nombre_admin: document.getElementById('nombreAdmin').value.trim(),
        usuario_admin: document.getElementById('usuarioAdmin').value.trim(),
        contrasena_admin: document.getElementById('contrasenaAdmin').value.trim()
    };

    if (!formData.nombre_admin || !formData.usuario_admin || !formData.contrasena_admin) {
        alert('Por favor, complete todos los campos');
        return;
    }

    try {
        const { data, error } = await window.supabase
            .from('administrador')
            .insert([{
                nombre_admin: formData.nombre_admin,
                usuario_admin: formData.usuario_admin,
                contrasena_admin: formData.contrasena_admin
            }])
            .select();

        if (error) throw error;

        alert('Administrador agregado exitosamente');
        document.getElementById('adminForm').reset();
        fetchAdmins();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la solicitud: ' + error.message);
    }
}

window.fetchAdmins = async function() {
    if (!checkSupabaseInitialized()) return;
    
    try {
        const { data, error } = await window.supabase
            .from('administrador')
            .select('*');

        if (error) throw error;

        const table = document.getElementById('adminTable');
        table.innerHTML = '<tr><th>ID Admin</th><th>Nombre Admin</th><th>Usuario Admin</th><th>Contraseña</th><th>Acciones</th></tr>';

        data.forEach(admin => {
            const row = table.insertRow();
            row.insertCell(0).innerText = admin.id_admin;
            row.insertCell(1).innerText = admin.nombre_admin;
            row.insertCell(2).innerText = admin.usuario_admin;
            row.insertCell(3).innerText = admin.contrasena_admin;
            row.insertCell(4).innerHTML = `<button onclick="deleteAdmin(${admin.id_admin})">Eliminar</button>`;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

window.deleteAdmin = async function(adminId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este administrador?")) return;

    try {
        const { error } = await window.supabase
            .from('administrador')
            .delete()
            .eq('id_admin', adminId);

        if (error) throw error;

        alert('Administrador eliminado exitosamente.');
        fetchAdmins();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el administrador: ' + error.message);
    }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Add user function
window.addUser = async function(event) {
    event.preventDefault();
    
    const formData = {
        nombre_usuario: document.getElementById('nombreUsuario').value.trim(),
        usuario: document.getElementById('usuario').value.trim(),
        contrasena: document.getElementById('contrasenaUsuario').value.trim(),
        correo: document.getElementById('correo').value.trim()
    };

    if (!formData.nombre_usuario || !formData.usuario || !formData.contrasena || !formData.correo) {
        alert('Por favor, complete todos los campos');
        return;
    }

    try {
        const { data, error } = await window.supabase
            .from('usuario')
            .insert([{
                nombre_usuario: formData.nombre_usuario,
                usuario: formData.usuario,
                contrasena: formData.contrasena,
                correo: formData.correo
            }])
            .select();

        if (error) throw error;

        alert('Usuario agregado exitosamente');
        document.getElementById('nombreUsuario').value = '';
        document.getElementById('usuario').value = '';
        document.getElementById('contrasenaUsuario').value = '';
        document.getElementById('correo').value = '';
        fetchUsers();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la solicitud: ' + error.message);
    }
}

// Fetch users function
window.fetchUsers = async function() {
    try {
        const { data, error } = await window.supabase
            .from('usuario')
            .select('*');

        if (error) throw error;

        const tableBody = document.querySelector('#userTable tbody');
        tableBody.innerHTML = '';

        data.forEach(user => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = user.id_usuario;
            row.insertCell(1).textContent = user.nombre_usuario;
            row.insertCell(2).textContent = user.usuario;
            
            const passwordCell = row.insertCell(3);
            passwordCell.innerHTML = `
                <input type="password" value="${user.contrasena}" class="password-field" readonly>
                <button onclick="togglePasswordVisibility(this)">👁️</button>
            `;

            row.insertCell(4).textContent = user.correo;
            row.insertCell(5).innerHTML = `
                <button onclick="deleteUser(${user.id_usuario})" class="delete-btn">Eliminar</button>
            `;
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Delete user function
window.deleteUser = async function(userId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }

    try {
        const { error } = await window.supabase
            .from('usuario')
            .delete()
            .eq('id_usuario', userId);

        if (error) throw error;

        alert('Usuario eliminado exitosamente');
        fetchUsers();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el usuario: ' + error.message);
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------    
    // Función para actualizar el estatus
async function updateStatus(contactId, estatus) {
    if (!checkSupabaseInitialized()) return;

    try {
        const { error } = await window.supabase
            .from('contacto')
            .update({ estatus: estatus })
            .eq('id_contacto', contactId);

        if (error) throw error;
        console.log('Estatus actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar el estatus:', error);
    }
}

// Función para obtener y mostrar contactos
window.fetchContacts = async function() {
    if (!checkSupabaseInitialized()) return;
    
    try {
        const { data, error } = await window.supabase
            .from('contacto')
            .select('*');

        if (error) throw error;

        const tableBody = document.getElementById('contactTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        data.forEach(contact => {
            const row = tableBody.insertRow();

            row.insertCell(0).innerText = contact.id_contacto;
            row.insertCell(1).innerText = contact.nombre;
            row.insertCell(2).innerText = contact.correo;
            row.insertCell(3).innerText = contact.dudas || 'N/A';
            row.insertCell(4).innerText = contact.telefono || 'N/A';
            row.insertCell(5).innerText = contact.fecha_contacto;
            row.insertCell(6).innerText = contact.horario_contacto;

            const estatusCell = row.insertCell(7);
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = contact.estatus;
            checkbox.addEventListener('change', () => updateStatus(contact.id_contacto, checkbox.checked));
            estatusCell.appendChild(checkbox);
        });
    } catch (error) {
        console.error('Error al obtener los contactos:', error);
    }
}

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
// fetch('estadisticas.php')
//     .then(response => response.json())
//     .then(data => {
//         // Mostrar datos semanales en la tabla
//         const semanalTable = document.getElementById('semanalTable');
//         data.semanal.forEach(item => {
//             const row = semanalTable.insertRow();
//             row.insertCell(0).innerText = `Semana ${item.semana}`;
//             row.insertCell(1).innerText = item.cantidad;
//         });

//         // Datos para la gráfica semanal
//         const weeklyLabels = data.semanal.map(item => `Semana ${item.semana}`);
//         const weeklyData = data.semanal.map(item => item.cantidad);

//         // Crear gráfica semanal con color rojo
//         const weeklyChart = new Chart(document.getElementById('weeklyChart'), {
//             type: 'bar',
//             data: {
//                 labels: weeklyLabels,
//                 datasets: [{
//                     label: 'Formularios Enviados por Semana',
//                     data: weeklyData,
//                     backgroundColor: 'rgba(255, 0, 0, 0.6)',  // Rojo semitransparente
//                     borderColor: 'rgba(255, 0, 0, 1)',  // Rojo intenso para el borde
//                     borderWidth: 2
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     x: {
//                         title: { display: true, text: 'Semanas', color: '#000', font: { weight: 'bold' }},
//                         ticks: { color: '#000', font: { weight: 'bold' }}  // Letras negras intensas en eje x
//                     },
//                     y: {
//                         beginAtZero: true,
//                         title: { display: true, text: 'Cantidad', color: '#000', font: { weight: 'bold' }},
//                         ticks: { color: '#000', font: { weight: 'bold' }}  // Letras negras intensas en eje y
//                     }
//                 },
//                 plugins: {
//                     legend: {
//                         labels: {
//                             color: '#000',  // Color negro intenso en leyenda
//                             font: { weight: 'bold' }
//                         }
//                     }
//                 }
//             }
//         });

//         // Datos para la gráfica mensual
//         const monthlyLabels = data.mensual.map(item => getMonthName(item.mes));
//         const monthlyData = data.mensual.map(item => item.cantidad);

//         // Crear gráfica mensual con color negro intenso
//         const monthlyChart = new Chart(document.getElementById('monthlyChart'), {
//             type: 'line',
//             data: {
//                 labels: monthlyLabels,
//                 datasets: [{
//                     label: 'Formularios Enviados por Mes',
//                     data: monthlyData,
//                     fill: true,
//                     backgroundColor: 'rgba(0, 0, 0, 0.2)',  // Negro semitransparente
//                     borderColor: 'rgba(0, 0, 0, 1)',  // Negro intenso para la línea
//                     borderWidth: 2,
//                     tension: 0.4
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     x: {
//                         title: { display: true, text: 'Meses', color: '#000', font: { weight: 'bold' }},
//                         ticks: { color: '#000', font: { weight: 'bold' }}  // Letras negras intensas en eje x
//                     },
//                     y: {
//                         beginAtZero: true,
//                         title: { display: true, text: 'Cantidad', color: '#000', font: { weight: 'bold' }},
//                         ticks: { color: '#000', font: { weight: 'bold' }}  // Letras negras intensas en eje y
//                     }
//                 },
//                 plugins: {
//                     legend: {
//                         labels: {
//                             color: '#000',  // Color negro intenso en leyenda
//                             font: { weight: 'bold' }
//                         }
//                     }
//                 }
//             }
//         });
//     })

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

window.toggleDisplay = function(sectionId) {
    document.querySelectorAll('.form-container, .table-container').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

window.logout = async function() {
    try {
        const { error } = await window.supabase.auth.signOut();
        window.location.href = './index.html';
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        window.location.href = './index.html';
    }
}

setTimeout(() => {
    document.getElementById('container').style.display = 'flex';
}, 2000);

// Reemplazar fetch a PHP por llamadas a Supabase
async function fetchData() {
    if (!window.supabase) return;
    try {
        const { data, error } = await window.supabase
            .from('contacto')
            .select('*');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

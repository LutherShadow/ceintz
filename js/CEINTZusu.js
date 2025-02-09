// Asegurar que Supabase está inicializado correctamente
const supabaseUrl = 'https://gpdexqhhxladxvwchofu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZGV4cWhoeGxhZHh2d2Nob2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MjM3OTMsImV4cCI6MjA1NDI5OTc5M30.lC8ryRSfyZVPRTqVZYGdkM6jeV3n-emK_YFi1Le3atY'
window.supabase = supabaseClient.createClient(supabaseUrl, supabaseKey)

// Función para obtener y mostrar contactos
window.fetchContacts = async function() {
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

// Función para actualizar el estado del contacto
async function updateStatus(contactId, status) {
    try {
        const { error } = await window.supabase
            .from("contacto")
            .update({ estatus: status })
            .eq("id_contacto", contactId);

        if (error) throw error;
        console.log("Estatus actualizado correctamente");
    } catch (error) {
        console.error("Error al actualizar el estatus:", error);
    }
}

// Llamar a fetchContacts al cargar la página
window.onload = fetchContacts;

// Obtener datos de las estadísticas
async function fetchStatistics() {
    try {
        // Consultar datos semanales
        const { data: semanal, error: errorSemanal } = await window.supabase
            .from('contacto')
            .select('fecha_contacto')
            .then(result => {
                // Procesar datos para agrupar por semana
                const weekCounts = {};
                result.data.forEach(contact => {
                    const week = new Date(contact.fecha_contacto).getWeek();
                    weekCounts[week] = (weekCounts[week] || 0) + 1;
                });
                return Object.entries(weekCounts).map(([semana, cantidad]) => ({
                    semana,
                    cantidad
                }));
            });

        // Consultar datos mensuales
        const { data: mensual, error: errorMensual } = await window.supabase
            .from('contacto')
            .select('fecha_contacto')
            .then(result => {
                // Procesar datos para agrupar por mes
                const monthCounts = {};
                result.data.forEach(contact => {
                    const month = new Date(contact.fecha_contacto).getMonth() + 1;
                    monthCounts[month] = (monthCounts[month] || 0) + 1;
                });
                return Object.entries(monthCounts).map(([mes, cantidad]) => ({
                    mes,
                    cantidad
                }));
            });

        if (errorSemanal || errorMensual) throw error;

        // Llenar la tabla semanal
        const semanalTable = document.getElementById("semanalTable");
        semanalTable.innerHTML = '';
        semanal.forEach((item) => {
            const row = semanalTable.insertRow();
            row.insertCell(0).innerText = `Semana ${item.semana}`;
            row.insertCell(1).innerText = item.cantidad;
        });

        // Crear gráficos
        createCharts({ semanal, mensual });
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
    }
}

// Función auxiliar para obtener el número de semana
Date.prototype.getWeek = function() {
    const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
};

// Crear gráficos
function createCharts(data) {
    const weeklyLabels = data.semanal.map(
        (item) => `Semana ${item.semana}`
    );
    const weeklyData = data.semanal.map((item) => item.cantidad);

    new Chart(document.getElementById("weeklyChart"), {
        type: "bar",
        data: {
            labels: weeklyLabels,
            datasets: [
                {
                    label: "Formularios Enviados por Semana",
                    data: weeklyData,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Semanas" } },
                y: { beginAtZero: true, title: { display: true, text: "Cantidad" } },
            },
        },
    });

    const monthlyLabels = data.mensual.map((item) => getMonthName(item.mes));
    const monthlyData = data.mensual.map((item) => item.cantidad);

    new Chart(document.getElementById("monthlyChart"), {
        type: "line",
        data: {
            labels: monthlyLabels,
            datasets: [
                {
                    label: "Formularios Enviados por Mes",
                    data: monthlyData,
                    fill: true,
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 2,
                    tension: 0.4,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Meses" } },
                y: { beginAtZero: true, title: { display: true, text: "Cantidad" } },
            },
        },
    });
}

// Obtener el nombre del mes
function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
}

// Función para cerrar sesión
function logout() {
    fetch("cerrar_sesion.php")
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Sesión cerrada correctamente");
                window.location.href = "./login.html";
            } else {
                alert("Error al cerrar sesión");
            }
        })
        .catch((error) => {
            console.error("Error al cerrar sesión:", error);
            window.location.href = "./login.html";
        });
}

// Mostrar sección correspondiente
function toggleDisplay(sectionId) {
    document.querySelectorAll(".form-container, .table-container").forEach((section) => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}

// Cargar estadísticas al inicio
window.onload = () => {
    fetchContacts();
    fetchStatistics();
};

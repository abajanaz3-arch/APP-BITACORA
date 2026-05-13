// Registro del Service Worker para funcionamiento Offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker activo', reg))
            .catch(err => console.error('Error al registrar SW', err));
    });
}

document.addEventListener('DOMContentLoaded', mostrarRegistros);

document.getElementById('bitacoraForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const registro = {
        fecha: document.getElementById('fecha').value,
        entrada: document.getElementById('horaEntrada').value,
        salida: document.getElementById('horaSalida').value,
        motivo: document.getElementById('motivo').value,
        supervisor: document.getElementById('supervisor').value,
        Desde: document.getElementById('Desde').value,
        Hasta: document.getElementById('Hasta').value
    };

    guardarEnLocalStorage(registro);
    mostrarRegistros();
    document.getElementById('bitacoraForm').reset();
});

function agregarFilaATabla(reg, index) {
    const tabla = document.getElementById('tablaRegistros').getElementsByTagName('tbody')[0];
    const nuevaFila = tabla.insertRow();
    
    const fechaFormateada = reg.fecha.split('-').reverse().join('/');

    nuevaFila.innerHTML = `
        <td>${fechaFormateada}</td>
        <td>${reg.entrada}</td>
        <td>${reg.salida}</td>
        <td style="white-space: normal; min-width: 150px;">${reg.motivo}</td>
        <td class="sup-name">${reg.supervisor}</td>
        <td>${reg.Desde}</td>
        <td>${reg.Hasta}</td>
        <td>
            <button class="btn-eliminar" onclick="eliminarRegistro(${index})">🗑️</button>
        </td>
    `;
}

function guardarEnLocalStorage(reg) {
    let registros = JSON.parse(localStorage.getItem('movilizaciones')) || [];
    registros.push(reg);
    localStorage.setItem('movilizaciones', JSON.stringify(registros));
}

function eliminarRegistro(index) {
    if (confirm('¿Deseas eliminar este registro?')) {
        let registros = JSON.parse(localStorage.getItem('movilizaciones')) || [];
        registros.splice(index, 1);
        localStorage.setItem('movilizaciones', JSON.stringify(registros));
        mostrarRegistros();
    }
}

function mostrarRegistros() {
    let registros = JSON.parse(localStorage.getItem('movilizaciones')) || [];
    const tbody = document.getElementById('tablaRegistros').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    registros.forEach((reg, index) => agregarFilaATabla(reg, index));
}
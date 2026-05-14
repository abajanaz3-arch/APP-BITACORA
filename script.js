let editIndex = null; // Variable para rastrear qué registro estamos editando

// Registro del Service Worker
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

    let registros = JSON.parse(localStorage.getItem('movilizaciones')) || [];

    if (editIndex !== null) {
        // Si estamos editando, reemplazamos el registro existente
        registros[editIndex] = registro;
        editIndex = null;
        document.querySelector('button[type="submit"]').textContent = 'Guardar Registro';
        document.querySelector('button[type="submit"]').style.backgroundColor = '#4818f2';
    } else {
        // Si es nuevo, lo añadimos al final
        registros.push(registro);
    }

    localStorage.setItem('movilizaciones', JSON.stringify(registros));
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
        <td class="acciones">
            <button class="btn-editar" onclick="cargarParaEditar(${index})">✏️</button>
            <button class="btn-eliminar" onclick="eliminarRegistro(${index})">🗑️</button>
        </td>
    `;
}

function cargarParaEditar(index) {
    let registros = JSON.parse(localStorage.getItem('movilizaciones')) || [];
    const reg = registros[index];

    // Llenamos el formulario con los datos guardados
    document.getElementById('fecha').value = reg.fecha;
    document.getElementById('horaEntrada').value = reg.entrada;
    document.getElementById('horaSalida').value = reg.salida;
    document.getElementById('motivo').value = reg.motivo;
    document.getElementById('supervisor').value = reg.supervisor;
    document.getElementById('Desde').value = reg.Desde;
    document.getElementById('Hasta').value = reg.Hasta;

    // Cambiamos el estado de la app a edición
    editIndex = index;
    const btnGuardar = document.querySelector('button[type="submit"]');
    btnGuardar.textContent = 'Actualizar Registro';
    btnGuardar.style.backgroundColor = '#28a745'; // Color verde para indicar edición
    
    // Scroll hacia arriba para que el usuario vea el formulario lleno
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
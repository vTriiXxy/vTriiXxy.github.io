document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioAlumno');
    const checkExamen = document.getElementById('agregarExamen');

    formulario.addEventListener('submit', (event) => {
        event.preventDefault(); // Previene que la página se recargue
        calcularPromedio();
    });

    checkExamen.addEventListener('change', () => {
        mostrarExamenFinal();
    });

    function mostrarExamenFinal() {
        const examenFinalFields = document.getElementById("examenFinalFields");
        examenFinalFields.classList.toggle('hidden', !checkExamen.checked);
    }
});

// Formateo automático de notas (ej: 65 -> 6,5)
document.querySelectorAll('.nota-input').forEach(input => {
    input.addEventListener('input', function() {
        // Limpiamos el valor, permitiendo solo números.
        let value = this.value.replace(/[^0-9]/g, '');
        
        // Si el usuario escribe dos dígitos (ej: "65" para 6,5)
        if (value.length === 2) {
            // Solo formateamos si el número está en el rango de notas válidas (10 a 70)
            const num = parseInt(value, 10);
            if (num >= 10 && num <= 70) {
                this.value = value.charAt(0) + ',' + value.charAt(1);
            } else {
                this.value = value; // Si no es válido (ej: 85), lo dejamos como está para que la validación final lo detecte
            }
        }
    });
});

// Validación en tiempo real para campos de porcentaje
document.querySelectorAll('.porc-input').forEach(input => {
    input.addEventListener('input', function() {
        // Si el valor ingresado es mayor a 100, lo ajustamos a 100
        if (parseInt(this.value, 10) > 100) {
            this.value = 100;
        }
        // Si el valor es negativo, lo ajustamos a 0
        if (parseInt(this.value, 10) < 0) {
            this.value = 0;
        }
    });
});

function obtenerNota(inputId) {
    let val = document.getElementById(inputId).value.trim();
    if (!val) return null;
    // Cambia coma a punto para parseFloat
    val = val.replace(',', '.');
    let n = parseFloat(val);
    return isNaN(n) ? null : n;
}

function calcularPromedio() {
    const resultadoContainer = document.getElementById("resultado-container");
    const resultadoP = document.getElementById("resultado");
    resultadoContainer.classList.add('hidden'); // Ocultar resultados previos

    const nombre = document.getElementById("nombre").value.trim();
    if (nombre === "") {
        alert("Por favor, ingrese el nombre del alumno.");
        return;
    }

    // Recolecta notas y porcentajes
    let notas = [];
    let porcentajes = [];
    for (let i = 1; i <= 4; i++) {
        let nota = obtenerNota(`nota${i}`);
        let porc = parseFloat(document.getElementById(`porc${i}`).value);

        if (!isNaN(nota) && !isNaN(porc)) {
            if (nota < 1.0 || nota > 7.0) {
                alert(`La Nota ${i} debe estar entre 1.0 y 7.0`);
                return;
            }
            if (porc < 0 || porc > 100) {
                alert(`El porcentaje de la Nota ${i} debe estar entre 0 y 100`);
                return;
            }
            notas.push(nota);
            porcentajes.push(porc);
        } else if ((nota !== null && isNaN(porc)) || (nota === null && !isNaN(porc))) {
            alert(`Debe ingresar tanto la Nota ${i} como su porcentaje, o dejar ambos vacíos.`);
            return;
        }
    }

    // Examen final opcional
    let agregarExamen = document.getElementById("agregarExamen").checked;
    if (agregarExamen) {
        let notaExamen = obtenerNota("notaExamen");
        let porcExamen = parseFloat(document.getElementById("porcExamen").value);

        if (isNaN(notaExamen) || isNaN(porcExamen)) {
            alert("Debe ingresar la nota y el porcentaje del examen final.");
            return;
        }
        if (notaExamen < 1.0 || notaExamen > 7.0) {
            alert("La nota del examen final debe estar entre 1.0 y 7.0");
            return;
        }
        if (porcExamen < 0 || porcExamen > 100) {
            alert("El porcentaje del examen final debe estar entre 0 y 100");
            return;
        }
        notas.push(notaExamen);
        porcentajes.push(porcExamen);
    }

    // Validación de porcentaje total
    let sumaPorcentajes = porcentajes.reduce((acc, val) => acc + val, 0);
    if (sumaPorcentajes !== 100) {
        alert(`La suma de todos los porcentajes debe ser 100%. Actualmente suma ${sumaPorcentajes}%.`);
        return;
    }
    if (notas.length === 0) {
        alert("Debe ingresar al menos una nota y su porcentaje.");
        return;
    }

    // Calculo ponderado
    let promedio = 0;
    for (let i = 0; i < notas.length; i++) {
        promedio += notas[i] * (porcentajes[i] / 100);
    }
    promedio = promedio.toFixed(2).replace('.', ',');

    let resultado = `Alumno: <b>${nombre}</b><br>Promedio ponderado: <b>${promedio}</b>`;
    if (agregarExamen) {
        resultado += "<br>Incluye examen final.";
    }

    resultadoP.innerHTML = resultado;
    resultadoContainer.classList.remove('hidden'); // Mostrar el contenedor con el resultado
}
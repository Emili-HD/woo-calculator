//calculoGrapadol.j
// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);

export function calculoAgujereado(calculosPersonalizados, tamanoRadio, nuevaCantidad) {

    // CALCULO AGUJEROS
    let preparacionAgujeros = 0;
    let tiempoPreparacionAgujeros = 0;
    let totalTiempoAgujeros = 0;
    let costeTaladrar = 0;
    let ventaTaladrar = 0;
    const acabadoRadios = document.querySelectorAll('input[name=acabado]');
    const impresionRadios = document.querySelectorAll('input[name=impresion]');

    function calculoTaladrar() {
        const cantidadAgujerosInput = document.querySelector('input[name=acabado]:checked');
        const impresionCaras = document.querySelector('input[name=impresion]:checked');

        const taladrarValores = {
            'taladrar_1_agujero': 1,
            'taladrar_2_agujeros': 2,
            'taladrar_4_agujeros': 4,
        };
        
        if (cantidadAgujerosInput && impresionCaras && taladrarValores[cantidadAgujerosInput.value] != null) {
            const taladrar = data.primas.preparacion_maquina;
            const cantidadAgujeros = data.primas.tiempo_manipulado;
            const tiempoTaladrar = data.primas.precio_hora_manipulado
            let nombreTaladrar = cantidadAgujerosInput.value.replace(/_/g, ' ').toLowerCase();
            nombreTaladrar = nombreTaladrar.charAt(0).toUpperCase() + nombreTaladrar.slice(1);
            let impresionCarasValor = impresionCaras.value;
            let precioHoraTaladrar = 0;

            // Obtenemos el valor correspondiente al input seleccionado
            let valorTaladrar = taladrarValores[cantidadAgujerosInput.value];
            let paginasDocumento = calculo[i].cantidad;
            let copias = cantidadCopias.value;
            
            for (let i in taladrar) {
                if (taladrar[i][0] === 'Taladrar') {
                    preparacionAgujeros = taladrar[i][1];
                    
                    for (let j in cantidadAgujeros) {
                        let nombreCantidadAgujeros = cantidadAgujeros[j][1].toLowerCase();
                        nombreCantidadAgujeros = nombreCantidadAgujeros.charAt(0).toUpperCase() + nombreCantidadAgujeros.slice(1);

                        if (nombreCantidadAgujeros === nombreTaladrar) {
                            tiempoPreparacionAgujeros = (paginasDocumento / impresionCarasValor) * copias / cantidadAgujeros[j][0];
                            // console.log('tiempoPreparacionAgujeros', paginasDocumento, impresionCarasValor, copias, cantidadAgujeros[j][0] );
                            break;
                        }
                    }
                    
                    totalTiempoAgujeros = parseFloat(preparacionAgujeros) + parseFloat(tiempoPreparacionAgujeros);
                    costeTaladrar = totalTiempoAgujeros.toFixed(2) * 12

                    for (let k in tiempoTaladrar) {
                        if (totalTiempoAgujeros >= tiempoTaladrar[k][2] && totalTiempoAgujeros <= tiempoTaladrar[k][3]) {
                            precioHoraTaladrar = tiempoTaladrar[k][0]
                        }
                    }
                    ventaTaladrar = totalTiempoAgujeros.toFixed(2) * precioHoraTaladrar
                }
            }
            
        }
    }
    
    // Llamar a calculoTaladrar para inicializar los cálculos
    calculoTaladrar();
    
    // Añadir event listeners para manejar cambios en acabadoRadios e impresionRadios
    acabadoRadios.forEach(radio => radio.addEventListener('change', calculoTaladrar));
    impresionRadios.forEach(radio => radio.addEventListener('change', calculoTaladrar));
    
    // console.log('costeTaladrar', costeTaladrar);
    
}

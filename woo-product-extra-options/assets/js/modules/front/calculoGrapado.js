//calculoGrapadol.j
// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);

export function calculoGrapado(calculosPersonalizados, tamanoRadio, nuevaCantidad) {

    // CALCULO GRAPADO
    let calculos = {
        costeGrapado: 0,
        importeGrapado: 0,
    };
    
    const grapadoInput = document.querySelector('input[name=acabado][value=grapado_izquierda]');
    const cantidadCopias = document.querySelector('input[name=cantidad__copias]');
    
    // Verificar si grapadoInput existe y si cantidadCopias existe
    if (grapadoInput && cantidadCopias) {
    
        function handleCalculoGrapado() {
            // Comprobar si el radio button grapado_izquierda está seleccionado
            if (grapadoInput.checked) {
                let copias = cantidadCopias.value;
                calculos.costeGrapado = parseFloat(data.primas.grapas[0][4]);
    
                for (let i in data.primas.margen_papel) {
                    if (copias >= data.primas.margen_papel[i][0] && copias <= data.primas.margen_papel[i][1]) {
                        calculos.importeGrapado = calculos.costeGrapado + (calculos.costeGrapado * data.primas.margen_papel[i][4] / 100);
                    }
                }
            } else {
                // Restablecer importeGrapado si grapado_izquierda no está seleccionado
                calculos.costeGrapado = 0;
                calculos.importeGrapado = 0;
            }

            calculosPersonalizados.calculosGrapado = {
                costeGrapado: calculos.costeGrapado,
                importeGrapado: calculos.importeGrapado
            }
        }
        
        // Llamar a handleCalculoGrapado para inicializar los cálculos
        handleCalculoGrapado();
        
        // Añadir event listeners para manejar cambios en cantidadCopias y grapadoInput
        cantidadCopias.addEventListener('input', handleCalculoGrapado);
        grapadoInput.addEventListener('change', handleCalculoGrapado);

        // Obtener todos los radio buttons del grupo 'acabado'
        const acabadoRadioButtons = document.querySelectorAll('input[name=acabado]');

        // Añadir event listener a cada radio button del grupo
        acabadoRadioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                if (!grapadoInput.checked) {
                    // Si 'grapadoInput' no está seleccionado, actualizar los valores a 0
                    calculos.costeGrapado = 0;
                    calculos.importeGrapado = 0;

                    calculosPersonalizados.calculosGrapado = {
                        costeGrapado: calculos.costeGrapado,
                        importeGrapado: calculos.importeGrapado
                    }
                } else {
                    // Si 'grapadoInput' está seleccionado, llamar a 'handleCalculoGrapado' para actualizar los valores
                    handleCalculoGrapado();
                }
            });
        });

    }
    
}

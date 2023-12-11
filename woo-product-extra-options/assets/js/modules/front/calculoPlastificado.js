// calculoEncuadernado.js
// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function calculoPlastificado(calculosPersonalizados, tamanoRadio, nuevaCantidad) {

    calculosPersonalizados.calculosPlastificado = []

    const plastificadoRadio = document.querySelector("div[data-name=acabado] .wpcc-field-radios input[value=plastificado]");

    if ( plastificadoRadio ) {
        let plastificado;
        let costeFunda = 0;
        let importeFunda = 0;
        let costePlastificado = 0;
        let importePlastificado = 0;
        let produccionPlastificado;
        let tiempoProduccionPlastificado;

        const cantidadCopias = document.querySelector('input[name=cantidad__copias]')

        function handleTamanoChange() {
            const selectedTanamoRadio = document.querySelector("div[data-name=tamano] .wpcc-field-radios input[name=tamano]:checked");
            const selectedGrosor = document.querySelector("div[data-name=grosor] .wpcc-field-radios input[name=grosor]:checked");
            let copias = parseInt(cantidadCopias.value, 10);

            if (selectedTanamoRadio) {
                let currentValue = selectedTanamoRadio.value
                // Dividir el string por la 'x'
                const dimensions = currentValue.split('x');

                // Obtener el alto y el ancho
                const alto = dimensions[0];
                const ancho = dimensions[1];

                const tipoPlastificado = data.primas.plastificado

                let calculo;
                if (productData.name == 'Copistería online') { 
                    calculo = calculosPersonalizados.calculosInicialesCopisteria
                } else {
                    calculo = calculosPersonalizados.customCalculosIniciales
                }
        
                for (const i in calculo) {
                    
                    let paginasDocumento = calculo[i].cantidad;
                    const tiempoManipulado = data.primas.tiempo_manipulado
                    const precioManipulado = data.primas.precio_hora_manipulado
                    let formatoPlastificado = selectedGrosor.getAttribute('data-format')

                    // console.log('tiempoManipulado', tiempoManipulado);
                    // console.log(selectedGrosor.getAttribute('data-format'));
                    for (const i in tipoPlastificado) {
                        if (selectedGrosor.value === tipoPlastificado[i][0]) {
                            plastificado = parseFloat(tipoPlastificado[i][5])
                            break;
                        }
                    }

                    if (formatoPlastificado === 'A3') {
                        produccionPlastificado = parseFloat(tiempoManipulado[3][0])
                    } else if (formatoPlastificado === 'A4') {
                        produccionPlastificado = parseFloat(tiempoManipulado[4][0])
                    } else if (formatoPlastificado === 'A5') {
                        produccionPlastificado = parseFloat(tiempoManipulado[5][0])
                    } else  {
                        produccionPlastificado = parseFloat(tiempoManipulado[4][0])
                    }

                    

                    // console.log(paginasDocumento, copias, produccionPlastificado);

                    costeFunda = paginasDocumento * plastificado
                    importeFunda = costeFunda * 2
                    tiempoProduccionPlastificado = paginasDocumento / produccionPlastificado
                    costePlastificado = tiempoProduccionPlastificado * 12

                    // console.log('costeFunda', paginasDocumento, plastificado);

                    for (let i in precioManipulado) {
                        if ( tiempoProduccionPlastificado >= precioManipulado[i][2] && tiempoProduccionPlastificado <= precioManipulado[i][3] ) {
                            importePlastificado = tiempoProduccionPlastificado * parseFloat(precioManipulado[i][0])
                            // console.log(tiempoProduccionPlastificado, precioManipulado[i][0]);
                        }
                    }


                    if (!calculosPersonalizados.calculosPlastificado[i]) {
                        calculosPersonalizados.calculosPlastificado[i] = {
                            cantidad: calculo[i].cantidad,
                            detalles: {
                                tiempoProduccionPlastificado: tiempoProduccionPlastificado,
                                costeFunda: costeFunda,
                                importeFunda: importeFunda,
                                costePlastificado: costePlastificado,
                                importePlastificado: importePlastificado
                            }
                        };
                    } else {
                        calculosPersonalizados.calculosPlastificado[i].detalles.tiempoProduccionPlastificado = tiempoProduccionPlastificado;
                        calculosPersonalizados.calculosPlastificado[i].detalles.costeFunda = costeFunda;
                        calculosPersonalizados.calculosPlastificado[i].detalles.importeFunda = importeFunda;
                        calculosPersonalizados.calculosPlastificado[i].detalles.costePlastificado = costePlastificado;
                        calculosPersonalizados.calculosPlastificado[i].detalles.importePlastificado = importePlastificado;
                    }
        
               
                }
            }

            // console.log('Cálculos Plastificado:', calculosPersonalizados.getCalculos());

        }

        // function attachTamanoChangeEvent() {
        //     const tamanoRadios = document.querySelectorAll("div[data-name='tamano'] .wpcc-field-radios input[name=tamano]");
        //     tamanoRadios.forEach(radio => {
        //         radio.addEventListener('change', handleTamanoChange);
        //     });
        // }

        cantidadCopias.addEventListener('input', handleTamanoChange);

        handleTamanoChange()
        // attachTamanoChangeEvent()

    }

}

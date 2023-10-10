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
                    for (const j in calculo[i].detalles) {
                        for (const k in calculo[i].detalles[j]) {
                            for (const m in calculo[i].detalles[j][k]) {

                                let paginasDocumento = calculo[i].cantidad;
                                const tiempoManipulado = data.primas.tiempo_manipulado
                                const precioManipulado = data.primas.precio_hora_manipulado

                                if (ancho === '297' && alto === '420') {
                                    plastificado = parseFloat(tipoPlastificado[3][5])
                                    produccionPlastificado = tiempoManipulado[3][0]
                                } else if (ancho === '210' && alto === '297') {
                                    plastificado = parseFloat(tipoPlastificado[1][5])
                                    produccionPlastificado = tiempoManipulado[4][0]
                                } else if (ancho <= '148' && alto <= '210') {
                                    plastificado = tipoPlastificado[7][5]
                                    produccionPlastificado = parseFloat(tiempoManipulado[5][0])
                                } else  {
                                    plastificado = tipoPlastificado[1][5]
                                    produccionPlastificado = parseFloat(tiempoManipulado[4][0])
                                }
                                

                                costeFunda = paginasDocumento * copias * plastificado
                                importeFunda = costeFunda * 2
                                tiempoProduccionPlastificado = paginasDocumento * copias / produccionPlastificado
                                costePlastificado = tiempoProduccionPlastificado * 12

                                for (let i in precioManipulado) {
                                    if ( tiempoProduccionPlastificado >= precioManipulado[i][2] && tiempoProduccionPlastificado <= precioManipulado[i][3] ) {
                                        importePlastificado = tiempoProduccionPlastificado * precioManipulado[i][0]
                                    }
                                }


                                if (!calculosPersonalizados.calculosPlastificado[i]) {
                                    calculosPersonalizados.calculosPlastificado[i] = {
                                        paginas: calculo[i].cantidad,
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
                    }
                }
            }

            // console.log('Cálculos Plastificado:', calculosPersonalizados.getCalculos());

        }

        function attachTamanoChangeEvent() {
            const tamanoRadios = document.querySelectorAll("div[data-name='tamano'] .wpcc-field-radios input[name=tamano]");
            tamanoRadios.forEach(radio => {
                radio.addEventListener('change', handleTamanoChange);
            });
        }

        cantidadCopias.addEventListener('input', handleTamanoChange);

        handleTamanoChange()
        attachTamanoChangeEvent()

    }

}

// calculoImpresion.js
// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function customCalculoImpresion(calculosPersonalizados, tamanoRadio, nuevaCantidad) {

    calculosPersonalizados.customCalculosImpresiones = []

    const preparacionMaquina = data.primas.preparacion_maquina;
    const amortizacionMaquina = data.primas.amortizacion;
    let maquina = 0;
    let preparacion = 0;
    let produccionHoraValor = 0;

    
    function toggleMaquinaBasedOnRadio() {
        const selectedColorRadio = document.querySelector("div[data-name='color'] .wpcc-field-radios input[name=color]:checked");      

        if (selectedColorRadio) {
            let currentValue = selectedColorRadio.value;

            if (currentValue === 'bn') {
                maquina = atributos.maquina.maquina[1];
            } else {
                maquina = atributos.maquina.maquina[0];
            }

            // var preparacion = 0;
            
            for (const i in preparacionMaquina) {
                if (maquina === preparacionMaquina[i][0]) {
                    preparacion = parseFloat(preparacionMaquina[i][1]);
                    break;
                }
            }

            // var produccionHoraValor = 0;
            var amortizacion = 0;
            var amortizacionMantenimiento = 0;
            for (let i in amortizacionMaquina) {
                if (maquina === amortizacionMaquina[i][0]) {
                    amortizacion = parseFloat(amortizacionMaquina[i][1]);
                    amortizacionMantenimiento = parseFloat(amortizacionMaquina[i][5]);
                    produccionHoraValor = parseFloat(amortizacionMaquina[i][3]);
                    // console.log('amortizacionMaquina', amortizacion, amortizacionMantenimiento, produccionHoraValor);
                    break;
                }
            }
        } else {
            maquina = atributos.maquina.maquina[0];
            preparacion = parseFloat(data.primas.preparacion_maquina[1][1])
            
            // Buscar produccionHora basado en la máquina
            
            for (let i in amortizacionMaquina) {
                if (maquina === amortizacionMaquina[i][0]) {
                    amortizacion = parseFloat(amortizacionMaquina[i][1]);
                    produccionHoraValor = amortizacionMaquina[i][3];
                    break;
                }
            }
        }

        let calculo;
        if (productData.name == 'Copistería online') { 
            calculo = calculosPersonalizados.calculosInicialesCopisteria
        } else {
            calculo = calculosPersonalizados.customCalculosIniciales
        }
        
        if (produccionHoraValor !== 0) {
            for (const i in calculo) {
                for (const j in calculo[i].detalles) {
                    for (const k in calculo[i].detalles[j]) {

                        let cantidad = calculo[i].cantidad
                        let impresiones = calculo[i].detalles[j][k].impresiones;
                        let produccionHora = {};
                        let tiempoImpresion = {};
                        let costeImpresion = {};
                        let importeImpresion = {};
                        
                        // Calculamos horasTirada y tiempoImpresion para cada propiedad del objeto impresiones
                        for (const cara in impresiones) {
                            produccionHora[cara] = impresiones[cara] / produccionHoraValor;
                            tiempoImpresion[cara] = preparacion + produccionHora[cara];                          
                            
                            for (let x in data.primas.precio_hora_producción) {
                                if (tiempoImpresion[cara] >= parseFloat(data.primas.precio_hora_producción[x][2]) && tiempoImpresion[cara] <= parseFloat(data.primas.precio_hora_producción[x][3])) {
                                    if (productData.name == 'Copistería online') {
                                        costeImpresion[cara] = 10 * tiempoImpresion[cara];
                                    } else {
                                        costeImpresion[cara] = parseFloat(data.primas.precio_hora_producción[x][1]) * tiempoImpresion[cara];
                                    }
                                    importeImpresion[cara] = parseFloat(data.primas.precio_hora_producción[x][0]) * tiempoImpresion[cara];
                                    break;
                                }
                            }
                            
                            if (!calculosPersonalizados.customCalculosImpresiones[i]) {
                                calculosPersonalizados.customCalculosImpresiones[i] = {
                                    cantidad: cantidad,
                                    detalles: {}
                                };
                            }
        
                            if (!calculosPersonalizados.customCalculosImpresiones[i].detalles[j]) {
                                calculosPersonalizados.customCalculosImpresiones[i].detalles[j] = {};
                            }
                            
                            // Guardar las horasTirada, tiempoImpresion, costeImpresion, y importeImpresion
                            calculosPersonalizados.customCalculosImpresiones[i].detalles[j][k] = {
                                produccionHora: { ...produccionHora },
                                tiempoImpresion: { ...tiempoImpresion },
                                costeImpresion: { ...costeImpresion },
                                importeImpresion: { ...importeImpresion }
                            };
                        } 
                    }
                }
            }
        }
    }

    toggleMaquinaBasedOnRadio();
    
    /* function attachChangeEvent(groupName) {
        const radios = document.querySelectorAll(`div[data-name='${groupName}'] .wpcc-field-radios input[name=${groupName}]`);
        radios.forEach(radio => {
            radio.addEventListener('change', toggleMaquinaBasedOnRadio);
        });
    }
    
    // Llamar a la función para los diferentes grupos
    attachChangeEvent("color");
    attachChangeEvent("hojas_por_cara");
    attachChangeEvent("tamano"); */

       
    // console.log('Cálculos personalizados:', calculosPersonalizados.getCalculos());
}

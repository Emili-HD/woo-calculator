// calculoEncuadernado.js
// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function calculoEncuadernado(calculosPersonalizados, nuevaCantidad) {

    calculosPersonalizados.calculosEncuadernado = []

    const encuadernadoRadio = document.querySelector("div[data-name='acabado'] .wpcc-field-radios input[value=encuadernado]");

    if ( encuadernadoRadio ) {
    
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
    
                const preparacionMaquina = data.primas.preparacion_maquina;
                var preparacion = 0;
                
                for (const i in preparacionMaquina) {
                    if (maquina === preparacionMaquina[i][0]) {
                        preparacion = parseFloat(preparacionMaquina[i][1]);
                        break;
                    }
                }
    
                var produccionHoraValor = 0;
                var amortizacion = 0;
                var amortizacionMantenimiento = 0;
                const amortizacionMaquina = data.primas.amortizacion;
                for (let i in amortizacionMaquina) {
                    if (maquina === amortizacionMaquina[i][0]) {
                        amortizacion = parseFloat(amortizacionMaquina[i][1]);
                        amortizacionMantenimiento = parseFloat(amortizacionMaquina[i][5]);
                        produccionHoraValor = parseFloat(amortizacionMaquina[i][3]);
                        break;
                    }
                }
            } else {
                maquina = atributos.maquina.maquina[0];
                preparacion = parseFloat(data.primas.preparacion_maquina[1][1])
                
                // Buscar produccionHora basado en la máquina
                const amortizacionMaquina = data.primas.amortizacion;
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
                            for (const m in calculo[i].detalles[j][k]) {
                                
                                const espirales = data.primas.espiral;
                                let paginasDocumento = calculo[i].cantidad;
                                let impresionCara = document.querySelector('input[name=impresion]:checked').value;
                                
                                // Seleccionar todos los radio buttons que pertenecen al grupo 'color_espiral'
                                const radiosColorEspiral = document.querySelectorAll('input[name=color_espiral]');

                                // Función para manejar el cambio de los radio buttons
                                function handleEspiralChange() {
                                    // buscamos el valor del tipo de espiral seleccionado
                                    let espiralColor = document.querySelector('input[name=color_espiral]:checked').value;
                                    // escogemos el grosor de
                                    let grosorEspiral = paginasDocumento / impresionCara;

                                    let precioEspiral; // Variable para almacenar el último elemento que cumple la condición

                                    for (let i in espirales) {
                                        if (grosorEspiral >= espirales[i][5] && espiralColor === espirales[i][2]) {
                                            precioEspiral = espirales[i]; // Actualizamos la variable con el nuevo elemento que cumple la condición
                                        }
                                    }

                                    // Después del bucle, imprimimos el último elemento que cumple la condición
                                    if (precioEspiral) {
                                        precioEspiral = precioEspiral[6];
                                    }

                                    // console.log(precioEspiral);
                                    
                                    // Aquí puedes agregar más código, si es necesario, para actualizar la UI u otras tareas.
                                    let costeTapaFrontal = 0
                                    let ventaTapaFrontal = 0
                                    let costeTapaTrasera = 0
                                    let ventaTapaTrasera = 0
                                    const cantidadCopias = document.querySelector('input[name=cantidad__copias]');
                                    function handleCalculoTapaFrontal() {
                                        let copias = cantidadCopias.value;
                                        costeTapaFrontal = copias * 0.09;
                                        costeTapaTrasera = copias * 0.12;
    
                                        for (let j in data.primas.margen_papel) {
                                            if (copias >= data.primas.margen_papel[j][0] && copias <= data.primas.margen_papel[j][1]) {
                                                const margen = data.primas.margen_papel[j][2];
    
                                                ventaTapaFrontal = (costeTapaFrontal * 2 * margen) / 100
                                                ventaTapaTrasera = (costeTapaTrasera * 2 * margen) / 100
                                                break;
                                            }
                                        }
                                    }
                                    handleCalculoTapaFrontal()
                                    cantidadCopias.addEventListener('input', handleCalculoTapaFrontal);
                                    
                                    
                                    const manipulado = data.primas.tiempo_manipulado[12][0];
                                    // const cantidadHojas = calculo[i].detalles[j][k].hojas
                                    const cantidadHojas = calculo[i].cantidad;
                                    
                                    
                                    let tiempoProduccionEncuadernado = cantidadHojas / manipulado
                                    let costeEncuadernado = tiempoProduccionEncuadernado * 12
                                    // console.log(calculo[i].cantidad, cantidadHojas, manipulado);
                                    
                                    const escaladoEncuadernado = data.primas.escalado_encuadernacion
                                    let importeEncuadernado = 0
                                    function handleImporteEncuadernado() {
                                        const copias = parseInt(cantidadCopias.value);
                                        const limites = [61, 121, 181, 241, 301, 361, 421, 461];
                                        
                                        for (let i in escaladoEncuadernado) {
                                            for (let j = 0; j < limites.length; j++) {
                                                if (paginasDocumento < limites[j] && copias >= escaladoEncuadernado[i][0] && copias <= escaladoEncuadernado[i][1]) {
                                                    importeEncuadernado = copias * parseFloat(escaladoEncuadernado[i][j + 2]);
                                                    break; // Salimos del bucle interno cuando encontramos el rango correcto
                                                }
                                            }
                                        }
                                    }
                                    
                                    handleImporteEncuadernado();
                                    cantidadCopias.addEventListener('input', handleImporteEncuadernado);
    
                                    let totalCosteEncuadernado = parseFloat(precioEspiral) + costeTapaFrontal + costeTapaTrasera + costeEncuadernado
                                    let totalVentaEncuadernado = parseFloat(precioEspiral) + ventaTapaFrontal + ventaTapaTrasera + importeEncuadernado                             
                                    // console.log('totalVentaEncuadernado', parseFloat(precioEspiral), ventaTapaFrontal, ventaTapaTrasera, importeEncuadernado, totalVentaEncuadernado );                             
    
    
                                    let impresiones = calculo[i].detalles[j][k].impresiones;
                                    let importePapel = 0;
                                    let costeImpresion = 0;
                                    let importeImpresion = 0;
                                    let costePapel = 0;
        
                                    // Calculamos horasTirada y tiempoImpresion para cada propiedad del objeto impresiones
                                    for (const cara in impresiones) {
                                        // console.log(amortizacion, amortizacionMantenimiento);
                                        let papelPortada = document.querySelector('input[name=papel_portada]:checked').value;
                                        // console.log(papelPortada);
    
                                        const papelSeleccionado = data.primas.books
                                        let copias = parseInt(cantidadCopias.value);
                                        for (let i in papelSeleccionado) {
                                            if(papelPortada == papelSeleccionado[i][0]) {
                                                costePapel = parseFloat(papelSeleccionado[i][2]) * copias
                                                break;
                                            }
                                        }
                                        
                                        importePapel = costePapel * 2;
    
                                        let tiempoPreparacionMaquina = 0.01
                                        let horasTirada = copias / produccionHoraValor
                                        let totalTiempoImpresion = tiempoPreparacionMaquina + horasTirada
                                        costeImpresion = totalTiempoImpresion * 12
                                        
                                        let precioHora;
                                        if (maquina === 'Fuji' ) {
                                            precioHora = data.primas.precio_hora_producción_bn
                                        } else {
                                            precioHora = data.primas.precio_hora_producción
                                        }
    
                                        for ( let i in precioHora ) {
                                            if ( totalTiempoImpresion >= precioHora[i][2] && totalTiempoImpresion <= precioHora[i][3] ) {
                                                importeImpresion = totalTiempoImpresion * precioHora[i][0]
                                            }
                                        }
                                    } 
        
                                    if (!calculosPersonalizados.calculosEncuadernado[i]) {
                                        calculosPersonalizados.calculosEncuadernado[i] = {
                                            cantidad: calculo[i].cantidad,
                                            detalles: {}
                                        };
                                    }
                
                                    if (!calculosPersonalizados.calculosEncuadernado[i].detalles[j]) {
                                        calculosPersonalizados.calculosEncuadernado[i].detalles[j] = {};
                                    }
                                    
                                    // Guardar las horasTirada, tiempoImpresion, costeImpresion, y importeImpresion
                                    calculosPersonalizados.calculosEncuadernado[i].detalles[j][k] = {
                                        tiempoProduccionEncuadernado: tiempoProduccionEncuadernado,
                                        costePapelEncuadernado: costePapel,
                                        costeEncuadernado: costeEncuadernado,
                                        totalCosteEncuadernado: totalCosteEncuadernado,
                                        totalVentaEncuadernado: totalVentaEncuadernado,
                                        importePapel: importePapel,
                                        costeImpresion: costeImpresion,
                                        importeImpresion: importeImpresion
                                    };
                                }

                                handleEspiralChange()

                                // Agregar el event listener 'change' a cada radio button
                                radiosColorEspiral.forEach(radio => {
                                    radio.addEventListener('change', handleEspiralChange);
                                });


                            }
                        }
                    }
                }
            }
            // console.log('Cálculos Encuadernado:', calculosPersonalizados.getCalculos());
        }
    
        function attachColorChangeEvent() {
            const colorRadios = document.querySelectorAll("div[data-name='color'] .wpcc-field-radios input[name=color]");
            colorRadios.forEach(radio => {
                radio.addEventListener('change', toggleMaquinaBasedOnRadio);
            });
        }
    
        toggleMaquinaBasedOnRadio();
        attachColorChangeEvent();
    
    }
}

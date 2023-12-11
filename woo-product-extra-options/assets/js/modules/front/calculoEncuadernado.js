// calculoEncuadernado.js
// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function calculoEncuadernado(calculosPersonalizados, nuevaCantidad) {

    calculosPersonalizados.calculosEncuadernado = []

    const encuadernadoRadio = document.querySelector("div[data-name='acabado'] .wpcc-field-radios input[value=encuadernado]");

    if ( encuadernadoRadio ) {
    
        function toggleMaquinaBasedOnRadio() {
            let maquina = 0;
            let preparacion = 0;
            let produccionHoraValor = 0;
            
            const selectedColorRadio = document.querySelector("div[data-name='color'] .wpcc-field-radios input[name=color]:checked");
            const selectedPortadaInput = document.querySelector('input[name=portada]:checked');
            const selectedPortadaValue = selectedPortadaInput.value

            const amortizacionMaquina = data.primas.amortizacion;
            const papelSeleccionado = data.primas.books
            const margenPapel = data.primas.margen_papel
            const burcarValorTapas = data.primas.tapas
            const preparacionMaquina = data.primas.preparacion_maquina;
            const espirales = data.primas.espiral;
            const escaladoEncuadernado = data.primas.escalado_encuadernacion;
            const manipulado = data.primas.tiempo_manipulado[12][0];
    
            if (selectedColorRadio) {
                let currentValue = selectedColorRadio.value;
    
                if (currentValue === 'bn') {
                    maquina = atributos.maquina.maquina[1];
                } else {
                    maquina = atributos.maquina.maquina[0];
                }
    
                for (const i in preparacionMaquina) {
                    if (maquina === preparacionMaquina[i][0]) {
                        preparacion = parseFloat(preparacionMaquina[i][1]);
                        break;
                    }
                }
    
                /* NO CAPTA BIEN LOS VALORES SEGUN SELECTEDPORTADAVALUE 
                   REVISAR CÁLCULOS EN EL EXCEL (FALTAN 0,05) */
                var amortizacion = 0;
                var amortizacionMantenimiento = 0;
                for (let i in amortizacionMaquina) {
                    if (maquina === amortizacionMaquina[i][0]) {
                        amortizacion = parseFloat(amortizacionMaquina[i][1]);
                        amortizacionMantenimiento = parseFloat(amortizacionMaquina[i][5]);
                        produccionHoraValor = parseFloat(amortizacionMaquina[i][3]);
                    } 
                    if (maquina === 'Fuji' && (selectedPortadaValue === '1_cara_bn' || selectedPortadaValue === '2_caras_bn')) {
                        amortizacion = parseFloat(amortizacionMaquina[1][1]);
                        produccionHoraValor = parseFloat(amortizacionMaquina[1][3]);
                    } else if (maquina === 'Fuji' && (selectedPortadaValue === '1_cara_color' || selectedPortadaValue === '2_caras_color')) {
                        amortizacion = parseFloat(amortizacionMaquina[0][1]);
                        produccionHoraValor = parseFloat(amortizacionMaquina[0][3]);
                    }
                }
                
                // console.log('valores', amortizacion, produccionHoraValor);
                // console.log(amortizacionMaquina);
            } else {
                maquina = atributos.maquina.maquina[0];
                preparacion = parseFloat(preparacionMaquina[1][1])
                
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
                                
                            let paginasDocumento = calculo[i].cantidad;
                            let impresionCara = document.querySelector('input[name=impresion]:checked').value;
                            
                            // Seleccionar todos los radio buttons que pertenecen al grupo 'color_espiral'
                            const radiosColorEspiral = document.querySelectorAll('input[name=color_espiral]');

                            // Función para manejar el cambio de los radio buttons
                            function handleEspiralChange() {
                                const cantidadCopias = document.querySelector('input[name=cantidad__copias]');
                                const tapaFrontalInput = document.querySelector('input[name=tapa_frontal]:checked');
                                const tapaTraseraInput = document.querySelector('input[name=tapa_trasera]:checked');
                                const selectedPapelPortadaInput = document.querySelector('input[name=papel_portada]:checked');
                                const copias = cantidadCopias.value;
                                const selectedPapelPortadaValue = selectedPapelPortadaInput.value
                                
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

                                // Después del bucle espiral, imprimimos el último elemento que cumple la condición
                                if (precioEspiral) {
                                    precioEspiral = precioEspiral[6];
                                }
                                
                                // Aquí puedes agregar más código, si es necesario, para actualizar la UI u otras tareas.
                                let costeTapaFrontal = 0
                                let ventaTapaFrontal = 0
                                let costeTapaTrasera = 0
                                let ventaTapaTrasera = 0


                                let costeAmortizacionPortada = 0
                                let costeAmortMantPortada = 0
                                let costePapelPortada = 0
                                let ventaPapelPortada = 0
                                

                                if (selectedPortadaValue === 'sin_portada') {
                                    costeAmortizacionPortada = 0;
                                    costeAmortMantPortada = 0;
                                    costePapelPortada = 0;
                                }
                                else if (selectedPortadaValue === 'hoja_blanca') {
                                    costeAmortizacionPortada = 0;
                                    costeAmortMantPortada = 0;
                                    for (let i in papelSeleccionado) {
                                        if(selectedPapelPortadaValue == papelSeleccionado[i][0]) {
                                            costePapelPortada = parseFloat(papelSeleccionado[i][2]) * copias
                                            break;
                                        }
                                    }
                                }
                                else if (selectedPortadaValue === '1_cara_bn' || selectedPortadaValue === '2_caras_bn') {
                                    // Asignar los valores predeterminados
                                    costeAmortizacionPortada = parseFloat(amortizacionMaquina[1][1]);
                                    costeAmortMantPortada = parseFloat(amortizacionMaquina[1][5]);
                                
                                    // Verificar si es 2_caras_bn y duplicar los valores si es así
                                    if (selectedPortadaValue === '2_caras_bn') {
                                        costeAmortizacionPortada *= 2;
                                        costeAmortMantPortada *= 2;
                                    }
                                
                                    // Buscar el coste del papel
                                    for (let i in papelSeleccionado) {
                                        if (selectedPapelPortadaValue == papelSeleccionado[i][0]) {
                                            costePapelPortada = parseFloat(papelSeleccionado[i][2]) * copias;
                                            break;
                                        }
                                    }
                                }
                                else if (selectedPortadaValue === '1_cara_color' || selectedPortadaValue === '2_caras_color') {
                                    // for (let i in amortizacionMaquina) {
                                        costeAmortizacionPortada = parseFloat(amortizacionMaquina[0][1]);
                                        costeAmortMantPortada = parseFloat(amortizacionMaquina[0][5]);

                                        if (selectedPortadaValue === '2_caras_color') {
                                            costeAmortizacionPortada *= 2
                                            costeAmortMantPortada *= 2;
                                        }

                                        for (let i in papelSeleccionado) {
                                            if(selectedPapelPortadaValue == papelSeleccionado[i][0]) {
                                                costePapelPortada = parseFloat(papelSeleccionado[i][2]) * copias
                                                break;
                                            }
                                        }
                                    // }
                                }

                                function handleCalculoTapaFrontal() {
                                    let tapaFrontal = tapaFrontalInput.value
                                    let tapaTrasera = tapaTraseraInput.value
                                    let precioTapaFrontal = null
                                    let precioTapaTrasera = null

                                    
                                    for (const i in burcarValorTapas) {
                                        if (tapaFrontal === burcarValorTapas[i][0]) {
                                            precioTapaFrontal = burcarValorTapas[i][4]
                                        }
                                        if (tapaTrasera === burcarValorTapas[i][0]) {
                                            precioTapaTrasera = burcarValorTapas[i][4]
                                        }
                                    }

                                    // console.log('precio tapas:', precioTapaFrontal, precioTapaTrasera);
                                    
                                    costeTapaFrontal = copias * precioTapaFrontal;
                                    costeTapaTrasera = copias * precioTapaTrasera;

                                    for (let j in margenPapel) {
                                        if (copias >= margenPapel[j][0] && copias <= margenPapel[j][1]) {
                                            const margen = margenPapel[j][2];

                                            ventaTapaFrontal = (costeTapaFrontal * 2 * margen) / 100
                                            ventaTapaTrasera = (costeTapaTrasera * 2 * margen) / 100
                                            ventaPapelPortada = (costePapelPortada * 2 * margen) / 100
                                            break;
                                        }
                                    }
                                }
                                handleCalculoTapaFrontal()

                                // console.log('ventaPapelPortada', ventaPapelPortada, costePapelPortada);
                                // cantidadCopias.addEventListener('input', handleCalculoTapaFrontal);                                
                                
                                let tiempoProduccionEncuadernado = paginasDocumento / manipulado
                                let costeEncuadernado = tiempoProduccionEncuadernado * 12
                                // console.log(calculo[i].cantidad, cantidadHojas, manipulado);
                                
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

                                let totalCosteEncuadernado = parseFloat(precioEspiral) + costeTapaFrontal + costeTapaTrasera + ventaPapelPortada + costeEncuadernado
                                let totalVentaEncuadernado = parseFloat(precioEspiral) + ventaTapaFrontal + ventaTapaTrasera + ventaPapelPortada + importeEncuadernado
                                // console.log('totalVentaEncuadernado', totalVentaEncuadernado, parseFloat(precioEspiral), ventaTapaFrontal, ventaTapaTrasera, ventaPapelPortada, importeEncuadernado );
                                // console.log('ventaPapelPortada', ventaPapelPortada);

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

                                    
                                    let copias = parseInt(cantidadCopias.value);
                                    for (let i in papelSeleccionado) {
                                        if(papelPortada == papelSeleccionado[i][0]) {
                                            costePapel = parseFloat(papelSeleccionado[i][2]) * copias
                                            break;
                                        }
                                    }
                                    
                                    importePapel = costePapel * 2;

                                    let tiempoPreparacionMaquina = 0.01
                                    let horasTirada;
                                    if (selectedPortadaValue === '2_caras_bn' || selectedPortadaValue === '2_caras_color') {
                                        horasTirada = (copias * 2) / produccionHoraValor
                                    } else {
                                        horasTirada = copias / produccionHoraValor
                                    }

                                    // console.log('horasTirada', horasTirada);
                                    
                                    let totalTiempoImpresion = tiempoPreparacionMaquina + horasTirada
                                    costeImpresion = totalTiempoImpresion * 12
                                    
                                    let precioHora;
                                    if (maquina === 'Fuji' ) {
                                        precioHora = data.primas.precio_hora_producción_bn
                                    } else {
                                        precioHora = data.primas.precio_hora_producción
                                    }

                                    if (selectedPortadaValue === 'sin_portada' || selectedPortadaValue === 'hoja_blanca') {
                                        importeImpresion = 0
                                    }
                                    else if (selectedPortadaValue === '1_cara_bn' || selectedPortadaValue === '2_caras_bn') {
                                        for ( let i in precioHora ) {
                                            if ( totalTiempoImpresion >= precioHora[i][2] && totalTiempoImpresion <= precioHora[i][3] ) {
                                                importeImpresion = totalTiempoImpresion * parseFloat(precioHora[i][0])
                                                // console.log(importeImpresion, totalTiempoImpresion, precioHora[i][0]);
                                            }
                                        }
                                    }
                                    else if (selectedPortadaValue === '1_cara_color' || selectedPortadaValue === '2_caras_color') {
                                        for ( let i in precioHora ) {
                                            if ( totalTiempoImpresion >= precioHora[i][2] && totalTiempoImpresion <= precioHora[i][3] ) {
                                                importeImpresion = totalTiempoImpresion * parseFloat(precioHora[i][0])
                                            }
                                        }
                                    }
                                    // console.log('importeImpresion', importeImpresion);
                                } 
    
                                if (!calculosPersonalizados.calculosEncuadernado[i]) {
                                    calculosPersonalizados.calculosEncuadernado[i] = {
                                        cantidad: paginasDocumento,
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
                                    costeAmortMantPortada: costeAmortMantPortada,
                                    ventaPapelPortada: ventaPapelPortada,
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
            // console.log('Cálculos Encuadernado:', calculosPersonalizados.getCalculos());
        }
    
        toggleMaquinaBasedOnRadio();

        // Agrega un evento change a todos los radios en el documento
        // document.querySelectorAll("input[type=radio]").forEach(radio => {
        //     radio.addEventListener('change', toggleMaquinaBasedOnRadio);
        // });
    
    }
}

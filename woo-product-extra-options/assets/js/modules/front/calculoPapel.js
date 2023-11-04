//calculoPapel.js

// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function customCalculoPapel(calculosPersonalizados, tamanoRadio, nuevaCantidad) {

    calculosPersonalizados.customCalculosPapeles = []

    const preparacionMaquina = data.primas.preparacion_maquina;
    const amortizacionMaquina = data.primas.amortizacion;
    let calculo;
    let maquina;
    let produccionHoraValor = 0;

    function recalcularPapelSegunMaquina() {
        const hojasPorCaraRadio = document.querySelector("div[data-name='hojas_por_cara'] .wpcc-field-radios input[name=hojas_por_cara]:checked")
        const selectedColorRadio = document.querySelector("div[data-name='color'] .wpcc-field-radios input[name=color]:checked");
        const selectedTanamoRadio = document.querySelector("div[data-name=tamano] .wpcc-field-radios input[name=tamano]:checked");
        const selectedImpresionRadio = document.querySelector("div[data-name=impresion] .wpcc-field-radios input[name=impresion]:checked");
        
        let hojasPorCara = hojasPorCaraRadio ? parseInt(hojasPorCaraRadio.value) : 1;

        
        // Buscar la coincidencia de esa máquina
        let amortizacion = null;
        let amortizacionTotal = null;
        
        // var produccionHoraValor = 0;
        var amortizacionMantenimiento = null;
        for (let i in amortizacionMaquina) {
            if (maquina === amortizacionMaquina[i][0]) {
                amortizacion = parseFloat(amortizacionMaquina[i][1]);
                amortizacionMantenimiento = parseFloat(amortizacionMaquina[i][5]);
                produccionHoraValor = parseFloat(amortizacionMaquina[i][3]);
                // console.log('amortizacionMaquina', amortizacion, amortizacionMantenimiento, produccionHoraValor);
                break;
            }
        }
        
        if (amortizacion !== null) {
            for (const i in calculo) {
                for (const j in calculo[i].detalles) {
                    for (const k in calculo[i].detalles[j]) {
                        // for (const m in calculo[i].detalles[j][k]) {
                            
                        let cantidad = calculo[i].cantidad
                        let cantidadCopias = document.querySelector("input[name=cantidad__copias");
                        let equivalenciaMedidasCorte = data.primas.copisteria;
                        let formatoSeleccionado = selectedTanamoRadio.dataset.format;
                        let equivalenciaPapel;
                        let hojas;
                        let cantidadImpresiones;

                        // console.log(amortizacionTotal);
                        // hojas = calculo[i].detalles[j][k].hojas;
                        // console.log(calculo[i].detalles[j][k]);
                        let costePapel = 0;


                        if (cantidadCopias && maquina === 'Fuji') {
                            cantidadCopias = cantidadCopias.value;
                            for (const i in equivalenciaMedidasCorte) {
                                if (equivalenciaMedidasCorte[i][0] === 'Fuji' && formatoSeleccionado === equivalenciaMedidasCorte[i][6]) {
                                    equivalenciaPapel = equivalenciaMedidasCorte[i][3];
                                    hojas = Math.ceil((cantidad / hojasPorCara) * parseFloat(equivalenciaPapel) * parseFloat(cantidadCopias));
                                    cantidadImpresiones = (parseInt(selectedImpresionRadio.value) === 1 && formatoSeleccionado === 'A3') ? hojas * 2 : hojas;
                                }
                            }
                            amortizacion = amortizacion * cantidadImpresiones
                            amortizacionMantenimiento = amortizacionMantenimiento * cantidadImpresiones
                        } 
                        else if (cantidadCopias && maquina === 'C6085') {
                            cantidadCopias = cantidadCopias.value;
                            for (const i in equivalenciaMedidasCorte) {
                                if (equivalenciaMedidasCorte[i][0] === 'C6085' && formatoSeleccionado === equivalenciaMedidasCorte[i][6]) {
                                    equivalenciaPapel = equivalenciaMedidasCorte[i][3];
                                    hojas = Math.ceil((cantidad / hojasPorCara) * parseFloat(equivalenciaPapel) * parseFloat(cantidadCopias));
                                    cantidadImpresiones = hojas;
                                }
                            }
                            amortizacion = amortizacion * cantidadImpresiones
                            amortizacionMantenimiento = amortizacionMantenimiento * cantidadImpresiones
                        } 
                        else {
                            hojas = calculo[i].detalles[j][k].hojas;
                            cantidadCopias = cantidad;
                            equivalenciaPapel = 1;
                            cantidadImpresiones = calculo[i].detalles[j][k].impresiones;
                            amortizacion = amortizacion
                            amortizacionMantenimiento = amortizacionMantenimiento
                        }

    
                        // Encontrar la coincidencia en data.primas.books y tomar el valor
                        for (let x in data.primas.books) {
                            for (let y in data.primas.books[x]) {
                                if (data.primas.books[x][y] === j) {
                                    const valorBook = data.primas.books[x][2];
                                    // console.log(data.primas.books[x]);
                                    costePapel = hojas * valorBook;
                                    break;
                                }
                            }
                        }

                        // console.log(costePapel);
    
                        // Calcular importePapel basado en margen_papel
                        let importePapel = 0;
                        for (let m = 0; m < data.primas.margen_papel.length; m++) {
                            // console.log(data.primas.margen_papel);
                            if (hojas >= data.primas.margen_papel[m][0] && hojas <= data.primas.margen_papel[m][1]) {
                                const margen = data.primas.margen_papel[m][2];
                                importePapel = costePapel + (costePapel * (margen / 100));
                                break;
                            }
                        }

                        
                        // let impresiones = calculo[i].detalles[j][k].impresiones;
                        // console.log(hojas);

                        let costeAmortizacion = {};
                        let amortMant = {};

                        for (const cara in cantidadImpresiones) {
                            costeAmortizacion[cara] = cantidadImpresiones[cara] * amortizacion;
                            amortMant[cara] = cantidadImpresiones[cara] * amortizacionMantenimiento;
                        }
    
                        if (!calculosPersonalizados.customCalculosPapeles[i]) {
                            calculosPersonalizados.customCalculosPapeles[i] = {
                                cantidad: calculo[i].cantidad,
                                detalles: {}
                            };
                        }
                        
                        if (!calculosPersonalizados.customCalculosPapeles[i].detalles[j]) {
                            calculosPersonalizados.customCalculosPapeles[i].detalles[j] = {};
                        }
                        
                        // console.log(calculo[i].cantidad, calculosPersonalizados.customCalculosPapeles[i].detalles[j], costePapel, importePapel);
                        if (!calculosPersonalizados.customCalculosPapeles[i].detalles[j][k]) {
                            calculosPersonalizados.customCalculosPapeles[i].detalles[j][k] = {
                                costeAmortizacion: costeAmortizacion,
                                costeAmortizacionMantenimiento: amortMant,
                                costePapel: costePapel,
                                importePapel: importePapel,
                            };
                        } else {
                            calculosPersonalizados.customCalculosPapeles[i].detalles[j][k].costeAmortizacion = costeAmortizacion;
                            calculosPersonalizados.customCalculosPapeles[i].detalles[j][k].costeAmortizacionMantenimiento = amortMant;
                            calculosPersonalizados.customCalculosPapeles[i].detalles[j][k].costePapel = costePapel;
                            calculosPersonalizados.customCalculosPapeles[i].detalles[j][k].importePapel = importePapel;
                        }
                        
                        // }
                    }
                }
            }
        }

    }


    if (productData.name == 'Copistería online') { 
        
        calculo = calculosPersonalizados.calculosInicialesCopisteria

        function handleColorChange() {
            const selectedColorRadio = document.querySelector("div[data-name='color'] .wpcc-field-radios input[name=color]:checked");
            if (selectedColorRadio) {
                let currentValue = selectedColorRadio.value;
    
                if (currentValue === 'bn') {
                    maquina = atributos.maquina.maquina[1];
                } else {
                    maquina = atributos.maquina.maquina[0];
                }

                recalcularPapelSegunMaquina()
                // console.log('maquina', maquina);
            }
        }
        
        handleColorChange()

        /* const colorRadios = document.querySelectorAll("div[data-name='color'] .wpcc-field-radios input[name=color]");
        colorRadios.forEach(radio => {
            radio.addEventListener('change', handleColorChange);
        });

        function attachChangeEvent(groupName) {
            const radios = document.querySelectorAll(`div[data-name='${groupName}'] .wpcc-field-radios input[name=${groupName}]`);
            radios.forEach(radio => {
                radio.addEventListener('change', recalcularPapelSegunMaquina);
            });
        }
        
        // Llamar a la función para los diferentes grupos
        // attachChangeEvent("color");
        attachChangeEvent("hojas_por_cara");
        attachChangeEvent("tamano"); */

    } else {
        calculo = calculosPersonalizados.customCalculosIniciales
        maquina = atributos.maquina.maquina[0];
        recalcularPapelSegunMaquina()
    }
    
    // console.log('Cálculos personalizados:', calculosPersonalizados.getCalculos());
}

//calculoPapel.js

// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function customCalculoPapel(calculosPersonalizados, tamanoRadio, nuevaCantidad) {

    calculosPersonalizados.customCalculosPapeles = []

    let calculo;
    let maquina;

    function recalcularPapelSegunMaquina() {
        
        // Buscar la coincidencia de esa máquina
        let amortizacion = null;
        let amortizacionTotal = null;
        
        
        for (let i in data.primas.amortizacion) {
            if (maquina === data.primas.amortizacion[i][0]) {
                amortizacion = data.primas.amortizacion[i][1];
                amortizacionTotal = data.primas.amortizacion[i][5];
                break;
            }
        }
        
        if (amortizacion !== null) {
            for (const i in calculo) {
                for (const j in calculo[i].detalles) {
                    for (const k in calculo[i].detalles[j]) {
                        // for (const m in calculo[i].detalles[j][k]) {
                            
                            // console.log(amortizacionTotal);
                            let hojas = calculo[i].detalles[j][k].hojas;
                            // console.log(calculo[i].detalles[j][k]);
                            let costePapel = 0;
        
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

                            
                            let impresiones = calculo[i].detalles[j][k].impresiones;
                            // console.log(impresiones, costePapel, importePapel);
    
                            let costeAmortizacion = {};
                            let amortMant = {};
    
                            for (const cara in impresiones) {
                                costeAmortizacion[cara] = impresiones[cara] * amortizacion;
                                amortMant[cara] = impresiones[cara] * amortizacionTotal;
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

        const colorRadios = document.querySelectorAll("div[data-name='color'] .wpcc-field-radios input[name=color]");
        colorRadios.forEach(radio => {
            radio.addEventListener('change', handleColorChange);
        });

    } else {
        calculo = calculosPersonalizados.customCalculosIniciales
        maquina = atributos.maquina.maquina[0];
        recalcularPapelSegunMaquina()
    }
    
    // console.log('Cálculos personalizados:', calculosPersonalizados.getCalculos());
}

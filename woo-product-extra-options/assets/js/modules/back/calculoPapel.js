export function calculoPapel(data, atributos, calculosGlobales) {
    // Recuperar el valor de maquina
    const maquina = atributos.maquina.maquina[0];
    
    // Buscar la coincidencia de esa máquina
    let amortizacion = null;
    let amortizacionTotal = null;
    for (let i = 0; i < data.primas.amortizacion.length; i++) {
        if (maquina === data.primas.amortizacion[i][0]) {
            amortizacion = data.primas.amortizacion[i][1];
            amortizacionTotal = data.primas.amortizacion[i][5];
            break;
        }
    }
    
    if (amortizacion !== null) {
        for (const i in calculosGlobales.calculosIniciales) {
            for (const j in calculosGlobales.calculosIniciales[i].detalles) {
                for (const k in calculosGlobales.calculosIniciales[i].detalles[j]) {
                    for (const m in calculosGlobales.calculosIniciales[i].detalles[j][k]) {
    
                        let hojas = calculosGlobales.calculosIniciales[i].detalles[j][k].hojas;
                        let costePapel = 0;
    
                        // Encontrar la coincidencia en data.primas.books y tomar el valor
                        for (let x = 0; x < data.primas.books.length; x++) {
                            for (let y = 0; y < data.primas.books[x].length; y++) {
                                if (data.primas.books[x][y] === j) {
                                    const valorBook = data.primas.books[x][2];
                                    costePapel = hojas * valorBook;
                                    break;
                                }
                            }
                        }
    
                        // Calcular importePapel basado en margen_papel
                        let importePapel = 0;
                        for (let m = 0; m < data.primas.margen_papel.length; m++) {
                            if (hojas >= data.primas.margen_papel[m][0] && hojas <= data.primas.margen_papel[m][1]) {
                                const margen = data.primas.margen_papel[m][2];
                                importePapel = costePapel + (costePapel * (margen / 100));
                                break;
                            }
                        }
    
                        let impresiones = calculosGlobales.calculosIniciales[i].detalles[j][k].impresiones;
                        let costeAmortizacion = {};
                        let amortMant = {};
    
                        for (const cara in impresiones) {
                            costeAmortizacion[cara] = impresiones[cara] * amortizacion;
                            amortMant[cara] = impresiones[cara] * amortizacionTotal;
                        }
    
    
                        if (!calculosGlobales.calculosPapeles[i]) {
                            calculosGlobales.calculosPapeles[i] = {
                                cantidad: calculosGlobales.calculosIniciales[i].cantidad,
                                detalles: {}
                            };
                        }
                        
                        if (!calculosGlobales.calculosPapeles[i].detalles[j]) {
                            calculosGlobales.calculosPapeles[i].detalles[j] = {};
                        }
                        
                        if (!calculosGlobales.calculosPapeles[i].detalles[j][k]) {
                            calculosGlobales.calculosPapeles[i].detalles[j][k] = {};
                        }
                        
                        calculosGlobales.calculosPapeles[i].detalles[j][k][m] = {
                            costeAmortizacion: costeAmortizacion,
                            costeAmortizacionMantenimiento: amortMant,
                            costePapel: costePapel,
                            importePapel: importePapel,
                        };
                    
                    }
                }
            }
        }
    }
    // console.log(calculosGlobales)
}
    
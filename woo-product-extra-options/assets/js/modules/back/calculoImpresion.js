export function calculoImpresion(data, atributos, calculosGlobales) {
    const maquina = atributos.maquina.maquina[0];
    const preparacion = parseFloat(data.primas.preparacion_maquina[1][1]);
    
    let produccionHoraValor = 0;

    // Buscar produccionHora basado en la máquina
    for (let i = 0; i < data.primas.amortizacion.length; i++) {
        if (maquina === data.primas.amortizacion[i][0]) {
            produccionHoraValor = data.primas.amortizacion[i][3];
            break;
        }
    }

    if (produccionHoraValor !== 0) {
        for (const i in calculosGlobales.calculosIniciales) {
            for (const j in calculosGlobales.calculosIniciales[i].detalles) {
                for (const k in calculosGlobales.calculosIniciales[i].detalles[j]) {
                    for (const m in calculosGlobales.calculosIniciales[i].detalles[j][k]) {
                        
                        let impresiones = calculosGlobales.calculosIniciales[i].detalles[j][k].impresiones;
                        let produccionHora = {};
                        let tiempoImpresion = {};
                        let costeImpresion = {};
                        let importeImpresion = {};

                        // Calculamos horasTirada y tiempoImpresion para cada propiedad del objeto impresiones
                        for (const cara in impresiones) {
                            produccionHora[cara] = impresiones[cara] / produccionHoraValor;
                            tiempoImpresion[cara] = preparacion + produccionHora[cara];
                            
                            /* for (let x = 0; x < data.primas.precio_hora_manipulado.length; x++) {
                                if (tiempoImpresion[cara] >= parseFloat(data.primas.precio_hora_manipulado[x][2]) && tiempoImpresion[cara] <= parseFloat(data.primas.precio_hora_manipulado[x][3])) {
                                    costeImpresion[cara] = parseFloat(data.primas.precio_hora_manipulado[x][1]) * tiempoImpresion[cara];
                                    importeImpresion[cara] = parseFloat(data.primas.precio_hora_manipulado[x][0]) * tiempoImpresion[cara];
                                    break;
                                }
                            } */
                            for (let x = 0; x < data.primas.precio_hora_producción.length; x++) {
                                if (tiempoImpresion[cara] >= parseFloat(data.primas.precio_hora_producción[x][2]) && tiempoImpresion[cara] <= parseFloat(data.primas.precio_hora_producción[x][3])) {
                                    costeImpresion[cara] = parseFloat(data.primas.precio_hora_producción[x][1]) * tiempoImpresion[cara];
                                    importeImpresion[cara] = parseFloat(data.primas.precio_hora_producción[x][0]) * tiempoImpresion[cara];
                                    break;
                                }
                            }
                        } 

                        if (!calculosGlobales.calculosImpresiones[i]) {
                            calculosGlobales.calculosImpresiones[i] = {
                                cantidad: calculosGlobales.calculosIniciales[i].cantidad,
                                detalles: {}
                            };
                        }

                        if (!calculosGlobales.calculosImpresiones[i].detalles[j]) {
                            calculosGlobales.calculosImpresiones[i].detalles[j] = {};
                        }
                        
                        if (!calculosGlobales.calculosImpresiones[i].detalles[j][k]) {
                            calculosGlobales.calculosImpresiones[i].detalles[j][k] = {};
                        }
                        
                        // Guardar las horasTirada, tiempoImpresion, costeImpresion, y importeImpresion
                        calculosGlobales.calculosImpresiones[i].detalles[j][k][m] = {
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
// calculoImpresion(data);

export function calculoCorte(data, atributos, calculosGlobales) {
    for (const i in calculosGlobales.calculosIniciales) {
        for (const j in calculosGlobales.calculosIniciales[i].detalles) {
            for (const k in calculosGlobales.calculosIniciales[i].detalles[j]) {
                
                const cantidadCorte = calculosGlobales.calculosIniciales[i].detalles[j][k].corte;
                const tiempoMaquina = parseFloat(data.primas.preparacion_maquina[0][1]);
                const manipuladoCorte = parseFloat(data.primas.tiempo_manipulado[0][0]);

                let tiempoCorte = cantidadCorte / manipuladoCorte;
                let totalTiempoCorte = tiempoMaquina + tiempoCorte;
                let costeCorte = 0;
                let importeCorte = 0;

                for (let x = 0; x < data.primas.precio_hora_manipulado.length; x++) {
                    if (totalTiempoCorte >= parseFloat(data.primas.precio_hora_manipulado[x][2]) && totalTiempoCorte <= parseFloat(data.primas.precio_hora_manipulado[x][3])) {
                        costeCorte = totalTiempoCorte * parseFloat(data.primas.precio_hora_manipulado[x][1]);
                        importeCorte = totalTiempoCorte * parseFloat(data.primas.precio_hora_manipulado[x][0]);
                        break;
                    }
                }
                
                if (!calculosGlobales.calculosCortes[i]) {
                    calculosGlobales.calculosCortes[i] = {
                        cantidad: calculosGlobales.calculosIniciales[i].cantidad,
                        detalles: {}
                    };
                }

                // if (!calculosGlobales.calculosCortes[i]) {
                //     calculosGlobales.calculosCortes[i] = {};
                // }
                if (!calculosGlobales.calculosCortes[i].detalles[j]) {
                    calculosGlobales.calculosCortes[i].detalles[j] = {};
                }
                calculosGlobales.calculosCortes[i].detalles[j][k] = {
                    tiempoCorte: tiempoCorte,
                    totalTiempoCorte: totalTiempoCorte,
                    costeCorte: costeCorte,
                    importeCorte: importeCorte
                };
            }
        }
    }
}

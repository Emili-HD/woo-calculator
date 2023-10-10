// calculoCorte.js
// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function customCalculoCorte(calculosPersonalizados, tamanoRadio, nuevaCantidad) {

    calculosPersonalizados.customCalculosCortes = []
    
    let calculo;
    let maquina;
    if (productData.name == 'Copistería online') { 
        calculo = calculosPersonalizados.calculosInicialesCopisteria
        maquina = data.primas.preparacion_maquina[4]
    } else {
        calculo = calculosPersonalizados.customCalculosIniciales
        maquina = data.primas.preparacion_maquina[0]
    }
    
    for (const i in calculo) {
        for (const j in calculo[i].detalles) {
            for (const k in calculo[i].detalles[j]) {
                
                const cantidadCorte = parseFloat(calculo[i].detalles[j][k].corte)
                const tiempoMaquina = parseFloat(maquina[1]);
                const manipuladoCorte = parseFloat(data.primas.tiempo_manipulado[0][0]);
                
                let tiempoCorte
                let totalTiempoCorte
                let costeCorte 
                let importeCorte 

                if (cantidadCorte > 0) {
                    
                    tiempoCorte = cantidadCorte / manipuladoCorte;
                    totalTiempoCorte = tiempoMaquina + tiempoCorte;
                    
                    for (let x in data.primas.precio_hora_manipulado) {
                        if (totalTiempoCorte >= parseFloat(data.primas.precio_hora_manipulado[x][2]) && totalTiempoCorte <= parseFloat(data.primas.precio_hora_manipulado[x][3])) {
                            costeCorte = totalTiempoCorte * parseFloat(data.primas.precio_hora_manipulado[x][1]);
                            importeCorte = totalTiempoCorte * parseFloat(data.primas.precio_hora_manipulado[x][0]);
                            break;
                        }
                    }
                    
                } else {
                    tiempoCorte = 0
                    totalTiempoCorte = 0
                    costeCorte = 0;
                    importeCorte = 0;
                }
                
                if (!calculosPersonalizados.customCalculosCortes[i]) {
                    calculosPersonalizados.customCalculosCortes[i] = {
                        cantidad: calculo[i].cantidad,
                        detalles: {}
                    };
                }

                if (!calculosPersonalizados.customCalculosCortes[i].detalles[j]) {
                    calculosPersonalizados.customCalculosCortes[i].detalles[j] = {};
                }
                calculosPersonalizados.customCalculosCortes[i].detalles[j][k] = {
                    tiempoCorte: tiempoCorte,
                    totalTiempoCorte: totalTiempoCorte,
                    costeCorte: costeCorte,
                    importeCorte: importeCorte
                };
            }
        }
    }
}

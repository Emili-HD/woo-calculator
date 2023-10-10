import { data, atributos, calculosGlobales } from './metaboxes.js';

export function calculoLaminado(data, atributos, calculosGlobales) {
    let cantidadMetros = 0;
    let produccionLaminado = 0;
    let tiempoLaminado = 0;
    let precioManipulado = 0;
    let precioTafira = 0;

    for (let i = 0; i < data.primas.materias.length; i++) {
        if (data.primas.materias[i][0] === "lm") {

            let capacidadGuillotina = data.primas.materias[i][6];

            for (const i in calculosGlobales.calculosIniciales) {
                for (const j in calculosGlobales.calculosIniciales[i].detalles) {
                    for (const k in calculosGlobales.calculosIniciales[i].detalles[j]) {

                        cantidadMetros = calculosGlobales.calculosIniciales[i].detalles[j][k].hojas / capacidadGuillotina;

                        for( let m = 0; m < data.primas.tiempo_manipulado.length; m++) {
                            if( data.primas.tiempo_manipulado[m][1] === "Laminado") {
                                const tiempoPreparacionMaquina = data.primas.tiempo_manipulado[m][0]
                                produccionLaminado = calculosGlobales.calculosIniciales[i].detalles[j][k].hojas / tiempoPreparacionMaquina;

                                for( let n = 0; n < data.primas.preparacion_maquina.length; n++) {
                                    if (data.primas.preparacion_maquina[n][0] === "Laminado") {
                                        tiempoLaminado = produccionLaminado + parseFloat(data.primas.preparacion_maquina[n][1]);
                                    }
                                }     
                                
                                for (let x = 0; x < data.primas.precio_hora_manipulado.length; x++) {
                                    if (tiempoLaminado >= data.primas.precio_hora_manipulado[x][2] && tiempoLaminado <= data.primas.precio_hora_manipulado[x][3]) {
                                        precioManipulado = data.primas.precio_hora_manipulado[x][1];

                                        for (let y = 0; y < data.primas.books.length; y++) {
                                            if (data.primas.books[y][0] === "LM") {
                                                precioTafira = parseFloat(data.primas.books[y][2]);
                                            }
                                        }

                                        const costeLaminado = (cantidadMetros * precioTafira) + (tiempoLaminado * precioManipulado);
                                        const ventaLaminado = cantidadMetros * ( precioTafira + (precioTafira * (50 / 100)) ) + (tiempoLaminado * 50)
                
                                        if (!calculosGlobales.calculosLaminados[i]) {
                                            calculosGlobales.calculosLaminados[i] = {
                                                cantidad: calculosGlobales.calculosIniciales[i].cantidad,
                                                detalles: {}
                                            };
                                        }

                                        // if (!calculosGlobales.calculosLaminados[i]) {
                                        //     calculosGlobales.calculosLaminados[i] = {};
                                        // }
                                        if (!calculosGlobales.calculosLaminados[i].detalles[j]) {
                                            calculosGlobales.calculosLaminados[i].detalles[j] = {};
                                        }
                                        calculosGlobales.calculosLaminados[i].detalles[j][k] = {
                                            tiempoLaminado: tiempoLaminado,
                                            costeLaminado: costeLaminado,
                                            ventaLaminado: ventaLaminado,
                                        };

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }    
}

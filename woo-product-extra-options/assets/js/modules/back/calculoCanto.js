export function calculoCanto(data, atributos, calculosGlobales) {
    const manipulado = data.primas.tiempo_manipulado[1][0];
    const cantidades = atributos.cantidades.cantidades; 
    const cantidadesNumericas = cantidades.map(cantidad => parseInt(cantidad));

    const calculosCantosArray = [];

    cantidadesNumericas.forEach(cantidad => {
        const mesMerma = cantidad * 1.05;
        const tiempoCantos = mesMerma / manipulado;

        for (let i in data.primas.precio_hora_manipulado) {
            if (tiempoCantos >= data.primas.precio_hora_manipulado[i][2] && tiempoCantos <= data.primas.precio_hora_manipulado[i][3]) {
                const costeCantos = tiempoCantos * data.primas.precio_hora_manipulado[i][1];
                const importeCantos = tiempoCantos * data.primas.precio_hora_manipulado[i][0];
                
                const cantoDetalles = {
                    cantidad: cantidad,
                    detalles: {
                        tiempoCantos: tiempoCantos,
                        costeCantos: costeCantos,
                        importeCantos: importeCantos,
                    }
                };

                calculosCantosArray.push(cantoDetalles);
            }
        }
    });

    calculosGlobales.calculosCantos = calculosCantosArray;
}


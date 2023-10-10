// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function customCalculoCanto(calculosPersonalizados, nuevaCantidad) {

    calculosPersonalizados.customCalculosCantos = []
    
    if (!document.querySelector('input[name="cantos"]')) {
        return; // Salimos de la función si el elemento no existe
    }

    const manipulado = data.primas.tiempo_manipulado[1][0];

    // Obtener cantidades de calculos Inciales según el producto
    let calculo;
    if (productData.name == 'Copistería online') { 
        calculo = calculosPersonalizados.calculosInicialesCopisteria
    } else {
        calculo = calculosPersonalizados.customCalculosIniciales
    }

    const cantidadesPersonalizadas = calculo.map(item => item.cantidad);

    // Convertir las cantidades a valores numéricos
    const cantidadesNumericas = cantidadesPersonalizadas.map(cantidad => parseInt(cantidad));

    const calculosCantosArray = [];

    cantidadesNumericas.forEach(cantidad => {
        const mesMerma = cantidad * 1.05;
        const tiempoCantos = mesMerma / manipulado;

        for (let i = 0; i < data.primas.precio_hora_manipulado.length; i++) {
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

    calculosPersonalizados.customCalculosCantos = calculosCantosArray;
    console.log('Cálculos personalizados:', calculosPersonalizados.getCalculos());
}

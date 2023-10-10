export function calculoInicial(data, atributos, calculosGlobales) {
    if (data.campos && data.campos.cartulina) {
        const cartulinasSeleccionadas = data.campos.cartulina;
        const cantidades = atributos.cantidades.cantidades;
        const impresion = data.campos.impresion;

        const materiasPrimasSeleccionadas = data.primas.materias.filter(materia => {
            return cartulinasSeleccionadas.includes(materia[0]);
        });

        let tamanos = [];
        if (data.campos.tamano) {
            tamanos = data.campos.tamano.map(tam => ({
                ancho: tam.ancho,
                alto: tam.alto,
            }));
        }

        const cantidadesNumericas = cantidades.map(cantidad => parseInt(cantidad));

        cantidadesNumericas.forEach(cantidad => {
            const detallesCantidad = {};
            materiasPrimasSeleccionadas.forEach((materiaPrima) => {
                tamanos.forEach((tam) => {
                    const originales1 = Math.floor(materiaPrima[3] / (parseInt(tam.ancho) + 8)) * Math.floor(materiaPrima[4] / (parseInt(tam.alto) + 8));
                    const originales2 = Math.floor(materiaPrima[3] / (parseInt(tam.alto) + 8)) * Math.floor(materiaPrima[4] / (parseInt(tam.ancho) + 8));

                    const corte1 = Math.floor(materiaPrima[3] / parseInt(tam.ancho)) + Math.floor((materiaPrima[4] / parseInt(tam.alto)) + 2);
                    const corte2 = Math.floor(materiaPrima[3] / parseInt(tam.alto)) + Math.floor((materiaPrima[4] / parseInt(tam.ancho)) + 2);

                    const originales = originales1 > originales2 ? originales1 : originales2;
                    const corte = originales === originales1 ? corte1 : corte2;
                    const tirada = Math.ceil(cantidad / originales);

                    const sizeKey = originales === originales1 ? `${tam.ancho}x${tam.alto}` : `${tam.alto}x${tam.ancho}`;

                    let impresiones = {};
                    impresion.forEach((cara) => {
                        const label = `${cara}cara${cara > 1 ? 's' : ''}`;
                        impresiones[label] = parseInt(cara) * tirada;
                    });

                    if (!detallesCantidad[materiaPrima[0]]) {
                        detallesCantidad[materiaPrima[0]] = {};
                    }

                    detallesCantidad[materiaPrima[0]][sizeKey] = {
                        orig: originales,
                        hojas: tirada,
                        impresiones: impresiones,
                        corte: corte
                    };
                });
            });

            calculosGlobales.calculosIniciales.push({
                cantidad: cantidad,
                detalles: detallesCantidad
            });
        });
    }
}

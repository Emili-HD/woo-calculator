// calculoInicial.js

// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

// Función para ordenar alto y ancho y devolver una clave única
function getTamanoKey(alto, ancho) {
    const sortedDimensions = [parseInt(alto), parseInt(ancho)].sort();
    return sortedDimensions.join("x");
}

// Esta función envía todos los cálculos necesarios para calcular los sucesivos módulos
export function customCalculoInicial(calculosPersonalizados) {
    calculosPersonalizados.customCalculosIniciales = []
    
    if (data.campos && data.campos.cartulina) {
        const cartulinasSeleccionadas = data.campos.cartulina;
        const cantidades = atributos.cantidades.cantidades;
        const impresion = data.campos.impresion;
        
        const materiasPrimasSeleccionadas = data.primas.materias.filter(materia => {
            return cartulinasSeleccionadas.includes(materia[0]);
        });
        // console.log(data.primas.materias);
        // console.log(cartulinasSeleccionadas);

        let tamanos = [];
        if (data.campos.tamano) {
            tamanos = data.campos.tamano.map(tam => ({
                ancho: tam.ancho,
                alto: tam.alto,
            }));
        }
        
        const cantidadesNumericas = cantidades.map(cantidad => parseInt(cantidad));

        // console.log('calculoInicial', cantidadesNumericas);
        
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
                    // console.log('tiradaIniciales:', cantidad, originales);

                    const sizeKey = originales === originales1 ? `${tam.ancho}x${tam.alto}` : `${tam.alto}x${tam.ancho}`;
                    
                    let impresiones = {};
                    impresion.forEach((cara) => {
                        const label = `${cara}cara${cara > 1 ? 's' : ''}`;
                        impresiones[label] = parseInt(cara) * tirada;
                    });

                    if (!detallesCantidad[materiaPrima[0]]) {
                        detallesCantidad[materiaPrima[0]] = {};
                    }

                    const tamanoKey = `${tam.alto}x${tam.ancho}`;
                    detallesCantidad[materiaPrima[0]][tamanoKey] = {
                        orig: originales,
                        hojas: tirada,
                        impresiones: impresiones,
                        corte: corte
                    };
                });
            });

            calculosPersonalizados.customCalculosIniciales.push({
                cantidad: cantidad,
                detalles: detallesCantidad
            });
        });
    }
    // console.log('Cálculos personalizados:', calculosPersonalizados.getCalculos());
}

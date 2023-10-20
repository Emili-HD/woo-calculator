// calculoCustomCantidad.js

// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

// Función para ordenar alto y ancho y devolver una clave única
function getTamanoKey(alto, ancho) {
    return `${parseInt(alto)}x${parseInt(ancho)}`;
}

// Esta función envía todos los cálculos necesarios para calcular los sucesivos módulos
export function calculoCustomCantidad(calculosPersonalizados, nuevaCantidad) {

    if (data.campos && data.campos.cartulina) {
        const cartulinasSeleccionadas = data.campos.cartulina;
        const impresion = data.campos.impresion;

        const materiasPrimasSeleccionadas = data.primas.materias.filter(materia => {
            return cartulinasSeleccionadas.includes(materia[0]);
        });

        // console.log('materiasPrimasSeleccionadas', materiasPrimasSeleccionadas);

        // Crear un conjunto para almacenar tamaños únicos como objetos
        let tamanosUnicos = new Set();

        let calculo;
        if (productData.name == 'Copistería online') { 
            calculo = calculosPersonalizados.calculosInicialesCopisteria
            // console.log('calculoCopisteria:', calculo);
        } else {
            calculo = calculosPersonalizados.customCalculosIniciales
            // console.log('calculoIniciales:', calculo);
        }

        // Reiniciar el objeto detallesCantidad antes de calcular los detalles para la nueva cantidad
        const detallesCantidad = {};


        // Recorrer el objeto calculo
        for (let i in calculo) {
            for (let j in calculo[i].detalles) {
                // Obtener los tamaños de cada detalle
                const tamanosDetalle = Object.keys(calculo[i].detalles[j]);

                // Agregar tamaños únicos al conjunto
                tamanosDetalle.forEach(tamano => {
                    const [alto, ancho] = tamano.split('x').map(Number);
                    // Crear un objeto con las propiedades alto y ancho
                    const tamanoObj = { alto, ancho };
                    tamanosUnicos.add(JSON.stringify(tamanoObj)); // Convertir el objeto en cadena JSON
                });
            }
        }

        // Convertir el conjunto nuevamente en un array de objetos de tamaños únicos
        let tamanos = Array.from(tamanosUnicos).map(JSON.parse);

        if (nuevaCantidad !== 0) {
            const detallesCantidad = {};
            
            materiasPrimasSeleccionadas.forEach((materiaPrima) => {
                tamanos.forEach((tam) => {
                    if (productData.name == 'Copistería online') {

                        const selectedColorRadio = document.querySelector("div[data-name='color'] .wpcc-field-radios input[name=color]:checked");
                        let maquina = atributos.maquina.maquina[1];
                        if (selectedColorRadio) {
                            let currentValue = selectedColorRadio.value;
                            if (currentValue === 'bn') {
                                maquina = atributos.maquina.maquina[1];
                            } else {
                                maquina = atributos.maquina.maquina[0];
                            }
                        } 

                        const copisteria = data.primas.copisteria
                        // console.log(copisteria);
                        for (const i in copisteria) {
                            if (maquina === copisteria[i][0]) {
                                // console.log(copisteria[i][2], tam.alto);
                                if (parseFloat(copisteria[i][2]) === tam.alto) {
                                    // console.log(copisteria[i][2], tam.ancho);
                                    let originales = copisteria[i][3]
                                    let corte = copisteria[i][5]
                                    let tirada = Math.ceil(nuevaCantidad / originales);

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
                                }
                            }
                        }

                    } else {

                        // Reiniciar el objeto detallesCantidad antes de calcular los detalles para la nueva cantidad
                        // const detallesCantidad = {};
                        
                        let originales1 = Math.floor(materiaPrima[3] / (parseInt(tam.ancho) + 8)) * Math.floor(materiaPrima[4] / (parseInt(tam.alto) + 8));
                        let originales2 = Math.floor(materiaPrima[3] / (parseInt(tam.alto) + 8)) * Math.floor(materiaPrima[4] / (parseInt(tam.ancho) + 8));
    
                        let corte1 = Math.floor(materiaPrima[3] / parseInt(tam.ancho)) + Math.floor((materiaPrima[4] / parseInt(tam.alto)) + 2);
                        let corte2 = Math.floor(materiaPrima[3] / parseInt(tam.alto)) + Math.floor((materiaPrima[4] / parseInt(tam.ancho)) + 2);
    
                        let originales = originales1 > originales2 ? originales1 : originales2;
                        let corte = originales === originales1 ? corte1 : corte2;
                        let tirada = Math.ceil(nuevaCantidad / originales);
    
                        let sizeKey = getTamanoKey(tam.alto, tam.ancho); // Usar la función de ordenamiento
    
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
                    }
                });
            });

            // Ordenar las claves en el objeto
            const detallesOrdenados = {};
            Object.keys(detallesCantidad).sort().forEach((key) => {
                detallesOrdenados[key] = detallesCantidad[key];
            });

            calculo.push({
                cantidad: nuevaCantidad,
                detalles: detallesOrdenados
            });
        }
    }
    // console.log('Cálculos Cantidad:', calculosPersonalizados.getCalculos());
}

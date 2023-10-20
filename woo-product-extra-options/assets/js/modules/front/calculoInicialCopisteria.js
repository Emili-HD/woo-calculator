// calculoInicialCopisteria.js

// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

// Función para ordenar alto y ancho y devolver una clave única
function getTamanoKey(alto, ancho) {
    const sortedDimensions = [parseInt(alto), parseInt(ancho)].sort();
    return sortedDimensions.join("x");
}

// Esta función envía todos los cálculos necesarios para calcular los sucesivos módulos
export function calculoInicialCopisteria(calculosPersonalizados) {

    calculosPersonalizados.calculosInicialesCopisteria = []

    if (productData.name == 'Copistería online') {

        let maquina;
        let currentValue;

        function toggleMaquina() {
            const selectedColorRadio = document.querySelector("div[data-name='color'] .wpcc-field-radios input[name=color]:checked");
            maquina = atributos.maquina.maquina[1];
            if (selectedColorRadio) {
                currentValue = selectedColorRadio.value;
                if (currentValue === 'bn') {
                    maquina = atributos.maquina.maquina[1];
                } else {
                    maquina = atributos.maquina.maquina[0];
                }
                // console.log('currentValue: ', currentValue);
            } 
            // console.log('maquina: ', maquina);

            if (data.campos && data.campos.cartulina) {
                 const cartulinasSeleccionadas = data.campos.cartulina;
                 const cantidades = atributos.cantidades.cantidades;
                 const impresion = data.campos.impresion;   
                 
                //  console.log(data.primas.materias);

                 
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
                    
                    // Vaciar el arreglo antes de agregar nuevos datos
                    calculosPersonalizados.calculosInicialesCopisteria.splice(0, calculosPersonalizados.calculosInicialesCopisteria.length);
                    
                    const cantidadesNumericas = cantidades.map(cantidad => parseInt(cantidad));
                
                    cantidadesNumericas.forEach(cantidad => {
                        const detallesCantidad = {};
                        materiasPrimasSeleccionadas.forEach((materiaPrima) => {
                            tamanos.forEach((tam) => {
                                const copisteria = data.primas.copisteria
                                // console.log(copisteria);
                                for (const i in copisteria) {
                                    if (maquina === copisteria[i][0]) {
                                        // console.log(copisteria[i]);
                                        if (copisteria[i][2] === tam.alto) {
                                            // console.log(copisteria[i][2], tam.ancho);
                                            const originales = copisteria[i][3]
                                            const corte = copisteria[i][5]
                                            const tirada = Math.ceil(cantidad / originales);

                                            // console.log('tirada:', cantidad, originales);

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
                            });
                        });
            
                        calculosPersonalizados.calculosInicialesCopisteria.push({
                            cantidad: cantidad,
                            detalles: detallesCantidad
                        });
                    });
             }
        }
        
        function attachMaquinaChangeEvent() {
            const colorRadios = document.querySelectorAll("div[data-name='color'] .wpcc-field-radios input[name=color]");
            
            colorRadios.forEach(radio => {
                radio.addEventListener('change', toggleMaquina);
            });
        }
        
        toggleMaquina()
        attachMaquinaChangeEvent()
    }
}

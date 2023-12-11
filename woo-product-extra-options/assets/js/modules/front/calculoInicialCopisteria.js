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

    // calculosPersonalizados.calculosInicialesCopisteria = []

    if (productData.name == 'Copistería online') {

        let maquina;
        let currentValue;

        function toggleMaquina() {
            // Vaciar el arreglo antes de agregar nuevos datos
            calculosPersonalizados.calculosInicialesCopisteria.splice(0, calculosPersonalizados.calculosInicialesCopisteria.length);
            
            const selectedColorRadio = document.querySelector("div[data-name='color'] .wpcc-field-radios input[name=color]:checked");
            const hojasPorCaraRadio = document.querySelector("div[data-name='hojas_por_cara'] .wpcc-field-radios input[name=hojas_por_cara]:checked")
            const selectedTanamoRadio = document.querySelector("div[data-name=tamano] .wpcc-field-radios input[name=tamano]:checked");
            const selectedImpresionRadio = document.querySelector("div[data-name=impresion] .wpcc-field-radios input[name=impresion]:checked");

            let totalImpresiones
            let hojasPorCara
            if (hojasPorCaraRadio) {
                if (parseInt(hojasPorCaraRadio.value) !== 3) {
                    hojasPorCara = parseInt(hojasPorCaraRadio.value)
                } else {
                    hojasPorCara = parseInt(hojasPorCaraRadio.value) - 1
                }
            }
            // console.log('hojasPorCara', hojasPorCara);

            maquina = atributos.maquina.maquina[1];
            if (selectedColorRadio) {
                currentValue = selectedColorRadio.value;
                if (currentValue === 'bn') {
                    maquina = atributos.maquina.maquina[1];
                } else {
                    maquina = atributos.maquina.maquina[0];
                }
            
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
                            const copisteria = data.primas.copisteria
                            // console.log(copisteria);
                            
                            for (const i in copisteria) {
                                if (maquina === copisteria[i][0]) {
                                    let cantidadCopias = document.querySelector("input[name=cantidad__copias]")
                                    let formatoSeleccionado = selectedTanamoRadio.dataset.format;
                                    let copias = parseInt(cantidadCopias.value);
                                    // console.log(copisteria[i]);

                                    totalImpresiones = copias
                                    if (cantidadCopias) {
                                        totalImpresiones = cantidad * copias
                                    }
                                    // console.log(totalImpresiones);
                                    // console.log('tirada:', cantidad, hojasPorCara, copias);

                                    if (copisteria[i][1] === tam.ancho && copisteria[i][2] === tam.alto) {
                                        // console.log(copisteria[i][2], tam.ancho);
                                        const originales = parseFloat(copisteria[i][4])
                                        const corte = parseFloat(copisteria[i][5])
                                        // const tirada = (Math.ceil(cantidad / hojasPorCara) * originales * copias / parseFloat(selectedImpresionRadio.value));

                                        // console.log('caras', selectedImpresionRadio.value);
                                        
                                        let tirada = {};
                                        let impresiones = {};

                                        impresion.forEach((cara) => {
                                            const label = `${cara}cara${cara > 1 ? 's' : ''}`;
                                            tirada[label] = 0; // Inicializar tirada con valor 0 para cada label
                                            
                                            if (parseInt(selectedImpresionRadio.value) === 1 && formatoSeleccionado === 'A3' && maquina === 'Fuji'){
                                                tirada[label] = (Math.ceil(cantidad / hojasPorCara) * originales * copias / parseFloat(selectedImpresionRadio.value))
                                                impresiones[label] = parseInt(cara) * tirada * 2 / hojasPorCara;
                                            } else {
                                                tirada[label] = (Math.ceil(cantidad / hojasPorCara) * originales * copias / parseFloat(selectedImpresionRadio.value))
                                                impresiones[label] = parseInt(cara) * tirada * originales / hojasPorCara;
                                            }
                                        });

                                        // console.log(impresiones);
                    
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
        
        toggleMaquina()

        /* function attachChangeEvent(groupName) {
            const radios = document.querySelectorAll(`div[data-name='${groupName}'] .wpcc-field-radios input[name=${groupName}]`);
            radios.forEach(radio => {
                radio.addEventListener('change', toggleMaquina);
            });
        }
        
        // Llamar a la función para los diferentes grupos
        attachChangeEvent("color");
        attachChangeEvent("hojas_por_cara");
        attachChangeEvent("tamano"); */
    }
}

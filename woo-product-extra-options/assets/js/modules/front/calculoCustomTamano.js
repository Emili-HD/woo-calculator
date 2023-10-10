// calculoCustomTamano.js

// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

// Esta función envía todos los cálculos necesarios para calcular los sucesivos módulos
export function calculoCustomTamano(calculosPersonalizados, nuevaCantidad) {
    const tamanoGroup = document.querySelector(".wpcc-group-radios[data-name=tamano]");

    if (tamanoGroup) {
        if (data.campos && data.campos.cartulina) {
            const cartulinasSeleccionadas = data.campos.cartulina;
            const cantidadesPersonalizadas = calculosPersonalizados.customCalculosIniciales.map(item => item.cantidad);
            // console.log();
    
            // Convertir las cantidades a valores numéricos
            const cantidadesNumericas = cantidadesPersonalizadas.map(cantidad => parseInt(cantidad));
            const impresion = data.campos.impresion;
    
            const materiasPrimasSeleccionadas = data.primas.materias.filter(materia => {
                return cartulinasSeleccionadas.includes(materia[0]);
            });
    
            // Resto del código de cálculos
            cantidadesNumericas.forEach(cantidad => {
                const detallesCantidad = {};
                materiasPrimasSeleccionadas.forEach((materiaPrima) => {
    
                    var alto = document.querySelector("input[name='alto']")
                    var ancho = document.querySelector("input[name='ancho']")
                    var customSizesDiv = document.querySelector('.custom__sizes-size');
                    var errorMessage = document.querySelector('.custom__sizes-error');

                    
                    if(alto && ancho) {
                        errorMessage.style.display = 'none';
                        
                        alto = parseFloat(alto.value);
                        ancho = parseFloat(ancho.value);
                        var superficie = alto * ancho;

                        var superficieMin = parseFloat(customSizesDiv.getAttribute('data-areamin'));
                        var superficieMax = parseFloat(customSizesDiv.getAttribute('data-areamax'));
                        var altoMin = parseFloat(document.querySelector("input[name='alto']").getAttribute('data-min'))
                        var altoMax = parseFloat(document.querySelector("input[name='alto']").getAttribute('data-max'))
                        var anchoMin = parseFloat(document.querySelector("input[name='ancho']").getAttribute('data-min'))
                        var anchoMax = parseFloat(document.querySelector("input[name='ancho']").getAttribute('data-max'))

                        if (superficie >= superficieMin && 
                            superficie <= superficieMax ||
                            altoMin >= alto || altoMax <= alto ||
                            anchoMin >= ancho || anchoMax <= ancho) {
                        
                            const originales1 = Math.floor(materiaPrima[3] / (parseInt(ancho) + 8)) * Math.floor(materiaPrima[4] / (parseInt(alto) + 8));
                            const originales2 = Math.floor(materiaPrima[3] / (parseInt(alto) + 8)) * Math.floor(materiaPrima[4] / (parseInt(ancho) + 8));
                            
                            const corte1 = Math.floor(materiaPrima[3] / parseInt(ancho)) + Math.floor((materiaPrima[4] / parseInt(alto)) + 2);
                            const corte2 = Math.floor(materiaPrima[3] / parseInt(alto)) + Math.floor((materiaPrima[4] / parseInt(ancho)) + 2);
                            
                            const originales = originales1 > originales2 ? originales1 : originales2;
                            const corte = originales === originales1 ? corte1 : corte2;
                            const tirada = Math.ceil(cantidad / originales);
                            
                            let impresiones = {};
                            impresion.forEach((cara) => {
                                const label = `${cara}cara${cara > 1 ? 's' : ''}`;
                                impresiones[label] = parseInt(cara) * tirada;
                            });
                            
                            if (!detallesCantidad[materiaPrima[0]]) {
                                detallesCantidad[materiaPrima[0]] = {};
                            }
                            
                            const tamanoKey = `${alto}x${ancho}`;
                            detallesCantidad[materiaPrima[0]][tamanoKey] = {
                                orig: originales,
                                hojas: tirada,
                                impresiones: impresiones,
                                corte: corte
                            };

                            return true;

                        } else {
                            errorMessage.style.display = 'block';
                            return false;
                        }
                    }
                });
    
                // Verificar si ya existe un cálculo para esta cantidad y tamaño en customCalculosIniciales
                const existeCalculo = calculosPersonalizados.customCalculosIniciales.find(item => item.cantidad === cantidad);
    
                if (existeCalculo) {
                    // Si existe, agrega los detalles calculados
                    Object.keys(detallesCantidad).forEach(materiaPrima => {
                        if (!existeCalculo.detalles[materiaPrima]) {
                            existeCalculo.detalles[materiaPrima] = {};
                        }
                        Object.keys(detallesCantidad[materiaPrima]).forEach(size => {
                            existeCalculo.detalles[materiaPrima][size] = detallesCantidad[materiaPrima][size];
                        });
                    });
                } else {
                    // Si no existe, crea un nuevo cálculo
                    calculosPersonalizados.customCalculosIniciales.push({
                        cantidad: cantidad,
                        detalles: detallesCantidad
                    });
                }
            });
        }
    }
    // console.log('Cálculos Tamaño:', calculosPersonalizados.getCalculos());
}


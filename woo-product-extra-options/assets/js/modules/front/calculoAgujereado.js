//calculoGrapadol.j
// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);

export function calculoAgujereado(calculosPersonalizados, tamanoRadio, nuevaCantidad) {

    calculosPersonalizados.calculosAgujereado = []

    let calculo;
    if (productData.name == 'Copistería online') { 
        calculo = calculosPersonalizados.calculosInicialesCopisteria
    } else {
        calculo = calculosPersonalizados.customCalculosIniciales
    }


    // CALCULO AGUJEROS
    let preparacionAgujeros = 0;
    let tiempoPreparacionAgujeros = 0;
    let totalTiempoAgujeros = 0;
    let costeTaladrar = 0;
    let ventaTaladrar = 0;

    function calculoTaladrar() {
        for (const i in calculo) {
            for (const j in calculo[i].detalles) {
                for (const k in calculo[i].detalles[j]) {
                    const cantidadAgujerosInput = document.querySelector('input[name=acabado]:checked');
                    const impresionCaras = document.querySelector('input[name=impresion]:checked');
                    const cantidadCopias = document.querySelector('input[name=cantidad__copias]'); 
                    
                    const taladrarValores = {
                        'taladrar_1_agujero': 1,
                        'taladrar_2_agujeros': 2,
                        'taladrar_4_agujeros': 4,
                    };

                    const selectedInputs = {};
                    for (const key in taladrarValores) {
                        const inputTaladrar = document.querySelector(`input[name=acabado][value=${key}]`);
                        const inputTaladrarSelected = document.querySelector('input[name=acabado]:checked')
                        // console.log(valorTaladrarSelected);
                        
                        if (inputTaladrar) {
                            let valorTaladrarSelected = inputTaladrarSelected.value
                            selectedInputs[key] = key;
                            let valoresNombresTaladrar = Object.values(selectedInputs);
                            // console.log(valoresNombresTaladrar);
                            
                            const taladrar = data.primas.preparacion_maquina;
                            const cantidadAgujeros = data.primas.tiempo_manipulado;
                            const tiempoTaladrar = data.primas.precio_hora_manipulado
                            let nombreTaladrarJSON = JSON.stringify(valoresNombresTaladrar);
                            let nombreTaladrarArray = JSON.parse(nombreTaladrarJSON);
                            let nombreTaladrar = nombreTaladrarArray.map(item => item.toLowerCase().replace(/_/g, ' '));

                            let impresionCarasValor = impresionCaras.value;
                            let precioHoraTaladrar = 0;
                            
                            // Obtenemos el valor correspondiente al input seleccionado
                            let valorTaladrar = taladrarValores[inputTaladrar.value];
                            let paginasDocumento = calculo[i].cantidad;
                            let copias = cantidadCopias.value;

                            let totalImpresiones;
                            if (cantidadCopias) {
                                totalImpresiones = paginasDocumento * copias;
                            } else {
                                totalImpresiones = paginasDocumento
                            }

                            // console.log(totalImpresiones);
                            
                            for (let i in taladrar) {
                                if (taladrar[i][0] === 'Taladrar') {
                                    preparacionAgujeros = taladrar[i][1];
                                }
                            }

                            let nombreCantidadAgujeros = inputTaladrar.value.toLowerCase();
                            nombreCantidadAgujeros = nombreCantidadAgujeros.toLowerCase().replace(/_/g, ' ');

                            let valorManipuladoAgujeros
                            if (valorTaladrarSelected === 'taladrar_1_agujero') {
                                valorManipuladoAgujeros = cantidadAgujeros[6][0]
                            } else if (valorTaladrarSelected === 'taladrar_2_agujeros') {
                                valorManipuladoAgujeros = cantidadAgujeros[7][0]
                            } else if (valorTaladrarSelected === 'taladrar_4_agujeros') {
                                valorManipuladoAgujeros = cantidadAgujeros[8][0]
                            }

                            
                            tiempoPreparacionAgujeros = Math.ceil(paginasDocumento / impresionCarasValor) * (copias / parseFloat(valorManipuladoAgujeros));
                            // Redondear tiempoPreparacionAgujeros a dos decimales
                            tiempoPreparacionAgujeros = (Math.ceil(tiempoPreparacionAgujeros * 100) / 100).toFixed(2);
                            totalTiempoAgujeros = parseFloat(preparacionAgujeros) + parseFloat(tiempoPreparacionAgujeros);

                            costeTaladrar = totalTiempoAgujeros.toFixed(2) * 12
                            
                            for (let k in tiempoTaladrar) {
                                if (totalTiempoAgujeros >= tiempoTaladrar[k][2] && totalTiempoAgujeros <= tiempoTaladrar[k][3]) {
                                    precioHoraTaladrar = tiempoTaladrar[k][0]
                                }
                            }
                            // console.log('ventaTaladrar', totalTiempoAgujeros.toFixed(2));
                            ventaTaladrar = parseFloat(totalTiempoAgujeros.toFixed(2)) * precioHoraTaladrar
                            // console.log('tiempoPreparacionAgujeros', ventaTaladrar, paginasDocumento, totalTiempoAgujeros);

                            // for (let j in cantidadAgujeros) {
                            //     let manipuladoAgujeros = cantidadAgujeros[j][1].toLowerCase()
                                
                            //     if (nombreTaladrar.includes(nombreCantidadAgujeros) && nombreCantidadAgujeros === manipuladoAgujeros) {
                            //         // console.log('nombreCantidadAgujeros', nombreCantidadAgujeros, manipuladoAgujeros);
                            //         break;                             

                            //       }
                            
                            // }
                            if (!calculosPersonalizados.calculosAgujereado[i]) {
                                calculosPersonalizados.calculosAgujereado[i] = {
                                    cantidad: calculo[i].cantidad,
                                    detalles: {
                                        costeTaladrar: costeTaladrar,
                                        ventaTaladrar: ventaTaladrar,
                                    }
                                };
                            }

                           /*  if (!calculosPersonalizados.calculosAgujereado[i].detalles[j]) {
                                calculosPersonalizados.calculosAgujereado[i].detalles[j] = {
                                };
                            } */

                            /* if (!calculosPersonalizados.calculosAgujereado[i].detalles[j][k]) {
                                calculosPersonalizados.calculosAgujereado[i].detalles[j][k] = {
                                }
                            } */
                        }
                    }
                }
            }
        }
    }
    
    // Llamar a calculoTaladrar para inicializar los cálculos
    calculoTaladrar();
    
    // Añadir event listeners para manejar cambios en acabadoRadios e impresionRadios
    // acabadoRadios.forEach(radio => radio.addEventListener('change', calculoTaladrar));
    // impresionRadios.forEach(radio => radio.addEventListener('change', calculoTaladrar));

    // Agrega un evento change a todos los radios en el documento
    // document.querySelectorAll("input[type=radio]").forEach(radio => {
    //     radio.addEventListener('change', calculoTaladrar);
    // });
    
    // console.log('Cálculos taladrar:', calculosPersonalizados.getCalculos());
    
}

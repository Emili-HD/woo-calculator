// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function customCalculoTotales(calculosPersonalizados, tamanoRadio, nuevaCantidad) {

    calculosPersonalizados.customTotales = []

    function initializeTotalObject() {
        return {
            '1cara': 0,
            '2caras': 0
        };
    }
    
    let totalTiempoProduccion = initializeTotalObject();
    let totalCoste = initializeTotalObject();
    let totalCosteSinAmortizacion = initializeTotalObject();
    let totalVentaSinAcabados = initializeTotalObject(); 
    let totalVentaSinCantos = initializeTotalObject(); 
    let totalVentaSinLaminado = initializeTotalObject(); 
    let totalVenta = initializeTotalObject(); 

    let calculo;
    if (productData.name == 'Copistería online') { 
        calculo = calculosPersonalizados.calculosInicialesCopisteria
    } else {
        calculo = calculosPersonalizados.customCalculosIniciales
    }

    // Verificación de la existencia del grupo de radios para cantos y laminado
    const cantosGroup = document.querySelector(".wpcc-group-radios[data-name=cantos]");
    const laminadoGroup = document.querySelector(".wpcc-group-radios[data-name=laminado]");
    const hendidoGroup = document.querySelector(".wpcc-group-radios[data-name=hendido]");

    
    for (let i in calculosPersonalizados.customCalculosImpresiones) {
        for (let j in calculosPersonalizados.customCalculosImpresiones[i].detalles) {
            for (let k in calculosPersonalizados.customCalculosImpresiones[i].detalles[j]) {
                for (let m in calculosPersonalizados.customCalculosImpresiones[i].detalles[j][k]) {
                    
                    // Obtener todos los radio buttons del grupo 'acabado'
                    const colorRadioButtons = document.querySelectorAll('input[name=color]');
                    const acabadoRadioButtons = document.querySelectorAll('input[name=acabado]');
                    const grapadoInput = document.querySelector('input[name=acabado][value=grapado_izquierda]');
                    let costeGrapado = 0;
                    let importeGrapado = 0;
                    
                    // Añadir event listener a cada radio button del grupo
                    acabadoRadioButtons.forEach(radio => {
                        radio.addEventListener('change', () => {
                            if (grapadoInput.checked) {
                                // Si 'grapadoInput' está seleccionado, recoge los valores del objeto
                                costeGrapado = calculosPersonalizados.calculosGrapado.costeGrapado;
                                importeGrapado = calculosPersonalizados.calculosGrapado.importeGrapado;
                            } else {
                                // Si 'grapadoInput' no está seleccionado, su valor es 0
                                costeGrapado = 0;
                                importeGrapado = 0;
                            }

                            realizarCalculos()
                        });
                    });
                    
                    // Añadir detector de eventos a cada radio button del grupo color
                    colorRadioButtons.forEach(radio => {
                        radio.addEventListener('change', () => {
                            realizarCalculos()
                        });
                    });

                    function realizarCalculos() {

                        // calculosPersonalizados.customTotales = {}
                        
                         /* DATOS PARA LOS CÁLCULOS */
                        /* ******************************************** */
                        
                        // TOTAL TIEMPO IMPRESIÓN
                        let impresion1Cara = calculosPersonalizados.customCalculosImpresiones[i].detalles[j][k]?.tiempoImpresion?.['1cara'] || 0;
                        let impresion2Caras = calculosPersonalizados.customCalculosImpresiones[i].detalles[j][k]?.tiempoImpresion?.['2caras'] || 0;
                        let tiempoCorte = calculosPersonalizados.customCalculosCortes[i].detalles[j][k]?.totalTiempoCorte || 0; // Aquí se obtiene el tiempoCorte.
                        let tiempoCantos = cantosGroup ? calculosPersonalizados.customCalculosCantos[i].tiempoCantos || 0 : 0;
                        let tiempoLaminado = laminadoGroup ? calculosPersonalizados.customCalculosLaminados[i].detalles[j][k].tiempoLaminado || 0 : 0;
                        let tiempoHendido = hendidoGroup ? calculosPersonalizados.customCalculosHendidos[i].detalles.tiempoHendido || 0 : 0;
                        let totalTiempoHendido = hendidoGroup ? calculosPersonalizados.customCalculosHendidos[i].detalles.totalTiempoHendido || 0 : 0;

                        // TOTAL COSTE
                        let costeAmortizacion1Cara = calculosPersonalizados.customCalculosPapeles[i].detalles[j][k]?.costeAmortizacionMantenimiento?.['1cara'] || 0;
                        let costeAmortizacion2Caras = calculosPersonalizados.customCalculosPapeles[i].detalles[j][k]?.costeAmortizacionMantenimiento?.['2caras'] || 0;
                        let costePapel = calculosPersonalizados.customCalculosPapeles[i].detalles[j][k].costePapel || 0;
                        let costeImpresion1Cara = calculosPersonalizados.customCalculosImpresiones[i].detalles[j][k]?.costeImpresion?.['1cara'] || 0;
                        let costeImpresion2Caras = calculosPersonalizados.customCalculosImpresiones[i].detalles[j][k]?.costeImpresion?.['2caras'] || 0;
                        let costeCorte = calculosPersonalizados.customCalculosCortes[i].detalles[j][k]?.costeCorte || 0;
                        let costeCantos = cantosGroup ? calculosPersonalizados.customCalculosCantos[i].detalles.costeCantos || 0 : 0;
                        let costeLaminado = laminadoGroup ? calculosPersonalizados.customCalculosLaminados[i].detalles[j][k].costeLaminado || 0 : 0;
                        let costeHendido = hendidoGroup ? calculosPersonalizados.customCalculosHendidos[i].detalles.costeHendido || 0 : 0;

                        // TOTAL VENTA
                        let importePapel = calculosPersonalizados.customCalculosPapeles[i].detalles[j][k].importePapel || 0;
                        let importeImpresion1Cara = calculosPersonalizados.customCalculosImpresiones[i].detalles[j][k]?.importeImpresion?.['1cara'] || 0;
                        let importeImpresion2Caras = calculosPersonalizados.customCalculosImpresiones[i].detalles[j][k]?.importeImpresion?.['2caras'] || 0;
                        let importeCorte = calculosPersonalizados.customCalculosCortes[i].detalles[j][k]?.importeCorte || 0;
                        let importeCantos = cantosGroup ? calculosPersonalizados.customCalculosCantos[i].detalles.importeCantos || 0 : 0;
                        let ventaLaminado = laminadoGroup ? calculosPersonalizados.customCalculosLaminados[i].detalles[j][k].ventaLaminado || 0 : 0;
                        let ventaHendido = hendidoGroup ? calculosPersonalizados.customCalculosHendidos[i].detalles.ventaHendido || 0 : 0;


                        // CALCULO AGUJEROS
                        let preparacionAgujeros = 0;
                        let tiempoPreparacionAgujeros = 0;
                        let totalTiempoAgujeros = 0;
                        let costeTaladrar = 0;
                        let ventaTaladrar = 0;
                        const acabadoRadios = document.querySelectorAll('input[name=acabado]');
                        const impresionRadios = document.querySelectorAll('input[name=impresion]');
                        const cantidadCopias = document.querySelector('input[name=cantidad__copias]');
                        const plastificadoRadio = document.querySelector('input[name=acabado][value=plastificado]')
                        const encuadernadoRadio = document.querySelector('input[name=acabado][value=encuadernado]')
                        const valoresPlastificado = calculosPersonalizados.calculosPlastificado
                        // const valoresEncuadernado = calculosPersonalizados.calculosEncuadernado
                        
                        
                        function calculoTaladrar() {
                            const cantidadAgujerosInput = document.querySelector('input[name=acabado]:checked');
                            const impresionCaras = document.querySelector('input[name=impresion]:checked');
    
                            const taladrarValores = {
                                'taladrar_1_agujero': 1,
                                'taladrar_2_agujeros': 2,
                                'taladrar_4_agujeros': 4,
                            };
                            
                            if (cantidadAgujerosInput && impresionCaras && taladrarValores[cantidadAgujerosInput.value] != null) {
                                const taladrar = data.primas.preparacion_maquina;
                                const cantidadAgujeros = data.primas.tiempo_manipulado;
                                const tiempoTaladrar = data.primas.precio_hora_manipulado
                                let nombreTaladrar = cantidadAgujerosInput.value.replace(/_/g, ' ').toLowerCase();
                                nombreTaladrar = nombreTaladrar.charAt(0).toUpperCase() + nombreTaladrar.slice(1);
                                let impresionCarasValor = impresionCaras.value;
                                let precioHoraTaladrar = 0;
    
                                // Obtenemos el valor correspondiente al input seleccionado
                                let valorTaladrar = taladrarValores[cantidadAgujerosInput.value];
                                let paginasDocumento = calculo[i].cantidad;
                                let copias = cantidadCopias.value;
                                
                                for (let i in taladrar) {
                                    if (taladrar[i][0] === 'Taladrar') {
                                        preparacionAgujeros = taladrar[i][1];
                                        
                                        for (let j in cantidadAgujeros) {
                                            let nombreCantidadAgujeros = cantidadAgujeros[j][1].toLowerCase();
                                            nombreCantidadAgujeros = nombreCantidadAgujeros.charAt(0).toUpperCase() + nombreCantidadAgujeros.slice(1);
    
                                            if (nombreCantidadAgujeros === nombreTaladrar) {
                                                tiempoPreparacionAgujeros = (paginasDocumento / impresionCarasValor) * copias / cantidadAgujeros[j][0];
                                                // console.log('tiempoPreparacionAgujeros', paginasDocumento, impresionCarasValor, copias, cantidadAgujeros[j][0] );
                                                break;
                                            }
                                        }
                                        
                                        totalTiempoAgujeros = parseFloat(preparacionAgujeros) + parseFloat(tiempoPreparacionAgujeros);
                                        costeTaladrar = totalTiempoAgujeros.toFixed(2) * 12
    
                                        for (let k in tiempoTaladrar) {
                                            if (totalTiempoAgujeros >= tiempoTaladrar[k][2] && totalTiempoAgujeros <= tiempoTaladrar[k][3]) {
                                                precioHoraTaladrar = tiempoTaladrar[k][0]
                                            }
                                        }
                                        ventaTaladrar = totalTiempoAgujeros.toFixed(2) * precioHoraTaladrar
                                    }
                                }
                            }
                        }
                        
                        // Llamar a calculoTaladrar para inicializar los cálculos
                        calculoTaladrar();
                        
                        // Añadir event listeners para manejar cambios en acabadoRadios e impresionRadios
                        acabadoRadios.forEach(radio => radio.addEventListener('change', calculoTaladrar));
                        impresionRadios.forEach(radio => radio.addEventListener('change', calculoTaladrar));

                        // Declaramos las variables de plastificado
                        let costeFunda = 0
                        let costePlastificado = 0
                        let importeFunda = 0
                        let importePlastificado = 0
                        let tiempoProduccionPlastificado = 0
                        
                        // Si existe el radiobutton 'plastificadoRadio' recogemos los datos
                        if (plastificadoRadio && plastificadoRadio.checked) {
                            tiempoProduccionPlastificado = calculosPersonalizados.calculosPlastificado[i].detalles.tiempoProduccionPlastificado || 0;
                            costeFunda = calculosPersonalizados.calculosPlastificado[i].detalles.costeFunda || 0;
                            costePlastificado = calculosPersonalizados.calculosPlastificado[i].detalles.costePlastificado || 0;
                            importeFunda = calculosPersonalizados.calculosPlastificado[i].detalles.importeFunda || 0;
                            importePlastificado = calculosPersonalizados.calculosPlastificado[i].detalles.importePlastificado || 0;
                        }
                        
                        // Declaramos las variables de Encuadernado
                        let tiempoProduccionEncuadernado = 0
                        let totalTiempoImpresion = 0
                        let costeImpresionEncuadernado = 0
                        let costePapelEncudernado = 0
                        let importeImpresionEncuadernado = 0
                        let importePapelEncuadernado = 0
                        let totalCosteEncuadernado = 0
                        let totalVentaEncuadernado = 0
                        let costeEncuadernado = 0
                        let costeTapaFrontal = 0
                        let costeTapaTrasera = 0
                        
                        // Si existe el radiobutton 'encuadernadoRadio' recogemos los datos
                        if (encuadernadoRadio && encuadernadoRadio.checked) {
                            tiempoProduccionEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].tiempoProduccionEncuadernado || 0;
                            costePapelEncudernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costePapelEncudernado || 0;
                            costeEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costeEncudernado || 0;
                            costeImpresionEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costeImpresion || 0;
                            totalTiempoImpresion = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].totalTiempoImpresion || 0;
                            importeImpresionEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costeImpresion || 0;
                            importePapelEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costeImpresion || 0;
                            totalCosteEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costeImpresion || 0;
                            totalVentaEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costeImpresion || 0;
                        }

                        if (productData.name == 'Copistería online') {
                            // TOTAL TIEMPO PRODUCCIÓN
                            totalTiempoProduccion['1cara'] = impresion1Cara + tiempoCorte + totalTiempoAgujeros + tiempoProduccionEncuadernado + totalTiempoImpresion + tiempoProduccionPlastificado;
                            totalTiempoProduccion['2caras'] = impresion2Caras + tiempoCorte + totalTiempoAgujeros + tiempoProduccionEncuadernado + totalTiempoImpresion + tiempoProduccionPlastificado;
                                   
                            // TOTAL COSTE
                            totalCoste['1cara'] = costeAmortizacion1Cara + costePapel + costeImpresionEncuadernado + costePapelEncudernado + totalCosteEncuadernado + costeCorte + costeGrapado + costeTaladrar + costeFunda + costePlastificado;
                            totalCoste['2caras'] = costeAmortizacion2Caras + costePapel + costeImpresionEncuadernado + costePapelEncudernado + totalCosteEncuadernado + costeCorte + costeGrapado + costeTaladrar + costeFunda + costePlastificado;

                            // TOTAL COSTE SIN AMORTIZACIÓN
                            totalCosteSinAmortizacion['1cara'] = totalCoste['1cara'] - costeAmortizacion1Cara;
                            totalCosteSinAmortizacion['2caras'] = totalCoste['2caras'] - costeAmortizacion2Caras;

                            // TOTAL VENTA SIN ACABADOS
                            totalVentaSinAcabados['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
                            totalVentaSinAcabados['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
                            
                            // TOTAL VENTA SIN CANTOS
                            totalVentaSinCantos['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
                            totalVentaSinCantos['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
        
                            // TOTAL VENTA SIN LAMINADO
                            totalVentaSinLaminado['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
                            totalVentaSinLaminado['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
                            
                            // TOTAL VENTA
                            // console.log(costeAmortizacion1Cara, importePapel, importeImpresion1Cara, importeCorte, importeFunda, importePlastificado, importeGrapado, ventaTaladrar, totalVentaEncuadernado, importeImpresionEncuadernado, importePapelEncuadernado);
                            totalVenta['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
                            totalVenta['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;

                            // console.log(costeAmortizacion1Cara, importePapel, importeImpresion1Cara, importeCorte, importeFunda, importePlastificado, importeGrapado, ventaTaladrar, totalVentaEncuadernado, importeImpresionEncuadernado, importePapelEncuadernado);


                        } else {
                           
                            // TOTAL TIEMPO PRODUCCIÓN
                            totalTiempoProduccion['1cara'] = impresion1Cara + tiempoCorte + tiempoCantos + tiempoLaminado + totalTiempoHendido + tiempoHendido;
                            totalTiempoProduccion['2caras'] = impresion2Caras + tiempoCorte + tiempoCantos + tiempoLaminado + totalTiempoHendido + tiempoHendido;
                                   
                            // TOTAL COSTE
                            totalCoste['1cara'] = costeAmortizacion1Cara + costePapel + costeImpresion1Cara + costeCorte + costeCantos + costeLaminado + costeHendido + costeGrapado + costeTaladrar + costeFunda + 2;
                            totalCoste['2caras'] = costeAmortizacion2Caras + costePapel + costeImpresion2Caras + costeCorte + costeCantos + costeLaminado + costeHendido + costeGrapado + costeTaladrar + costeFunda + 2;

                            // TOTAL COSTE SIN AMORTIZACIÓN
                            totalCosteSinAmortizacion['1cara'] = totalCoste['1cara'] - costeAmortizacion1Cara;
                            totalCosteSinAmortizacion['2caras'] = totalCoste['2caras'] - costeAmortizacion2Caras;

                            // TOTAL VENTA SIN ACABADOS
                            totalVentaSinAcabados['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + ventaHendido + importeGrapado + ventaTaladrar + 1;
                            totalVentaSinAcabados['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + ventaHendido + importeGrapado + ventaTaladrar + 1;
                            
                            // TOTAL VENTA SIN CANTOS
                            totalVentaSinCantos['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + ventaLaminado + ventaHendido + importeGrapado + ventaTaladrar + 1;
                            totalVentaSinCantos['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + ventaLaminado + ventaHendido + importeGrapado + ventaTaladrar + 1;
        
                            // TOTAL VENTA SIN LAMINADO
                            totalVentaSinLaminado['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + importeCantos + ventaHendido + importeGrapado + ventaTaladrar + 1;
                            totalVentaSinLaminado['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + importeCantos + ventaHendido + importeGrapado + ventaTaladrar + 1;
        
                            // TOTAL VENTA
                            totalVenta['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + importeCantos + ventaLaminado + ventaHendido + importeGrapado + ventaTaladrar + 1;
                            totalVenta['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + importeCantos + ventaLaminado + ventaHendido + importeGrapado + ventaTaladrar + 1;
                        
                        }
                                
                        // ENVÍO DE LOS CÁLCULOS
                        if (!calculosPersonalizados.customTotales[i]) {
                            calculosPersonalizados.customTotales[i] = {
                                cantidad: calculo[i].cantidad,
                                detalles: {}
                            };
                        }
                        if (!calculosPersonalizados.customTotales[i].detalles[j]) {
                            calculosPersonalizados.customTotales[i].detalles[j] = {};
                        }

                        if (!calculosPersonalizados.customTotales[i].detalles[j][k]) {
                            calculosPersonalizados.customTotales[i].detalles[j][k] = {
                                '1Cara': {
                                    totalTiempoProduccion: totalTiempoProduccion['1cara'],
                                    totalCoste: totalCoste['1cara'],
                                    totalCosteSinAmortizacion: totalCosteSinAmortizacion['1cara'],
                                    totalVentaSinAcabados: totalVentaSinAcabados['1cara'],
                                    totalVentaSinCantos: totalVentaSinCantos['1cara'],
                                    totalVentaSinLaminado: totalVentaSinLaminado['1cara'],
                                    totalVenta: totalVenta['1cara'],
                                },
                                '2Caras': {
                                    totalTiempoProduccion: totalTiempoProduccion['2caras'],
                                    totalCoste: totalCoste['2caras'],
                                    totalCosteSinAmortizacion: totalCosteSinAmortizacion['2caras'],
                                    totalVentaSinAcabados: totalVentaSinAcabados['2caras'],
                                    totalVentaSinCantos: totalVentaSinCantos['2caras'],
                                    totalVentaSinLaminado: totalVentaSinLaminado['2caras'],
                                    totalVenta: totalVenta['2caras'],
                                }
                            } 
                        } else {
                            
                            calculosPersonalizados.customTotales[i].detalles[j][k]['1Cara'].totalTiempoProduccion = totalTiempoProduccion['1cara'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['1Cara'].totalCoste = totalCoste['1cara'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['1Cara'].totalCosteSinAmortizacion = totalCosteSinAmortizacion['1cara'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['1Cara'].totalVentaSinAcabados = totalVentaSinAcabados['1cara'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['1Cara'].totalVentaSinCantos = totalVentaSinCantos['1cara'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['1Cara'].totalVentaSinLaminado = totalVentaSinLaminado['1cara'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['1Cara'].totalVenta = totalVenta['1cara'];
                            
                            calculosPersonalizados.customTotales[i].detalles[j][k]['2Caras'].totalTiempoProduccion = totalTiempoProduccion['2caras'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['2Caras'].totalCoste = totalCoste['2caras'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['2Caras'].totalCosteSinAmortizacion = totalCosteSinAmortizacion['2caras'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['2Caras'].totalVentaSinAcabados = totalVentaSinAcabados['2caras'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['2Caras'].totalVentaSinCantos = totalVentaSinCantos['2caras'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['2Caras'].totalVentaSinLaminado = totalVentaSinLaminado['2caras'];
                            calculosPersonalizados.customTotales[i].detalles[j][k]['2Caras'].totalVenta = totalVenta['2caras'];

                            // console.log('papel', costePapel, importePapel);
                        }
                            
                    }

                    realizarCalculos()                    
                }
            }
        }
    }
    // console.log('Cálculos personalizados:', calculosPersonalizados.getCalculos());
    return totalTiempoProduccion;
}
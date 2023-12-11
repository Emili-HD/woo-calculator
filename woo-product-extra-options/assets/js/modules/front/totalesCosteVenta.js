// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function customCalculoTotales(calculosPersonalizados, tamanoRadio, nuevaCantidad, cantidadCopias) {

    calculosPersonalizados.customTotales = [];

    function initializeTotalObject() {
        return {
            '1cara': 0,
            '2caras': 0
        };
    };
    
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
    };

    // Verificación de la existencia del grupo de radios para cantos y laminado
    const cantosGroup = document.querySelector(".wpcc-group-radios[data-name=cantos]");
    const laminadoGroup = document.querySelector(".wpcc-group-radios[data-name=laminado]");
    const hendidoGroup = document.querySelector(".wpcc-group-radios[data-name=hendido]");

    // Accedemos a los valores configurados en materias primas
    const papelSeleccionado = data.primas.books
    const precioEscaladoBn = data.primas.escalado_bn
    const precioEscaladoColor = data.primas.escalado_color
    
    for (let i in calculosPersonalizados.customCalculosIniciales) {
        for (let j in calculosPersonalizados.customCalculosIniciales[i].detalles) {
            for (let k in calculosPersonalizados.customCalculosIniciales[i].detalles[j]) {
                    
                // Obtener todos los radio buttons del grupo 'acabado'
                const acabadoRadioButtons = document.querySelectorAll('input[name=acabado]');
                const grapadoInput = document.querySelector('input[name=acabado][value=grapado_izquierda]');
                let costeGrapado = 0;
                let importeGrapado = 0;
                
                if (grapadoInput && grapadoInput.checked) {
                    // Si 'grapadoInput' está seleccionado, recoge los valores del objeto
                    costeGrapado = calculosPersonalizados.calculosGrapado.costeGrapado;
                    importeGrapado = calculosPersonalizados.calculosGrapado.importeGrapado;
                } 
                
                cantidadCopias = document.querySelector('input[name=cantidad__copias]');

                function realizarCalculos() {

                    let valorCantidadCopias = 1;
                    if (cantidadCopias) {
                        valorCantidadCopias = cantidadCopias.value
                    }
                    
                    /* DATOS PARA LOS CÁLCULOS */
                    /* ******************************************** */
                    const impresionRadio = document.querySelector('input[name=impresion]:checked');
                    let impresionRadioValue = parseFloat(impresionRadio.value)
                    
                    let paginasDocumento;
                    for (const i in calculo) {
                        paginasDocumento = calculo[i].cantidad;

                        let cartulinaInput = document.querySelector('input[name=cartulina]:checked');
                        let precioPapel = 0;

                        for (let y in papelSeleccionado) {
                            if (papelSeleccionado[y][0] === cartulinaInput.value && cartulinaInput.value !== 'DA4') {
                                precioPapel = parseFloat(papelSeleccionado[y][2]) * paginasDocumento;
                            }
                        }

                        let cantidadImpresiones;
                        if (impresionRadioValue === 1) {
                            cantidadImpresiones = calculo[i].detalles[j][k]?.impresiones?.['1cara'];
                        } else {
                            cantidadImpresiones = calculo[i].detalles[j][k]?.impresiones?.['2caras'];
                        }

                        // console.log(calculo[i].detalles[j][k]?.impresiones?.['1cara']);

                        const cantidadImpresiones1Cara = calculo[i].detalles[j][k]?.impresiones?.['1cara'];
                        const cantidadImpresiones2Caras = calculo[i].detalles[j][k]?.impresiones?.['2caras'];

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

                        // Obtener el valor seleccionado del radio button
                        const selectedColorRadio = document.querySelector('input[name=color]:checked');
                        const radioValue = selectedColorRadio ? selectedColorRadio.value : null;
                        
                        // let precioUnitarioBn = 0;

                        let totalImpresiones = paginasDocumento
                        if (cantidadCopias) {
                            totalImpresiones = cantidadImpresiones
                        }
                        
                        let importePapel = calculosPersonalizados.customCalculosPapeles[i].detalles[j][k].importePapel || 0;     
                        if (productData.name === 'Copistería online') {
                            let precioEscalado = (radioValue === 'bn') ? precioEscaladoBn : precioEscaladoColor;
                        
                            for (let i in precioEscalado) {
                                let rangoInicial = parseFloat(precioEscalado[i][0]);
                                let rangoFinal = parseFloat(precioEscalado[i][1]);
                        
                                if (totalImpresiones >= rangoInicial && totalImpresiones <= rangoFinal) {
                                    importePapel = 0;
                                } else if (totalImpresiones > rangoFinal) {
                                    importePapel = (calculosPersonalizados.customCalculosPapeles[i]?.detalles[j]?.[k]?.importePapel) || 0;
                                }
                            }
                        }

                        let importeImpresion1Cara = calculosPersonalizados.customCalculosImpresiones[i].detalles[j][k]?.importeImpresion?.['1cara'] || 0;
                        let importeImpresion2Caras = calculosPersonalizados.customCalculosImpresiones[i].detalles[j][k]?.importeImpresion?.['2caras'] || 0;
                        let importeCorte = calculosPersonalizados.customCalculosCortes[i].detalles[j][k]?.importeCorte || 0;
                        let importeCantos = cantosGroup ? calculosPersonalizados.customCalculosCantos[i].detalles.importeCantos || 0 : 0;
                        let ventaLaminado = laminadoGroup ? calculosPersonalizados.customCalculosLaminados[i].detalles[j][k].ventaLaminado || 0 : 0;
                        let ventaHendido = hendidoGroup ? calculosPersonalizados.customCalculosHendidos[i].detalles.ventaHendido || 0 : 0;

                        const plastificadoRadio = document.querySelector('input[name=acabado][value=plastificado]')
                        const encuadernadoRadio = document.querySelector('input[name=acabado][value=encuadernado]')
                        
                        // CALCULO AGUJEROS
                        const agujereadoRadio2 = document.querySelector('input[name=acabado][value=taladrar_2_agujeros]:checked')
                        const agujereadoRadio4 = document.querySelector('input[name=acabado][value=taladrar_4_agujeros]:checked')
                        let preparacionAgujeros = 0;
                        let tiempoPreparacionAgujeros = 0;
                        let totalTiempoAgujeros = 0;
                        let costeTaladrar = 0
                        let ventaTaladrar = 0

                        if (agujereadoRadio2 || agujereadoRadio4) {
                            costeTaladrar = calculosPersonalizados.calculosAgujereado[i].detalles.costeTaladrar;
                            ventaTaladrar = calculosPersonalizados.calculosAgujereado[i].detalles.ventaTaladrar;
                        }

                        // console.log(costeTaladrar, ventaTaladrar);
                        

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
                        let costeAmortMantPortada = 0
                        let ventaPapelPortada = 0
                        
                        // Si existe el radiobutton 'encuadernadoRadio' recogemos los datos
                        if (encuadernadoRadio && encuadernadoRadio.checked) {
                            tiempoProduccionEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].tiempoProduccionEncuadernado || 0;
                            totalTiempoImpresion = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].totalTiempoImpresion || 0;

                            costePapelEncudernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costePapelEncudernado || 0;
                            costeEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costeEncudernado || 0;
                            costeImpresionEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costeImpresion || 0;
                            costeAmortMantPortada = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].costeAmortMantPortada || 0;
                            totalCosteEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].totalCosteEncuadernado || 0;

                            importeImpresionEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].importeImpresion || 0;
                            importePapelEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].importePapel || 0;
                            totalVentaEncuadernado = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].totalVentaEncuadernado || 0;
                            ventaPapelPortada = calculosPersonalizados.calculosEncuadernado[i].detalles[j][k].ventaPapelPortada || 0;
                        }

                        /* 
                           IMPORTANTE!!!
                           La manera de calcular pasada en el excel no está bien estructurada, con lo que hay que recorrer multitud de opciones y sumarlas en los cálculos
                           Sería interesante crear un total en cada script que recoja las variables implicadas. 
                           Esto simplificaría el código y sería más fácil el mantenimiento
                        */


                        if (productData.name == 'Copistería online') {
                            // ventaPapelPortada = ventaPapelPortada * valorCantidadCopias
                            // TOTAL TIEMPO PRODUCCIÓN
                            totalTiempoProduccion['1cara'] = impresion1Cara + tiempoCorte + totalTiempoAgujeros + tiempoProduccionEncuadernado + totalTiempoImpresion + tiempoProduccionPlastificado;
                            totalTiempoProduccion['2caras'] = impresion2Caras + tiempoCorte + totalTiempoAgujeros + tiempoProduccionEncuadernado + totalTiempoImpresion + tiempoProduccionPlastificado;
                                    
                            // TOTAL COSTE
                            totalCoste['1cara'] = costeAmortizacion1Cara + costePapel + costeImpresionEncuadernado + costePapelEncudernado + costeAmortMantPortada + totalCosteEncuadernado + costeCorte + costeGrapado + costeTaladrar + costeFunda + costePlastificado;
                            totalCoste['2caras'] = costeAmortizacion2Caras + costePapel + costeImpresionEncuadernado + costePapelEncudernado + costeAmortMantPortada + totalCosteEncuadernado + costeCorte + costeGrapado + costeTaladrar + costeFunda + costePlastificado;

                            // TOTAL COSTE SIN AMORTIZACIÓN
                            totalCosteSinAmortizacion['1cara'] = totalCoste['1cara'] - costeAmortizacion1Cara;
                            totalCosteSinAmortizacion['2caras'] = totalCoste['2caras'] - costeAmortizacion2Caras;
                        
                            // TOTAL VENTA SIN CANTOS
                            totalVentaSinCantos['1cara'] = 0;
                            totalVentaSinCantos['2caras'] = 0;
        
                            // TOTAL VENTA SIN LAMINADO
                            totalVentaSinLaminado['1cara'] = 0;
                            totalVentaSinLaminado['2caras'] = 0;
        
                            // TOTAL VENTA
                            totalVenta['1cara'] = 0;
                            totalVenta['2caras'] = 0;

                            if (radioValue === 'bn') {
                                for (let i in precioEscaladoBn) {
                                    const rangoInicial = parseFloat(precioEscaladoBn[i][0]);
                                    const rangoFinal = parseFloat(precioEscaladoBn[i][1]);
                                    const precio = parseFloat(precioEscaladoBn[i][2])

                                    // console.log('rangoFinal', precioEscaladoBn);

                                    if (paginasDocumento >= 1 || paginasDocumento <= 2000) {
                                        // TOTAL VENTA SIN ACABADOS
                                        // importeFunda = 0
                                        totalVentaSinAcabados['1cara'] = (precio * totalImpresiones) + precioPapel + importePapel + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + ventaPapelPortada + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
                                        totalVentaSinAcabados['2caras'] = (precio * totalImpresiones) + precioPapel + importePapel + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + ventaPapelPortada + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
                                                                // console.log(precio, totalImpresiones, precioPapel, importePapel, importeFunda, importePlastificado, importeGrapado, ventaTaladrar, ventaPapelPortada, totalVentaEncuadernado, importeImpresionEncuadernado, importePapelEncuadernado);
 
                                        break;
                                    }
                                    if (paginasDocumento > 2000 ) {
                                        // TOTAL VENTA SIN ACABADOS
                                        totalVentaSinAcabados['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + importeGrapado + ventaTaladrar + ventaPapelPortada + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado + importeFunda + importePlastificado + 1;
                                        totalVentaSinAcabados['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + importeGrapado + ventaTaladrar + ventaPapelPortada + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado + importeFunda + importePlastificado + 1;
                                        break;
                                    }
                                    /* if (precioUnitarioBn === 0) {
                                        // TOTAL VENTA SIN ACABADOS
                                        totalVentaSinAcabados['1cara'] = valorCantidadCopias * (totalImpresiones + precioPapel + importePapel + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + ventaPapelPortada + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado);
                                        totalVentaSinAcabados['2caras'] = valorCantidadCopias * (totalImpresiones + precioPapel + importePapel + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + ventaPapelPortada + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado);
                                    } */
                                }
                            } else if (radioValue === 'color') {
                                for (let i in precioEscaladoColor) {
                                    const rangoInicial = parseFloat(precioEscaladoColor[i][0]);
                                    const rangoFinal = parseFloat(precioEscaladoColor[i][1]);
                                    const precio = parseFloat(precioEscaladoColor[i][3]);

                                    // const totalPaginasColor = paginasDocumento * parseFloat(cantidadCopias.value);
                                    // console.log(paginasDocumento, parseFloat(cantidadCopias.value));

                                    if (totalImpresiones <= 1 || totalImpresiones <= 6000) {
                                        // TOTAL VENTA SIN ACABADOS
                                        totalVentaSinAcabados['1cara'] = (precio * paginasDocumento) + precioPapel + importePapel + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + ventaPapelPortada + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
                                        totalVentaSinAcabados['2caras'] = (precio * paginasDocumento) + precioPapel + importePapel + importeFunda + importePlastificado + importeGrapado + ventaTaladrar + ventaPapelPortada + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado;
                                        // console.log(precio, totalPaginasColor, precioPapel, importePapel, importeGrapado, ventaTaladrar, totalVentaEncuadernado, importePapelEncuadernado, importeImpresionEncuadernado, importePlastificado);
                                    }
                                    if (totalImpresiones > 6000 ) {
                                        // TOTAL VENTA SIN ACABADOS
                                        totalVentaSinAcabados['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + importeGrapado + ventaTaladrar + ventaPapelPortada + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado + importeFunda + importePlastificado;
                                        totalVentaSinAcabados['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + importeGrapado + ventaTaladrar + ventaPapelPortada + totalVentaEncuadernado + importeImpresionEncuadernado + importePapelEncuadernado + importeFunda + importePlastificado;
                                        // console.log(costeAmortizacion1Cara, importePapel, importeImpresion1Cara, importeCorte , importeFunda , importePlastificado , importeGrapado , ventaTaladrar , ventaPapelPortada , totalVentaEncuadernado , importeImpresionEncuadernado , importePapelEncuadernado);
                                        // console.log(costeAmortizacion1Cara, importePapel, importeImpresion1Cara, importeCorte, ventaHendido, importeGrapado, ventaTaladrar);
                                    }
                                }
                            }

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
                        // Enviamos los cálculos al cargar la página
                        if (!calculosPersonalizados.customTotales[i]) {
                            calculosPersonalizados.customTotales[i] = {
                                cantidad: paginasDocumento,
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
                            // Si ya existe el array, lo actualizamo con los nuevos cálculos
                            // Este envío es necesario para actualizar el array cada vez que clicamos un nuevo radiobutton
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
                        }
                        //     }
                        // }
                    }
                    
                        
                }

                realizarCalculos()
                
                
                // // Agrega un evento change a todos los radios en el documento
                // document.querySelectorAll("input[type=radio]").forEach(radio => {
                //     radio.addEventListener('change', realizarCalculos);
                // });

                // Si tienes un elemento con id "cantidadCopias", puedes agregar un evento input
                // const cantidadCopias = document.getElementById("cantidadCopias");
                // if (cantidadCopias) {
                //     cantidadCopias.addEventListener('input', realizarCalculos);
                // }
                
                
            }
        }
    }
    // console.log('Cálculos personalizados:', calculosPersonalizados.getCalculos());
    return totalTiempoProduccion;
}

export function calculoTotales(data, atributos, calculosGlobales) {
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
    
    for (let i in calculosGlobales.calculosImpresiones) {
        for (let j in calculosGlobales.calculosImpresiones[i].detalles) {
            for (let k in calculosGlobales.calculosImpresiones[i].detalles[j]) {
                for (let m in calculosGlobales.calculosImpresiones[i].detalles[j][k]) {
                
                    // TOTAL TIEMPO IMPRESIÓN
                    let impresion1Cara = calculosGlobales.calculosImpresiones[i].detalles[j][k][m]?.tiempoImpresion?.['1cara'] || 0;
                    let impresion2Caras = calculosGlobales.calculosImpresiones[i].detalles[j][k][m]?.tiempoImpresion?.['2caras'] || 0;
                    let tiempoCorte = calculosGlobales.calculosCortes[i].detalles[j][k]?.totalTiempoCorte || 0; // Aquí se obtiene el tiempoCorte.
                    let tiempoCantos = calculosGlobales.calculosCantos[i].tiempoCantos || 0;
                    let tiempoLaminado = calculosGlobales.calculosLaminados[i].detalles[j][k].tiempoLaminado || 0;
                    
                    totalTiempoProduccion['1cara'] = impresion1Cara + tiempoCorte + tiempoCantos + tiempoLaminado;
                    totalTiempoProduccion['2caras'] = impresion2Caras + tiempoCorte + tiempoCantos + tiempoLaminado;

                    // TOTAL COSTE
                    let costeAmortizacion1Cara = calculosGlobales.calculosPapeles[i].detalles[j][k].impresiones?.costeAmortizacionMantenimiento?.['1cara'] || 0;
                    let costeAmortizacion2Caras = calculosGlobales.calculosPapeles[i].detalles[j][k].impresiones?.costeAmortizacionMantenimiento?.['2caras'] || 0;
                    let costePapel = calculosGlobales.calculosPapeles[i].detalles[j][k].orig.costePapel || 0;
                    let costeImpresion1Cara = calculosGlobales.calculosImpresiones[i].detalles[j][k][m]?.costeImpresion?.['1cara'] || 0;
                    let costeImpresion2Caras = calculosGlobales.calculosImpresiones[i].detalles[j][k][m]?.costeImpresion?.['2caras'] || 0;
                    let costeCorte = calculosGlobales.calculosCortes[i].detalles[j][k]?.costeCorte || 0;
                    let costeCantos = calculosGlobales.calculosCantos[i].detalles.costeCantos || 0;
                    let costeLaminado = calculosGlobales.calculosLaminados[i].detalles[j][k].costeLaminado || 0;
                    
                    totalCoste['1cara'] = costeAmortizacion1Cara + costePapel + costeImpresion1Cara + costeCorte + costeCantos + costeLaminado + 2;
                    totalCoste['2caras'] = costeAmortizacion2Caras + costePapel + costeImpresion2Caras + costeCorte + costeCantos + costeLaminado + 2;
                    
                    // TOTAL COSTE SIN AMORTIZACIÓN
                    totalCosteSinAmortizacion['1cara'] = totalCoste['1cara'] - costeAmortizacion1Cara;
                    totalCosteSinAmortizacion['2caras'] = totalCoste['2caras'] - costeAmortizacion2Caras;
                    
                    // TOTAL VENTA
                    let importePapel = calculosGlobales.calculosPapeles[i].detalles[j][k].orig.importePapel || 0;
                    let importeImpresion1Cara = calculosGlobales.calculosImpresiones[i].detalles[j][k][m]?.importeImpresion?.['1cara'] || 0;
                    let importeImpresion2Caras = calculosGlobales.calculosImpresiones[i].detalles[j][k][m]?.importeImpresion?.['2caras'] || 0;
                    let importeCorte = calculosGlobales.calculosCortes[i].detalles[j][k]?.importeCorte || 0;
                    let importeCantos = calculosGlobales.calculosCantos[i].detalles.importeCantos || 0;
                    let ventaLaminado = calculosGlobales.calculosLaminados[i].detalles[j][k].ventaLaminado || 0;

                    totalVentaSinAcabados['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + 1;
                    totalVentaSinAcabados['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + 1;

                    totalVentaSinCantos['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + ventaLaminado + 1;
                    totalVentaSinCantos['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + ventaLaminado + 1;

                    totalVentaSinLaminado['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + importeCantos + 1;
                    totalVentaSinLaminado['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + importeCantos + 1;

                    totalVenta['1cara'] = costeAmortizacion1Cara + importePapel + importeImpresion1Cara + importeCorte + importeCantos + ventaLaminado + 1;
                    totalVenta['2caras'] = costeAmortizacion2Caras + importePapel + importeImpresion2Caras + importeCorte + importeCantos + ventaLaminado + 1;


                    // ENVÍO DE LOS CÁLCULOS
                    if (!calculosGlobales.totalesCosteVenta[i]) {
                        calculosGlobales.totalesCosteVenta[i] = {
                            cantidad: calculosGlobales.calculosIniciales[i].cantidad,
                            detalles: {}
                        };
                    }
                    if (!calculosGlobales.totalesCosteVenta[i].detalles[j]) {
                        calculosGlobales.totalesCosteVenta[i].detalles[j] = {};
                    }
                    calculosGlobales.totalesCosteVenta[i].detalles[j][k] = {
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
                    };
                    
                }
            }
        }
    }

    let urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('post');

    const xhr = new XMLHttpRequest();
    xhr.open("POST", wpcc_vars.ajax_url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = xhr.responseText;
            // Handle the response if needed
        }
    };

    xhr.send("action=wpcc_save_calculos_globales&calculosGlobales=" + encodeURIComponent(JSON.stringify(calculosGlobales)) + "&product_id=" + productId);

    // console.log(calculosGlobales.getCalculos());
    return totalTiempoProduccion;

    
}

// customCalculoLaminado.js
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);



export function customCalculoLaminado(calculosPersonalizados, tamanoRadio, nuevaCantidad) {
    
    calculosPersonalizados.customCalculosLaminados = []
    
    if (!document.querySelector('input[name="laminado"]')) {
        return; // Salimos de la función si el elemento no existe
    }
    
    const laminadoGroup = document.querySelector('.wpcc-group-radios[data-name=laminado]')
    
    // Actualizar el estado del radiobutton "Laminado 2 Caras"
    function updateLaminadoState() {
        let impresionSelected = document.querySelector('input[name="impresion"]:checked').value;
        let laminado2Caras = document.querySelector('input[name="laminado"][value="2"]');
        
        if (laminado2Caras) {
            laminado2Caras.disabled = impresionSelected === '1';
            if (laminado2Caras.disabled && laminado2Caras.checked) {
                document.querySelector('input[name="laminado"][value="0"]').checked = true;
            }
        }
    }
    updateLaminadoState();
    
    // Controlador de eventos para los radiobuttons de "Impresión"
    document.querySelectorAll('input[name="impresion"]').forEach(function(radio) {
        radio.addEventListener('change', updateLaminadoState);
    });

    let calculo;
    if (productData.name == 'Copistería online') { 
        calculo = calculosPersonalizados.calculosInicialesCopisteria
    } else {
        calculo = calculosPersonalizados.customCalculosIniciales
    }
    
    let cantidadMetros = 0;
    let produccionLaminado = 0;
    let tiempoLaminado = 0;
    let precioManipulado = 0;
    let precioTafira = 0;

    for (let i = 0; i < data.primas.materias.length; i++) {
        if (data.primas.materias[i][0] === "lm") {

            let capacidadGuillotina = data.primas.materias[i][6];

            for (const i in calculo) {
                for (const j in calculo[i].detalles) {
                    for (const k in calculo[i].detalles[j]) {

                        cantidadMetros = Math.ceil(calculo[i].detalles[j][k].hojas / capacidadGuillotina);

                        for( let m = 0; m < data.primas.tiempo_manipulado.length; m++) {
                            if( data.primas.tiempo_manipulado[m][1] === "Laminado") {
                                
                                for( let n = 0; n < data.primas.preparacion_maquina.length; n++) {
                                    if (data.primas.preparacion_maquina[n][0] === "Laminado") {
                                        const tiempoPreparacionMaquina = parseFloat(data.primas.preparacion_maquina[n][1])
                                        produccionLaminado = calculo[i].detalles[j][k].hojas / data.primas.tiempo_manipulado[m][0];
                                        tiempoLaminado = produccionLaminado + tiempoPreparacionMaquina;
                                    }
                                }     
                                
                                for (let x = 0; x < data.primas.precio_hora_manipulado.length; x++) {
                                    if (tiempoLaminado >= data.primas.precio_hora_manipulado[x][2] && tiempoLaminado <= data.primas.precio_hora_manipulado[x][3]) {
                                        precioManipulado = data.primas.precio_hora_manipulado[x][0];
                                        
                                        for (let y = 0; y < data.primas.books.length; y++) {
                                            if (data.primas.books[y][0] === "LM") {
                                                precioTafira = parseFloat(data.primas.books[y][2]);
                                            }
                                        }
                                        
                                        const costeLaminado = tiempoLaminado * data.primas.precio_hora_manipulado[x][1];
                                        const ventaLaminado = tiempoLaminado * precioManipulado
                
                                        if (!calculosPersonalizados.customCalculosLaminados[i]) {
                                            calculosPersonalizados.customCalculosLaminados[i] = {
                                                cantidad: calculo[i].cantidad,
                                                detalles: {}
                                            };
                                        }

                                        if (!calculosPersonalizados.customCalculosLaminados[i].detalles[j]) {
                                            calculosPersonalizados.customCalculosLaminados[i].detalles[j] = {};
                                        }
                                        calculosPersonalizados.customCalculosLaminados[i].detalles[j][k] = {
                                            tiempoLaminado: tiempoLaminado,
                                            costeLaminado: costeLaminado,
                                            ventaLaminado: ventaLaminado,
                                        };

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }    
}

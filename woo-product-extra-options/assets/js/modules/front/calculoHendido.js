// Parsear las cadenas JSON a objetos
const data = JSON.parse(wpcc_vars.data);
const atributos = JSON.parse(wpcc_vars.atributos);

export function customCalculoHendido(calculosPersonalizados, nuevaCantidad) {
    // calculosPersonalizados.customCalculosHendidos = []

    if (!document.querySelector('input[name="hendido"]')) {
        return; // Salimos de la función si el elemento no existe
    }

    const calculosHendidos = []
    
    // Obtener el valor para hendido de tiempo manipulado
    const manipulado = data.primas.tiempo_manipulado;
    for (const i in manipulado) {
        if (manipulado[i][1] === 'Hendido') {
            var tiempo_manipulado_hendido = parseFloat(manipulado[i][0])
        }
    }

    // Buscar el valor de preparación hendido
    const preparaciones = data.primas.preparacion_maquina
    for (const i in preparaciones) {
        if (preparaciones[i][0] === 'Hendir') {
            var preparacionHendido = parseFloat(preparaciones[i][1])
            // console.log(preparacionHendido);
        }
    }

    // console.log(data.primas.precio_hora_manipulado);
    
    // Calculo de la merma por cantidad
    const cantidades = calculosPersonalizados.customCalculosIniciales.map(item => item.cantidad);
    const cantidadesNumericas = cantidades.map(cantidad => parseInt(cantidad))

    cantidadesNumericas.forEach(cantidad => {
        
        var mesMerma = parseFloat(cantidad * 1.05);
        var tiempo_hendido = mesMerma / tiempo_manipulado_hendido
        var total_tiempo_hendido = preparacionHendido + tiempo_hendido
        
        const calculoManipulado = data.primas.precio_hora_manipulado
        for (const i in calculoManipulado){
            if (total_tiempo_hendido >= calculoManipulado[i][2] && total_tiempo_hendido <= calculoManipulado[i][3]) {
                var coste_hendido = total_tiempo_hendido * 12
                
                const precioHoraManipulado = data.primas.precio_hora_manipulado
                for (const i in precioHoraManipulado) {
                    if (total_tiempo_hendido >= precioHoraManipulado[i][2] && total_tiempo_hendido <= precioHoraManipulado[i][3]) {
                        var venta_hendido = total_tiempo_hendido * precioHoraManipulado[i][0]
                        // console.log(venta_hendido);
                    }
                }


                const hendidoDetalles = {
                    cantidad: cantidad,
                    detalles: {
                        tiempoHendido: tiempo_hendido,
                        totalTiempoHendido: total_tiempo_hendido,
                        costeHendido: coste_hendido,
                        ventaHendido: venta_hendido,
                    }
                };
                calculosHendidos.push(hendidoDetalles);
            }
        }

    });
    calculosPersonalizados.customCalculosHendidos = calculosHendidos;
    // console.log('Cálculos Hendidos:', calculosPersonalizados.getCalculos());
}

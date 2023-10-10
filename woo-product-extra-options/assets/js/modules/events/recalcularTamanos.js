import { calculosPersonalizados } from '../../modules/front/calculosGlobales.js'
import { calculoCustomTamano } from '../../modules/front/calculoCustomTamano.js'
import { calculoCustomCantidad } from '../../modules/front/calculoCustomCantidad.js'
import { customCalculoInicial } from '../../modules/front/calculoInicial.js';
import { customCalculoPapel } from '../../modules/front/calculoPapel.js';
import { customCalculoImpresion } from '../../modules/front/calculoImpresion.js';
import { customCalculoCorte } from '../../modules/front/calculoCorte.js';
import { customCalculoCanto } from '../../modules/front/calculoCanto.js';
import { customCalculoLaminado } from '../../modules/front/calculoLaminado.js';
import { customCalculoHendido } from '../../modules/front/calculoHendido.js';
import { customCalculoTotales } from '../../modules/front/totalesCosteVenta.js';

export function recalcularMedidas() {

    // Verificación de la existencia del grupo de radios para cantos y laminado
    const tamanoGroup = document.querySelector(".wpcc-group-radios[data-name=tamano]");
    const cantosGroup = document.querySelector(".wpcc-group-radios[data-name=cantos]");
    const laminadoGroup = document.querySelector(".wpcc-group-radios[data-name=laminado]");
    const cartulinaGroup = document.querySelector('div[data-name="cartulina"] .wpcc-field-radios');
    const firstRadioInput = cartulinaGroup.querySelector('input[type="radio"]');
    
    function getRadioValues() {
        const cartulinaVal = document.querySelector("div[data-name='cartulina'] .wpcc-field-radios input[type=radio]:checked")?.value || null;
        // const tamanoVal = document.querySelector("div[data-name='tamano'] .wpcc-field-radios input[type=radio]:checked")?.value || null;
        const impresionVal = document.querySelector("div[data-name='impresion'] .wpcc-field-radios input[type=radio]:checked")?.value || null;
    
        // Si el grupo de radios existe y tiene un radio seleccionado, se obtiene su valor. Si no, se asigna null
        const tamanoVal = tamanoGroup ? document.querySelector("div[data-name='tamano'] .wpcc-field-radios input[type=radio]:checked")?.value || 0 : 0;
        const cantosVal = cantosGroup ? document.querySelector("div[data-name='cantos'] .wpcc-field-radios input[type=radio]:checked")?.value || 0 : 0;
        const laminadoVal = laminadoGroup ? document.querySelector("div[data-name='laminado'] .wpcc-field-radios input[type=radio]:checked")?.value || 0 : 0;
        
        return { cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal };
    }

    const calcularCantidadBtn = document.querySelector('#calcularCantidad');
    const cantidadInput = document.querySelector('#customQuantityInput');
        
    // Función para recalcular tamaños personalizados
    // Variables para almacenar los valores previos de alto y ancho
    let prevAlto = '';
    let prevAncho = '';

    // Función para manejar cambios en los campos de alto y ancho
    function handleTamanoChange() {
        const nuevoAlto = document.querySelector("input[name='alto']").value;
        const nuevoAncho = document.querySelector("input[name='ancho']").value;

        if (nuevoAlto !== prevAlto || nuevoAncho !== prevAncho) {
            // Los valores de alto o ancho han cambiado
            prevAlto = nuevoAlto;
            prevAncho = nuevoAncho;

            // Realizar las actualizaciones necesarias
            recalcularTamanos();
        }
    }

    // Agregar event listeners a los campos de alto y ancho
    var alto = document.querySelector("input[name='alto']")
    var ancho = document.querySelector("input[name='ancho']")
    if(alto && ancho) {
        alto.addEventListener('input', handleTamanoChange);
        ancho.addEventListener('input', handleTamanoChange);
    }

    // Función para recalcular tamaños personalizados
    function recalcularTamanos() {
        const nuevaCantidad = parseInt(cantidadInput.value);

        // Actualizar la cantidad en el objeto calculosPersonalizados
        calculosPersonalizados.cantidad = nuevaCantidad;

        const anchoInput = document.querySelector("input[name='ancho']");
        const altoInput = document.querySelector("input[name='alto']");
        const ancho = parseInt(anchoInput.value); // Convertir ancho a número
        const alto = parseInt(altoInput.value); // Convertir alto a número

        // console.log("Alto:", alto);
        // console.log("Ancho:", ancho);

        // Verificar si los valores de alto y ancho son diferentes de 0
        if (alto > 0 && ancho > 0) {
            // Actualizar el valor del radio button personalizado
            const tamanoRadio = document.querySelector("div[data-name='tamano'] .wpcc-field-radios input[type='radio'].custom__sizes-radio");
            if (tamanoRadio) {
                tamanoRadio.value = `${alto}x${ancho}`;
                tamanoRadio.checked = true;
            }

            // Ejecutar las actualizaciones de cálculos y tabla
            ejecutarActualizaciones(nuevaCantidad);

        } else {
            console.log('Los valores de alto y ancho deben ser mayores a 0 para actualizar la tabla.');
        }
    }

    // Función para ejecutar las actualizaciones de cálculos y tabla
    function ejecutarActualizaciones(nuevaCantidad) {
        // Realizar cálculos basados en la nueva cantidad
        calculoCustomTamano(calculosPersonalizados, nuevaCantidad);
        calculoCustomCantidad(calculosPersonalizados, nuevaCantidad);
        customCalculoPapel(calculosPersonalizados, nuevaCantidad);
        customCalculoImpresion(calculosPersonalizados, nuevaCantidad);
        customCalculoCorte(calculosPersonalizados, nuevaCantidad);
        customCalculoCanto(calculosPersonalizados, nuevaCantidad);
        customCalculoLaminado(calculosPersonalizados, nuevaCantidad);
        customCalculoTotales(calculosPersonalizados, nuevaCantidad);

        const { cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal } = getRadioValues();

        // Recorrer el objeto customCalculosIniciales y ejecutar las actualizaciones necesarias
        for (const cantidadObj of calculosPersonalizados.customCalculosIniciales) {
            for (const detalleKey in cantidadObj.detalles) {
                if (cantidadObj.detalles.hasOwnProperty(detalleKey)) {
                    const tamanoObj = cantidadObj.detalles[detalleKey];

                    for (const tamano in tamanoObj) {
                        if (tamanoObj.hasOwnProperty(tamano)) {
                            // Actualizar la tabla con los nuevos tamaños
                            updateTableValues(cartulinaVal, tamano, impresionVal, cantosVal, laminadoVal);
                        }
                    }
                }
            }
        }
    }
}

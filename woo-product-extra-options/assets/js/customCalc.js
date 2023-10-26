import { calculosPersonalizados } from './modules/front/calculosGlobales.js'
import { calculoCustomTamano } from './modules/front/calculoCustomTamano.js'
import { calculoCustomCantidad } from './modules/front/calculoCustomCantidad.js'
import { customCalculoInicial } from './modules/front/calculoInicial.js';
import { calculoInicialCopisteria } from './modules/front/calculoInicialCopisteria.js';
import { customCalculoPapel } from './modules/front/calculoPapel.js';
import { customCalculoImpresion } from './modules/front/calculoImpresion.js';
import { customCalculoCorte } from './modules/front/calculoCorte.js';
import { customCalculoCanto } from './modules/front/calculoCanto.js';
import { customCalculoLaminado } from './modules/front/calculoLaminado.js';
import { customCalculoHendido } from './modules/front/calculoHendido.js';
import { calculoGrapado } from './modules/front/calculoGrapado.js';
import { calculoEncuadernado } from './modules/front/calculoEncuadernado.js';
import { calculoAgujereado } from './modules/front/calculoAgujereado.js';
import { calculoPlastificado } from './modules/front/calculoPlastificado.js';
import { customCalculoTotales } from './modules/front/totalesCosteVenta.js';

const atributos = JSON.parse(wpcc_vars.atributos);

document.addEventListener('DOMContentLoaded', (event) => {
    window.addEventListener("load", function(e) {

        const seleccionarPrimerRadio = () => {
            let groups = document.querySelectorAll('.wpcc-field.wpcc-group-radios')
            groups.forEach(group => {
                let firstRadioInput;
                if (group) {
                    firstRadioInput = group.querySelector('input[type="radio"]');
                }
                
                if (firstRadioInput) {
                    firstRadioInput.checked = true;
                }   
            })
        }
        seleccionarPrimerRadio()

        if (productData.name == 'Copistería online') { 

            /* ************************************************************************* */
            /* Con este fragmento mostramos y ocultamos los radiobuttons según su medida 
             y seleccionamos el primer radio visible de cada grupo al realizar el cambio */
            /* ************************************************************************* */

            const tamanoGroup = document.querySelector(".wpcc-group-radios[data-name=tamano]");
        
            // Agrega un evento change a los radios del grupo "tamano"
            tamanoGroup.addEventListener("change", function() {
                // Obtiene el valor del radio seleccionado
                const selectedTamano = tamanoGroup.querySelector("input[name='tamano']:checked").getAttribute("data-format");
        
                // Recorre los radios con atributo data-format con valor definido y muestra u oculta según el valor seleccionado
                const allGroups = document.querySelectorAll(".wpcc-field-radios");
                const firstVisibleRadios = new Map();
        
                allGroups.forEach(group => {
                    const inputRadios = group.querySelectorAll("input[type=radio]:not([name=tamano])");
        
                    const filteredInputRadios = [];
        
                    inputRadios.forEach(input => {
                        const dataFormatValue = input.getAttribute('data-format');
                        if (dataFormatValue !== null && dataFormatValue !== "") {
                            filteredInputRadios.push(input);
                        }
                    });
        
                    let firstVisibleRadio = null;
        
                    filteredInputRadios.forEach(function(radio) {
                        let format = radio.getAttribute("data-format");
                        let parent = radio.parentElement;
        
                        const selectRadios = () => {
                            if (!firstVisibleRadio) {
                                firstVisibleRadio = radio;
                                firstVisibleRadio.checked = true;
                            }
                        }
        
                        if ((selectedTamano === "A4" || selectedTamano === "A5" || selectedTamano === "A6") && format === "A4") {
                            parent.style.display = "block";
                            selectRadios();
                        } else if ((selectedTamano === "A3" || selectedTamano === "SRA3") && (format === "A3" || format === "SRA3")) {
                            parent.style.display = "block";
                            selectRadios();
                        } else {
                            parent.style.display = "none";
                        }
                    });
                    if (firstVisibleRadio) {
                        firstVisibleRadios.set(group, firstVisibleRadio);
                    }
                });
        
                /* // Aquí puedes acceder a los primeros radios visibles de cada grupo utilizando el mapa firstVisibleRadios
                firstVisibleRadios.forEach((firstVisibleRadio, group) => {
                    // Realiza cualquier operación adicional con el primer radio visible del grupo
                    console.log(`Grupo: ${group}, Primer radio visible: ${firstVisibleRadio}`);
                }); */
            });
        
            // Ejecuta el evento change inicialmente para reflejar el estado inicial
            tamanoGroup.dispatchEvent(new Event("change"));
        }
        

        let nuevaCantidad = parseInt(document.querySelector("input.custom__quantity").value);
        let cantidadCopias = document.querySelector("input[name=cantidad__copias]");
        if (cantidadCopias) {
            cantidadCopias = parseInt(cantidadCopias.value)
            nuevaCantidad = nuevaCantidad * cantidadCopias
        }

        customCalculoInicial(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        calculoInicialCopisteria(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        calculoCustomTamano(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        calculoCustomCantidad(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        customCalculoPapel(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        customCalculoImpresion(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        customCalculoCorte(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        customCalculoCanto(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        customCalculoLaminado(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        customCalculoHendido(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        calculoGrapado(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        calculoEncuadernado(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        calculoAgujereado(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        calculoPlastificado(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        customCalculoTotales(calculosPersonalizados, nuevaCantidad, cantidadCopias);
    
        // Verificación de la existencia del grupo de radios para cantos y laminado
        const cantosGroup = document.querySelector(".wpcc-group-radios[data-name=cantos]");
        const laminadoGroup = document.querySelector(".wpcc-group-radios[data-name=laminado]");
        const hendidoGroup = document.querySelector('div[data-name=hendido] .wpcc-field-radios');
        const colorGroup = document.querySelector('div[data-name=color] .wpcc-field-radios');
        // const firstRadioInput = cartulinaGroup.querySelector('input[type="radio"]');

        function toggleActiveClassBasedOnRadio() {            
            const encuadernadoGroup = document.querySelectorAll(".wpcc-group-radios[data-family=encuadernado]");
            const encuadernadoRadios = document.querySelectorAll("div[data-name='acabado'] .wpcc-field-radios input[name=acabado]");
        
            encuadernadoRadios.forEach(radio => {
                if (radio.checked) {
                    let currentValue = radio.value;
        
                    encuadernadoGroup.forEach(group => {
                        if (currentValue !== 'encuadernado') {
                            group.classList.remove('active');
                        } else {
                            // console.log('encuadernado checked');
                            group.classList.add('active');
                        }
                    });
                }
            });
        }
        
        function attachRadioChangeEvent() {
            const encuadernadoRadios = document.querySelectorAll("div[data-name='acabado'] .wpcc-field-radios input[name=acabado]");
            
            encuadernadoRadios.forEach(radio => {
                radio.addEventListener('change', toggleActiveClassBasedOnRadio);
            });
        }
        
        // Ejecuta la función al cargar el script y también añade el evento.
        toggleActiveClassBasedOnRadio();
        attachRadioChangeEvent();
         

        function getRadioValues() {
            const cartulinaVal = document.querySelector("div[data-name='cartulina'] .wpcc-field-radios input[type=radio]:checked")?.value || null;
            const tamanoVal = document.querySelector("div[data-name='tamano'] .wpcc-field-radios input[type=radio]:checked")?.value || null;
            const impresionVal = document.querySelector("div[data-name='impresion'] .wpcc-field-radios input[type=radio]:checked")?.value || null;
        
            // Si el grupo de radios existe y tiene un radio seleccionado, se obtiene su valor. Si no, se asigna null
            const cantosVal = cantosGroup ? document.querySelector("div[data-name='cantos'] .wpcc-field-radios input[type=radio]:checked")?.value || 0 : 0;
            const laminadoVal = laminadoGroup ? document.querySelector("div[data-name='laminado'] .wpcc-field-radios input[type=radio]:checked")?.value || 0 : 0;
            const hendidoVal = hendidoGroup ? document.querySelector("div[data-name='hendido'] .wpcc-field-radios input[type=radio]:checked")?.value || 0 : 0;
            const colorVal = colorGroup ? document.querySelector("div[data-name='color'] .wpcc-field-radios input[type=radio]:checked")?.value || 0 : 0;
            
            return { cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal, hendidoVal, colorVal };
        }
        
        function getValues(cantidad, cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal, hendidoVal, colorVal ) {
            
            var item = calculosPersonalizados.customTotales.find(i => i.cantidad === cantidad);
            // console.log('Cantidades: ', item);
            if (item) {
                item = item.detalles[cartulinaVal];
                if (item && tamanoVal) {
                    item = item[tamanoVal];
                }
                
                // Mapeo de laminadoVal a impresionVal
                if (item && impresionVal) {
                    if (impresionVal === "1") {
                        impresionVal = "1Cara";
                    } else if (impresionVal === "2") {
                        impresionVal = "2Caras";
                    }
                    item = item[impresionVal];
                }
                
                if (item) {

                    if (!cantosVal && !laminadoVal) {
                        return parseFloat(item.totalVentaSinAcabados).toFixed(2);
                    }
                    else if (cantosVal && !laminadoVal) {
                        if (cantosVal === "recto") {
                            return parseFloat(item.totalVentaSinAcabados).toFixed(2);
                        } else if (cantosVal === "romo" || cantosVal == "forma") {
                            return parseFloat(item.totalVentaSinLaminado).toFixed(2);
                        }
                    }
                    else if (!cantosVal && laminadoVal) {
                        if (laminadoVal === "0") {
                            return parseFloat(item.totalVentaSinAcabados).toFixed(2);
                        } else if (laminadoVal === "1" || laminadoVal === "2") {
                            return parseFloat(item.totalVentaSinCantos).toFixed(2);
                        }
                    }
                    else if (cantosVal && laminadoVal) {
                        if (cantosVal === "recto") {
                            if (laminadoVal === "0") {
                                return parseFloat(item.totalVentaSinAcabados).toFixed(2);
                            } else if (laminadoVal === "1" || laminadoVal === "2") {
                                return parseFloat(item.totalVenta).toFixed(2);
                            }
                        } 
                        else if (cantosVal === "romo") {
                            if (laminadoVal === "0") {
                                return parseFloat(item.totalVentaSinLaminado).toFixed(2);
                            } else if (laminadoVal === "1" || laminadoVal === "2") {
                                return parseFloat(item.totalVenta).toFixed(2);
                            }
                        } 
                        else if (cantosVal === "forma") {
                            if (laminadoVal === "0") {
                                return parseFloat(item.totalVentaSinLaminado).toFixed(2);
                            } else if (laminadoVal === "1" || laminadoVal === "2") {
                                return parseFloat(item.totalVenta).toFixed(2);
                            }
                        } 
                        else {
                            return parseFloat(item.totalVenta).toFixed(2);
                        }
                    }
                                   
                }
            }
            return null;  // Si no se encuentra el valor correspondiente.
        }
        
        // Función para actualizar la tabla con precios calculos
        function updateTableValues() {

            console.log('Cálculos personalizados a usar:', calculosPersonalizados.getCalculos());

            const { cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal, hendidoVal, colorVal } = getRadioValues();
        
            // console.log("Valores seleccionados:", { cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal, hendidoVal, colorVal });

            // Definir los porcentajes de incremento para cada tipo
            const incrementos = {
                'Económico': 0, // No hay incremento
                'Estándar': 0.15, // 15% de incremento
                'Urgente': 0.35 // 35% de incremento
            };
        
            // Obtiene el valor máximo en cantidades urgentes
            const maxUrgente = Math.max(...atributos.urgente.cantidades_urgente.map(Number));
        
            // Actualizar cada fila de la tabla
            var columns = document.querySelectorAll(".variations__table tbody tr th");
        
            // console.log("calculosPersonalizados a usar:", calculosPersonalizados)
            columns.forEach(column => {
                var tipo = column.textContent;
                
                if (incrementos.hasOwnProperty(tipo)) {
                    var incremento = incrementos[tipo];
                    var columnIndex = column.parentElement;
                    var cells = columnIndex.querySelectorAll('td');
        
                    cells.forEach(function(cell, index) {
                        var thValue = parseInt(document.querySelectorAll(".variations__table thead th")[index + 1].textContent);
        
                        if (thValue > maxUrgente && tipo === 'Urgente') {
                            cell.textContent = ''; // Vaciamos la celda si excede el máximo de envío urgente
                            return;
                        }
                        
                        
                        for (const key in calculosPersonalizados) {
                            if (calculosPersonalizados.hasOwnProperty(key)) {
                                var array = calculosPersonalizados[key];
                                // console.log(array);
                                for (var i = 0; i < array.length; i++) {
                                    var cantidad = array[i].cantidad;
                                    // console.log(cantidad);
                                    if (thValue === cantidad) {
                                        var detalles = array[i].detalles;
                                        var valueToShow = getValues(cantidad, cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal, hendidoVal, colorVal, detalles);
                                        valueToShow = valueToShow * (1 + incremento); // Aplica el incremento según el tipo
                                        // console.log(cantidad, detalles);
                                        cell.textContent = valueToShow.toFixed(2); // Asumiendo que deseas dos decimales
                                        // console.log(`Actualizando celda [${index}] de tipo ${tipo} con cantidad ${thValue} a valor: ${valueToShow.toFixed(2)}`);
                                        break;
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }

        updateTableValues();  // Llamar a la función cuando se carga la página


        // Función para habilitar/deshabilitar la opción de Laminado de 2 Caras según la selección de Impresión
        function toggleLaminadoOptionBasedOnImpresion() {
            var impresionRadios = document.querySelectorAll("div[data-name='impresion'] .wpcc-field-radios input[type=radio]");
            var laminadoRadios = document.querySelectorAll("div[data-name='laminado'] .wpcc-field-radios input[type=radio][value='2']");
            
            var impresionValue = getCheckedRadioValue(impresionRadios);
            
            // Si la impresión es de 1 Cara, deshabilitar la opción de Laminado de 2 Caras.
            if (impresionValue === "1") {
                laminadoRadios.forEach(function(radio) {
                    radio.disabled = true;
                });
            
                // Si además, el laminado de 2 Caras estaba seleccionado, seleccionamos Sin Laminado.
                if (isRadioChecked(laminadoRadios)) {
                    var sinLaminadoRadio = document.querySelector("div[data-name='laminado'] .wpcc-field-radios input[type=radio][value='0']");
                    if (sinLaminadoRadio) {
                        sinLaminadoRadio.checked = true;
                    }
                }
            } else {
                laminadoRadios.forEach(function(radio) {
                    radio.disabled = false;
                });
            }
        }
        toggleLaminadoOptionBasedOnImpresion();

        function toggleTipoLaminado() {
            const tipoGroup = document.querySelector(".wpcc-group-radios[data-name=tipo_laminado]");
            const laminadoRadios = document.querySelectorAll("div[data-name='laminado'] .wpcc-field-radios input[type=radio]")
            
            if(tipoGroup) {
                laminadoRadios.forEach(laminadoRadio => {
                    laminadoRadio.addEventListener('change', function() {
                        let currentValue = parseInt(this.value);
                        if(currentValue !== 0) {
                            tipoGroup.classList.add('active')
                        } else {
                            tipoGroup.classList.remove('active')
                        }
                    });
                })
            }
        }
        toggleTipoLaminado()

        function toggleImpresionCantosBasedOnMaterial() {
            var materialRadios = document.querySelectorAll("div[data-name='cartulina'] .wpcc-field-radios input[type=radio]");
            var formaRadio = document.querySelector("div[data-name='cantos'] .wpcc-field-radios input[type=radio][value='forma']");
            var romoRadio = document.querySelector("div[data-name='cantos'] .wpcc-field-radios input[type=radio][value='romo']");
            var impresionRadio2caras = document.querySelector("div[data-name='impresion'] .wpcc-field-radios input[type=radio][value='2']");

            // console.log(cantosRadios);
            materialRadios.forEach(material => {
                if(material) {
                    if (formaRadio){
                        formaRadio.disabled = true
                        romoRadio.disabled = true
                        
                        impresionRadio2caras.disabled = true
                        material.addEventListener('change', function() {
                            if (material.value === 'p450' && material.checked) {
                                formaRadio.disabled = true;
                                romoRadio.disabled = false;
                                impresionRadio2caras.disabled = false
                            } else if (material.value === 'i330' && material.checked){
                                formaRadio.disabled = false;
                                romoRadio.disabled = true; 
                                impresionRadio2caras.disabled = true;
                            } else {
                                formaRadio.disabled = false;
                                romoRadio.disabled = false;
                                impresionRadio2caras.disabled = false;
                            }
                        });
                    }
                }
            });


        }
        toggleImpresionCantosBasedOnMaterial()
                
        
        // Llamar a la función cada vez que se modifica la selección en el campo "Impresión".
        var impresionRadios = document.querySelectorAll("div[data-name='impresion'] .wpcc-field-radios input[type=radio]");
        impresionRadios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                toggleLaminadoOptionBasedOnImpresion();
            });
        });
        
        function getCheckedRadioValue(radios) {
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    return radios[i].value;
                }
            }
            return null;
        }
        
        function isRadioChecked(radios) {
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    return true;
                }
            }
            return false;
        }


        document.querySelectorAll(".wpcc-field-radios input[type=radio]").forEach(radio => {
            radio.addEventListener('change', function() {
                const { cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal, hendidoVal, colorVal  } = getRadioValues();

                var customSizesRadio = document.querySelector(".wpcc-field-radios .custom__sizes input[type=radio]");
            
                if (customSizesRadio && customSizesRadio.checked) {
                    var customSizesSize = customSizesRadio.closest('.custom__sizes').querySelector('.custom__sizes-size');
                    if (customSizesSize) {
                        customSizesSize.classList.add('active');
                    }
                } 
                else if (customSizesRadio) {
                    var customSizesSize = customSizesRadio.closest('.custom__sizes').querySelector('.custom__sizes-size');
                    if (customSizesSize) {
                        customSizesSize.classList.remove('active');
                    }
                }
                updateTableValues(cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal, hendidoVal, colorVal );

            });
        });
    
        
        // Obtener los valores de alto y ancho del usuario
        const calcularCantidadBtn = document.querySelector('#calcularCantidad');
        const cantidadInput = document.querySelector('#customQuantityInput');
        const copiasInput = document.querySelector('#cantidadCopiasInput');
        
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
        var altura = document.querySelector("input[name='alto']")
        var anchura = document.querySelector("input[name='ancho']")

        if (altura && anchura) {
            altura.addEventListener('input', handleTamanoChange);
            anchura.addEventListener('input', handleTamanoChange);
        }

        function realizarCalculosYActualizar(nuevaCantidad) {
            // Actualizar la cantidad en el objeto calculosPersonalizados
            calculosPersonalizados.cantidad = nuevaCantidad;
        
            // Realizar cálculos basados en la nueva cantidad
            customCalculoInicial(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            calculoInicialCopisteria(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            calculoCustomTamano(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            calculoCustomCantidad(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            customCalculoPapel(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            customCalculoImpresion(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            customCalculoCorte(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            customCalculoCanto(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            customCalculoLaminado(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            customCalculoHendido(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            calculoGrapado(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            calculoEncuadernado(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            calculoPlastificado(calculosPersonalizados, nuevaCantidad, cantidadCopias);
            customCalculoTotales(calculosPersonalizados, nuevaCantidad, cantidadCopias);
        
            const { cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal, hendidoVal, colorVal  } = getRadioValues();
        
            // Actualizar la tabla con los nuevos valores
            updateTableValues(cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal, hendidoVal, colorVal );
        }

        function recalcularTamanos() {
            const nuevaCantidad = parseInt(cantidadInput.value);
            // const cantidadCopias = parseInt(copiasInput.value)
            
            const altoInput = document.querySelector("input[name='alto']");
            const anchoInput = document.querySelector("input[name='ancho']");
            
            const alto = parseInt(altoInput.value); // Convertir alto a número
            const ancho = parseInt(anchoInput.value); // Convertir ancho a número
        
            // Verificar si los valores de alto y ancho son diferentes de 0
            if (alto > 0 && ancho > 0) {
                const tamanoRadio = document.querySelector("div[data-name='tamano'] .wpcc-field-radios input[type='radio'].custom__sizes-radio");
                if (tamanoRadio) {
                    tamanoRadio.value = `${alto}x${ancho}`;
                    tamanoRadio.checked = true;
                }
                // Llamar a la nueva función que combina cálculos y actualizaciones
                realizarCalculosYActualizar(nuevaCantidad);
            } else {
                console.log('Los valores de alto y ancho deben ser mayores a 0 para actualizar la tabla.');
            }
        }
        
        function recalcularCantidades() {
            let nuevaCantidad = parseInt(cantidadInput.value);
            let cantidadCopias;
            if (copiasInput) {
                cantidadCopias = parseInt(copiasInput.value);
                nuevaCantidad = nuevaCantidad * cantidadCopias
            }
            console.log('nuevaCantidad', nuevaCantidad);
            
            if (!isNaN(nuevaCantidad) && nuevaCantidad >= 0) {
                // Verificar si ya existe el th para la cantidad personalizada
                let existingTh = document.querySelector(`.variations__table thead th.custom-quantity`);
                let tbodyRows = document.querySelectorAll(".variations__table tbody tr");
        
                if (!existingTh) {
                    // Si no existe el <th> para esta cantidad, créalo
                    const newTh = document.createElement("th");
                    newTh.textContent = nuevaCantidad;
                    newTh.classList.add("custom-quantity"); // Agregar una clase para identificarlo
                    const theadRow = document.querySelector(".variations__table thead tr");
                    theadRow.appendChild(newTh);
        
                    // Crear las celdas de <td> correspondientes en las filas del cuerpo
                    tbodyRows.forEach(tbodyRow => {
                        const newCell = document.createElement("td");
                        newCell.addEventListener('click', function() {
                            const newTds = document.querySelectorAll(".variations__table tbody tr td");
                            newTds.forEach(function(tableTd) {
                                tableTd.classList.remove('selected');
                            });
        
                            // Añadir la clase 'selected' al td que fue clicado
                            newCell.classList.add('selected');
        
                            var selectedPrice = newCell.textContent;
                            selectedPriceInput.value = selectedPrice;
                            
                            // Llama a la función para actualizar campos ocultos aquí.
                            var fieldValues = captureFieldValues();
                            fieldValues.selected_display_quantity = selectedQty;
                            // console.log('datos actualizados: ', fieldValues.selected_display_quantity);
                            addHiddenFields(fieldValues);
                        });
                        tbodyRow.appendChild(newCell);
                    });
                } else {
                    // El <th> ya existe, solo actualiza su contenido
                    existingTh.textContent = nuevaCantidad;
        
                    // Actualiza el contenido de las celda de <td> correspondientes
                    const correspondingCells = document.querySelectorAll(`.variations__table tbody td.custom-quantity-td`);
                    correspondingCells.forEach(cell => {
                        cell.textContent = nuevaCantidad; // Actualiza aquí con el valor adecuado
                    });
                }
            }
        
            // console.log("Llamando a realizarCalculosYActualizar con:", nuevaCantidad);

            // Llamar a la nueva función que combina cálculos y actualizaciones
            realizarCalculosYActualizar(nuevaCantidad);
        }


        calcularCantidadBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir la recarga de la página
            recalcularCantidades();
        });

        /********************************************/
        /* FUNCIONES BOTÓN ADD-TO-CART */
        /********************************************/

        const simpleProduct = document.querySelector('.product-type-simple form.cart')
        if (simpleProduct) {
            const nodes = [...simpleProduct.children].splice(1)

            const wrapper = document.createElement('div')
            wrapper.classList.add('addtocart-wrapper')

            // and append all children:
            wrapper.append(...nodes)

            // and ofc add the wrapper to the container:
            simpleProduct.appendChild(wrapper)
        }

        var disabled = document.querySelectorAll('.disabled')
        disabled.forEach((elem) => {
            elem.addEventListener('click', (e) => {
            e.preventDefault()
            })
        })

        // Evento click en cada <td> con precio
        var addtocartWrapper = document.querySelector(".addtocart-wrapper");
        addtocartWrapper.insertAdjacentHTML('beforeend', '<input type="hidden" name="selected_price" id="selected_price" value="0">');

        // Esta función toma un objeto de valores y crea campos ocultos para cada uno de ellos.
        function addHiddenFields(values) {
            // Primero, elimina cualquier campo oculto anterior para evitar duplicados.
            var addtocartWrapper = document.querySelector(".addtocart-wrapper");
            var dynamicHiddenFields = addtocartWrapper.querySelectorAll("input.dynamic-hidden-field");
            
            dynamicHiddenFields.forEach(function(field) {
                field.remove();
            });

            // Itera sobre el objeto de valores y crea un campo oculto para cada par clave-valor.
            for (var key in values) {
                if (values.hasOwnProperty(key)) {
                    var input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", key);
                    input.setAttribute("value", values[key]);
                    input.classList.add("dynamic-hidden-field");
                    addtocartWrapper.appendChild(input);
                }
            }
        }

        function captureFieldValues() {
            var values = {};

            // Obtén todos los elementos con la clase "wpcc-field-radios".
            var radioFields = document.querySelectorAll(".wpcc-field-radios");

            // Itera sobre cada conjunto de botones de opción.
            radioFields.forEach(function(field) {
                // Asume que el atributo data-name está en un div que envuelve los botones de radio.
                var fieldName = field.parentElement.getAttribute("data-name");

                // Encuentra el radio button seleccionado en este conjunto.
                var checkedRadio = field.querySelector("input[type=radio]:checked");

                // Obtenemos el texto del label del radio button seleccionado.
                var fieldValue = checkedRadio ? checkedRadio.parentElement.textContent.trim() : "";

                // Si el nombre del campo y el valor están presentes, añádelos al objeto de valores.
                if (fieldName && fieldValue) {
                    values[fieldName] = fieldValue;
                }
            });

            // Obtener el índice del td seleccionado en la tabla de variaciones.
            var selectedTd = document.querySelector('.variations__table tbody tr td.selected');
            var selectedIndex = selectedTd ? selectedTd.cellIndex : -1;

            // Obtener la cantidad seleccionada desde el encabezado de la tabla.
            var selectedQty = selectedIndex >= 0 ? document.querySelector('.variations__table thead tr th:nth-child(' + (selectedIndex + 1) + ')').textContent.trim() : "";

            // Añadir la cantidad seleccionada al objeto de valores.
            values.selected_display_quantity = selectedQty;

            // Obtener el campo de tamaño personalizado
            var tamanoRadio = document.querySelector('.wpcc-input-radio.custom__sizes input[type=radio]:checked');
            if (tamanoRadio) {
                var tamanoLabel = tamanoRadio.parentElement.textContent.trim();
                var altoValue = tamanoRadio.parentElement.querySelector('input[name=alto]').value;
                var anchoValue = tamanoRadio.parentElement.querySelector('input[name=ancho]').value;
                values.tamano = `${altoValue} x ${anchoValue}`;
            }

            // Capturar el tipo de envío
            var selectedTd = document.querySelector('.variations__table tbody tr td.selected');
            if (selectedTd) {
                var parentRow = selectedTd.parentElement;
                var envioType = parentRow.querySelector('th').textContent.trim();
                values.envio_type = envioType;
            }

            return values;
        }


        // Actualizar el valor del input oculto y la cantidad al seleccionar un precio.
        var variationsTableTds = document.querySelectorAll(".variations__table tbody tr td");
        var selectedPriceInput = document.getElementById("selected_price");

        variationsTableTds.forEach(function(td) {
            td.addEventListener('click', function() {
                variationsTableTds.forEach(function(tableTd) {
                    tableTd.classList.remove('selected');
                });

                // Añadir la clase 'selected' al td que fue clicado
                td.classList.add('selected');

                var selectedPrice = td.textContent;
                selectedPriceInput.value = selectedPrice;

                // Llama a la función para actualizar campos ocultos aquí.
                var fieldValues = captureFieldValues();
                // fieldValues.selected_display_quantity = selectedQty;
                addHiddenFields(fieldValues);
            });
        });

        // Este evento se activa cuando se hace clic en el botón "Añadir al carrito".
        var addToCartButton = document.querySelector(".single_add_to_cart_button");
        addToCartButton.addEventListener('click', function(e) {
            // Captura los valores actuales de los campos.
            var fieldValues = captureFieldValues();
            // console.log(fieldValues);
            // Añade campos ocultos basados en estos valores.
            addHiddenFields(fieldValues);

            // Si no hay un precio seleccionado, evita que el producto se añada al carrito y muestra una alerta.
            var selectedPrice = document.getElementById("selected_price").value;
            if (!selectedPrice || parseFloat(selectedPrice) === 0) {
                e.preventDefault();
                alert("Por favor, selecciona un precio antes de agregar al carrito.");
                return false;
            }
        });

        // Este evento se activa cada vez que se cambia la selección en cualquier campo de radio.
        // Actualiza los campos ocultos inmediatamente cuando se cambia un valor.
        var wpccRadios = document.querySelectorAll(".wpcc-field-radios input[type=radio]");
        wpccRadios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                var fieldValues = captureFieldValues();
                addHiddenFields(fieldValues);
            });
        });


        
    })



    let groups = document.querySelectorAll('.wpcc-field.wpcc-group-radios')
    groups.forEach(group => {
        const items = group.querySelectorAll('input')
        if (items.length === 1) {
            group.style.display = 'none';
        }
    })

    /* setTimeout(() => {
        // 1. Obtener el valor mínimo:
        let minPrice = Infinity;
        let detalles = calculosPersonalizados.customTotales[0].detalles;

        for (let material in detalles) {
            for (let size in detalles[material]) {
                if (size !== "0x0") {
                    if (detalles[material][size].hasOwnProperty("1Cara") && detalles[material][size]["1Cara"].totalVentaSinAcabados < minPrice) {
                        minPrice = detalles[material][size]["1Cara"].totalVentaSinAcabados;
                        minPrice = parseFloat(minPrice.toFixed(2))
                    }
                    
                    if (detalles[material][size].hasOwnProperty("2Caras") && detalles[material][size]["2Caras"].totalVentaSinAcabados < minPrice) {
                        minPrice = detalles[material][size]["2Caras"].totalVentaSinAcabados;
                        minPrice = parseFloat(minPrice.toFixed(2))
                    }
                }
            }
        }

        // Verificar si hemos encontrado un precio válido
        if (minPrice !== Infinity) {
            // console.log("Precio mínimo encontrado:", minPrice);
        } else {
            // console.log("No se encontró un precio mínimo válido");
        }

        let priceElement = document.querySelector(".price .woocommerce-Price-amount");
        if (priceElement) {
            priceElement.innerHTML = `<bdi>${minPrice.toFixed(2)}&nbsp;<span class="woocommerce-Price-currencySymbol">€</span></bdi>`;
        }
        
    }, 2000); */
    
});

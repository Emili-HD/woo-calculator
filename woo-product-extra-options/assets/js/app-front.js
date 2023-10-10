jQuery(document).ready(function($) {

    function getDecodedVariations() {
        var variacionesString = document.querySelector('form.wpcc-fields-producto').getAttribute('data-variaciones');
        try {
            var firstParse = JSON.parse(variacionesString);
            return JSON.parse(firstParse);
        } catch (error) {
            console.error("Error al parsear JSON:", error);
            return null;
        }
    }
    
    var parsedVariaciones = getDecodedVariations();

    function getValues(cantidad, cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal) {
        // console.log("Parámetros:", cantidad, cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal);  // Registro para depuración.
        var item = parsedVariaciones.totalesCosteVenta.find(i => i.cantidad === cantidad);
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
                // console.log("Coincidencia final:", item);
                if (cantosVal === "recto" && laminadoVal === "0") {
                    return parseFloat(item.totalVentaSinAcabados).toFixed(2);
                } else if (cantosVal === "recto" && (laminadoVal === "1" || laminadoVal === "2")) {
                    return parseFloat(item.totalVentaSinCantos).toFixed(2);
                } else if (cantosVal === "romo" && laminadoVal === "0") {
                    return parseFloat(item.totalVentaSinLaminado).toFixed(2);
                } else if (cantosVal === "romo" && (laminadoVal === "1" || laminadoVal === "2")) {
                    return parseFloat(item.totalVenta).toFixed(2);
                } else {
                    return null;
                }                
            }
        }
        return null;  // Si no se encuentra el valor correspondiente.
    }    

    function updateTableValues() {
        var cartulinaVal = $("div[data-name='cartulina'] .wpcc-field-radios input[type=radio]:checked").val();
        var tamanoVal = $("div[data-name='tamano'] .wpcc-field-radios input[type=radio]:checked").val();
        var impresionVal = $("div[data-name='impresion'] .wpcc-field-radios input[type=radio]:checked").val();
        var cantosVal = $("div[data-name='cantos'] .wpcc-field-radios input[type=radio]:checked").val();
        var laminadoVal = $("div[data-name='laminado'] .wpcc-field-radios input[type=radio]:checked").val();

        var economicoRow = $(".variations__table tbody tr").filter(function() {
            return $(this).find('th').text() === "Económico";
        });
        
        economicoRow.find('td').each(function(index) {
            var thValue = $(".variations__table thead th").eq(index + 1).text();
            var valueToShow = getValues(Number(thValue), cartulinaVal, tamanoVal, impresionVal, cantosVal, laminadoVal);
            $(this).text(valueToShow);
            // console.log(valueToShow);
        });
    } 

    if (parsedVariaciones && typeof parsedVariaciones === 'object' && parsedVariaciones.hasOwnProperty('totalesCosteVenta')) {
        updateTableValues();  // Llamar a la función cuando se carga la página
    } else {
        console.log('No se encontraron las variaciones o el formato no es el esperado.');
    }

    // Selecciona el campo "Tamaño personalizado"
    var $customSizeField = $(".custom__sizes");

    // Función para manejar el cambio en el campo "Tamaño personalizado"
    function handleCustomSizeChange() {
        if ($customSizeField.find("input[type='radio']").is(":checked")) {
            $customSizeField.find(".custom__sizes-size").addClass("active");
        } else {
            $customSizeField.find(".custom__sizes-size").removeClass("active");
        }
    }

    // Ejecutar la función solo cuando cambien los radio buttons excepto .custom__sizes-radio
    $(".wpcc-field-radios input[type=radio]").on('change', function() {
        if (!$(".custom__sizes-radio input[type=radio]").is(":checked")) {
            updateTableValues();  // Llamar a la función solo si .custom__sizes-radio no está seleccionado
        }
        handleCustomSizeChange();
    });

    function toggleLaminadoOptionBasedOnImpresion() {
        var impresionValue = $("div[data-name='impresion'] .wpcc-field-radios input[type=radio]:checked").val();

        // Si la impresión es de 1 Cara, deshabilitar la opción de Laminado de 2 Caras.
        if (impresionValue === "1") {
            $("div[data-name='laminado'] .wpcc-field-radios input[type=radio][value='2']").prop('disabled', true);
            
            // Si además, el laminado de 2 Caras estaba seleccionado, seleccionamos Sin Laminado.
            if ($("div[data-name='laminado'] .wpcc-field-radios input[type=radio][value='2']").is(':checked')) {
                $("div[data-name='laminado'] .wpcc-field-radios input[type=radio][value='0']").prop('checked', true);
            }
        } else {
            $("div[data-name='laminado'] .wpcc-field-radios input[type=radio][value='2']").prop('disabled', false);
        }
    }

    // Llamar a la función cuando se carga la página.
    toggleLaminadoOptionBasedOnImpresion();

    // Llamar a la función cada vez que se modifica la selección en el campo "Impresión".
    $("div[data-name='impresion'] .wpcc-field-radios input[type=radio]").on('change', function() {
        toggleLaminadoOptionBasedOnImpresion();
    });

    // Evento click en cada <td> con precio 
    $(".addtocart-wrapper").append('<input type="hidden" name="selected_price" id="selected_price" value="0">');   



    // Esta función captura todos los valores de los campos de radio en el formulario.
    // Devuelve un objeto con pares de clave-valor donde la clave es el nombre del campo y el valor es el valor seleccionado.
    function captureFieldValues() {
        var values = {};

        // Itera sobre cada conjunto de botones de opción.
        $(".wpcc-field-radios").each(function() {
            // Asume que el atributo data-name está en un div que envuelve los botones de radio.
            var fieldName = $(this).parent().data("name");
            // Obtenemos el texto del label 
            var fieldValue = $(this).find("input[type=radio]:checked").parent().text().trim();

            // Si el nombre del campo y el valor están presentes, añádelos al objeto de valores.
            if (fieldName && fieldValue) {
                values[fieldName] = fieldValue;
            }
        });

        var selectedIndex = $('.variations__table tbody tr td.selected').index();
        var selectedQty = $('.variations__table thead tr th').eq(selectedIndex).text();
        values.selected_display_quantity = selectedQty;

        return values;
    }

    // Esta función toma un objeto de valores y crea campos ocultos para cada uno de ellos.
    function addHiddenFields(values) {
        // Primero, elimina cualquier campo oculto anterior para evitar duplicados.
        $(".addtocart-wrapper").find("input.dynamic-hidden-field").remove();

        // Itera sobre el objeto de valores y crea un campo oculto para cada par clave-valor.
        $.each(values, function(key, value) {
            $(".addtocart-wrapper").append('<input type="hidden" name="' + key + '" value="' + value + '" class="dynamic-hidden-field">');
        });
    }

    // Actualizar el valor del input oculto y la cantidad al seleccionar un precio.
    $(".variations__table tbody tr td").on('click', function() { // Asegúrate de que este selector es correcto.
        $(".variations__table tbody tr td").removeClass('selected');
        
        // Añadir la clase 'selected' al td que fue clicado
        $(this).addClass('selected');

        var selectedPrice = $(this).text();
        $("#selected_price").val(selectedPrice);

        // Llama a la función para actualizar campos ocultos aquí.
        var fieldValues = captureFieldValues();
        // fieldValues.selected_display_quantity = selectedQty;
        addHiddenFields(fieldValues);
    });


    // Este evento se activa cuando se hace clic en el botón "Añadir al carrito".
    $(".single_add_to_cart_button").on('click', function(e) {
        // Captura los valores actuales de los campos.
        var fieldValues = captureFieldValues();

        // Añade campos ocultos basados en estos valores.
        addHiddenFields(fieldValues);

        // Si no hay un precio seleccionado, evita que el producto se añada al carrito y muestra una alerta.
        var selectedPrice = $("#selected_price").val();
        if (!selectedPrice || parseFloat(selectedPrice) === 0) {
            e.preventDefault();
            alert("Por favor, selecciona un precio antes de agregar al carrito.");
            return false;
        }
    });

    // Este evento se activa cada vez que se cambia la selección en cualquier campo de radio.
    // Actualiza los campos ocultos inmediatamente cuando se cambia un valor.
    $(".wpcc-field-radios input[type=radio]").on('change', function() {
        var fieldValues = captureFieldValues();
        addHiddenFields(fieldValues);
    });

});

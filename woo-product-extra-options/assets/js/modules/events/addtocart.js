export function addToCart() {
    
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
}

// Función para habilitar/deshabilitar la opción de Laminado de 2 Caras según la selección de Impresión
export function toggleLaminadoOptionBasedOnImpresion() {
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

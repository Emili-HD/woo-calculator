export function toggleImpresionCantosBasedOnMaterial() {
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
// Llamar a la función cada vez que se modifica la selección en el campo "Impresión".
var impresionRadios = document.querySelectorAll("div[data-name='impresion'] .wpcc-field-radios input[type=radio]");
impresionRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
        toggleLaminadoOptionBasedOnImpresion();
    });
});

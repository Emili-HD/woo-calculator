export const calculosGlobales = {
    calculosIniciales: [],
    calculosPapeles: [],
    calculosImpresiones: [],
    calculosCortes: [],
    calculosCantos: [],
    calculosLaminados: [],
    totalesCosteVenta: [],
}

export const data = {
    primas: {},
    campos: {}
};

export const atributos = {
    maquina: {},
    cantidades: {},
    urgente: {},
    envio: {}
};


export function metaboxes() {
    
    // ------------------- Recorrido de campos -------------------
    const campos = document.querySelectorAll(".acf-postbox .acf-field:not(.acf-field-number)");
    
    campos.forEach((campo) => {
        const fieldName = campo.getAttribute("data-name");
        if (!fieldName) return;

        // data.campos[fieldName] = [];

        const checkboxes = campo.querySelectorAll("input[type='checkbox']");
        const filas = campo.querySelectorAll(".fila");
        
        // Check for the special 'cantidades' checkbox
        if (fieldName === "cantidades") {
            atributos.cantidades[fieldName] = []; 
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    atributos.cantidades[fieldName].push(checkbox.value);
                }
            });
        } 
        if (fieldName === "cantidades_urgente") {
            atributos.urgente[fieldName] = []; 
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    atributos.urgente[fieldName].push(checkbox.value);
                }
            });
        } 
        else if (fieldName === "envio") {
            atributos.envio[fieldName] = []; 
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    atributos.envio[fieldName].push(checkbox.value);
                }
            });
        } 
        else if (fieldName === "maquina") {
            atributos.maquina[fieldName] = []; 
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    atributos.maquina[fieldName].push(checkbox.value);
                }
            });
        } 
        else if (fieldName === 'tamano') {
            const repeaterRows = campo.querySelectorAll(".acf-repeater .acf-row:not(.acf-clone)");
            data.campos[fieldName] = [];

            repeaterRows.forEach((row) => {
                const altoValue = row.querySelector('[data-name="alto"] input[type="number"]').value;
                const anchoValue = row.querySelector('[data-name="ancho"]  input[type="number"]').value;

                data.campos[fieldName].push({
                    alto: altoValue,
                    ancho: anchoValue
                });
            });
        } else if (checkboxes.length > 0) {
            data.campos[fieldName] = []; // Make sure we initialize it to an empty array

            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    data.campos[fieldName].push(checkbox.value);
                }
            });
        }
    });

    // ------------------- Recorrido de primas -------------------
    const primas = document.querySelectorAll('.calculator');
    
    primas.forEach((prima) => {
        const nombreCampo = prima.getAttribute("data-name");
        if (!nombreCampo) return;
    
        data.primas[nombreCampo] = [];
    
        const rows = prima.querySelectorAll(".fila"); // selecciona todas las filas en la tabla
    
        rows.forEach((row) => {
            let rowData = [];
    
            // Obtiene todas las celdas en la fila que tienen el atributo 'data-value'
            let cellsWithData = row.querySelectorAll('[data-value]');
    
            cellsWithData.forEach(cell => {
                rowData.push(cell.getAttribute('data-value'));
            });
    
            if(rowData.length > 0) { // Si rowData tiene datos, lo añade
                data.primas[nombreCampo].push(rowData);
            }
        });
    });

    
    
    // console.log('----------------------------------');
    // console.log(data); 
    // console.log(atributos);
    // console.log('----------------------------------');



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

    xhr.send("action=wpcc_save_fields_values&data=" + encodeURIComponent(JSON.stringify(data)) + "&atributos=" + encodeURIComponent(JSON.stringify(atributos)) + "&product_id=" + productId);


    // console.log(JSON.stringify(data));
    // console.log(JSON.stringify(atributos));
    // console.log(calculosGlobales);
    /* console.log('----------------------------------');
    console.log(JSON.stringify(calculosGlobales));    
    console.log('----------------------------------'); */ 

    return { data, atributos, calculosGlobales };


    
    
};


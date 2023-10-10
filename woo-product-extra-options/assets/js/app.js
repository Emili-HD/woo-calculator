import { metaboxes } from './modules/back/metaboxes.js';
import { calculoInicial } from './modules/back/calculoInicial.js';
import { calculoPapel } from './modules/back/calculoPapel.js';
import { calculoImpresion } from './modules/back/calculoImpresion.js';
import { calculoCorte } from './modules/back/calculoCorte.js';
import { calculoCanto } from './modules/back/calculoCanto.js';
import { calculoLaminado } from './modules/back/calculoLaminado.js';
import { calculoTotales } from './modules/back/totalesCosteVenta.js';

window.addEventListener('DOMContentLoaded', (event) => {
    
    const { data, atributos, calculosGlobales } = metaboxes();
    calculoInicial(data, atributos, calculosGlobales);
    calculoPapel(data, atributos, calculosGlobales);
    calculoImpresion(data, atributos, calculosGlobales);
    calculoCorte(data, atributos, calculosGlobales);
    calculoCanto(data, atributos, calculosGlobales);
    calculoLaminado(data, atributos, calculosGlobales);
    calculoTotales(data, atributos, calculosGlobales);


    // Obtener todos los elementos h3 dentro del acordeón
    const accordionHeaders = document.querySelectorAll('.accordion h3');

    // Agregar el evento de clic a cada h3
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Toggle: Mostrar el siguiente elemento hermano (en este caso, el div con clase "accordion_section")
            header.nextElementSibling.classList.toggle('active');
        });
    });
    
})

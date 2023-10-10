<?php

function mostrar_tabla_acf_en_producto() {
    global $post;
    
    $campos = get_fields($post->ID); // Obtiene todos los campos ACF de la publicación actual
    $totales = get_option('calculos_guardados'); // Aquí accedemos a los datos que hemos guardado previamente

    if($campos) {
        $opciones_cantidades = isset($campos['cantidades']) ? $campos['cantidades'] : array();
        $opciones_envio = isset($campos['envio']) ? $campos['envio'] : array();

        if(!empty($opciones_cantidades) || !empty($opciones_envio)) {
            echo '<div class="acf-fields-producto">';
            echo '<div class="variations__table-title">';
            echo '<h2>Tabla de precios y envío</h2>';
            echo '<p>Introduce tu cantidad personalizada</p>';
            echo '<input id="customQuantityInput" class="custom__quantity" type="number" name="cantidad_personalizada" value="0">';
            echo '<button id="calcularCantidad" type="button">Calcular</button>';
            echo '</div>';
            echo '<table class="variations__table">';

            echo '<thead><tr>';
            echo '<th></th>';
            foreach ($opciones_cantidades as $opcion_cantidad) {
                echo '<th>';
                echo esc_html($opcion_cantidad);
                echo '</th>';
            }
            echo '</tr></thead>';

            foreach ($opciones_envio as $opcion_envio) {
                echo '<tr>';
                echo '<th>';
                echo esc_html($opcion_envio);
                echo '</th>';

                foreach ($opciones_cantidades as $opcion_cantidad) {
                    echo '<td>';
                    if (isset($totales[$opcion_cantidad]['1Cara']['totalVenta'])) { // Asumiendo que quieres el valor de '1Cara'
                        echo esc_html($totales[$opcion_cantidad]['1Cara']['totalVenta']);
                    } else {
                        echo ''; // Valor por defecto si no existe
                    }
                    echo '</td>';
                }
                echo '</tr>';
            }
            echo '</table>';
            echo '</div>';
        }
    }
}
add_action('woocommerce_before_add_to_cart_quantity', 'mostrar_tabla_acf_en_producto');


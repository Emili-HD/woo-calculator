<?php

function wpcc_add_meta_box() {
    add_meta_box(
        'wpcc_options_meta_box', // ID de la metabox
        'Valores Iniciales materias primas', // Título de la metabox
        'wpcc_options_meta_box_callback', // Función que mostrará el contenido
        'product', // CPT en el que se mostrará la metabox
        'advanced', // Contexto
        'high' // Prioridad
    );
}
add_action('add_meta_boxes', 'wpcc_add_meta_box');

// Creamos una función que nos servirá de base
// para crear todas las tablas de cada custom field

function render_table($fieldName, $columns, $post) {
    $saved_values = get_post_meta($post->ID, $fieldName, true);
    $rows = get_field($fieldName, 'option');

    $niceTitle = ucwords(str_replace('_', ' ', $fieldName));

    echo '<h3>' . $niceTitle . '</h3>';
    echo '<div class="accordion_section">';
    if ($rows && is_array($rows)) {
        echo '<table class="calculator" width="100%" data-name="' . $fieldName . '" >';
        echo '<tr>';
        echo '<th></th>'; // Para el checkbox
        foreach ($columns as $column) {
            $columnTitle = ucwords(str_replace('_', ' ', $column));
            echo '<th>' . $columnTitle . '</th>';
        }
        echo '</tr>';

        foreach ($rows as $row) {
            echo '<tr class="fila">';
            $checked = in_array(reset($row), $saved_values) ? ' checked' : '';
            echo '<td><input type="checkbox" name="' . $fieldName . '[]" value="' . reset($row) . '"' . $checked . '></input></td>';
            foreach ($columns as $column) {
                echo '<td data-value="' . $row[$column] . '">' . $row[$column] . '</td>';
            }
            echo '</tr>';
        }
        echo '</table>';
        echo '</div>';
        
    } else {
        echo '<p>No hay valor definido para el campo.</p>';
    }
}


function wpcc_options_meta_box_callback($post) {

    echo '<div class="accordion">';

    $fields = [
        'materias' => ['referencia', 'tipo', 'formato', 'base', 'altura', 'margen_papel', 'guillotina', 'resma'],
        'books' => ['referencia', 'tipo', 'precio_books'],
        'amortizacion' => ['maquina', 'amortizacion_maquina', 'mantenimiento', 'produccion_hora', 'formato_impresion', 'total_amortizacion'],
        'margen_papel' => ['escalado_papel_desde', 'escalado_papel_hasta', 'valor_papel', 'valor_papel_b', 'valor_papel_c'],
        'escalado_bn' => ['escalado_bn_desde', 'escalado_bn_hasta', 'valor_escalado_bn'],
        'escalado_color' => ['escalado_color_desde', 'escalado_color_hasta', 'valor_escalado_color_a3', 'valor_escalado_color_a4', 'valor_escalado_color_a5', 'valor_escalado_color_a6'],
        'escalado_encuadernacion' => ['escalado_encuadernacion_desde', 'escalado_encuadernacion_hasta', 'valor_encuadernacion_60', 'valor_encuadernacion_120', 'valor_encuadernacion_180', 'valor_encuadernacion_240', 'valor_encuadernacion_300', 'valor_encuadernacion_360', 'valor_encuadernacion_420', 'valor_encuadernacion_460'],
        'precio_hora_producción' => ['precio_hora_producción', 'precio_coste_hora_producción', 'hora_desde', 'hora_hasta'],
        'precio_hora_producción_bn' => ['precio_hora_producción_bn', 'precio_coste_hora_producción_bn', 'hora_desde_bn', 'hora_hasta_bn'],
        'precio_hora_manipulado' => ['precio_venta_hora_manipulado', 'precio_coste_hora_manipulado', 'hora_desde', 'hora_hasta'],
        'tiempo_manipulado' => ['produccion_hora', 'tipo_manipulado'],
        'margen_laminado' => ['valor_margen_laminado', 'hora_desde', 'hora_hasta'],
        'preparacion_maquina' => ['preparacion_para', 'valor_hora'],
        'plastificado' => ['referencia_plastificado', 'titulo_plastificado', 'formato_plastificado', 'margen_plastificado', 'capacidad_guillotina_plastificado', 'precio_costo_plastificado'],
        'espiral' => ['referencia_espiral', 'titulo_espiral', 'color_espiral', 'formato_espiral', 'margen_espiral', 'capacidad_hojas_espiral', 'precio_costo_espiral'],
        'tapas' => ['referencia_tapas', 'titulo_tapas', 'formato_tapas', 'margen_tapas', 'precio_costo_tapas'],
        'grapas' => ['referencia_grapas', 'titulo_grapas', 'formato_grapas', 'margen_grapas', 'precio_costo_grapas'],
        'copisteria' => ['impresora', 'ancho_papel', 'alto_papel', 'eq_papel', 'eq_impresion', 'cortes_hoja', 'din'],
    ];

    
    foreach($fields as $fieldName => $columns) {
        render_table($fieldName, $columns, $post);
    }
    
    echo '</div>';

}

add_action('save_post', 'save_wpcc_options', 10, 3);
function save_wpcc_options($post_id, $post, $update) {
    // global $fields;  // Traemos la variable $fields de function wpcc_options_meta_box_callback($post)
    $fields = [
        'materias' => ['referencia', 'tipo', 'formato', 'base', 'altura', 'margen_papel', 'guillotina', 'resma'],
        'books' => ['referencia', 'tipo', 'precio_books'],
        'amortizacion' => ['maquina', 'amortizacion_maquina', 'mantenimiento', 'produccion_hora', 'formato_impresion', 'total_amortizacion'],
        'escalado_encuadernacion' => ['escalado_encuadernacion_desde', 'escalado_encuadernacion_hasta', 'valor_encuadernacion_60', 'valor_encuadernacion_120', 'valor_encuadernacion_180', 'valor_encuadernacion_240', 'valor_encuadernacion_300', 'valor_encuadernacion_360', 'valor_encuadernacion_420', 'valor_encuadernacion_460'],
        'margen_papel' => ['escalado_papel_desde', 'escalado_papel_hasta', 'valor_papel', 'valor_papel_b', 'valor_papel_c'],
        'escalado_bn' => ['escalado_bn_desde', 'escalado_bn_hasta', 'valor_escalado_bn'],
        'escalado_color' => ['escalado_color_desde', 'escalado_color_hasta', 'valor_escalado_color_a3', 'valor_escalado_color_a4', 'valor_escalado_color_a5', 'valor_escalado_color_a6'],
        'precio_hora_producción' => ['precio_hora_producción', 'precio_coste_hora_producción', 'hora_desde', 'hora_hasta'],
        'precio_hora_producción_bn' => ['precio_hora_producción_bn', 'precio_coste_hora_producción_bn', 'hora_desde_bn', 'hora_hasta_bn'],
        'precio_hora_manipulado' => ['precio_venta_hora_manipulado', 'precio_coste_hora_manipulado', 'hora_desde', 'hora_hasta'],
        'tiempo_manipulado' => ['produccion_hora', 'tipo_manipulado'],
        'margen_laminado' => ['valor_margen_laminado', 'hora_desde', 'hora_hasta'],
        'preparacion_maquina' => ['preparacion_para', 'valor_hora'],
        'plastificado' => ['referencia_plastificado', 'titulo_plastificado', 'formato_plastificado', 'margen_plastificado', 'capacidad_guillotina_plastificado', 'precio_costo_plastificado'],
        'espiral' => ['referencia_espiral', 'titulo_espiral', 'color_espiral', 'formato_espiral', 'margen_espiral', 'capacidad_hojas_espiral', 'precio_costo_espiral'],
        'tapas' => ['referencia_tapas', 'titulo_tapas', 'formato_tapas', 'margen_tapas', 'precio_costo_tapas'],
        'grapas' => ['referencia_grapas', 'titulo_grapas', 'formato_grapas', 'margen_grapas', 'precio_costo_grapas'],
        'copisteria' => ['impresora', 'ancho_papel', 'alto_papel', 'eq_papel', 'eq_impresion', 'cortes_hoja', 'din'],
    ];

    foreach ($fields as $field_name => $sub_fields) {
        if(isset($_POST[$field_name])) {
            $clean_data = array_map('sanitize_text_field', $_POST[$field_name]); // Limpiar los datos del $_POST
            update_post_meta($post_id, $field_name, $clean_data); // Guardar los datos en la base de datos como metadata del post
            update_post_meta($product_id, '_wpcc_data', $data);
            update_post_meta($product_id, '_wpcc_atributos', $atributos);
        }
    }
}

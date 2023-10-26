<?php

function add_ajaxurl_cdata_to_front() {
    ?>
    <script type="text/javascript"> // <![CDATA[
        var ajaxurl = '<?php echo admin_url( 'admin-ajax.php'); ?>';
    // ]]></script>
    <?php
}
add_action( 'wp_head', 'add_ajaxurl_cdata_to_front', 1);

function wpcc_save_fields_values() {
    if (isset($_POST['data']) && isset($_POST['product_id'])) {
        $data = stripslashes($_POST['data']);
        $atributos = stripslashes($_POST['atributos']);
        $data_array = json_decode($data, true);
        $atributos_array = json_decode($atributos, true);
        
        $product_id = intval($_POST['product_id']);
        
        // Guardamos el JSON en el metadato del producto
        update_post_meta($product_id, '_wpcc_product_data', $data);
        update_post_meta($product_id, '_wpcc_product_atributos', $atributos);
    }
    wp_die(); 
}

add_action('wp_ajax_wpcc_save_fields_values', 'wpcc_save_fields_values');
add_action('wp_ajax_nopriv_wpcc_save_fields_values', 'wpcc_save_fields_values');



function wpcc_save_calculos_globales() {
    if (isset($_POST['calculosGlobales']) && isset($_POST['product_id'])) {
        $calculosGlobales = stripslashes($_POST['calculosGlobales']);
        $calculosGlobales_array = json_decode($calculosGlobales, true);
        $product_id = intval($_POST['product_id']);
        
        // Guardamos el JSON en el metadato del producto
        update_post_meta($product_id, '_wpcc_calculosGlobales', $calculosGlobales);
    }
    wp_die(); 
}

add_action('wp_ajax_wpcc_save_calculos_globales', 'wpcc_save_calculos_globales');
add_action('wp_ajax_nopriv_wpcc_save_calculos_globales', 'wpcc_save_calculos_globales');


function obtener_precios_ajax() {
    // Verificar nonce
    if( !isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'my_ajax_nonce') ) {
        die('Permiso denegado');
    }

    $respuesta = array();

    if(isset($_POST['calculosGlobales'])) {
        $calculosGlobales = json_decode(stripslashes($_POST['calculosGlobales']), true);

        // Aquí es donde procesas el JSON y obtienes los valores que necesitas basándote en la lógica de tu aplicación
        // Por ejemplo:
        $respuesta['totalVenta'] = $calculosGlobales['...']['totalVenta'];  // Completa la ruta correcta
        // (haz lo mismo para totalVentaSinAcabados, totalVentaSinCantos, y totalVentaSinLaminado)

    } else {
        $respuesta['error'] = "No se recibió el JSON de cálculos globales";
    }

    echo json_encode($respuesta);
    die();
}

add_action('wp_ajax_obtener_precios', 'obtener_precios_ajax'); // Si el usuario está logueado
add_action('wp_ajax_nopriv_obtener_precios', 'obtener_precios_ajax'); // Si el usuario no está logueado

//  FUNCIONES PARA PÁGINAS DE ARCHIVO
/* 
 * Función para ocultar el precio del producto en archives
 */
function tyches_hide_prices_on_all_categories( $price, $product ) {
    return '';
}
add_filter( 'woocommerce_get_price_html', 'tyches_hide_prices_on_all_categories', 10, 2 );

// Replace add to cart button by a linked button to the product in Shop and archives pages
add_filter( 'woocommerce_loop_add_to_cart_link', 'replace_loop_add_to_cart_button', 10, 2 );
function replace_loop_add_to_cart_button( $button, $product  ) {
    // Not needed for variable products
    if( $product->is_type( 'variable' ) ) return $button;

    // Button text here
    $button_text = __( "Ver producto", "woocommerce" );

    return '<a class="button" href="' . $product->get_permalink() . '">' . $button_text . '</a>';
}


//  FUNCIONES PARA PÁGINAS DE PRODUCTO
/* 
 * Función para mover el tab description bajo el título
 */
function move_tabs(){
    add_filter( 'woocommerce_product_description_heading', '__return_null' );
    remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_product_data_tabs', 10 );
    add_action( 'woocommerce_before_add_to_cart_form', 'woocommerce_output_product_data_tabs', 5 );
}
add_action('wp', 'move_tabs');


// FUNCIONES PERSONALIZADAS PARA WOOCOMMERCE ADD TO CART Y CARRITO

/* 
 * Función para establecer el precio personalizado de un artículo añadido al carrito.
 * Este precio es capturado desde un input radio en la página del producto.
 */
function set_custom_cart_item_price( $cart_item_data, $product_id ) {
    // Verifica si el precio personalizado está presente en el POST.
    if( isset( $_POST['selected_price'] ) ) {
        $price = floatval( $_POST['selected_price'] ); // Convierte el valor a float.
        $cart_item_data['custom_price'] = $price; // Almacena el precio en los datos del artículo del carrito.
    }
    return $cart_item_data;
}
add_filter( 'woocommerce_add_cart_item_data', 'set_custom_cart_item_price', 10, 2 );

/* 
 * Función para aplicar el precio personalizado a los artículos en el carrito.
 */
function apply_custom_price_to_cart_item( $cart_object ) {
    // Evita que la función se ejecute durante la recarga del proceso de compra.
    if( !WC()->session->__isset( "reload_checkout" )) {
        // Itera sobre cada artículo en el carrito.
        foreach ( $cart_object->cart_contents as $key => $value ) {
            // Si el artículo tiene un precio personalizado, aplícalo.
            if( isset( $value['custom_price'] ) ) {
                $value['data']->set_price( $value['custom_price'] );
            }
        }
    }
}
add_action( 'woocommerce_before_calculate_totals', 'apply_custom_price_to_cart_item', 20 );


// Función que devuelve la lista de campos y etiquetas.
function get_custom_field_labels() {
    // Lista de todos los posibles campos personalizados.
    // Esta lista puede ser estática o puede venir de alguna otra parte de tu sistema.
    return array(
        'selected_display_quantity' => 'Cantidad',
        'tamano'                    => 'Tamaño',
        'cartulina'                 => 'Cartulina',
        'cantos'                    => 'Cantos',
        'impresion'                 => 'Impresión',
        'laminado'                  => 'Laminado',
        'tipo_laminado'             => 'Tipo de laminado',
        'envio_type'                => 'Envío',
    );
}

/*
 * Función para almacenar datos personalizados (por ejemplo, opciones de "impresión", "laminado", o cualquier otro campo) en el artículo del carrito.
 */
function store_product_custom_data_to_cart($cart_item_data, $product_id) {
    
    $field_labels = get_custom_field_labels();

    // Iterar sobre todos los posibles campos y agregar al carrito si están presentes en el POST.
    foreach (array_keys($field_labels) as $field) {
        if (isset($_POST[$field])) {
            $cart_item_data[$field] = sanitize_text_field($_POST[$field]);
            error_log('Guardando ' . $field . ': ' . $_POST[$field]);
        }
    }

    return $cart_item_data;
}
add_filter('woocommerce_add_cart_item_data', 'store_product_custom_data_to_cart', 20, 2);

/*
 * Función para mostrar los datos personalizados debajo del nombre del producto en la página del carrito.
 */
function display_custom_data_in_cart($item_name, $cart_item) {
    // Nuevamente, definimos una lista de todos los posibles campos personalizados.
    $field_labels = get_custom_field_labels();

    // Iterar sobre todos los posibles campos y mostrar si están presentes en el artículo del carrito.
    foreach ($field_labels as $field => $label) {
        if (isset($cart_item[$field])) {
            $item_name .= '<br>' . $label . ': ' . esc_html($cart_item[$field]);
        }
    }

    return $item_name;
}
add_filter('woocommerce_cart_item_name', 'display_custom_data_in_cart', 10, 2);


// Función para agregar los campos personalizados como metadatos de los ítems de pedido.
function add_custom_order_item_meta($item, $cart_item_key, $values, $order) {
    // Obtener las etiquetas de los campos personalizados.
    $field_labels = get_custom_field_labels();
    
    // Iterar sobre las claves de los campos personalizados.
    foreach (array_keys($field_labels) as $field) {
        // Si el campo está presente en los valores del carrito, agregarlo como metadato al ítem del pedido.
        if (isset($values[$field])) {
            $item->add_meta_data($field, $values[$field], true);
        }
    }
}
add_action('woocommerce_checkout_create_order_line_item', 'add_custom_order_item_meta', 20, 4);


// Función para mostrar los campos personalizados en la página de pedido en el área de administración.
function display_custom_data_in_admin_order($item_id, $item, $product) {
    // Obtener las etiquetas de los campos personalizados.
    $field_labels = get_custom_field_labels();
    
    // Iterar sobre las etiquetas y claves de los campos personalizados.
    foreach ($field_labels as $field_key => $field_label) {
        // Obtener el valor del campo personalizado.
        $field_value = $item->get_meta($field_key);
        
        // Si el valor no está vacío, mostrarlo en el pedido en el área de administración.
        if ($field_value) {
            echo '<br><strong>' . $field_label . ': </strong>' . esc_html($field_value);
        }
    }
}
add_action('woocommerce_before_order_itemmeta', 'display_custom_data_in_admin_order', 10, 3);


// Función para ocultar los campos personalizados de metadatos en el área de administración.
function hide_custom_order_item_meta($meta_keys) {
    // Obtener las etiquetas de los campos personalizados.
    $field_labels = get_custom_field_labels();
    
    // Agregar las claves de los campos personalizados a la lista de metadatos ocultos.
    $meta_keys = array_merge($meta_keys, array_keys($field_labels));
    
    return $meta_keys;
}
add_filter('woocommerce_hidden_order_itemmeta', 'hide_custom_order_item_meta', 10, 1);





// Display the custom text field
function vicode_create_field() {
    $args = array(
    'id' => 'custom_file_field_title',
    'label' => __( 'Additional Field Title', 'vicode' ),
    'class' => 'vicode-custom-field',
    'desc_tip' => true,
    'description' => __( 'Enter the title of your additional custom text field.', 'ctwc' ),
    );
    woocommerce_wp_text_input( $args );
}
add_action( 'woocommerce_product_options_general_product_data', 'vicode_create_field' );


function my_admin_only_render_field_settings( $field ) {
    acf_render_field_setting( $field, array(
        'label'        => __( 'Familia', 'my-textdomain' ),
        'instructions' => '',
        'name'         => 'familia',
        'type'         => 'text',
        'ui'           => 1,
    ), true ); 
    acf_render_field_setting( $field, array(
        'label'        => __( 'Order', 'my-textdomain' ),
        'instructions' => '',
        'name'         => 'order',
        'type'         => 'number',
        'ui'           => 1,
    ), true ); 
}
add_action( 'acf/render_field_settings', 'my_admin_only_render_field_settings' );

function my_admin_only_prepare_field( $field ) {
    // Bail early if no 'admin_only' setting or if set to false.
    if ( empty( $field['familia'] ) ) {
        return $field;
    }
    if ( empty( $field['order'] ) ) {
        return $field;
    }

    // Return the original field otherwise.
    return $field;
}
add_filter( 'acf/prepare_field', 'my_admin_only_prepare_field' );

/* // save data from custom field
function vicode_save_field_data( $post_id ) {
    $product = wc_get_product( $post_id );
    $title = isset( $_POST['custom_file_field_title'] ) ? $_POST['custom_file_field_title'] : '';
    $product->update_meta_data( 'custom_file_field_title', sanitize_text_field( $title ) );
    $product->save();
}
add_action( 'woocommerce_process_product_meta', 'vicode_save_field_data' );


// Display field on the Product Page
function vicode_display_field() {
    global $post;
    // Check for the custom field value
    $product = wc_get_product( $post->ID );
    $title = $product->get_meta( 'custom_file_field_title' );
    if( $title ) {
        // Display the field if not empty
        printf(
        '<div class="vicode-custom-field-wrapper"><label for="vicode-file-field" style="margin-right: 30px;">%s: </label><input type="file" id="vicode-file-field" name="vicode-file-field"></div><br /><hr />',
        esc_html( $title )
        );
    }
}
add_action( 'woocommerce_before_add_to_cart_button', 'vicode_display_field' );


// custom input validation
function vicode_field_validation( $passed, $product_id, $quantity ) {
    if( empty($_FILES['vicode-file-field']["name"]) ) {
        // Fails validation
        $passed = false;
        wc_add_notice( __( 'Please attach an image to your product.', 'vicode' ), 'error' );
    }
    return $passed;
}
add_filter( 'woocommerce_add_to_cart_validation', 'vicode_field_validation', 10, 3 ); */


// add field data to the cart
/* function vicode_add_field_data_to_cart( $cart_item_data, $product_id, $variation_id, $quantity ) {

    // Parte de la función set_custom_cart_item_price
    if( isset( $_POST['selected_price'] ) ) {
        $price = floatval( $_POST['selected_price'] );
        $cart_item_data['custom_price'] = $price;
    }

    if( ! empty( $_FILES['vicode-file-field']["name"] ) ) {
        // WordPress environment
        require( dirname(__FILE__) . '/../../../wp-load.php' );
        
        $wordpress_upload_dir = wp_upload_dir();
        // $wordpress_upload_dir['path'] is the full server path to wp-content/uploads/2017/05, for multisite works good as well
        // $wordpress_upload_dir['url'] the absolute URL to the same folder, actually we do not need it, just to show the link to file
        $i = 1; // number of tries when the file with the same name already exists
        
        $file_image = $_FILES['vicode-file-field'];
        $new_file_path = $wordpress_upload_dir['path'] . '/' . $file_image['name'];
        $new_file_mime = mime_content_type( $file_image['tmp_name'] );
        
        if( empty( $file_image ) )
            die( 'File is not selected.' );
        
        if( $file_image['error'] )
            die( $file_image['error'] );
        
        if( $file_image['size'] > wp_max_upload_size() )
            die( 'It is too large than expected.' );
        
        if( !in_array( $new_file_mime, get_allowed_mime_types() ) )
            die( 'WordPress doesn\'t allow this type of uploads.' );
        
        while( file_exists( $new_file_path ) ) {
            $i++;
            $new_file_path = $wordpress_upload_dir['path'] . '/' . $i . '_' . $file_image['name'];
        }
        
        // if everything is fine
        if( move_uploaded_file( $file_image['tmp_name'], $new_file_path ) ) {
            $upload_id = wp_insert_attachment( array(
                'guid'           => $new_file_path, 
                'post_mime_type' => $new_file_mime,
                'post_title'     => preg_replace( '/\.[^.]+$/', '', $file_image['name'] ),
                'post_content'   => '',
                'post_status'    => 'inherit'
            ), $new_file_path );
        
            // wp_generate_attachment_metadata() won't work if you do not include this file
            require_once( ABSPATH . 'wp-admin/includes/image.php' );
        
            // Generate and save the attachment metas into the database
            wp_update_attachment_metadata( $upload_id, wp_generate_attachment_metadata( $upload_id, $new_file_path ) );        
        }
        // Add item data
        $cart_item_data['file_field'] = $wordpress_upload_dir['url'] . '/' . basename( $new_file_path );
        $product = wc_get_product( $product_id );
        $price = $product->get_price();
        $cart_item_data['total_price'] = $price;
    }
    return $cart_item_data;
}
add_filter( 'woocommerce_add_cart_item_data', 'vicode_add_field_data_to_cart', 10, 4 );


// update cart price
function vicode_calculate_cart_totals( $cart_obj ) {
    if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
        return;
    }
    // Iterate through each cart item
    foreach( $cart_obj->get_cart() as $key=>$value ) {
        if( isset( $value['total_price'] ) ) {
            $price = $value['total_price'];
            $value['data']->set_price( ( $price ) );
        }
    }
}
add_action( 'woocommerce_before_calculate_totals', 'vicode_calculate_cart_totals', 10, 1 );


// display field in the cart
function vicode_field_to_cart( $name, $cart_item, $cart_item_key ) {
    if( isset( $cart_item['file_field'] ) ) {
        $name .= sprintf(
            '<p>%s</p>',
            esc_html( $cart_item['file_field'] )
        );
    }
    return $name;
}
add_filter( 'woocommerce_cart_item_name', 'vicode_field_to_cart', 10, 3 );


// Add custom field to order object
function vicode_add_field_data_to_order( $item, $cart_item_key, $values, $order ) {
    foreach( $item as $cart_item_key=>$values ) {
        if( isset( $values['file_field'] ) ) {
        $item->add_meta_data( __( 'Custom Field', 'vicode' ), $values['file_field'], true );
        }
    }
}
add_action( 'woocommerce_checkout_create_order_line_item', 'vicode_add_field_data_to_order', 10, 4 );
 */

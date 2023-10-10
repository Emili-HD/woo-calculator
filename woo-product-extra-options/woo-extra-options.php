<?php
/*
Plugin Name: Woo Price Calculator
Description: Calculos de costos y precios para el plugin Woocommerce Product Options
Version: 0.1.0
*/

// Prevent direct file access
if (!defined('ABSPATH')) {
    exit;
}

// Registra los scripts y estilos
function wpcc_register_files() {
    wp_register_style('wpcc-styles', plugins_url('assets/css/styles.css', __FILE__));
    wp_register_script('wpcc-script', plugins_url('assets/js/app.js', __FILE__), '', '1.0', true);
}

add_action('init', 'wpcc_register_files');

// Encolar los scripts y estilos para el backend
function wpcc_admin_styles() {
    wp_localize_script('wpcc-script', 'wpcc_vars', array(
        'ajax_url' => admin_url('admin-ajax.php')
    ));
    wp_enqueue_style('wpcc-styles');
    wp_enqueue_script('wpcc-script');
}

add_action('admin_enqueue_scripts', 'wpcc_admin_styles');

// Enqueue de scripts y estilos para el frontend
function wpcc_enqueue_frontend_scripts() {
    global $post;

    if ($post && $post->post_type == 'product') {
        $product_data = get_post_meta($post->ID, '_wpcc_product_data', true);
        $product_atributos = get_post_meta($post->ID, '_wpcc_product_atributos', true);
        wp_enqueue_style('css-front', plugins_url('/assets/css/front.css', __FILE__));

        wp_register_script('wpcc-calculos', plugins_url('assets/js/customCalc.js', __FILE__),'', '0.1.0', true);
        // wp_register_script('wpcc-front-script', plugins_url('assets/js/app-front.js', __FILE__), array('jquery'), null, true);
        wp_localize_script('wpcc-calculos', 'wpcc_vars', array(
            'data' => $product_data,
            'atributos' => $product_atributos,
            'myAjax' => array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('my_ajax_nonce')
            )
        ));

        $product_id = get_the_ID();
        $product_name = get_the_title();

        wp_localize_script('wpcc-calculos', 'productData', array(
            'id' => $product_id,
            'name' => $product_name
        ));

        wp_enqueue_script('wpcc-calculos');
        // wp_enqueue_script('wpcc-front-script');
    }
}

add_action('wp_enqueue_scripts', 'wpcc_enqueue_frontend_scripts');

// Agrega el atributo 'module' al script
add_filter("script_loader_tag", "add_module_to_my_script", 10, 3);

function add_module_to_my_script($tag, $handle, $src) {
    if ("wpcc-script" === $handle || "wpcc-calculos" === $handle) {
        $tag = '<script type="module" src="' . esc_url($src) . '"></script>';
    }

    return $tag;
}


// Incluye los archivos necesarios
require plugin_dir_path(__FILE__) . '/includes/pages.php';
require plugin_dir_path(__FILE__) . '/includes/metaboxes.php';
require plugin_dir_path(__FILE__) . '/includes/product-options.php';
require plugin_dir_path(__FILE__) . '/includes/front/front-fields-product.php';
require plugin_dir_path(__FILE__) . '/includes/front/front-quantity-table.php';

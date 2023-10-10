<?php

// Acción para registrar la página de administración
add_action('admin_menu', 'wpcc_zona_admin_menu');

function wpcc_zona_admin_menu() {
    if( function_exists('acf_add_options_page') ) {
        acf_add_options_page(array(
            'page_title'    => 'Settings',        // título de la página
            'menu_title'    => 'Cost Calculator', // Título del menú
            'menu_slug'     => 'wpcc-calculator', // slug
            'capability'    => 'manage_options',  // Capacidades
            'icon_url'      => 'dashicons-calculator', // Ícono opcional
            'position'      => 20                 // Posición en el menú
        ));
    }
}


// Acción para registrar la página de administración
/* add_action('admin_menu', 'wpcc_zona_admin_menu');

function wpcc_zona_admin_menu() {
    // Añade una nueva página de menú al menú principal de WordPress
    add_menu_page(
        '',  // título de la página
        'Cost Calculator', // Título del menú
        'manage_options', // Capacidades
        'wpcc-calculator', // slug
        'wpcc_zona_admin_callback',  //función con el código que queremos renderizar
        'dashicons-admin-generic', // Ícono opcional, puedes cambiarlo
        20 // Posición en el menú, ajusta este número según sea necesario
    );

    if( function_exists('acf_add_options_page') ) {
        acf_add_options_sub_page(array(
            'page_title'    => 'Settings',
            'menu_title'    => 'Ajustes',
            'parent_slug'   => 'wpcc-calculator',
        ));  
    }
}
 */

<?php

function mostrar_campos_acf_en_producto() {
    global $post;
    
    $campos = get_fields($post->ID); // Obtiene todos los campos ACF de la publicación actual

    
    if( $campos ) {
        
        echo '<form class="wpcc-fields-producto" enctype="multipart/form-data">';
        echo '<div class="wpcc-options">';
        // var_dump($campos);
        foreach( $campos as $nombre_campo => $valor ) {

            // Obtenemos el objeto del campo para determinar su tipo
            $campo_objeto = get_field_object($nombre_campo);

            /****************************************************************/
            /* Muestra los campos tipo checkbox del backend como radio buttons
            excepto los campos para la tabla */
            /****************************************************************/
            if ( $campo_objeto['type'] == 'checkbox' &&  
                $campo_objeto['name'] != 'cantidades' && 
                $campo_objeto['name'] != 'cantidades_urgente' && 
                $campo_objeto['name'] != 'maquina' && 
                $campo_objeto['name'] != 'envio' && 
                $campo_objeto['name'] != 'limite_medidas' && 
                is_array($valor) ) {

                    $opcionValidaEncontrada = false;
                    foreach ($valor as $opcion_seleccionada) {
                        if (isset($campo_objeto['choices'][$opcion_seleccionada])) {
                            $opcionValidaEncontrada = true;
                            break;
                        }
                    }

                    if ($opcionValidaEncontrada) {
                        echo '<div id="' . $campo_objeto['key'] . '" class="wpcc-field wpcc-group-radios" data-name="'.esc_attr($nombre_campo).'" data-family="'.esc_attr($campo_objeto['wrapper']['class']).'" style="order: '.esc_attr($campo_objeto['wrapper']['id']).';">'; // Contenedor para cada campo
                        echo '<p class="wpcc-field-name">' . $campo_objeto['label'] . '</p>';
                        echo '<div class="wpcc-field-radios">';

                        $valorPorDefecto = isset($campo_objeto['default_value'][0]) ? $campo_objeto['default_value'][0] : '';

                        // Recorremos solo las opciones seleccionadas
                        foreach ($valor as $opcion_seleccionada) {
                            if (isset($campo_objeto['choices'][$opcion_seleccionada])) {
                                $label = $campo_objeto['choices'][$opcion_seleccionada]; // Obtenemos la etiqueta para la opción seleccionada
                                $isChecked = ($opcion_seleccionada == $valorPorDefecto) ? 'checked' : '';

                                // Utilizamos expresiones regulares para extraer el formato de papel
                                preg_match('/^(A4|A3|SRA3)/', $label, $matches);
                                $formato_papel = isset($matches[1]) ? $matches[1] : '';

                                // Eliminamos el formato de papel del label
                                $label_sin_formato = str_replace($formato_papel, '', $label);

                                echo '<label class="wpcc-input-radio">';
                                echo '<input type="radio" name="' . esc_attr($nombre_campo) . '" value="' . esc_attr($opcion_seleccionada) . '" ' . $isChecked . ' data-format="' . $formato_papel . '"> ' . esc_html($label_sin_formato) . '<br>';
                                echo '</label>';
                            }
                        }

                        echo '</div>';
                        echo '</div>';
                    }

                } elseif ( $campo_objeto['type'] == 'checkbox' && $campo_objeto['name'] == 'cantidades' && $campo_objeto['name'] = 'maquina' && $campo_objeto['name'] = 'envio' && is_array($valor) ) {
                // no hacemos nada
                }

                /****************************************************************/
                /* 
                * Muestra los campos tipo repeater del backend como radio buttons
                */
                /****************************************************************/

            elseif($campo_objeto['type'] == 'repeater' && is_array($valor)) {
                echo '<div id="' . $campo_objeto['key'] . '" class="wpcc-field wpcc-group-radios" data-name="'.esc_attr($nombre_campo).'" data-family="'.esc_attr($campo_objeto['wrapper']['class']).'" style="order: '.esc_attr($campo_objeto['wrapper']['id']).';">'; // Contenedor para cada campo
                echo '<p class="wpcc-field-name">' . $campo_objeto['label'] . '</p>';
                echo '<div class="wpcc-field-radios">';

                $firstChecked = true;

                // Recorremos las filas del campo repeater
                foreach($valor as $fila) {
                    $alto = isset($fila['alto']) ? $fila['alto'] : '';
                    $ancho = isset($fila['ancho']) ? $fila['ancho'] : '';
                    $formato = isset($fila['formato']) ? $fila['formato'] : '';
                    $labelRadio = "$alto x $ancho";
                    $dataLabel = "$alto"."x"."$ancho";

                    // Obtener los valores Mínimos y máximos de impresión
                    $medidas = get_field('limite_medidas');
                    $medidas_min = $medidas['min'];
                    $medidas_max = $medidas['max'];
                    $superficie_min = $medidas['superficie_min'];
                    $superficie_max = $medidas['superficie_max'];


                    $isChecked = $firstChecked ? 'checked' : '';
                    $firstChecked = false; // Lo configuramos como falso para que solo el primer radio button esté seleccionado

                    if ($ancho == 0 && $alto == 0) {
                        echo '<label class="wpcc-input-radio custom__sizes">';
                        echo '<input type="radio" name="tamano" class="custom__sizes-radio" value="' . esc_attr($dataLabel) . '" ' . $isChecked . ' > Tamaño Personalizado<br>';
                        echo '<div class="custom__sizes-size" data-areamin="' . esc_attr($superficie_min) . '" data-areamax="' . esc_attr($superficie_max) . '" >';
                        echo '<span>Alto:</span> <input type="number" name="alto" min="' . esc_attr($medidas_min) . '" max="' . esc_attr($medidas_max) . '" value="0"><br>';
                        echo '<span>Ancho:</span> <input type="number" name="ancho" min="' . esc_attr($medidas_min) . '" max="' . esc_attr($medidas_max) . '" value="0"><br>';
                        echo '<div class="custom__sizes-error" style="color: red; display: none;">Error: Las medidas no cumplen con los límites establecidos.</div>';
                        // echo '<button type="button" id="calcularBtn">Calcular</button><br>';
                        echo '</div>';
                        echo '</label>';
                    }
                    else {
                        echo '<label class="wpcc-input-radio">';
                        echo '<input type="radio" name="' . esc_attr($nombre_campo) . '" data-format="'.esc_html($formato).'" value="' . esc_attr($dataLabel) . '" ' . $isChecked . ' > ('. esc_html($formato). ') ' . esc_html($labelRadio) . '<br>';
                        echo '</label>';
                    }
                }

                echo '</div>';
                echo '</div>';
            }

            elseif ($campo_objeto['type'] == 'number') {
                $copias = get_field('cantidad_copias');
                echo '<div class="wpcc-field wpcc-cantidad-copias" data-name="cantidad_copias" style="order: '.esc_attr($campo_objeto['wrapper']['id']).';">';
                echo 'Cantidad de copias<input type="number" name="cantidad__copias" class="custom__sizes-number" value="1">';
                echo '</div>';
            }
            
            /****************************************************************/
            // Aquí podemos agregar más condiciones para otros tipos de campos según necesitemos
            /****************************************************************/
            else {
                /* echo '<div class="wpcc-field">'; // Contenedor para cada campo
                echo '<strong>' . $campo_objeto['label'] . ':</strong> ' . esc_html($valor);
                echo '</div>'; */
            }
        }
        echo '</div>';
        // echo '<div class="wpcc-input-upload">';
        // echo '<svg class="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 510.3 510.3"><path d="M429.064,197.276c0-0.151,0.043-1.057,0.043-1.057c0-75.282-61.261-136.521-136.543-136.521     c-52.223,0-97.823,30.587-120.689,76.339c-11.691-9.103-25.13-15.682-40.294-15.682c-37.145,0-67.387,30.199-67.387,67.387     c0,0,0.453,3.279,0.798,5.824C27.028,206.486,0,241.172,0,282.286c0,25.367,9.879,49.246,27.826,67.15     c17.968,17.99,41.804,27.891,67.215,27.891h130.266v73.276h83.953v-73.276h109.946c50.217,0,91.093-40.855,91.093-91.007     C510.278,239.597,474.428,202.409,429.064,197.276z M419.207,350.493H309.26v-55.955h54.682l-95.623-101.965l-97.673,101.965     h54.66v55.955H95.041c-18.206,0-35.333-7.075-48.211-19.975c-12.878-12.899-19.953-30.027-19.953-48.189     c0-32.68,23.21-60.808,55.243-66.956l12.511-2.394l-2.092-14.431l-1.467-10.785c0-22.347,18.184-40.51,40.51-40.51     c13.266,0,25.712,6.514,33.305,17.408l15.251,21.873l8.499-25.303c15.013-44.652,56.796-74.656,103.906-74.656     c60.484,0,109.709,49.203,109.709,109.644l-1.337,25.712l15.121,0.302l3.149-0.086c35.441,0,64.216,28.797,64.216,64.216     C483.401,321.717,454.626,350.493,419.207,350.493z"></path></svg>';
        // echo '<input class="box__file" type="file" name="files[]" id="file" data-multiple-caption="{count} files selected" multiple />';
        // echo '<label for="file"><strong>Sube un archivo</strong><span class="box__dragndrop"> o arrástralo aquí</span>.</label>';
        // echo '<button class="box__button" type="submit">Subir archivos</button>';
        // echo '</div>';
        // echo '<div class="box__uploading">Subiendo archivo…</div>';
        // echo '<div class="box__success">¡Perfecto!</div>';
        // echo '<div class="box__error">¡Error! <span></span>.</div>';
        echo '</form>';
    }
}
add_action('woocommerce_before_add_to_cart_form', 'mostrar_campos_acf_en_producto');


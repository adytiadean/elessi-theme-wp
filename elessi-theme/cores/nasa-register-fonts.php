<?php

/**
 * 
 * @param type $font_families
 * @param type $font_set
 * @return string The cleaned URL.
 */
if (!function_exists('elessi_register_fonts')) :
    function elessi_google_fonts_url($font_families = array(), $font_set = array()) {
        $query_args = array();

        if ($font_families) {
            $query_args['family'] = urlencode(implode('|', $font_families));
        }

        if ($font_set) {
            $query_args['subset'] = urlencode(implode(',', $font_set));
        }

        return $query_args ? esc_url(add_query_arg($query_args, 'https://fonts.googleapis.com/css')) : false;
    }
endif;

/**
 * Register font
 */
add_action('wp_enqueue_scripts', 'elessi_register_fonts');
if (!function_exists('elessi_register_fonts')) :
    function elessi_register_fonts() {
        /**
         * Override page | Category
         */
        global $wp_query, $nasa_opt;
        $objectId = $wp_query->get_queried_object_id();

        $type_font_select = '';
        $type_headings = '';
        $type_texts = '';
        $type_nav = '';
        $type_banner = '';
        $type_price = '';
        $custom_font = '';

        if ('page' === get_post_type() && $objectId) {
            $type_font_select = get_post_meta($objectId, '_nasa_type_font_select', true);

            if ($type_font_select == 'google') {
                $type_headings = get_post_meta($objectId, '_nasa_type_headings', true);
                $type_texts = get_post_meta($objectId, '_nasa_type_texts', true);
                $type_nav = get_post_meta($objectId, '_nasa_type_nav', true);
                $type_banner = get_post_meta($objectId, '_nasa_type_banner', true);
                $type_price = get_post_meta($objectId, '_nasa_type_price', true);
            }

            if ($type_font_select == 'custom') {
                $custom_font = get_post_meta($objectId, '_nasa_custom_font', true);
            }
        }

        /**
         * Override primary color for root category product
         */
        else {
            $rootCatId = elessi_get_root_term_id();
            if ($rootCatId) {
                $type_font_select = get_term_meta($rootCatId, 'type_font', true);

                if ($type_font_select == 'google') {
                    $type_headings = get_term_meta($rootCatId, 'headings_font', true);
                    $type_texts = get_term_meta($rootCatId, 'texts_font', true);
                    $type_nav = get_term_meta($rootCatId, 'nav_font', true);
                    $type_banner = get_term_meta($rootCatId, 'banner_font', true);
                    $type_price = get_term_meta($rootCatId, 'price_font', true);
                }

                if ($type_font_select == 'custom') {
                    $custom_font = get_term_meta($rootCatId, 'custom_font', true);
                }
            }
        }

        /**
         * Global Font register in NasaTheme Options
         */
        if (!$type_font_select) {
            $type_font_select = isset($nasa_opt['type_font_select']) ? $nasa_opt['type_font_select'] : '';
            $type_headings = isset($nasa_opt['type_headings']) ? $nasa_opt['type_headings'] : '';
            $type_texts = isset($nasa_opt['type_texts']) ? $nasa_opt['type_texts'] : '';
            $type_nav = isset($nasa_opt['type_nav']) ? $nasa_opt['type_nav'] : '';
            $type_banner = isset($nasa_opt['type_banner']) ? $nasa_opt['type_banner'] : '';
            $type_price = isset($nasa_opt['type_price']) ? $nasa_opt['type_price'] : '';
            $custom_font = isset($nasa_opt['custom_font']) ? $nasa_opt['custom_font'] : '';
        } 

        $fontSets = '';

        /**
         * Select Font custom use load site
         */
        if ($type_font_select == 'custom' && $custom_font) {
            global $nasa_upload_dir;

            $nasa_upload_dir = !isset($nasa_upload_dir) ? wp_upload_dir() : $nasa_upload_dir;

            if (is_file($nasa_upload_dir['basedir'] . '/nasa-custom-fonts/' . $custom_font . '/' . $custom_font . '.css')) {
                $fontSets = $nasa_upload_dir['baseurl'] . '/nasa-custom-fonts/' . $custom_font . '/' . $custom_font . '.css';
            }
        }

        /**
         * Select Google Font use load site
         */
        elseif ($type_font_select == 'google') {
            $default_fonts = array(
                "Open Sans",
                "Helvetica",
                "Arial",
                "Sans-serif"
            );

            $googlefonts = array();

            if ($type_headings && !in_array($type_headings, $googlefonts)) {
                $googlefonts[] = $type_headings;
            }

            if ($type_texts && !in_array($type_texts, $googlefonts)) {
                $googlefonts[] = $type_texts;
            }

            if ($type_nav && !in_array($type_nav, $googlefonts)) {
                $googlefonts[] = $type_nav;
            }

            if ($type_banner && !in_array($type_banner, $googlefonts)) {
                $googlefonts[] = $type_banner;
            }

            if ($type_price && !in_array($type_price, $googlefonts)) {
                $googlefonts[] = $type_price;
            }

            $nasa_font_family = array();
            $nasa_font_set = array();

            if (!empty($nasa_opt['type_subset'])) {
                foreach ($nasa_opt['type_subset'] as $key => $val) {
                    if ($val && !in_array($key, $nasa_font_set)) {
                        $nasa_font_set[] = $key;
                    }
                }
            }

            if ($googlefonts) {
                $font_weight = apply_filters('nasa_google_font_weight', ':400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic');
                
                foreach ($googlefonts as $googlefont) {
                    if (!in_array($googlefont, $default_fonts)) {
                        $default_fonts[] = $googlefont;
                        $nasa_font_family[] = $googlefont . $font_weight;
                    }
                }
            }

            if (!empty($nasa_font_family)) {
                $fontSets = elessi_google_fonts_url($nasa_font_family, $nasa_font_set);
            }
        }

        if ($fontSets) {
            wp_enqueue_style('nasa-fonts', $fontSets);
        }
    }
endif;

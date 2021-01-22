<?php

/**
 * Render Time sale Countdown
 */
if (!function_exists('elessi_time_sale')) :
    function elessi_time_sale($time_sale = null, $gmt = true) {
        return function_exists('nasa_time_sale') ? nasa_time_sale($time_sale, $gmt, true) : '';
    }
endif;

/**
 * Get custom style by post id
 */
if (!function_exists('elessi_get_custom_style')) :
    function elessi_get_custom_style($post_id) {
        return function_exists('nasa_get_custom_style') ? nasa_get_custom_style($post_id) : '';
    }
endif;

/**
 * get Nasa Block
 */
if (!function_exists('elessi_get_block')):
    function elessi_get_block($slug) {
        return function_exists('nasa_get_block') ? nasa_get_block($slug) : '';
    }
endif;

/**
 * Clear Both
 */
if (!function_exists('elessi_clearboth')) :
    function elessi_clearboth() {
        echo '<div class="nasa-clear-both nasa-min-height"></div>';
    }
endif;

/**
 * Single hr
 */
if (!function_exists('elessi_single_hr')) :
    function elessi_single_hr() {
        echo '<hr class="nasa-single-hr" />';
    }
endif;

/**
 * Switch Tablet
 */
if (!function_exists('elessi_switch_tablet')) :
    function elessi_switch_tablet() {
        return function_exists('nasa_switch_tablet') ? nasa_switch_tablet() : apply_filters('nasa_switch_tablet', '848');
    }
endif;

/**
 * Switch Desktop
 */
if (!function_exists('elessi_switch_desktop')) :
    function elessi_switch_desktop() {
        return function_exists('nasa_switch_desktop') ? nasa_switch_desktop() : apply_filters('nasa_switch_desktop', '1130');
    }
endif;

/**
 * Get logo
 */
if (!function_exists('elessi_logo')) :
    function elessi_logo() {
        global $nasa_logo;
        
        if (!isset($nasa_logo) || !$nasa_logo) {
            global $nasa_opt, $wp_query;
            
            $logo_link = isset($nasa_opt['site_logo']) ? $nasa_opt['site_logo'] : '';
            $logo_retina = isset($nasa_opt['site_logo_retina']) ? $nasa_opt['site_logo_retina'] : '';
            $logo_link_overr = $logo_retina_overr = false;
            
            $page_id = false;
            $root_term_id = elessi_get_root_term_id();
            
            /**
             * For Page
             */
            if (!$root_term_id) {
                /*
                 * Override Header
                 */
                $is_shop = $pageShop = $is_product_taxonomy = false;
                if (NASA_WOO_ACTIVED) {
                    $is_shop = is_shop();
                    $is_product_taxonomy = is_product_taxonomy();
                    $pageShop = wc_get_page_id('shop');
                }

                if (($is_shop || $is_product_taxonomy) && $pageShop > 0) {
                    $page_id = $pageShop;
                }

                /**
                 * Page
                 */
                if (!$page_id) {
                    $page_id = $wp_query->get_queried_object_id();
                }
                
                if ($page_id) {
                    $logo_link_overr = get_post_meta($page_id, '_nasa_custom_logo', true);
                    $logo_retina_overr = get_post_meta($page_id, '_nasa_custom_logo_retina', true);
                }
            }
            
            /**
             * For Root Category
             */
            else {
                $logo_id = get_term_meta($root_term_id, 'cat_logo', true);
                $logo_retina_id = $logo_id ? get_term_meta($root_term_id, 'cat_logo_retina', true) : false;
                
                if ($logo_id) {
                    $logo_link_overr = wp_get_attachment_image_url($logo_id, 'full');
                    $logo_retina_overr = $logo_retina_id ? wp_get_attachment_image_url($logo_retina_id, 'full') : false;
                }
            }
            
            $logo_link = $logo_link_overr ? $logo_link_overr : $logo_link;
            $logo_retina = $logo_retina_overr ? $logo_retina_overr : ($logo_retina ? $logo_retina : false);
            $logo_class = 'header_logo';
            $logo_class = apply_filters('nasa_logo_classes', $logo_class);
            
            $site_title = esc_attr(get_bloginfo('name', 'display'));

            $content = '<a class="logo nasa-logo-retina" href="' . esc_url(home_url('/')) . '" title="' . $site_title . ' - ' . esc_attr(get_bloginfo('description', 'display')) . '" rel="' . esc_attr__('Home', 'elessi-theme') . '">';
            
            if ($logo_link) {
                $img_attrs = array(
                    'src="' . esc_url($logo_link) . '"',
                    'alt="' . $site_title . '"',
                    'class="' . esc_attr($logo_class) . '"'
                );

                if ($logo_retina) {
                    $img_attrs[] = 'data-src-retina="' . esc_url($logo_retina) . '"';
                }
                
                if (isset($nasa_opt['logo_width']) && (int) $nasa_opt['logo_width']) {
                    $img_attrs[] = 'width="' . esc_attr($nasa_opt['logo_width']) . '"';
                }
                
                if (isset($nasa_opt['logo_height']) && (int) $nasa_opt['logo_height']) {
                    $img_attrs[] = 'height="' . esc_attr($nasa_opt['logo_height']) . '"';
                }
                
                $content .= '<img ' . implode(' ', $img_attrs) . ' />';
                
            } else {
                $content .= get_bloginfo('name', 'display');
            }
            
            $content .= '</a>';
            
            $GLOBALS['nasa_logo'] = $content;
            
            return $content;
        }
        
        return $nasa_logo;
    }
endif;

/**
 * Get search Product Post_type search mobile form
 */
add_filter('nasa_mobile_search_post_type', 'elessi_mobile_search_form_post_type');
if (!function_exists('elessi_mobile_search_form_post_type')) :
    function elessi_mobile_search_form_post_type($post_type) {
        global $nasa_opt;

        if (isset($nasa_opt['anything_search']) && $nasa_opt['anything_search']) {
            return false;
        }

        return $post_type;
    }
endif;

/**
 * Get search Product Post_type search
 */
if (!function_exists('elessi_search_form_product')) :
    function elessi_search_form_product($post_type) {
        global $nasa_opt;
        
        if (isset($nasa_opt['anything_search']) && $nasa_opt['anything_search']) {
            return false;
        }
        
        return 'product';
    }
endif;

/**
 * Get search Post Post_type search
 */
if (!function_exists('elessi_search_form_post')) :
    function elessi_search_form_post($post_type) {
        global $nasa_opt;
        
        if (isset($nasa_opt['anything_search']) && $nasa_opt['anything_search']) {
            return false;
        }
        
        return 'post';
    }
endif;

/**
 * Get header search
 */
if (!function_exists('elessi_search')) :
    function elessi_search($search_type = 'icon', $return = true) {
        global $nasa_opt;
        
        add_filter('nasa_search_post_type', 'elessi_search_form_product');
        
        $class_wrap = ' nasa_search_' . $search_type;
        $class = $search_type == 'icon' ? ' nasa-over-hide' : ' nasa-search-relative';
        $class .= isset($nasa_opt['search_effect']) && $nasa_opt['search_effect'] ? ' nasa-' . $nasa_opt['search_effect'] : '';   
        
        $search = '';
        $search .= '<div class="nasa-search-space' . esc_attr($class_wrap) . '">';
        $search .= '<div class="nasa-show-search-form' . $class . '">';
        $search .= get_search_form(false);
        $search .= '</div>';
        $search .= '</div>';
        
        add_filter('nasa_search_post_type', 'elessi_search_form_post');
        
        if ($return) {
            return $search;
        }
        
        echo $search;
    }
endif;

/**
 * Get Main-menu
 */
if (!function_exists('elessi_get_main_menu')) :
    function elessi_get_main_menu($main = true) {
        global $nasa_main_menu;
        
        $mega = class_exists('Nasa_Nav_Menu');
        $walker = $mega ? new Nasa_Nav_Menu() : new Walker_Nav_Menu();
        if (!$nasa_main_menu) {
            if (has_nav_menu('primary')) :
                $depth = apply_filters('nasa_max_depth_main_menu', 3);
                
                $GLOBALS['nasa_main_menu'] = wp_nav_menu(array(
                    'echo' => false,
                    'theme_location' => 'primary',
                    'container' => false,
                    'items_wrap' => '%3$s',
                    'depth' => (int) $depth,
                    'walker' => $walker
                ));
            else:
                $allowed_html = array(
                    'li' => array(),
                    'b' => array()
                );
                
                $GLOBALS['nasa_main_menu'] = wp_kses(__('<li>Please Define menu in <b>Apperance > Menus</b></li>', 'elessi-theme'), $allowed_html);
            endif;
        }
        
        echo '<div class="nav-wrapper inline-block main-menu-warpper">';
        echo '<ul' . ($main ? ' id="site-navigation" ' : ' ') . 'class="header-nav nasa-to-menu-mobile' . ($mega ? '' : ' nasa-wp-simple-nav-menu') . '">';
        echo $nasa_main_menu;
        echo '</ul>';
        echo '</div><!-- nav-wrapper -->';
    }
endif;

/**
 * Get Menu
 */
if (!function_exists('elessi_get_menu')) :
    function elessi_get_menu($menu_location, $class = "", $depth = 3) {
        if (has_nav_menu($menu_location)) {
            $depth = apply_filters('nasa_max_depth_menu', $depth);
            
            $mega = class_exists('Nasa_Nav_Menu');
            $walker = $mega ? new Nasa_Nav_Menu() : new Walker_Nav_Menu();
            $classes = $mega ? 'nasa-nav-menu' : 'nasa-wp-simple-nav-menu';
            $classes .= $class != '' ? ' ' . $class : '';
            
            echo '<ul class="' . esc_attr($classes) . '">';
            
            wp_nav_menu(array(
                'theme_location' => $menu_location,
                'container' => false,
                'items_wrap' => '%3$s',
                'depth' => (int) $depth,
                'walker' => $walker
            ));
            
            echo '</ul>';
        }
    }
endif;

/**
 * Get Vertical-menu
 */
if (!function_exists('elessi_get_vertical_menu')) :
    function elessi_get_vertical_menu() {
        global $nasa_vertical_menu;

        if (!$nasa_vertical_menu) {
            global $nasa_opt, $wp_query;
            
            $page_id = $menu_overr = false;
            $menu = isset($nasa_opt['vertical_menu_selected']) ? $nasa_opt['vertical_menu_selected'] : false;
            
            $rootCatId = elessi_get_root_term_id();
            if (!$rootCatId) {
                $is_shop = $pageShop = $is_product_taxonomy = false;
                if (NASA_WOO_ACTIVED) {
                    $is_shop = is_shop();
                    $is_product_taxonomy = is_product_taxonomy();
                    $pageShop = wc_get_page_id('shop');
                }

                if (($is_shop || $is_product_taxonomy) && $pageShop > 0) {
                    $page_id = $pageShop;
                }

                /**
                 * Page
                 */
                if (!$page_id) {
                    $page_id = $wp_query->get_queried_object_id();
                }

                /**
                 * Switch footer
                 */
                if ($page_id) {
                    $menu_overr = get_post_meta($page_id, '_nasa_vertical_menu_selected', true);
                }
            }
            
            /**
             * For Root Category
             */
            else {
                $menu_overr = get_term_meta($rootCatId, 'cat_header_vertical_menu', true);
            }
            
            if ($menu_overr) {
                $menu = $menu_overr;
            }

            if (!$menu) {
                $locations = get_theme_mod('nav_menu_locations');
                $menu = isset($locations['vetical-menu']) && $locations['vetical-menu'] ? $locations['vetical-menu'] : null;
            }

            if ($menu && $menu != '-1') {
                $show = $page_id ? get_post_meta($page_id, '_nasa_vertical_menu_allways_show', true) : false;
                $nasa_wrap = 'vertical-menu nasa-vertical-header';
                $nasa_class = $show ? ' nasa-allways-show' : '';
                $nasa_wrap .= $show ? ' nasa-allways-show-warp' : '';
                $nasa_wrap .= NASA_RTL ? ' nasa-menu-ver-align-right' : ' nasa-menu-ver-align-left';
                $nasa_wrap .= isset($nasa_opt['order_mobile_menus']) && $nasa_opt['order_mobile_menus'] == 'v-focus' ? ' nasa-focus-menu' : '';

                $mega = class_exists('Nasa_Nav_Menu');
                $walker = $mega ? new Nasa_Nav_Menu() : new Walker_Nav_Menu();
                $class = $mega ? '' : ' nasa-wp-simple-nav-menu';
                
                $depth = apply_filters('nasa_max_depth_vertical_menu', 3);
                
                ob_start();
                ?>
                <div class="<?php echo esc_attr($nasa_wrap); ?>">
                    <h5 class="section-title nasa-title-vertical-menu">
                        <?php echo esc_html__('Browse Categories', 'elessi-theme'); ?>
                    </h5>
                    <div class="vertical-menu-container<?php echo esc_attr($nasa_class); ?>">
                        <ul class="vertical-menu-wrapper<?php echo esc_attr($class); ?>">
                            <?php
                            wp_nav_menu(array(
                                'menu' => $menu,
                                'container' => false,
                                'items_wrap' => '%3$s',
                                'depth' => (int) $depth,
                                'walker' => $walker
                            ));
                            ?>
                        </ul>
                    </div>
                </div>
                <?php
                
                $nasa_vertical_menu = ob_get_clean();
                $GLOBALS['nasa_vertical_menu'] = $nasa_vertical_menu;
            }
        }
        
        echo $nasa_vertical_menu ? $nasa_vertical_menu : '';
    }
endif;

/**
 * Back URL by javascript
 */
if (!function_exists('elessi_back_to_page')) :
    function elessi_back_to_page() {
        echo '<a class="back-history" href="javascript: history.go(-1)">';
        echo esc_html__('Return to Previous Page', 'elessi-theme');
        echo '</a>';
    }
endif;

/**
 * Get breadcrumb
 */
if (!function_exists('elessi_get_breadcrumb')) :
    function elessi_get_breadcrumb() {
        if (!NASA_WOO_ACTIVED) {
            return;
        }

        global $wp_query, $post, $nasa_opt, $nasa_root_term_id;
        
        $enable = isset($nasa_opt['breadcrumb_show']) && !$nasa_opt['breadcrumb_show'] ? false : true;
        $is_product = is_product();
        $is_product_cat = is_product_category();
        $is_product_taxonomy = is_product_taxonomy();
        $is_shop = is_shop();
        
        $mobile = isset($nasa_opt['nasa_in_mobile']) && $nasa_opt['nasa_in_mobile'] ? true : false;
        
        $override = false;

        // Theme option
        $has_bg = isset($nasa_opt['breadcrumb_type']) && $nasa_opt['breadcrumb_type'] == 'has-background' ?
            true : false;

        $bg = isset($nasa_opt['breadcrumb_bg']) && trim($nasa_opt['breadcrumb_bg']) != '' ?
            $nasa_opt['breadcrumb_bg'] : false;

        $bg_cl = isset($nasa_opt['breadcrumb_bg_color']) && $nasa_opt['breadcrumb_bg_color'] ?
            $nasa_opt['breadcrumb_bg_color'] : false;

        // $bg_lax = isset($nasa_opt['breadcrumb_bg_lax']) && $nasa_opt['breadcrumb_bg_lax'] ?
        //    true : false;

        $h_bg = isset($nasa_opt['breadcrumb_height']) && (int) $nasa_opt['breadcrumb_height'] ?
            (int) $nasa_opt['breadcrumb_height'] : false;

        $txt_color = isset($nasa_opt['breadcrumb_color']) && $nasa_opt['breadcrumb_color'] ?
            $nasa_opt['breadcrumb_color'] : false;

        /*
         * Override breadcrumb BG
         */
        if ($is_shop || $is_product_cat || $is_product_taxonomy || $is_product) {
            $pageShop = wc_get_page_id('shop');

            if ($pageShop > 0) {
                $show_breadcrumb = get_post_meta($pageShop, '_nasa_show_breadcrumb', true);
                $enable = ($show_breadcrumb != 'on') ? false : true;
                if (!$enable) {
                    return;
                }
            }

            $term_id = false;

            /**
             * Check Single product
             */
            if ($is_product) {
                if (!$nasa_root_term_id) {
                    $product_cats = get_the_terms($wp_query->get_queried_object_id(), 'product_cat');
                    if ($product_cats) {
                        foreach ($product_cats as $cat) {
                            $term_id = $cat->term_id;
                            break;
                        }
                    }
                } else {
                    $term_id = $nasa_root_term_id;
                }
            }

            /**
             * Check Archive product
             */
            elseif ($is_product_cat) {
                $query_obj = get_queried_object();
                $term_id = isset($query_obj->term_id) ? $query_obj->term_id : false;
            }

            if ($term_id) {
                $bg_cat_enable = get_term_meta($term_id, 'cat_breadcrumb', true);

                if (!$bg_cat_enable) {
                    if ($nasa_root_term_id) {
                        $term_id = $nasa_root_term_id;
                    } else {
                        $ancestors = get_ancestors($term_id, 'product_cat');
                        $term_id = $ancestors ? end($ancestors) : 0;
                        $GLOBALS['nasa_root_term_id'] = $term_id;
                    }

                    if ($term_id) {
                        $bg_cat_enable = get_term_meta($term_id, 'cat_breadcrumb', true);
                    }
                }

                if ($bg_cat_enable && !$mobile) {
                    $bgImgId = get_term_meta($term_id, 'cat_breadcrumb_bg', true);
                    if ($bgImgId) {
                        $bg = wp_get_attachment_image_url($bgImgId, 'full');
                        $has_bg = true;
                    }

                    $text_color_cat = get_term_meta($term_id, 'cat_breadcrumb_text_color', true);
                    $txt_color = $text_color_cat != '' ? $text_color_cat : $txt_color;
                }
            }

            /**
             * Breadcrumb shop page
             */
            elseif ($is_shop && $pageShop > 0) {
                $queryObj = $pageShop;
                $override = true;
            }
        }

        else {
            $pageBlog = get_option('page_for_posts');
            /**
             * Check page
             */
            if (isset($post->ID) && $post->post_type == 'page') {
                $queryObj = $post->ID;
                $show_breadcrumb = get_post_meta($queryObj, '_nasa_show_breadcrumb', true);
                $enable = ($show_breadcrumb != 'on') ? false : true;
                $override = true;
            }

            /**
             * Check Blog | archive post | single post
             */
            elseif ($pageBlog && isset($post->post_type) && $post->post_type == 'post' && (is_category() || is_tag() || is_date() || is_home() || is_single())) {
                $show_breadcrumb = get_post_meta($pageBlog, '_nasa_show_breadcrumb', true);
                $enable = ($show_breadcrumb != 'on') ? false : true;
                $queryObj = $pageBlog;
                $override = true;
            }

            if (!$enable) {
                return;
            }
        }
        
        /**
         * Mobile Detect
         */
        if ($mobile) {
            $has_bg = false;
            // $parallax = false;
            $style_custom = $style_height = false;
            
            if (!$enable) {
                return;
            }
        }
        
        /**
         * For Desktop
         */
        else {
            // Override
            if ($override) {
                $type_bg = get_post_meta($queryObj, '_nasa_type_breadcrumb', true);
                $bg_override = get_post_meta($queryObj, '_nasa_bg_breadcrumb', true);
                $bg_cl_override = get_post_meta($queryObj, '_nasa_bg_color_breadcrumb', true);
                $h_override = get_post_meta($queryObj, '_nasa_height_breadcrumb', true);
                $color_override = get_post_meta($queryObj, '_nasa_color_breadcrumb', true);

                if ($type_bg == '1') {
                    $bg = $bg_override ? $bg_override : $bg;
                }

                $bg_cl = $bg_cl_override ? $bg_cl_override : $bg_cl;
                $txt_color = $color_override ? $color_override : $txt_color;
                $h_bg = (int) $h_override ? (int) $h_override : $h_bg;
            }

            // set style by option breadcrumb
            $style_custom = '';
            if ($has_bg && $bg) {
                $style_custom .= 'background:url(' . esc_url($bg) . '); background-size:cover;';
                // $style_custom .= $bg_lax ? ' center center repeat-y;' : ';background-size:cover;';
            }
            
            $style_custom .= $bg_cl ? 'background-color:' . $bg_cl . ';' : '';
            $style_custom .= $txt_color ? 'color:' . $txt_color . ';' : '';
            $style_height = $h_bg ? 'height:' . $h_bg . 'px;' : 'height:auto;';
        }
        
        $defaults = apply_filters('nasa_breadcrumb_args', array(
            'delimiter' => '<span class="fa fa-angle-right"></span>',
            'wrap_before' => '<span class="breadcrumb">',
            'wrap_after' => '</span>',
            'before' => '',
            'after' => '',
            'home' => esc_html__('Home', 'elessi-theme'),
        ));
        
        // $parallax = ($has_bg && $bg && $bg_lax) ? true : false;
        $bread_align = !isset($nasa_opt['breadcrumb_align']) ? 'text-center' : $nasa_opt['breadcrumb_align'];
        $args = wp_parse_args($defaults);
        
        $wc_breadcrumbs = new WC_Breadcrumb();

        if (!empty($args['home'])) {
            $wc_breadcrumbs->add_crumb(
                $args['home'],
                apply_filters('woocommerce_breadcrumb_home_url', home_url('/'))
            );
        }
        $args['breadcrumb'] = $wc_breadcrumbs->generate();
        do_action('woocommerce_breadcrumb', $wc_breadcrumbs, $args);
        
        $class_all = array('bread nasa-breadcrumb');
        $attr_all = array('id="nasa-breadcrumb-site"');
        if ($has_bg) {
            $class_all[] = 'nasa-breadcrumb-has-bg';
        }
        
        // if ($parallax) {
        //    $class_all[] = 'nasa-parallax nasa-parallax-stellar';
        //    $attr_all[] = 'data-stellar-background-ratio="0.6"';
            
            /**
             * Parallax
             */
        //    wp_enqueue_script('jquery-stellar', ELESSI_THEME_URI . '/assets/js/min/jquery.stellar.min.js', array('jquery'), null, true);
        // }
        
        if ($style_custom) {
            $attr_all[] = 'style="' . esc_attr($style_custom) . '"';
        }
        
        $class_all_string = !empty($class_all) ? implode(' ', $class_all) : '';
        if ($class_all_string) {
            $attr_all[] = 'class="' . esc_attr($class_all_string) . '"';
        }
        
        $attr_all_string = !empty($attr_all) ? ' ' . implode(' ', $attr_all) : '';
        
        ?>
        <div<?php echo $attr_all_string; ?>>
            <div class="row">
                <div class="large-12 columns nasa-display-table">
                    <nav class="breadcrumb-row <?php echo esc_attr($bread_align); ?>"<?php echo $style_height ? ' style="' . esc_attr($style_height).'"' : ''; ?>>
                        <?php wc_get_template('global/breadcrumb.php', $args); ?>
                    </nav>
                </div>
            </div>
        </div>

        <?php
    }
endif;

/**
 * Build breadcrumb Portfolio
 */
if (!function_exists('elessi_rebuilt_breadcrumb_portfolio')) :
    function elessi_rebuilt_breadcrumb_portfolio($orgBreadcrumb, $single = true) {
        global $nasa_opt, $post;
        
        $breadcrumb = array($orgBreadcrumb[0]);
        
        $portfolio = null;
        if (isset($nasa_opt['nasa-page-view-portfolio']) && (int) $nasa_opt['nasa-page-view-portfolio']) {
            $portfolio = get_post((int) $nasa_opt['nasa-page-view-portfolio']);
        } else {
            $pages = get_pages(array(
                'meta_key' => '_wp_page_template',
                'meta_value' => 'portfolio.php'
            ));

            if ($pages) {
                foreach ($pages as $page) {
                    $portfolio = get_post((int) $page->ID);
                    break;
                }
            }
        }

        if ($portfolio) {
            $breadcrumb[] = array(
                0 => $portfolio->post_title,
                1 => get_permalink($portfolio)
            );
        }

        $terms = wp_get_post_terms(
            $post->ID,
            'portfolio_category',
            array(
                'orderby' => 'parent',
                'order' => 'DESC'
            )
        );

        if ($terms) {
            $main_term = $terms[0];
            $ancestors = get_ancestors($main_term->term_id, 'portfolio_category');
            $ancestors = array_reverse($ancestors);
            if (count($ancestors)) {
                foreach ($ancestors as $ancestor) {
                    $ancestor = get_term($ancestor, 'portfolio_category');

                    if ($ancestor) {
                        $breadcrumb[] = array(
                            0 => $ancestor->name,
                            1 => get_term_link($ancestor, 'portfolio_category')
                        );
                    }
                }
            }

            if ($single) {
                $breadcrumb[] = array(
                    0 => $main_term->name,
                    1 => get_term_link($main_term, 'portfolio_category')
                );
            }
        }

        return $breadcrumb;
    }
endif;

/**
 * Add body class
 */
add_filter('body_class', 'elessi_body_classes');
if (!function_exists('elessi_body_classes')) :
    function elessi_body_classes($classes) {
        global $nasa_opt;

        $classes[] = 'antialiased';
        if (is_multi_author()) {
            $classes[] = 'group-blog';
        }

        if (isset($nasa_opt['site_layout']) && $nasa_opt['site_layout'] == 'boxed') {
            $classes[] = 'boxed';
        }

        if (isset($nasa_opt['promo_popup']) && $nasa_opt['promo_popup'] == 1) {
            $classes[] = 'open-popup';
        }

        if (NASA_WOO_ACTIVED) {
            if (!in_array('nasa-woo-actived', $classes)) {
                $classes[] = 'nasa-woo-actived';
            }
            
            if (function_exists('is_product') && is_product()) {
                if (isset($nasa_opt['product-zoom']) && $nasa_opt['product-zoom']) {
                    $classes[] = 'product-zoom';
                }

                if (isset($nasa_opt['product-image-lightbox']) && !$nasa_opt['product-image-lightbox']) {
                    $classes[] = 'nasa-disable-lightbox-image';
                }
            }
            
            if (!isset($nasa_opt['disable-quickview']) || !$nasa_opt['disable-quickview']) {
                $classes[] = 'nasa-quickview-on';
            }
            
            if (isset($nasa_opt['enable_focus_main_image']) && $nasa_opt['enable_focus_main_image'] == 1) {
                $classes[] = 'nasa-focus-main-image';
            }
        }
        
        if (isset($nasa_opt['nasa_in_mobile']) && $nasa_opt['nasa_in_mobile']) {
            $classes[] = 'nasa-in-mobile';
        }
        
        if (isset($nasa_opt['toggle_widgets']) && !$nasa_opt['toggle_widgets']) {
            $classes[] = 'nasa-disable-toggle-widgets';
        }
        
        if ((!isset($nasa_opt['disable_wow']) || !$nasa_opt['disable_wow'])) {
            $classes[] = 'nasa-enable-wow';
        }
        
        if (NASA_RTL) {
            $classes[] = 'nasa-rtl';
        }

        return $classes;
    }
endif;

/**
 * Add hr to the widget title
 */
if (!function_exists('elessi_widget_title')) :
    function elessi_widget_title($title) {
        return !empty($title) ? $title . '<span class="nasa-hr small primary-color"></span>' : '';
    }
endif;

/**
 * Comments
 */ 
if (!function_exists('elessi_comment')) :
    function elessi_comment($comment, $args, $depth) {
        $GLOBALS['comment'] = $comment;
        
        switch ($comment->comment_type) :
            case 'pingback' :
            case 'trackback' : ?>
                <li class="post pingback">
                    <p><?php esc_html_e('Pingback:', 'elessi-theme'); ?> <?php comment_author_link(); ?><?php edit_comment_link(esc_html__('Edit', 'elessi-theme'), '<span class="edit-link">', '<span>'); ?></p>
                <?php
                break;
            default : ?>
                <li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">
                    <article id="comment-<?php comment_ID(); ?>" class="comment-inner">
                        <div class="comment-author left padding-right-15 rtl-right rtl-padding-right-0 rtl-padding-left-15">
                            <?php echo get_avatar($comment, 80); ?>
                        </div>
                        
                        <div class="comment-info">
                            <?php printf('<cite class="fn">%s</cite>', get_comment_author_link()); ?>
                            <div class="comment-meta">
                                <i class="fa fa-clock-o"></i>
                                <time datetime="<?php comment_time('c'); ?>">
                                    <?php printf(_x('%1$s at %2$s', '1: date, 2: time', 'elessi-theme'), get_comment_date(), get_comment_time()); ?>
                                </time>
                                <?php edit_comment_link(esc_html__('Edit', 'elessi-theme'), '<span class="edit-link">', '<span>'); ?>
                            </div>
                            
                            <div class="reply">
                                <?php
                                comment_reply_link(array_merge($args, array(
                                    'depth' => $depth,
                                    'max_depth' => $args['max_depth'],
                                )));
                                ?>
                            </div>
                            
                            <?php if ($comment->comment_approved == '0') : ?>
                                <em>
                                    <?php esc_html_e('Your comment is awaiting moderation.', 'elessi-theme'); ?>
                                </em><br />
                            <?php endif; ?>

                            <div class="comment-content">
                                <?php comment_text(); ?>
                            </div>
                        </div>
                    </article>
                <?php
                break;
        endswitch;
    }
endif;

/**
 * Post meta top
 */  
if (!function_exists('elessi_posted_on')) :
    function elessi_posted_on() {
        $allowed_html = array(
            'span' => array('class' => array()),
            'strong' => array(),
            'a' => array('class' => array(), 'href' => array(), 'title' => array(), 'rel' => array()),
            'time' => array('class' => array(), 'datetime' => array())
        );
        
        $day = get_the_date('d');
        $month = get_the_date('m');
        $year = get_the_date('Y');
        $author = get_the_author();
        printf(
            wp_kses(
                __('<span class="meta-author">By <a class="url fn n nasa-bold" href="%5$s" title="%6$s" rel="author">%7$s</a>.</span> Posted on <a href="%1$s" title="%2$s" rel="bookmark"><time class="entry-date nasa-bold" datetime="%3$s">%4$s</time></a>', 'elessi-theme'), $allowed_html
            ),
            esc_url(get_day_link($year, $month, $day)),
            esc_attr(get_the_time()),
            esc_attr(get_the_date('c')),
            esc_html(get_the_date()),
            esc_url(get_author_posts_url(get_the_author_meta('ID'))),
            esc_attr(
                sprintf(
                    esc_html__('View all posts by %s', 'elessi-theme'),
                    $author
                )
            ),
            $author
        );
    }
endif;

/**
 * Promo Popup
 */
add_action('wp_footer', 'elessi_promo_popup');
if (!function_exists('elessi_promo_popup')) :
    function elessi_promo_popup() {
        global $nasa_opt;
        if (!isset($nasa_opt['promo_popup']) || !$nasa_opt['promo_popup']) {
            return;
        }
        
        $popup_closed = isset($_COOKIE['nasa_popup_closed']) ? $_COOKIE['nasa_popup_closed'] : '';
        if ($popup_closed === 'do-not-show') {
            return;
        }
        
        $inMobile = isset($nasa_opt['nasa_in_mobile']) && $nasa_opt['nasa_in_mobile'] ? true : false;
        
        // Disable popup on mobile
        $disableMobile = (isset($nasa_opt['disable_popup_mobile']) && (int) $nasa_opt['disable_popup_mobile']) ? 'true' : 'false';
        if ($disableMobile === 'true' && $inMobile) {
            return;
        }
        
        $one_time = isset($nasa_opt['promo_popup_1_time']) && $nasa_opt['promo_popup_1_time'] ? '1' : '0';
        
        $delay = (!isset($nasa_opt['delay_promo_popup']) || (int) $nasa_opt['delay_promo_popup'] <= 0) ? 0 : (int) $nasa_opt['delay_promo_popup'];
        
        echo '<a class="nasa-popup open-click popup_link hidden-tag" href="#nasa-popup" data-delay="' . esc_attr($delay) . '" data-disable_mobile="' . esc_attr($disableMobile) . '" data-one_time="' . esc_attr($one_time) . '">' . esc_html__('Newsletter', 'elessi-theme') . '</a>';
        
        $file = ELESSI_CHILD_PATH . '/includes/nasa-promo-popup.php';
        include is_file($file) ? $file : ELESSI_THEME_PATH . '/includes/nasa-promo-popup.php';
    }
endif;

/**
 * Add parent class to menu item
 */
add_filter('wp_nav_menu_objects', 'elessi_add_menu_parent_class');
if (!function_exists('elessi_add_menu_parent_class')) :
    function elessi_add_menu_parent_class($items) {
        $parents = array();
        foreach ($items as $item) {
            if ($item->menu_item_parent && $item->menu_item_parent > 0) {
                $parents[] = $item->menu_item_parent;
            }
        }

        foreach ($items as $item) {
            if (in_array($item->ID, $parents)) {
                $item->classes[] = 'menu-parent-item';
            }
        }

        return $items;
    }
endif;

/**
 * Multi Languages Flags + Multi Currencies
 */
add_action('nasa_topbar_menu', 'elessi_multi_languages', 10);
add_action('nasa_mobile_topbar_menu', 'elessi_multi_languages', 10);
if (!function_exists('elessi_multi_languages')) :
    function elessi_multi_languages() {
        global $nasa_opt;

        $outputHtml = '';
        
        /**
         * Multi Languages
         */
        if (isset($nasa_opt['switch_lang']) && $nasa_opt['switch_lang']) {
            $language_output = '<li class="nasa-select-languages left rtl-right desktop-margin-right-30 rtl-desktop-margin-right-0 rtl-desktop-margin-left-30 menu-item-has-children root-item li_accordion">';
            $mainLang = '';
            $selectLang = '<ul class="nasa-list-languages sub-menu">';

            if (function_exists('icl_get_languages')) {
                $current = defined('ICL_LANGUAGE_CODE') ? ICL_LANGUAGE_CODE : get_option('WPLANG');

                $languages = icl_get_languages('skip_missing=0&orderby=code');
                if (!empty($languages)) {
                    foreach ($languages as $lang) {
                        /**
                         * Current Language
                         */
                        if ($current == $lang['language_code']) {
                            $mainLang .= '<a href="javascript:void(0);" class="nasa-current-lang">';

                            if (isset($lang['country_flag_url'])) {
                                $mainLang .= '<img src="' . esc_url($lang['country_flag_url']) . '" alt="' . esc_attr($lang['native_name']) . '" width="18" height="12" />';
                            }

                            $mainLang .= $lang['native_name'];
                            $mainLang .= '</a>';
                        }

                        /**
                         * Select Languages
                         */
                        else {
                            $selectLang .= '<li class="nasa-item-lang"><a href="' . esc_url($lang['url']) . '" title="' . esc_attr($lang['native_name']) . '">';

                            if (isset($lang['country_flag_url'])) {
                                $selectLang .= '<img src="' . esc_url($lang['country_flag_url']) . '" alt="' . esc_attr($lang['native_name']) . '" width="18" height="12" />';
                            }

                            $selectLang .= $lang['native_name'];
                            $selectLang .= '</a></li>';
                        }
                    }
                }
            }

            /**
             * have not installs WPML
             */
            else {
                $mainLang .= '<a href="javascript:void(0);" class="nasa-current-lang" title="' . esc_attr__('English', 'elessi-theme') . '">';
                $mainLang .= '<img src="' . esc_url(ELESSI_THEME_URI . '/assets/images/en.png') . '" alt="' . esc_attr__('English', 'elessi-theme') . '" width="18" height="12" />';
                $mainLang .= esc_html__('English', 'elessi-theme');
                $mainLang .= '</a>';

                /**
                 * Select Languages
                 */
                // Deutsch
                $selectLang .= '<li class="nasa-item-lang"><a href="#" title="' . esc_attr__('Deutsch', 'elessi-theme') . '">';
                $selectLang .= '<img src="' . esc_url(ELESSI_THEME_URI . '/assets/images/de.png') . '" alt="' . esc_attr__('Deutsch', 'elessi-theme') . '" width="18" height="12" />';

                $selectLang .= esc_html__('Deutsch', 'elessi-theme');
                $selectLang .= '</a></li>';

                // Français
                $selectLang .= '<li class="nasa-item-lang"><a href="#" title="' . esc_attr__('Français', 'elessi-theme') . '">';
                $selectLang .= '<img src="' . esc_url(ELESSI_THEME_URI . '/assets/images/fr.png') . '" alt="' . esc_attr__('Français', 'elessi-theme') . '" width="18" height="12" />';

                $selectLang .= esc_html__('Français', 'elessi-theme');
                $selectLang .= '</a></li>';
                
                // Requires WPML
                $selectLang .= '<li class="nasa-item-lang"><a href="#" title="' . esc_attr__('Requires WPML', 'elessi-theme') . '">';
                $selectLang .= esc_html__('&nbsp;Requires WPML', 'elessi-theme');
                $selectLang .= '</a></li>';
            }

            $selectLang .= '</ul>';

            $language_output .= $mainLang . $selectLang . '</li>';
            
            $outputHtml .= $language_output;
        }
        
        /**
         * Multi Currencies
         */
        if (isset($nasa_opt['switch_currency']) && $nasa_opt['switch_currency']) {
            $format = (!isset($nasa_opt['switch_currency_format']) || trim($nasa_opt['switch_currency_format']) === '') ? '(%symbol%) %code%' : $nasa_opt['switch_currency_format'];
            
            $currency_output = '';
            
            /**
             * WPML + WooCommerce Multilingual
             */
            if (shortcode_exists('currency_switcher')) {
                $currency_output .= do_shortcode('[currency_switcher switcher_style="wcml-dropdown" format="' . esc_attr($format) . '"]');
            }
            
            /**
             * For Demo
             */
            else {
                $currency_output .=
                '<div class="wcml-dropdown product wcml_currency_switcher">' .
                    '<ul>' .
                        '<li class="wcml-cs-active-currency">' .
                            '<a href="#" class="wcml-cs-item-toggle" title="Requires package of WPML">US Dollar</a>' .
                            '<ul class="wcml-cs-submenu">' .
                                '<li><a href="#">Euro (EUR)</a></li>' .
                                '<li><a href="#">Indian Rupee (INR)</a></li>' .
                                '<li><a href="#">Requires WPML</a></li>' .
                            '</ul>' .
                        '</li>' .
                    '</ul>' .
                '</div>';
            }
            
            $outputHtml .= trim($currency_output) ? '<li class="nasa-select-currencies left rtl-right desktop-margin-right-30 rtl-desktop-margin-right-0 rtl-desktop-margin-left-30">' . $currency_output . '</li>' : '';
        }

        echo $outputHtml ? '<ul class="header-multi-languages left rtl-right">' . $outputHtml . '</ul>' : '';
    }
endif;

/**
 * Cut string limit
 */
if (!function_exists('elessi_limit_words')) :
    function elessi_limit_words($string, $word_limit) {
        $words = explode(' ', $string, ($word_limit + 1));
        if (count($words) <= $word_limit) {
            return $string;
        }
        array_pop($words);
        return implode(' ', $words) . ' ...';
    }
endif;

/**
 * Blog post navigation
 */
if (!function_exists('elessi_content_nav')) :
    function elessi_content_nav($nav_id) {
        global $wp_query, $post;
        
        $allowed_html = array(
            'span' => array('class' => array())
        );
        
        $is_single = is_single();

        if ($is_single) {
            $previous = (is_attachment()) ? get_post($post->post_parent) : get_adjacent_post(false, '', true);
            $next = get_adjacent_post(false, '', false);

            if (!$next && !$previous) {
                return;
            }
        }

        if ($wp_query->max_num_pages < 2 && (is_home() || is_archive() || is_search())) {
            return;
        }

        $nav_class = $is_single ? 'navigation-post' : 'navigation-paging';
        ?>
        <nav role="navigation" id="<?php echo esc_attr($nav_id); ?>" class="<?php echo esc_attr($nav_class); ?>">
            <?php
            if ($is_single) {
                previous_post_link('<div class="nav-previous left">%link</div>', '<span class="fa fa-caret-left">' . _x('', 'Previous post link', 'elessi-theme') . '</span> %title');
                next_post_link('<div class="nav-next right">%link</div>', '%title <span class="fa fa-caret-right">' . _x('', 'Next post link', 'elessi-theme') . '</span>');
            } elseif ($wp_query->max_num_pages > 1 && (is_home() || is_archive() || is_search())) {
                // navigation links for home, archive, and search pages
                if (get_next_posts_link()) {
                    ?>
                    <div class="nav-previous"><?php next_posts_link(wp_kses(__('Next <span class="fa fa-caret-right"></span>', 'elessi-theme'), $allowed_html)); ?></div>
                    <?php
                }
                if (get_previous_posts_link()) {
                    ?>
                    <div class="nav-next"><?php previous_posts_link(wp_kses(__('<span class="fa fa-caret-left"></span> Previous', 'elessi-theme'), $allowed_html)); ?></div>
                    <?php
                }
            }
            ?>
        </nav>
        <?php
    }
endif;

/**
 * Get relates post
 */
add_action('nasa_after_single_post', 'elessi_relate_post');
if (!function_exists('elessi_relate_post')) :
    function elessi_relate_post() {
        global $nasa_opt, $post;
        
        if (isset($nasa_opt['relate_blogs']) && !$nasa_opt['relate_blogs']) {
            return;
        }
        
        $numberPost = isset($nasa_opt['relate_blogs_number']) && (int) $nasa_opt['relate_blogs_number'] ? (int) $nasa_opt['relate_blogs_number'] : 10;
        
        $relate = get_posts(
            array(
                'post_status' => 'publish',
                'post_type' => 'post',
                'category__in' => wp_get_post_categories($post->ID),
                'numberposts' => $numberPost,
                'post__not_in' => array($post->ID),
                'orderby' => 'date',
                'order' => 'DESC'
            )
        );
        
        $columns_number_small = isset($nasa_opt['relate_blogs_columns_small']) && (int) $nasa_opt['relate_blogs_columns_small'] ? (int) $nasa_opt['relate_blogs_columns_small'] : 1;
        $columns_number_tablet = isset($nasa_opt['relate_blogs_columns_tablet']) && (int) $nasa_opt['relate_blogs_columns_tablet'] ? (int) $nasa_opt['relate_blogs_columns_tablet'] : 2;
        $columns_number = isset($nasa_opt['relate_blogs_columns_desk']) && (int) $nasa_opt['relate_blogs_columns_desk'] ? (int) $nasa_opt['relate_blogs_columns_desk'] : 3;
        
        $file = ELESSI_CHILD_PATH . '/includes/nasa-blog-relate.php';
        include is_file($file) ? $file : ELESSI_THEME_PATH . '/includes/nasa-blog-relate.php';
    }
endif;

/**
 * Add shortcode Top bar Promotion news
 */
if (!function_exists('elessi_promotion_recent_post')):
    function elessi_promotion_recent_post() {
        global $nasa_opt;

        if (isset($nasa_opt['enable_post_top']) && !$nasa_opt['enable_post_top']) {
            return '';
        }

        $content = '';
        $posts = null;

        if (!isset($nasa_opt['type_display']) || $nasa_opt['type_display'] == 'custom') {
            $content = isset($nasa_opt['content_custom']) ? $nasa_opt['content_custom'] : '';
        }
        else {
            if (!isset($nasa_opt['category_post']) || !$nasa_opt['category_post']) {
                $nasa_opt['category_post'] = null;
            }

            if (!isset($nasa_opt['number_post']) || !$nasa_opt['number_post']) {
                $nasa_opt['number_post'] = 4;
            }

            $args = array(
                'post_status' => 'publish',
                'post_type' => 'post',
                'orderby' => 'date',
                'order' => 'DESC',
                'category' => ((int) $nasa_opt['category_post'] != 0) ? (int) $nasa_opt['category_post'] : null,
                'posts_per_page' => $nasa_opt['number_post']
            );

            $posts = get_posts($args);
        }

        $file = ELESSI_CHILD_PATH . '/includes/nasa-blog-promotion.php';
        include is_file($file) ? $file : ELESSI_THEME_PATH . '/includes/nasa-blog-promotion.php';
    }
endif;

/**
 * Before load effect site
 */
add_action('nasa_theme_before_load', 'elessi_theme_before_load');
if (!function_exists('elessi_theme_before_load')):
    function elessi_theme_before_load() {
        global $nasa_opt;

        if (!isset($nasa_opt['effect_before_load']) || $nasa_opt['effect_before_load'] == 1) {
            echo 
            '<div id="nasa-before-load">' .
                '<div class="nasa-loader"></div>' .
            '</div>';
        }
    }
endif;

/**
 * Compatible with Plugin Nextend Social Login
 */
add_action('woocommerce_login_form_end', 'elessi_social_login');
if (!function_exists('elessi_social_login')) :
    function elessi_social_login() {
        if (shortcode_exists('nextend_social_login') && !NASA_CORE_USER_LOGGED) :
            echo '<div class="nasa-social-login-title"><h5>' . esc_html__('OR LOGIN WITH', 'elessi-theme') . '</h5></div>';
            echo '<div class="form-row row-submit-login-social text-center">';
            echo do_shortcode('[nextend_social_login]');
            echo '</div>';
        endif;
    }
endif;

/**
 * Prev | Next Post in single post
 */
add_action('nasa_after_content_single_post', 'elessi_prev_next_post', 10, 1);
if (!function_exists('elessi_prev_next_post')) :
    function elessi_prev_next_post() {
        $prevPost = get_previous_post(true);
        $nextPost = get_next_post(true);
        
        $hasPrevPost = is_a($prevPost, 'WP_Post');
        $hasNextPost = is_a($nextPost, 'WP_Post');
        
        if (!$hasPrevPost && !$hasNextPost) {
            return;
        }
        
        $html = '<div class="nasa-post-navigation">';
        
        $html .= '<div class="nasa-post-prev nasa-post-navigation-item">';
        if ($hasPrevPost) {
            $title = get_the_title($prevPost->ID);
            $link = get_the_permalink($prevPost->ID);
            $html .= '<a href="' . esc_url($link) . '" title="' . esc_attr($title) .'">';
            $html .= '<span class="nasa-post-label">' . esc_html__('PREVIOUS', 'elessi-theme') . '</span>';
            $html .= '<span class="nasa-post-title hide-for-mobile">' . $title . '</span>';
            $html .= '</a>';
        }
        $html .= '</div>';
        
        $archiveLink = get_permalink(get_option('page_for_posts'));
        $archiveLink = $archiveLink ? $archiveLink : home_url('/');
        $html .= '<div class="nasa-post-archive nasa-post-navigation-item">';
        $html .= '<a href="' . esc_url($archiveLink) . '" title="' . esc_attr__('Back to Blog', 'elessi-theme') .'">';
        $html .= '<span class="nasa-icon icon-nasa-icons-19"></span>';
        $html .= '</a>';
        $html .= '</div>';
        
        $html .= '<div class="nasa-post-next nasa-post-navigation-item">';
        if ($hasNextPost) {
            $title = get_the_title($nextPost->ID);
            $link = get_the_permalink($nextPost->ID);
            $html .= '<a href="' . esc_url($link) . '" title="' . esc_attr($title) .'">';
            $html .= '<span class="nasa-post-label">' . esc_html__('NEXT', 'elessi-theme') . '</span>';
            $html .= '<span class="nasa-post-title hide-for-mobile">' . $title . '</span>';
            $html .= '</a>';
        }
        $html .= '</div>';
        
        $html .= '</div>';
        
        echo $html;
    }
endif;

/**
 * Get contact form 7 Newsletter
 */
if (!function_exists('elessi_get_newsletter_form')) :
    function elessi_get_newsletter_form($id) {
        if (!shortcode_exists('contact-form-7') || !$id) {
            return '';
        }
        
        /**
         * Filter id with multi languages
         */
        $lang_id = false;
        if (function_exists('icl_object_id') && class_exists('WPCF7_ContactForm')) {
            $lang_id = icl_object_id($id, WPCF7_ContactForm::post_type, true);
        }
        
        $contact_id = $lang_id ? $lang_id : $id;
        
        return do_shortcode('[contact-form-7 id="' . esc_attr($contact_id) . '"]');
    }
endif;

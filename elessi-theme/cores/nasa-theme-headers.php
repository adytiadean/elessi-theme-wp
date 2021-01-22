<?php
/**
 * Mobile header
 * 
 * It is not Mobile layout - only responsive
 */
if (!function_exists('elessi_mobile_header')) :
    function elessi_mobile_header() {
        global $nasa_opt;
        ?>
        <div class="mobile-menu">
            <table>
                <tr>
                    <td class="nasa-td-20 mini-icon-mobile">
                        <a href="javascript:void(0);" class="nasa-icon nasa-mobile-menu_toggle mobile_toggle nasa-mobile-menu-icon pe-7s-menu"></a>
                        <a class="nasa-icon icon pe-7s-search mobile-search" href="javascript:void(0);"></a>
                    </td>

                    <td class="logo-wrapper">
                        <?php echo elessi_logo(); ?>
                    </td>

                    <td class="nasa-td-20 nasa-td-mobile-icons">
                        <?php
                        $show_icons = isset($nasa_opt['topbar_mobile_icons_toggle']) && $nasa_opt['topbar_mobile_icons_toggle'] ? false : true;
                        $class_icons_wrap = '';
                        $toggle_icon = '';

                        if (!$show_icons) :
                            $class_icons_wrap .= ' nasa-absolute-icons nasa-hide-icons';
                            $toggle_icon .= '<a class="nasa-toggle-mobile_icons" href="javascript:void(0);"><span class="nasa-icon"></span></a>';
                        endif;

                        echo '<div class="nasa-mobile-icons-wrap' . $class_icons_wrap . '">';
                        echo $toggle_icon;
                        echo elessi_header_icons(true, true, true, true, false);
                        echo '</div>';
                        ?>
                    </td>
                </tr>
            </table>
        </div>
        <?php
    }
endif;

/**
 * Add Block header
 */
if (!function_exists('elessi_block_header')):
    function elessi_block_header() {
        global $nasa_opt, $wp_query;
        
        $object = $wp_query->get_queried_object();
        $pageOption = isset($object->post_type) && $object->post_type == 'page' ? true : false;
        $objectId = $pageOption ? $object->ID : 0;

        $custom_header = $objectId ? get_post_meta($objectId, '_nasa_custom_header', true) : '';
        
        if (!isset($nasa_opt['header-block'])) {
            $nasa_opt['header-block'] = 'default';
        }
        
        $header_block = ($custom_header !== '' && $objectId) ? get_post_meta($objectId, '_nasa_header_block', true) : $nasa_opt['header-block'];

        if ($header_block == '-1' || $header_block == 'default') {
            return;
        }
        
        $header_block = $header_block == '' ? ($nasa_opt['header-block'] != 'default' ? $nasa_opt['header-block'] : false) : $header_block;
        $header_block = $header_block ? $header_block : false;
        
        echo $header_block ? elessi_get_block($header_block) : '';
    }
endif;

/**
 * Add action header
 */
add_action('init', 'elessi_add_action_header');
if (!function_exists('elessi_add_action_header')):
    function elessi_add_action_header() {
        /* INIT Header site */
        add_action('nasa_get_header_theme', 'elessi_get_header_theme', 10);
        
        /* Header Promotion */
        add_action('nasa_before_header_structure', 'elessi_promotion_recent_post', 1);
        
        /* Header Default */
        add_action('nasa_header_structure', 'elessi_get_header_structure', 10);
        add_action('nasa_header_structure', 'elessi_block_header', 100);
        
        /* Breadcrumb site */
        add_action('nasa_after_header_structure', 'elessi_get_breadcrumb', 999);
        
        /* Topbar */
        add_action('nasa_topbar_header', 'elessi_header_topbar');
        
        /* Topbar Mobile */
        add_action('nasa_topbar_header_mobile', 'elessi_header_topbar_mobile');
        
        /* Mobile - responsite */
        add_action('nasa_mobile_header', 'elessi_mobile_header');
    }
endif;

/**
 * Add custom meta to head tag
 */
if (!is_home()) :
    add_action('wp_head', 'elessi_share_meta_head');
    if (!function_exists('elessi_share_meta_head')):
        function elessi_share_meta_head() {
            global $post;
            ?>
            <meta property="og:title" content="<?php the_title(); ?>" />
            <?php if (isset($post->ID)) : ?>
                <?php if (has_post_thumbnail($post->ID)) :
                    $image = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'single-post-thumbnail'); ?>
                    <meta property="og:image" content="<?php echo esc_url($image[0]); ?>" />
                <?php endif; ?>
            <?php endif; ?>
            <meta property="og:url" content="<?php the_permalink(); ?>" />
            <?php
        }
    endif;
endif;

/**
 * Header main
 */
if (!function_exists('elessi_get_header_theme')) :
    function elessi_get_header_theme() {
        global $nasa_opt;
        
        $file = ELESSI_CHILD_PATH . '/headers/header-main.php';
        include_once is_file($file) ? $file : ELESSI_THEME_PATH . '/headers/header-main.php';
    }
endif;

/**
 * Get header structure
 */
if (!function_exists('elessi_get_header_structure')):
    function elessi_get_header_structure() {
        global $nasa_opt, $wp_query;

        $hstructure = isset($nasa_opt['header-type']) ? $nasa_opt['header-type'] : '1';
        $page_id = false;
        $header_override = false;
        $header_slug = isset($nasa_opt['header-custom']) && $nasa_opt['header-custom'] != 'default' ? $nasa_opt['header-custom'] : false;
        $header_slug_ovrride = false;
        $fixed_nav_header = '';
        
        $root_term_id = elessi_get_root_term_id();
        /*
         * Override Header
         */
        $is_shop = $pageShop = $is_product_taxonomy = $is_product = false;
        if (NASA_WOO_ACTIVED) {
            $is_shop = is_shop();
            $is_product = is_product();
            $is_product_taxonomy = is_product_taxonomy();
            $pageShop = wc_get_page_id('shop');
        }
        
        if (!$root_term_id) {
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
             * Swith header structure
             */
            if ($page_id) {
                $custom_header = get_post_meta($page_id, '_nasa_custom_header', true);
                if (!empty($custom_header)) {
                    $hstructure = $custom_header;
                    
                    $header_slug_ovrride = get_post_meta($page_id, '_nasa_header_builder', true);
                }

                $fixed_nav_header = get_post_meta($page_id, '_nasa_fixed_nav', true);
                $fixed_nav_header = $fixed_nav_header == '-1' ? false : $fixed_nav_header;
            }
        }
        
        else {
            $header_override = get_term_meta($root_term_id, 'cat_header_type', true);
            
            if ($header_override == 'nasa-custom') {
                $hstructure = $header_override;
                $header_slug_ovrride = get_term_meta($root_term_id, '_nasa_header_builder', true);
            } else {
                $hstructure = $header_override ? $header_override : $hstructure;
            }
        }
        
        /**
         * Apply to override header structure
         */
        $hstructure = apply_filters('nasa_header_structure_type', $hstructure);
        
        if ($fixed_nav_header === '') {
            $fixed_nav_header = (!isset($nasa_opt['fixed_nav']) || $nasa_opt['fixed_nav']);
        }
        
        /**
         * Apply to fixed header
         */
        $fixed_nav = apply_filters('nasa_header_sticky', $fixed_nav_header);
        
        /**
         * Header builder
         */
        if ($hstructure == 'nasa-custom') {
            remove_action('nasa_header_structure', 'elessi_block_header', 100);
            
            $header_slug = $header_slug_ovrride ? $header_slug_ovrride : $header_slug;
            if ($header_slug) {
                elessi_header_builder($header_slug);
            }
            
            return;
        }
        
        $header_classes = array();
        
        /**
         * Transparent header
         */
        $header_transparent = $page_id ? get_post_meta($page_id, '_nasa_header_transparent', true) : '';
        $header_transparent = $header_transparent == '-1' ? '0' : $header_transparent;
        $header_transparent = $header_transparent == '' ? ((!isset($nasa_opt['header_transparent']) || !$nasa_opt['header_transparent']) ? false : true) : (bool) $header_transparent;
        if ($header_transparent) {
            $header_classes[] = 'nasa-header-transparent';
        }
        
        /**
         * Mobile Detect
         */
        if (isset($nasa_opt['nasa_in_mobile']) && $nasa_opt['nasa_in_mobile']) {
            $header_classes[] = 'nasa-header-mobile-layout';
            if ($fixed_nav) {
                $header_classes[] = 'nasa-header-sticky';
            }
            
            $vertical = in_array($hstructure, array(4)) ? true : false;
            $header_classes = !empty($header_classes) ? implode(' ', $header_classes) : '';
            $header_classes = apply_filters('nasa_header_classes', $header_classes);
            
            $file = ELESSI_CHILD_PATH . '/headers/header-mobile.php';
            include is_file($file) ? $file : ELESSI_THEME_PATH . '/headers/header-mobile.php';
            
            return;
        }
        
        /**
         * Init vars
         */
        $menu_warp_class = array();
        $header_classes[] = 'header-wrapper header-type-' . $hstructure;
        $full_rule_headers = array('2', '3');
        
        /**
         * Extra class name
         */
        $el_class_header = $page_id ? get_post_meta($page_id, '_nasa_el_class_header', true) : '';
        if ($el_class_header != '') {
            $header_classes[] = $el_class_header;
        }
        
        /**
         * Main menu style
         */
        $menu_warp_class[] = 'nasa-nav-style-1';
        $data_padding_y = apply_filters('nasa_responsive_y_menu', 15);
        $data_padding_x = apply_filters('nasa_responsive_x_menu', 40);
        
        $menu_warp_class = !empty($menu_warp_class) ? ' ' . implode(' ', $menu_warp_class) : '';
        
        /**
         * Full width main menu
         */
        $fullwidth_main_menu = true;
        if (in_array($hstructure, $full_rule_headers)) {
            $fullwidth_main_menu = $page_id ? get_post_meta($page_id, '_nasa_fullwidth_main_menu', true) : true;
            $fullwidth_main_menu = $fullwidth_main_menu === '-1' ? '0' : $fullwidth_main_menu;
            
            if ($fullwidth_main_menu == '' && isset($nasa_opt['header-type']) && in_array($nasa_opt['header-type'], $full_rule_headers)) {
                $fullwidth_main_menu = (isset($nasa_opt['fullwidth_main_menu']) && !$nasa_opt['fullwidth_main_menu']) ? false : true;
            }
            
            else {
                $fullwidth_main_menu = $fullwidth_main_menu ? true : false;
            }
        }
        
        /**
         * Top filter cats
         */
        $show_icon_cat_top = isset($nasa_opt['show_icon_cat_top']) ? $nasa_opt['show_icon_cat_top'] : 'show-in-shop';
        switch ($show_icon_cat_top) :
            case 'show-all-site':
                $show_cat_top_filter = true;
                break;

            case 'not-show':
                $show_cat_top_filter = false;
                break;

            case 'show-in-shop':
            default:
                $show_cat_top_filter = ($is_shop || $is_product_taxonomy || $is_product) ? true : false;
                break;
        endswitch;
        
        $show_product_cat = true;
        $show_cart = true;
        $show_compare = true;
        $show_wishlist = true;
        $show_search = in_array($hstructure, array(3, 4)) ? false : true;
        $nasa_header_icons = elessi_header_icons($show_product_cat, $show_cart, $show_compare, $show_wishlist, $show_search);
        
        /**
         * Sticky header
         */
        if ($fixed_nav) {
            $header_classes[] = 'nasa-header-sticky';
        }
        
        /**
         * $header_classes to string
         */
        $header_classes = !empty($header_classes) ? implode(' ', $header_classes) : '';
        $header_classes = apply_filters('nasa_header_classes', $header_classes);
        
        /**
         * Main header include
         */
        $file = ELESSI_CHILD_PATH . '/headers/header-structure-' . ((int) $hstructure) . '.php';
        if (is_file($file)) {
            include $file;
        } else {
            $file = ELESSI_THEME_PATH . '/headers/header-structure-' . ((int) $hstructure) . '.php';
            include is_file($file) ? $file : ELESSI_THEME_PATH . '/headers/header-structure-1.php';
        }
    }
endif;

/**
 * Group header icons
 */
if (!function_exists('elessi_header_icons')) :
    function elessi_header_icons($product_cat = true, $cart = true, $compare = true, $wishlist = true, $search = true) {
        global $nasa_opt;
        
        $icons = '';
        $first = false;
        
        /**
         * Account menu item mobile version
         */
        if (
            NASA_WOO_ACTIVED &&
            isset($nasa_opt['nasa_in_mobile']) && $nasa_opt['nasa_in_mobile'] &&
            (!isset($nasa_opt['hide_tini_menu_acc']) || !$nasa_opt['hide_tini_menu_acc']) &&
            (!isset($nasa_opt['main_screen_acc_mobile']) || $nasa_opt['main_screen_acc_mobile'])
        ) {
            $title_acc = !NASA_CORE_USER_LOGGED ? esc_attr__('Login / Register', 'elessi-theme') : esc_attr__('My Account', 'elessi-theme');

            $login_ajax = !NASA_CORE_USER_LOGGED && (!isset($nasa_opt['login_ajax']) || $nasa_opt['login_ajax'] == 1) ? '1' : '0';

            $login_url = '#';
            $myaccount_page_id = get_option('woocommerce_myaccount_page_id');
            if ($myaccount_page_id) {
                $login_url = get_permalink($myaccount_page_id);
            }
            
            $icon = apply_filters('nasa_mini_icon_account', '<i class="nasa-icon pe7-icon pe-7s-user"></i>');

            $nasa_icon_account = 
            '<a class="nasa-login-register-ajax inline-block" data-enable="' . $login_ajax . '" href="' . esc_url($login_url) . '" title="' . $title_acc . '">' .
                $icon .
            '</a>';

            $class = !$first ? 'first ' : '';
            $first = true;
            $icons .= '<li class="' . $class . 'nasa-icon-account-mobile">' . $nasa_icon_account . '</li>';
        }
        
        /**
         * List icons
         */
        if (NASA_WOO_ACTIVED && $product_cat) {
            $show_icon_cat_top = isset($nasa_opt['show_icon_cat_top']) ? $nasa_opt['show_icon_cat_top'] : 'show-in-shop';
            
            switch ($show_icon_cat_top) {
                case 'show-all-site':
                    $show_icon = true;
                    break;
                
                case 'not-show':
                    $show_icon = false;
                    break;
                
                case 'show-in-shop':
                default:
                    $show_icon = (!is_post_type_archive('product') && !is_tax(get_object_taxonomies('product'))) ? false : true;
                    break;
            }
            
            if ($show_icon) {
                $icon = apply_filters('nasa_mini_icon_filter_cats', '<i class="nasa-icon pe-7s-keypad"></i>');
                
                $nasa_icon_cat = 
                    '<a class="filter-cat-icon inline-block nasa-hide-for-mobile" href="javascript:void(0);" title="' . esc_attr__('Product Categories', 'elessi-theme') . '">' .
                        $icon .
                    '</a>' .
                    '<a class="filter-cat-icon-mobile inline-block" href="javascript:void(0);" title="' . esc_attr__('Product Categories', 'elessi-theme') . '">' .
                        $icon .
                    '</a>';
                $class = !$first ? 'first ' : '';
                $first = true;
                $icons .= '<li class="' . $class . 'nasa-icon-filter-cat">' . $nasa_icon_cat . '</li>';
            }
        }
        
        if ($cart) {
            $show = defined('NASA_PLG_CACHE_ACTIVE') && NASA_PLG_CACHE_ACTIVE ? false : true;
            $nasa_mini_cart = elessi_mini_cart($show);
            if ($nasa_mini_cart != '') {
                $class = !$first ? 'first ' : '';
                $first = true;
                $icons .= '<li class="' . $class . 'nasa-icon-mini-cart">' . $nasa_mini_cart . '</li>';
            }
        }
        
        if ($wishlist) {
            $nasa_icon_wishlist = elessi_icon_wishlist();
            if ($nasa_icon_wishlist != '') {
                $class = !$first ? 'first ' : '';
                $first = true;
                $icons .= '<li class="' . $class . 'nasa-icon-wishlist">' . $nasa_icon_wishlist . '</li>';
            }
        }
        
        if ($compare && (!isset($nasa_opt['nasa-product-compare']) || $nasa_opt['nasa-product-compare'])) {
            $nasa_icon_compare = elessi_icon_compare();
            if ($nasa_icon_compare != '') {
                $class = !$first ? 'first ' : '';
                $first = true;
                $icons .= '<li class="' . $class . 'nasa-icon-compare">' . $nasa_icon_compare . '</li>';
            }
        }
        
        if ($search) {
            $icon = apply_filters('nasa_mini_icon_search', '<i class="nasa-icon nasa-search icon-nasa-search"></i>');
            
            $search_icon = 
            '<a class="search-icon desk-search inline-block" href="javascript:void(0);" data-open="0" title="' . esc_attr__('Search', 'elessi-theme') . '">' .
                $icon .
            '</a>';
            $class = !$first ? 'first ' : '';
            $first = true;
            $icons .= '<li class="' . $class . 'nasa-icon-search nasa-hide-for-mobile">' . $search_icon . '</li>';
        }
        
        $icons_wrap = ($icons != '') ? '<div class="nasa-header-icons-wrap"><ul class="header-icons">' . $icons . '</ul></div>' : '';
        
        return apply_filters('nasa_header_icons', $icons_wrap);
    }
endif;

/**
 * Get header builder custom
 */
if (!function_exists('elessi_header_builder')) :
    function elessi_header_builder($header_slug) {
        if (!function_exists('nasa_get_header')) {
            return;
        }

        $header_builder = nasa_get_header($header_slug);
        
        $file = ELESSI_CHILD_PATH . '/headers/header-builder.php';
        include is_file($file) ? $file : ELESSI_THEME_PATH . '/headers/header-builder.php';
    }
endif;

/**
 * Topbar
 */
if (!function_exists('elessi_header_topbar')) :
    function elessi_header_topbar($mobile = false) {
        global $wp_query, $nasa_opt;
        
        $queryObjId = $wp_query->get_queried_object_id();
        
        /**
         * Top bar Toggle
         */
        $topbar_toggle = get_post_meta($queryObjId, '_nasa_topbar_toggle', true);
        $topbar_df_show = $topbar_toggle == 1 ? get_post_meta($queryObjId, '_nasa_topbar_default_show', true) : '';

        $topbar_toggle_val = $topbar_toggle == '' ? (isset($nasa_opt['topbar_toggle']) && $nasa_opt['topbar_toggle'] ? true : false) : ($topbar_toggle == 1 ? true : false);
        $topbar_df_show_val = $topbar_df_show == '' ? (!isset($nasa_opt['topbar_default_show']) || $nasa_opt['topbar_default_show'] ? true : false) : ($topbar_df_show == 1 ? true : false);

        $class_topbar = $topbar_toggle_val ? ' nasa-topbar-toggle' : '';
        $class_topbar .= $topbar_df_show_val ? '' : ' nasa-topbar-hide';
        
        /**
         * Top bar content
         */
        $topbar_left = '';
        if (isset($nasa_opt['topbar_content']) && $nasa_opt['topbar_content']) {
            $topbar_left = elessi_get_block($nasa_opt['topbar_content']);
        }
        
        /**
         * Old data
         */
        elseif (isset($nasa_opt['topbar_left']) && $nasa_opt['topbar_left'] != '') {
            $topbar_left = do_shortcode($nasa_opt['topbar_left']);
        }
        
        $file = ELESSI_CHILD_PATH . '/headers/top-bar.php';
        include is_file($file) ? $file : ELESSI_THEME_PATH . '/headers/top-bar.php';
    }
endif;

/**
 * Topbar mobile
 */
if (!function_exists('elessi_header_topbar_mobile')) :
    function elessi_header_topbar_mobile() {
        elessi_header_topbar(true);
    }
endif;

/**
 * Topbar menu
 */
add_action('nasa_topbar_menu', 'elessi_topbar_menu', 15);
add_action('nasa_mobile_topbar_menu', 'elessi_topbar_menu', 15);
if (!function_exists('elessi_topbar_menu')) :
    function elessi_topbar_menu() {
        elessi_get_menu('topbar-menu', 'nasa-topbar-menu', 1);
    }
endif;

/**
 * Topbar Account
 */
add_action('nasa_topbar_menu', 'elessi_topbar_account', 20);
if (!function_exists('elessi_topbar_account')) :
    function elessi_topbar_account() {
        echo elessi_tiny_account(true);
    }
endif;

/**
 * Mobile account menu
 */
if (!function_exists('elessi_mobile_account')) :
    function elessi_mobile_account() {
        $file = ELESSI_CHILD_PATH . '/includes/nasa-mobile-account.php';
        include is_file($file) ? $file : ELESSI_THEME_PATH . '/includes/nasa-mobile-account.php';
    }
endif;

/**
 * Short code group icons header
 */
if (!function_exists('nasa_header_icons_sc')) :
    function nasa_header_icons_sc($atts = array(), $content = null) {
        $dfAttr = array(
            'show_mini_cart' => 'yes',
            'show_mini_compare' => 'yes',
            'show_mini_wishlist' => 'yes',
            'el_class' => ''
        );
        extract(shortcode_atts($dfAttr, $atts));

        $cart = $show_mini_cart == 'yes' ? true : false;
        $compare = $show_mini_compare == 'yes' ? true : false;
        $wishlist = $show_mini_wishlist == 'yes' ? true : false;
        
        $content = '<div class="nasa-header-icons-wrap' . esc_attr($el_class != '' ? ' ' . $el_class : '') . '">' .
            elessi_header_icons(false, $cart, $compare, $wishlist, false) .
        '</div>';
        
        return $content;
    }
endif;

/**
 * Short code header search
 */
if (!function_exists('nasa_header_search_sc')) :
    function nasa_header_search_sc($atts = array(), $content = null) {
        $dfAttr = array(
            'el_class' => ''
        );
        extract(shortcode_atts($dfAttr, $atts));
        
        $content = '<div class="nasa-header-search-wrap' . esc_attr($el_class != '' ? ' ' . $el_class : '') . '">' .
            elessi_search('full') .
        '</div>';
        
        return $content;
    }
endif;

<?php
/**
 * Footer Main
 */
add_action('wp_footer', 'elessi_get_footer_theme', 1);
if (!function_exists('elessi_get_footer_theme')) :
    function elessi_get_footer_theme() {
        global $nasa_opt;

        $file = ELESSI_CHILD_PATH . '/footers/footer-main.php';
        include_once is_file($file) ? $file : ELESSI_THEME_PATH . '/footers/footer-main.php';
    }
endif;

/**
 * Footer output
 * since 4.0
 */
add_action('nasa_footer_layout_style', 'elessi_footer_output');
if (!function_exists('elessi_footer_output')) :
    function elessi_footer_output() {
        global $nasa_opt, $wp_query;
        
        $inMobile = isset($nasa_opt['nasa_in_mobile']) && $nasa_opt['nasa_in_mobile'] ? true : false;
        
        $footer_mode = isset($nasa_opt['footer_mode']) ? $nasa_opt['footer_mode'] : 'builder';
        $footer_builder = isset($nasa_opt['footer-type']) ? $nasa_opt['footer-type'] : false;
        $footer_builder_m = isset($nasa_opt['footer-mobile']) ? $nasa_opt['footer-mobile'] : false;
        $footer_buildin = isset($nasa_opt['footer_build_in']) ? $nasa_opt['footer_build_in'] : false;
        $footer_buildin_m = isset($nasa_opt['footer_build_in_mobile']) ? $nasa_opt['footer_build_in_mobile'] : false;
        $footer_buildin_m = $footer_buildin_m === '' ? $footer_buildin : $footer_buildin_m; // Ext-Desktop
        $footer = false;
        $footer_override = false;
        $footer_mode_override = false;
        
        if ($footer_mode == 'builder') {
            $footer = $inMobile ? $footer_builder_m : $footer_builder;
        }
        
        if ($footer_mode == 'build-in') {
            $footer = $inMobile ? $footer_buildin_m : $footer_buildin;
        }
        
        $page_id = false;
        $root_term_id = elessi_get_root_term_id();
        
        /*
         * For Page
         */
        if (!$root_term_id) {
            /*
             * Override Footer
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
            
            /**
             * Switch footer
             */
            if ($page_id) {
                $footer_mode_override = get_post_meta($page_id, '_nasa_footer_mode', true);
                
                if ($inMobile) {
                    switch ($footer_mode_override) :
                        case 'builder' :
                            $footer_override = get_post_meta($page_id, '_nasa_custom_footer_mobile', true);
                            break;
                        
                        case 'build-in' :
                            $footer_override = get_post_meta($page_id, '_nasa_footer_build_in_mobile', true);
                            if ($footer_override == '') {
                                $footer_override = get_post_meta($page_id, '_nasa_footer_build_in', true);
                            }
                            break;
                        
                        default :
                            
                            break;
                    endswitch;
                }
                
                /* Desktop */
                else {
                    switch ($footer_mode_override) :
                        case 'builder' :
                            $footer_override = get_post_meta($page_id, '_nasa_custom_footer', true);
                            break;
                        
                        case 'build-in' :
                            $footer_override = get_post_meta($page_id, '_nasa_footer_build_in', true);
                            break;
                        
                        default :
                            
                            break;
                    endswitch;
                }
            }
        }
        
        /**
         * For Root Category
         */
        else {
            $footer_mode_override = get_term_meta($root_term_id, 'cat_footer_mode', true);
            
            /**
             * Mobile
             */
            if ($inMobile) {
                switch ($footer_mode_override) :
                    case 'builder' :
                        $footer_override = get_term_meta($root_term_id, 'cat_footer_mobile', true);
                        break;

                    case 'build-in' :
                        $footer_override = get_term_meta($root_term_id, 'cat_footer_build_in_mobile', true);
                        if ($footer_override == '') {
                            $footer_override = get_term_meta($root_term_id, 'cat_footer_build_in', true);
                        }
                        break;

                    default :

                        break;
                endswitch;
            }
            
            /**
             * Desktop
             */
            else {
                switch ($footer_mode_override) :
                    case 'builder' :
                        $footer_override = get_term_meta($root_term_id, 'cat_footer_type', true);
                        break;

                    case 'build-in' :
                        $footer_override = get_term_meta($root_term_id, 'cat_footer_build_in', true);
                        break;

                    default :

                        break;
                endswitch;
            }
        }
        
        
        
        if ($footer_override) {
            $footer = $footer_override;
            $footer_mode = $footer_mode_override;
        }
        
        if (!$footer) {
            return;
        }
        
        if ($footer_mode == 'builder') {
            elessi_footer_builder($footer);
        }
        
        if ($footer_mode == 'build-in') {
            elessi_footer_build_in($footer);
        }
    }
endif;

/**
 * Footer Builder
 */
if (!function_exists('elessi_footer_builder')) :
    function elessi_footer_builder($footer_slug) {
        if (!function_exists('nasa_get_footer')) {
            return;
        }

        /**
         * get footer content
         */
        echo nasa_get_footer($footer_slug);
    }
endif;

/**
 * Footer Build-in
 */
if (!function_exists('elessi_footer_build_in')) :
    function elessi_footer_build_in($footer) {
        $file = ELESSI_CHILD_PATH . '/footers/footer-built-in-' . $footer . '.php';
        $real_file = is_file($file) ? $file : ELESSI_THEME_PATH . '/footers/footer-built-in-' . $footer . '.php';
        
        if (is_file($real_file)) {
            include $real_file;
        }
    }
endif;

/**
 * Footer run static content
 */
add_action('wp_footer', 'elessi_run_static_content', 9);
if (!function_exists('elessi_run_static_content')) :
    function elessi_run_static_content() {
        do_action('nasa_before_static_content');
        do_action('nasa_static_content');
        do_action('nasa_after_static_content');
    }
endif;

/**
 * Group static buttons
 */
add_action('nasa_static_content', 'elessi_static_group_btns', 10);
if (!function_exists('elessi_static_group_btns')) :
    function elessi_static_group_btns() {
        echo '<!-- Start static group buttons -->';
        echo '<div class="nasa-static-group-btn">';
        
        do_action('nasa_static_group_btns');
        
        echo '</div>';
        echo '<!-- End static group buttons -->';
    }
endif;

/**
 * Back to top buttons
 */
add_action('nasa_static_group_btns', 'elessi_static_back_to_top_btns');
if (!function_exists('elessi_static_back_to_top_btns')) :
    function elessi_static_back_to_top_btns() {
        $btns = '<a href="javascript:void(0);" id="nasa-back-to-top" class="nasa-tip nasa-tip-left" data-tip="' . esc_attr__('Back To Top', 'elessi-theme') . '"><i class="pe-7s-angle-up"></i></a>';
        
        echo apply_filters('nasa_back_to_top_button', $btns);
    }
endif;

/**
 * Wrap Before static_content
 */
add_action('nasa_static_content', 'elessi_static_content_before', 10);
if (!function_exists('elessi_static_content_before')) :
    function elessi_static_content_before() {
        echo '<!-- Start static content -->' .
            '<div class="static-position vendor_hidden">' .
                '<div class="nasa-check-reponsive nasa-desktop-check"></div>' .
                '<div class="nasa-check-reponsive nasa-taplet-check"></div>' .
                '<div class="nasa-check-reponsive nasa-mobile-check"></div>' .
                '<div class="nasa-check-reponsive nasa-switch-check"></div>' .
                '<div class="black-window hidden-tag"></div>' .
                '<div class="white-window hidden-tag"></div>' .
                '<div class="transparent-window hidden-tag"></div>' .
                '<div class="transparent-mobile hidden-tag"></div>' .
                '<div class="black-window-mobile"></div>';
    }
endif;

/**
 * Wrap After static content
 */
add_action('nasa_static_content', 'elessi_static_content_after', 999);
if (!function_exists('elessi_static_content_after')) :
    function elessi_static_content_after() {
        echo '</div><!-- End static content -->';
    }
endif;

/**
 * Mobile static
 */
add_action('nasa_static_content', 'elessi_static_for_mobile', 12);
if (!function_exists('elessi_static_for_mobile')) :
    function elessi_static_for_mobile() {
        global $nasa_opt;
        ?>
        <div class="warpper-mobile-search hidden-tag">
            <!-- for mobile -->
            <?php
            $search_form_file = ELESSI_CHILD_PATH . '/includes/nasa-mobile-product-searchform.php';
            include is_file($search_form_file) ? $search_form_file : ELESSI_THEME_PATH . '/includes/nasa-mobile-product-searchform.php';
            ?>
        </div>

        <div id="heading-menu-mobile" class="hidden-tag">
            <i class="fa fa-bars"></i><?php esc_html_e('Navigation','elessi-theme'); ?>
        </div>
        
        <?php
        $inMobile = isset($nasa_opt['nasa_in_mobile']) && $nasa_opt['nasa_in_mobile'] ? true : false;
        $mainSreen = isset($nasa_opt['main_screen_acc_mobile']) && !$nasa_opt['main_screen_acc_mobile'] ? false : true;
        if (!$mainSreen || !$inMobile) :
            if (!isset($nasa_opt['hide_tini_menu_acc']) || !$nasa_opt['hide_tini_menu_acc']) : ?>
                <div id="mobile-account" class="hidden-tag">
                    <?php
                    $mobile_acc_file = ELESSI_CHILD_PATH . '/includes/nasa-mobile-account.php';
                    include is_file($mobile_acc_file) ? $mobile_acc_file : ELESSI_THEME_PATH . '/includes/nasa-mobile-account.php';
                    ?>
                </div>
        <?php
            endif;
        endif;
    }
endif;

/**
 * Static Cart sidebar
 */
add_action('nasa_static_content', 'elessi_static_cart_sidebar', 13);
if (!function_exists('elessi_static_cart_sidebar')) :
    function elessi_static_cart_sidebar() {
        global $nasa_opt;
        if (!NASA_WOO_ACTIVED || (isset($nasa_opt['disable-cart']) && $nasa_opt['disable-cart'])) {
            return;
        }
        $nasa_cart_style = isset($nasa_opt['style-cart']) ? esc_attr($nasa_opt['style-cart']) : 'style-1';
        ?>
        <div id="cart-sidebar" class="nasa-static-sidebar <?php echo esc_attr($nasa_cart_style); ?>">
            <div class="cart-close nasa-sidebar-close">
                <a href="javascript:void(0);" title="<?php esc_attr_e('Close', 'elessi-theme'); ?>"><?php esc_html_e('Close','elessi-theme'); ?></a>
                
                <h3 class="nasa-tit-mycart nasa-sidebar-tit text-center">
                    <?php echo esc_html__('My Cart', 'elessi-theme'); ?>
                </h3>
            </div>
            
            <div class="widget_shopping_cart_content">
                <input type="hidden" name="nasa-mini-cart-empty-content" />
            </div>
            
            <?php if (isset($_REQUEST['nasa_cart_sidebar']) && $_REQUEST['nasa_cart_sidebar'] == 1) : ?>
                <input type="hidden" name="nasa_cart_sidebar_show" value="1" />
            <?php endif; ?>
        </div>
        <?php
    }
endif;

/**
 * Static Wishlist sidebar
 */
add_action('nasa_static_content', 'elessi_static_wishlist_sidebar', 14);
if (!function_exists('elessi_static_wishlist_sidebar')) :
    function elessi_static_wishlist_sidebar() {
        if (!NASA_WOO_ACTIVED) {
            return;
        }
        
        global $nasa_opt;
        
        if (NASA_WISHLIST_ENABLE) {
            echo '<input type="hidden" name="nasa_yith_wishlist_actived" value="1" />';
        }
        
        if (!NASA_WISHLIST_ENABLE) {
            if (isset($nasa_opt['enable_nasa_wishlist']) && !$nasa_opt['enable_nasa_wishlist']) {
                return;
            }
            
            $nasa_wishlist = function_exists('elessi_woo_wishlist') ? elessi_woo_wishlist() : null;
            if ($nasa_wishlist) {
                echo '<input type="hidden" name="nasa_wishlist_cookie_name" value="' . $nasa_wishlist->get_cookie_name() . '" />';
            }
        }
        
        $nasa_wishlist_style = isset($nasa_opt['style-wishlist']) ? esc_attr($nasa_opt['style-wishlist']) : 'style-1';
        ?>
        <div id="nasa-wishlist-sidebar" class="nasa-static-sidebar <?php echo esc_attr($nasa_wishlist_style); ?>">
            <div class="wishlist-close nasa-sidebar-close">
                <a href="javascript:void(0);" title="<?php esc_attr_e('Close', 'elessi-theme'); ?>">
                    <?php esc_html_e('Close', 'elessi-theme'); ?>
                </a>
                
                <h3 class="nasa-tit-wishlist nasa-sidebar-tit text-center">
                    <?php echo esc_html__('Wishlist', 'elessi-theme'); ?>
                </h3>
            </div>
            
            <?php echo elessi_loader_html('nasa-wishlist-sidebar-content'); ?>
        </div>
        <?php
    }
endif;

/**
 * Static Login / Register
 */
add_action('nasa_static_content', 'elessi_static_login_register', 15);
if (!function_exists('elessi_static_login_register')) :
    function elessi_static_login_register() {
        global $nasa_opt;
        
        if (did_action('nasa_init_login_register_form')) {
            return;
        }
        
        if (!NASA_CORE_USER_LOGGED && shortcode_exists('woocommerce_my_account') && (!isset($nasa_opt['login_ajax']) || $nasa_opt['login_ajax'] == 1)) : ?>
            <div class="nasa-login-register-warper">
                <div id="nasa-login-register-form">
                    <div class="nasa-form-logo-log nasa-no-fix-size-retina">
                        <?php echo elessi_logo(); ?>
                        
                        <a class="login-register-close" href="javascript:void(0);" title="<?php esc_attr_e('Close', 'elessi-theme'); ?>"><i class="pe-7s-angle-up"></i></a>
                    </div>
                    
                    <div class="nasa-message margin-top-20"></div>
                    <div class="nasa-form-content">
                        <?php do_action('nasa_login_register_form', true); ?>
                    </div>
                </div>
            </div>
        <?php
        endif;
    }
endif;

/**
 * Static Quickview sidebar
 */
add_action('nasa_static_content', 'elessi_static_quickview_sidebar', 16);
if (!function_exists('elessi_static_quickview_sidebar')) :
    function elessi_static_quickview_sidebar() {
        global $nasa_opt;
        
        $style_quickview = isset($nasa_opt['style_quickview']) && in_array($nasa_opt['style_quickview'], array('sidebar', 'popup')) ? $nasa_opt['style_quickview'] : 'sidebar';
        
        if ($style_quickview == 'sidebar') : ?>
        <div id="nasa-quickview-sidebar" class="nasa-static-sidebar style-1">
            <div class="nasa-quickview-fog hidden-tag"></div>
            <div class="quickview-close nasa-sidebar-close">
                <a href="javascript:void(0);" title="<?php esc_attr_e('Close', 'elessi-theme'); ?>"><?php esc_html_e('Close', 'elessi-theme'); ?></a>
            </div>
            <?php echo elessi_loader_html('nasa-quickview-sidebar-content', false); ?>
        </div>
        <?php
        endif;
    }
endif;

/**
 * Static Compare sidebar
 */
add_action('nasa_static_content', 'elessi_static_compare_sidebar', 17);
if (!function_exists('elessi_static_compare_sidebar')) :
    function elessi_static_compare_sidebar() {
        global $yith_woocompare;
        
        if ($yith_woocompare) {
            $nasa_compare = isset($yith_woocompare->obj) ?
                $yith_woocompare->obj : $yith_woocompare;
            
            if (isset($nasa_compare->cookie_name)) {
                echo '<input type="hidden" name="nasa_woocompare_cookie_name" value="' . $nasa_compare->cookie_name . '" />';
            }
        }
        ?>
        <div class="nasa-compare-list-bottom">
            <div id="nasa-compare-sidebar-content" class="nasa-relative">
                <div class="nasa-loader"></div>
            </div>
            <p class="nasa-compare-mess nasa-compare-success hidden-tag"></p>
            <p class="nasa-compare-mess nasa-compare-exists hidden-tag"></p>
        </div>
        <?php
    }
endif;

/**
 * Mobile Menu
 */
add_action('nasa_static_content', 'elessi_static_menu_vertical_mobile', 19);
if (!function_exists('elessi_static_menu_vertical_mobile')) :
    function elessi_static_menu_vertical_mobile() {
        global $nasa_opt;
        
        $class = isset($nasa_opt['mobile_menu_layout']) ? 
            'nasa-' . $nasa_opt['mobile_menu_layout'] : 'nasa-light-new'; ?>
        
        <div id="nasa-menu-sidebar-content" class="<?php echo esc_attr($class); ?>">
            <a class="nasa-close-menu-mobile" href="javascript:void(0);" title="<?php esc_attr_e('Close', 'elessi-theme'); ?>">
                <?php esc_html_e('Close', 'elessi-theme'); ?>
            </a>
            <div class="nasa-mobile-nav-wrap">
                <div id="mobile-navigation"></div>
            </div>
        </div>
        <?php
    }
endif;

/**
 * Top Categories filter
 */
add_action('nasa_static_content', 'elessi_static_top_cat_filter', 20);
if (!function_exists('elessi_static_top_cat_filter')) :
    function elessi_static_top_cat_filter() {
        ?>
        <div class="nasa-top-cat-filter-wrap-mobile">
            <h3 class="nasa-tit-filter-cat"><?php echo esc_html__("Categories", 'elessi-theme'); ?></h3>
            
            <div id="nasa-mobile-cat-filter">
                <div class="nasa-loader"></div>
            </div>
            
            <a href="javascript:void(0);" title="<?php esc_attr_e('Close categories filter', 'elessi-theme'); ?>" class="nasa-close-filter-cat"><i class="pe-7s-close"></i></a>
        </div>
        <?php
    }
endif;

/**
 * Static Configurations
 */
add_action('nasa_static_content', 'elessi_static_config_info', 21);
if (!function_exists('elessi_static_config_info')) :
    function elessi_static_config_info() {
        global $nasa_opt, $loadmoreStyle;
        
        $inMobile = isset($nasa_opt['nasa_in_mobile']) && $nasa_opt['nasa_in_mobile'] ? true : false;
        
        /**
         * Paging style in store
         */
        if (isset($_REQUEST['paging-style']) && in_array($_REQUEST['paging-style'], $loadmoreStyle)) {
            echo '<input type="hidden" name="nasa_loadmore_style" value="' . $_REQUEST['paging-style'] . '" />';
        }
        
        /**
         * Mobile Fixed add to cart in Desktop
         */
        if (!isset($nasa_opt['enable_fixed_add_to_cart']) || $nasa_opt['enable_fixed_add_to_cart']) {
            echo '<!-- Enable Fixed add to cart single product -->';
            echo '<input type="hidden" name="nasa_fixed_single_add_to_cart" value="1" />';
        }
        
        /**
         * Mobile Fixed add to cart in mobile
         */
        if (!isset($nasa_opt['mobile_fixed_add_to_cart'])) {
            $nasa_opt['mobile_fixed_add_to_cart'] = 'no';
        }
        echo '<!-- Fixed add to cart single product in Mobile layout -->';
        echo '<input type="hidden" name="nasa_fixed_mobile_single_add_to_cart_layout" value="' . esc_attr($nasa_opt['mobile_fixed_add_to_cart']) . '" />';
        
        /**
         * Mobile Detect
         */
        if ($inMobile) {
            echo '<!-- In Mobile -->';
            echo '<input type="hidden" name="nasa_mobile_layout" value="1" />';
        }
        
        /**
         * Event After add to cart
         */
        $after_add_to_cart = isset($nasa_opt['event-after-add-to-cart']) ? $nasa_opt['event-after-add-to-cart'] : 'sidebar';
        echo '<!-- Event After Add To Cart -->';
        echo '<input type="hidden" name="nasa-event-after-add-to-cart" value="' . esc_attr($after_add_to_cart) . '" />';
        
        /**
         * Grid List view cookie name
         */
        $grid_cookie_name = 'archive_grid_view';
        $siteurl = get_option('siteurl');
        $grid_cookie_name .= $siteurl ? '_' . md5($siteurl) : '';
        echo '<input type="hidden" name="nasa_archive_grid_view" value="' . esc_attr($grid_cookie_name) . '" />';
        ?>
        
        <!-- Format currency -->
        <input type="hidden" name="nasa_currency_pos" value="<?php echo get_option('woocommerce_currency_pos'); ?>" />
        
        <!-- URL Logout -->
        <input type="hidden" name="nasa_logout_menu" value="<?php echo wp_logout_url(get_home_url()); ?>" />
        
        <!-- width toggle Add To Cart | Countdown -->
        <input type="hidden" name="nasa-toggle-width-product-content" value="<?php echo apply_filters('nasa_toggle_width_product_content', 180); ?>" />

        <!-- Enable gift effect -->
        <input type="hidden" name="nasa-enable-gift-effect" value="<?php echo (isset($nasa_opt['enable_gift_effect']) && $nasa_opt['enable_gift_effect'] == 1) ? '1' : '0'; ?>" />
        
        <!-- Enable focus main image -->
        <input type="hidden" name="nasa-enable-focus-main-image" value="<?php echo (isset($nasa_opt['enable_focus_main_image']) && $nasa_opt['enable_focus_main_image'] == 1) ? '1' : '0'; ?>" />
        
        <!-- Select option to Quick-view -->
        <input type="hidden" name="nasa-disable-quickview-ux" value="<?php echo (isset($nasa_opt['disable-quickview']) && $nasa_opt['disable-quickview'] == 1) ? '1' : '0'; ?>" />
        
        <!-- Close Pop-up string -->
        <input type="hidden" name="nasa-close-string" value="<?php echo esc_attr__('Close (Esc)', 'elessi-theme'); ?>" />

        <!-- Text no results in live search products -->
        <p class="hidden-tag" id="nasa-empty-result-search"><?php esc_html_e('Sorry. No results match your search.', 'elessi-theme'); ?></p>
        
        <!-- Toggle Select Options Sticky add to cart single product page -->
        <input type="hidden" name="nasa_select_options_text" value="<?php echo esc_attr__('Select Options', 'elessi-theme'); ?>" />
        
        <!-- Less Total Count items Wishlist - Compare - (9+) -->
        <input type="hidden" name="nasa_less_total_items" value="<?php echo (!isset($nasa_opt['compact_number']) || $nasa_opt['compact_number']) ? '1' : '0'; ?>" />

        <?php
        $shop_url   = NASA_WOO_ACTIVED ? wc_get_page_permalink('shop') : '';
        $base_url   = home_url('/');
        $friendly   = preg_match('/\?post_type\=/', $shop_url) ? '0' : '1';
        if (preg_match('/\?page_id\=/', $shop_url)){
            $friendly = '0';
            $shop_url = $base_url . '?post_type=product';
        }
        
        echo '<input type="hidden" name="nasa-shop-page-url" value="' . esc_url($shop_url) . '" />';
        echo '<input type="hidden" name="nasa-base-url" value="' . esc_url($base_url) . '" />';
        echo '<input type="hidden" name="nasa-friendly-url" value="' . esc_attr($friendly) . '" />';
        
        if (defined('NASA_PLG_CACHE_ACTIVE') && NASA_PLG_CACHE_ACTIVE) :
            echo '<input type="hidden" name="nasa-caching-enable" value="1" />';
        endif;
        
        if (isset($_GET) && !empty($_GET)) {
            echo '<div class="hidden-tag nasa-value-gets">';
            foreach ($_GET as $key => $value) {
                if (!in_array($key, array('add-to-cart'))) {
                    echo '<input type="hidden" name="' . $key . '" value="' . $value . '" />';
                }
            }
            echo '</div>';
        }
    }
endif;
        
/**
 * Bottom Bar menu
 */
add_action('nasa_static_content', 'elessi_bottom_bar_menu', 22);
if (!function_exists('elessi_bottom_bar_menu')):
    function elessi_bottom_bar_menu() {
        global $nasa_opt;
        
        if (isset($nasa_opt['nasa_in_mobile']) && $nasa_opt['nasa_in_mobile']) {
            $file = ELESSI_CHILD_PATH . '/includes/nasa-mobile-bottom-bar.php';
            include is_file($file) ? $file : ELESSI_THEME_PATH . '/includes/nasa-mobile-bottom-bar.php';
        }
    }
endif;

/**
 * Global wishlist template
 */
add_action('nasa_static_content', 'elessi_global_wishlist', 25);
if (!function_exists('elessi_global_wishlist')):
    function elessi_global_wishlist() {
        global $nasa_opt;
        
        if (NASA_WISHLIST_ENABLE && 
            (!isset($nasa_opt['optimize_wishlist_html']) || $nasa_opt['optimize_wishlist_html'])
        ) {
            $file = ELESSI_CHILD_PATH . '/includes/nasa-global-wishlist.php';
            include is_file($file) ? $file : ELESSI_THEME_PATH . '/includes/nasa-global-wishlist.php';
        }
    }
endif;

/**
 * Captcha template template
 */
add_action('nasa_after_static_content', 'elessi_tmpl_captcha_field_register');
if (!function_exists('elessi_tmpl_captcha_field_register')):
    function elessi_tmpl_captcha_field_register() {
        global $nasa_opt;
        if (!isset($nasa_opt['register_captcha']) || !$nasa_opt['register_captcha']) {
            return;
        }
        
        $file = ELESSI_CHILD_PATH . '/includes/nasa-tmpl-captcha-field-register.php';
        include is_file($file) ? $file : ELESSI_THEME_PATH . '/includes/nasa-tmpl-captcha-field-register.php';
    }
endif;

/**
 * GDPR Message
 */
add_action('nasa_static_content', 'elessi_gdpr_notice', 30);
if (!function_exists('elessi_gdpr_notice')) :
    function elessi_gdpr_notice() {
        global $nasa_opt;
        if (!isset($nasa_opt['nasa_gdpr_notice']) || !$nasa_opt['nasa_gdpr_notice'])  {
            return;
        }

        $enable = !isset($_COOKIE['nasa_gdpr_notice']) || !$_COOKIE['nasa_gdpr_notice'] ? true : false;
        if (!$enable) {
            return;
        }
        
        $file = ELESSI_CHILD_PATH . '/includes/nasa-gdpr-notice.php';
        include is_file($file) ? $file : ELESSI_THEME_PATH . '/includes/nasa-gdpr-notice.php';
    }
endif;

/**
 * Template variation for quick-view product variable
 */
add_action('nasa_after_static_content', 'elessi_script_template_variation_quickview');
if (!function_exists('elessi_script_template_variation_quickview')) :
    function elessi_script_template_variation_quickview() {
        global $nasa_opt;
        
        if (isset($nasa_opt['disable-quickview']) && $nasa_opt['disable-quickview']) {
            return;
        }
        ?>
        <script type="text/template" id="tmpl-variation-template-nasa">
            <div class="woocommerce-variation-description">{{{data.variation.variation_description}}}</div>
            <div class="woocommerce-variation-price">{{{data.variation.price_html}}}</div>
            <div class="woocommerce-variation-availability">{{{data.variation.availability_html}}}</div>
        </script>
        <script type="text/template" id="tmpl-unavailable-variation-template-nasa">
            <p><?php echo esc_html__('Sorry, this product is unavailable. Please choose a different combination.', 'elessi-theme'); ?></p>
        </script>
        <?php
    }
endif;

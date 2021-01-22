<?php
/**
 * Single Product tabs / and sections
 *
 * @author 	WooThemes
 * @package 	WooCommerce/Templates
 * @version     3.8.0
 */
if (!defined('ABSPATH')) :
    exit; // Exit if accessed directly
endif;

/**
 * Filter tabs and allow third parties to add their own
 *
 * Each tab is an array containing title, callback and priority.
 * @see woocommerce_default_product_tabs()
 */
$tabs = apply_filters('woocommerce_product_tabs', array());

if (!empty($tabs)) :
    global $nasa_opt, $product;

    $tab_style = apply_filters('nasa_single_product_tabs_style', '2d-no-border');
    
    $class_wrap = 'nasa-tabs-content woocommerce-tabs';
    $class_wrap .= isset($nasa_opt['woo_tabs_off_canvas']) && $nasa_opt['woo_tabs_off_canvas'] ? ' mobile-tabs-off-canvas' : '';
    $class_ul = 'nasa-tabs';
    
    switch ($tab_style) :
        case 'accordion':
            $class_wrap = 'nasa-accordions-content woocommerce-tabs nasa-no-global';
            break;

        case '2d':
            $class_ul .= ' nasa-classic-style nasa-classic-2d';
            break;

        case '2d-radius':
            $class_ul .= ' nasa-classic-style nasa-classic-2d nasa-tabs-no-border nasa-tabs-radius';
            break;
        
        case '2d-radius-dashed':
            $class_ul .= ' nasa-classic-style nasa-classic-2d nasa-tabs-radius-dashed';
            break;

        case '3d':
            $class_ul .= ' nasa-classic-style';
            break;

        case 'slide':
            $class_ul .= ' nasa-slide-style';
            break;
        
        case 'scroll-down':
            $class_wrap = 'nasa-scroll-content woocommerce-tabs';
            break;

        case '2d-no-border':
        default:
            $class_ul .= ' nasa-classic-style nasa-classic-2d nasa-tabs-no-border';
            break;
    endswitch;

    ?>
    <div class="product-details" id="nasa-single-product-tabs">
        <div class="<?php echo esc_attr($class_wrap); ?>">
            <?php
            /**
             * Accordion layout style
             */
            if ($tab_style === 'accordion') :
                $file = ELESSI_CHILD_PATH . '/includes/nasa-single-product-tabs_accordion_layout.php';
                if(!is_file($file)) :
                    $file = ELESSI_THEME_PATH . '/includes/nasa-single-product-tabs_accordion_layout.php';
                endif;
                
            /**
             * Scroll Down layout style
             */
            elseif ($tab_style === 'scroll-down') :
                $file = ELESSI_CHILD_PATH . '/includes/nasa-single-product-tabs_scroll_layout.php';
                if(!is_file($file)) :
                    $file = ELESSI_THEME_PATH . '/includes/nasa-single-product-tabs_scroll_layout.php';
                endif;

            /**
             * Tabs layout style
             */
            else:
                $file = ELESSI_CHILD_PATH . '/includes/nasa-single-product-tabs_tab_layout.php';
                if(!is_file($file)) :
                    $file = ELESSI_THEME_PATH . '/includes/nasa-single-product-tabs_tab_layout.php';
                endif;
            endif;
            
            /**
             * Content WooCommerce Tabs
             */
            include $file;
            ?>
        </div>
    </div>
<?php
endif;

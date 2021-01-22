<?php
/**
 * Mini-cart
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates
 * @version 3.7.0
 */
if (!defined('ABSPATH')) {
    exit;
}

do_action('woocommerce_before_mini_cart');

if (!WC()->cart->is_empty()) :
    $cartItems = WC()->cart->get_cart();
    ?>
    <div class="woocommerce-mini-cart cart_list product_list_widget <?php echo esc_attr($args['list_class']); ?>">
        <?php
        do_action('woocommerce_before_mini_cart_contents');

        foreach ($cartItems as $cart_item_key => $cart_item) {
            $_product = apply_filters('woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key);
            $product_id = apply_filters('woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key);

            if ($_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters('woocommerce_widget_cart_item_visible', true, $cart_item, $cart_item_key)) {
                $product_name = apply_filters('woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key);
                $thumbnail = apply_filters('woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key);
                $product_price = apply_filters('woocommerce_cart_item_price', WC()->cart->get_product_price($_product), $cart_item, $cart_item_key);
                $product_permalink = apply_filters('woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink($cart_item) : '', $cart_item, $cart_item_key);
                ?>
                <div class="row mini-cart-item woocommerce-mini-cart-item <?php echo esc_attr(apply_filters('woocommerce_mini_cart_item_class', 'mini_cart_item', $cart_item, $cart_item_key)); ?>" id="item-<?php echo (int) $product_id; ?>">
                    <div class="small-3 large-3 columns nasa-image-cart-item padding-left-0 padding-right-0 rtl-right">
                        <?php echo $thumbnail; ?>
                    </div>
                    
                    <div class="small-7 large-8 columns nasa-info-cart-item padding-left-15 padding-right-0 rtl-padding-left-0 rtl-padding-right-15 rtl-right">
                        <div class="mini-cart-info">
                            <?php if (empty($product_permalink)) : ?>
                                <?php echo $product_name; ?>
                            <?php else : ?>
                                <a href="<?php echo esc_url($product_permalink); ?>" title="<?php echo esc_attr($product_name); ?>">
                                    <?php echo $product_name; ?>
                                </a>
                            <?php endif; ?>
                            
                            <?php echo wc_get_formatted_cart_item_data($cart_item); ?>
                            
                            <?php echo apply_filters('woocommerce_widget_cart_item_quantity', '<div class="cart_list_product_quantity">' . sprintf('%s &times; %s', $cart_item['quantity'], $product_price) . '</div>', $cart_item, $cart_item_key); ?>
                        </div>
                    </div>
                    
                    <div class="small-2 large-1 columns product-remove padding-left-0 padding-right-0 text-right rtl-text-left">
                        <?php
                        echo apply_filters('woocommerce_cart_item_remove_link',
                            sprintf(
                                '<a href="%s" class="remove remove_from_cart_button item-in-cart" aria-label="%s" data-product_id="%s" data-cart_item_key="%s" data-product_sku="%s" title="%s">%s</a>',
                                esc_url(wc_get_cart_remove_url($cart_item_key)),
                                esc_attr__('Remove', 'elessi-theme'),
                                esc_attr($product_id),
                                esc_attr($cart_item_key),
                                esc_attr($_product->get_sku()),
                                esc_html__('Remove', 'elessi-theme'),
                                esc_attr__('Remove', 'elessi-theme')
                            ), $cart_item_key);
                        ?>
                    </div>
                </div>
            <?php
            }
        }

        do_action('woocommerce_mini_cart_contents');
        ?>
    </div>

    <div class="minicart_total_checkout woocommerce-mini-cart__total total">
        <?php
        /**
         * Woocommerce_widget_shopping_cart_total hook.
         *
         * @removed woocommerce_widget_shopping_cart_subtotal - 10
         * @hooked elessi_widget_shopping_cart_subtotal - 10
         */
        do_action('woocommerce_widget_shopping_cart_total');
        ?>
    </div>

    <?php do_action('nasa_subtotal_free_shipping'); ?>

    <div class="btn-mini-cart inline-lists text-center">
        <?php do_action('woocommerce_widget_shopping_cart_before_buttons'); ?>

	<p class="woocommerce-mini-cart__buttons buttons">
            <?php do_action('woocommerce_widget_shopping_cart_buttons'); ?>
        </p>

	<?php do_action('woocommerce_widget_shopping_cart_after_buttons'); ?>
    </div>

<?php
/**
 * Empty cart
 */
else :
    $icon_class = elessi_mini_cart_icon();
    echo '<p class="empty woocommerce-mini-cart__empty-message"><i class="nasa-empty-icon ' . $icon_class . '"></i>' . esc_html__('No products in the cart.', 'elessi-theme') . '<a href="javascript:void(0);" class="button nasa-sidebar-return-shop">' . esc_html__('RETURN TO SHOP', 'elessi-theme') . '</a></p>';
endif;

do_action('woocommerce_after_mini_cart');

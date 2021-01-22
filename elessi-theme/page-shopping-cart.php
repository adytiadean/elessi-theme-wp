<?php
/*
  Template name: Page Shopping cart
 */

get_header();
?>

<div class="container-wrap page-shopping-cart">
    <div class="order-steps">
        <div class="row">
            <div class="large-12 columns">
                <?php if (function_exists('is_wc_endpoint_url')) : ?>
                    <?php if (!is_wc_endpoint_url('order-received')) : ?>
                        <div class="checkout-breadcrumb">
                            <div class="title-cart">
                                <a href="<?php echo esc_url(wc_get_cart_url()); ?>" title="<?php esc_attr_e('Shopping Cart', 'elessi-theme'); ?>">
                                    <h1>01</h1>
                                    <h4><?php esc_html_e('Shopping Cart', 'elessi-theme'); ?></h4>
                                    <p><?php esc_html_e('Manage Your Items List', 'elessi-theme'); ?></p>
                                </a>
                                <span class="pe-7s-angle-right"></span>
                            </div>

                            <div class="title-checkout">
                                <a href="<?php echo esc_url(wc_get_checkout_url()); ?>" title="<?php esc_attr_e('Checkout details', 'elessi-theme'); ?>">
                                    <h1>02</h1>
                                    <h4><?php esc_html_e('Checkout Details', 'elessi-theme'); ?></h4>
                                    <p><?php esc_html_e('Checkout Your Items List', 'elessi-theme'); ?></p>
                                </a>
                                <span class="pe-7s-angle-right"></span>
                            </div>
                            
                            <div class="title-thankyou">
                                <h1>03</h1>
                                <h4><?php esc_html_e('Order Complete', 'elessi-theme'); ?></h4>
                                <p><?php esc_html_e('Review And Submit Your Order', 'elessi-theme'); ?></p>
                            </div>
                        </div>
                    <?php else : ?>
                        <div class="checkout-breadcrumb">
                            <div class="title-cart">
                                <a href="javascript:void(0);">
                                    <h1>01</h1>
                                    <h4><?php esc_html_e('Shopping Cart', 'elessi-theme'); ?></h4>
                                    <p><?php esc_html_e('Manage Your Items List', 'elessi-theme'); ?></p>
                                </a>
                                <span class="pe-7s-angle-right"></span>
                            </div>
                            <div class="title-checkout">
                                <a href="javascript:void(0);">
                                    <h1>02</h1>
                                    <h4><?php esc_html_e('Checkout Details', 'elessi-theme'); ?></h4>
                                    <p><?php esc_html_e('Checkout Your Items List', 'elessi-theme'); ?></p>
                                </a>
                                <span class="pe-7s-angle-right"></span>
                            </div>
                            <div class="title-thankyou nasa-complete">
                                <h1>03</h1>
                                <h4><?php esc_html_e('Order Complete', 'elessi-theme'); ?></h4>
                                <p><?php esc_html_e('Review And Submit Your Order', 'elessi-theme'); ?></p>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php else : ?> 
                    <div class="checkout-breadcrumb">
                        <div class="title-cart">
                            <span>01</span>
                            <p><?php esc_html_e('Shopping Cart', 'elessi-theme'); ?></p>
                        </div>
                        <div class="title-checkout">
                            <span>02</span>
                            <p><?php esc_html_e('Checkout details', 'elessi-theme'); ?></p>
                        </div>
                        <div class="title-thankyou">
                            <span>03</span>
                            <p><?php esc_html_e('Order Complete', 'elessi-theme'); ?></p>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <div id="content">
        <?php
        if (class_exists('WooCommerce') && shortcode_exists('woocommerce_cart')):
            echo do_shortcode('[woocommerce_cart]');
        endif;
        while (have_posts()) :
            the_post();
            the_content();
        endwhile;
        ?>
    </div>
</div>

<?php
get_footer();

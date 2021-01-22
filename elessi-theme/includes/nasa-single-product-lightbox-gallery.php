<div
    class="main-image-slider nasa-slick-slider nasa-slick-nav"
    data-columns="<?php echo esc_attr($show_images); ?>"
    data-columns-small="<?php echo esc_attr($show_images); ?>"
    data-columns-tablet="<?php echo esc_attr($show_images); ?>"
    data-items="<?php echo esc_attr($show_images); ?>"
    data-autoplay="false"
    data-delay="6000"
    data-height-auto="false"
    data-dot="false">
    <?php
    /**
     * Main image
     */
    echo $hasThumb ? $imageMain : '<img src="' . wc_placeholder_img_src() . '" />';
    
    if (count($attachment_ids)) :
        $loop = 0;
        $columns = apply_filters('woocommerce_product_thumbnails_columns', 3);
        foreach ($attachment_ids as $attachment_id) :
            $classes = array('zoom');
        
            if ($loop == 0 || $loop % $columns == 0) :
                $classes[] = 'first';
            endif;

            if (($loop + 1) % $columns == 0) :
                $classes[] = 'last';
            endif;

            $image_link = wp_get_attachment_url($attachment_id);

            if (!$image_link) :
                continue;
            endif;

            $image = wp_get_attachment_image($attachment_id, apply_filters('single_product_small_thumbnail_size', 'shop_thumbnail'));
            $image_class = esc_attr(implode(' ', $classes));
            $image_title = esc_attr(get_the_title($attachment_id));
            
            printf('%s', wp_get_attachment_image($attachment_id, apply_filters('single_product_large_thumbnail_size', 'shop_single')), wp_get_attachment_url($attachment_id));

            $loop++;
        endforeach;
    endif;
    ?>
</div>

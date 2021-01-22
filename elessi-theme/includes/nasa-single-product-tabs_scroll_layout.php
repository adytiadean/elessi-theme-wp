<?php
if (!defined('ABSPATH')) :
    exit; // Exit if accessed directly
endif;

$scroll_title_class = 'nasa-scroll-titles';
$scroll_title_class .= isset($nasa_opt['tab_align_info']) ? ' text-' . $nasa_opt['tab_align_info'] : ' text-center';
$tabs_titles = array();
    
foreach ($tabs as $key => $tab) :
    if (!isset($tab['title']) || !isset($tab['callback'])) :
        continue;
    endif;

    $tabs_titles[$key] = apply_filters('woocommerce_product_' . $key . '_tab_title', $tab['title'], $key);
endforeach;

foreach ($tabs as $key => $tab) :
    if (!isset($tab['title']) || !isset($tab['callback'])) :
        continue;
    endif;
    ?>

    <div class="<?php echo esc_attr($scroll_title_class); ?>" id="nasa-anchor-<?php echo esc_attr($key); ?>">
        <?php foreach ($tabs_titles as $k => $title):
            $anchor_href = '#nasa-anchor-' . $k;
            $anchor_class = 'nasa-anchor nasa-transition';
            $anchor_class .= $k == $key ? ' active' : '';
            ?>
            <a class="<?php echo esc_attr($anchor_class); ?>" data-target="#nasa-anchor-<?php echo esc_attr($k); ?>" href="#nasa-anchor-<?php echo esc_attr($k); ?>">
                <?php echo $title; ?>
            </a>
        <?php endforeach; ?>
    </div>

    <div class="nasa-scroll-content nasa-content-<?php echo esc_attr($key); ?>" id="nasa-scroll-<?php echo esc_attr($key); ?>">
        <?php call_user_func($tab['callback'], $key, $tab); ?>
    </div>

    <?php
endforeach;

<?php
/**
 * Carousel slide for gift products
 */
$id_sc = rand(0, 9999999);
$_delay = 0;
$_delay_item = (isset($nasa_opt['delay_overlay']) && (int) $nasa_opt['delay_overlay']) ? (int) $nasa_opt['delay_overlay'] : 100;
$columns_title = isset($_REQUEST['title_columns']) && (int) $_REQUEST['title_columns'] <= 4 ? (int) $_REQUEST['title_columns'] : 2;
$coulums_slide = 12 - $columns_title;
$file_content = ELESSI_CHILD_PATH . '/includes/nasa-content-product-gift.php';
$file_content = is_file($file_content) ? $file_content : ELESSI_THEME_PATH . '/includes/nasa-content-product-gift.php';

?>
<div class="large-<?php echo esc_attr($columns_title); ?> columns">
    <div class="nasa-slide-left-info-wrap">
        <h4 class="nasa-combo-gift"><?php echo esc_html__('Bundle product for', 'elessi-theme'); ?></h4>
        <h3><?php echo ($product->get_name()); ?><span class="nasa-count-items">(<?php echo count($combo) . ' ' . esc_html__('Items', 'elessi-theme'); ?>)</span></h3>
    </div>
</div>

<div class="large-<?php echo esc_attr($coulums_slide); ?> columns">
    <div class="row group-slider">
        <div
            id="nasa-slider-<?php echo esc_attr($id_sc); ?>"
            class="nasa-slider-items-margin nasa-slick-slider nasa-slick-nav nasa-combo-slider"
            data-columns="4"
            data-columns-small="2"
            data-columns-tablet="3"
            data-switch-tablet="<?php echo elessi_switch_tablet(); ?>"
            data-switch-desktop="<?php echo elessi_switch_desktop(); ?>">
            <?php
            foreach ($combo as $bundle_item) :
                include $file_content;
                $_delay += $_delay_item;
            endforeach;
            ?>
        </div>
    </div>
</div>

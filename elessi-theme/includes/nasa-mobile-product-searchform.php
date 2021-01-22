<?php
/**
 * The template for displaying search forms mobile in nasatheme
 *
 * @package     nasatheme
 * @version     1.0.0
 */

$url = home_url('/');
$postType = apply_filters('nasa_mobile_search_post_type', 'product');
$classInput = 'search-field search-input';
$placeHolder = esc_attr__("Start typing ...", 'elessi-theme');
$classWrap = 'nasa-search-form';
if ($postType === 'product') {
    $classInput .= ' live-search-input';
    $classWrap = 'nasa-ajax-search-form';
    $placeHolder = esc_attr__("I'm shopping for ...", 'elessi-theme');
}
?>

<div class="search-wrapper <?php echo esc_attr($classWrap); ?>-container">
    <form method="get" class="<?php echo esc_attr($classWrap); ?>" action="<?php echo esc_url($url); ?>">
        <label for="nasa-input-mobile-search" class="hidden-tag">
            <?php esc_html_e('Search here', 'elessi-theme'); ?>
        </label>
        
        <input id="nasa-input-mobile-search" type="text" class="<?php echo esc_attr($classInput); ?>" value="<?php echo get_search_query();?>" name="s" placeholder="<?php echo $placeHolder; ?>" />

        <?php if ($postType) : ?>
            <input type="hidden" class="search-param" name="post_type" value="<?php echo esc_attr($postType); ?>" />
        <?php endif; ?>

        <input class="nasa-vitual-hidden" type="submit" name="page" value="search" />
    </form>
</div>

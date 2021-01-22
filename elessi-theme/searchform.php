<?php
/**
 * The template for displaying search forms in nasatheme
 *
 * @package nasatheme
 */
global $nasa_opt, $nasa_search_form_id;
$_id = isset($nasa_search_form_id) ? $nasa_search_form_id : 1;
$GLOBALS['nasa_search_form_id'] = $_id + 1;

$post_type = apply_filters('nasa_search_post_type', 'post');
$classInput = 'search-field search-input';
$placeHolder = esc_attr__("Start typing ...", 'elessi-theme');
$hotkeys = '';
$classWrap = 'nasa-search-form';
if ($post_type === 'product') {
    $classInput .= ' live-search-input';
    $classWrap = 'nasa-ajax-search-form';
    $placeHolder = esc_attr__("I'm shopping for ...", 'elessi-theme');
    
    if (isset($nasa_opt['hotkeys_search']) && trim($nasa_opt['hotkeys_search']) !== '') {
        $hotkeys = ' data-suggestions="' . esc_attr($nasa_opt['hotkeys_search']) . '"';
    }
}
?>
<div class="search-wrapper <?php echo esc_attr($classWrap); ?>-container">
    <form method="get" class="<?php echo esc_attr($classWrap); ?>" action="<?php echo esc_url(home_url('/')); ?>">
        <label for="nasa-input-<?php echo esc_attr($_id); ?>" class="hidden-tag">
            <?php esc_html_e('Search here', 'elessi-theme'); ?>
        </label>
        
        <input type="text" name="s" id="nasa-input-<?php echo esc_attr($_id); ?>" class="<?php echo esc_attr($classInput); ?>" value="<?php echo get_search_query(); ?>" placeholder="<?php echo $placeHolder; ?>"<?php echo $hotkeys;?> />
        
        <span class="nasa-icon-submit-page">
            <button class="nasa-submit-search hidden-tag">
                <?php esc_attr_e('Search', 'elessi-theme'); ?>
            </button>
        </span>
        
        <input type="hidden" name="page" value="search" />
        
        <?php if ($post_type) : ?>
            <input type="hidden" name="post_type" value="<?php echo esc_attr($post_type); ?>" />
        <?php endif; ?>
    </form>
    
    <a href="javascript:void(0);" title="<?php esc_attr_e('Close search', 'elessi-theme'); ?>" class="nasa-close-search"><i class="pe-7s-close"></i></a>
</div>

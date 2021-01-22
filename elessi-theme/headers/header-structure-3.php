<div class="<?php echo esc_attr($header_classes); ?>">
    <?php
    /**
     * Hook - top bar header
     */
    do_action('nasa_topbar_header');
    ?>
    <div class="sticky-wrapper">
        <div id="masthead" class="site-header">
            <?php
            /**
             * Hook - Mobile responsive
             */
            do_action('nasa_mobile_header');
            ?>

            <div class="row nasa-wrap-event-search nasa-hide-for-mobile nasa-elements-wrap">
                <!-- Logo -->
                <div class="large-3 columns nasa-min-height rtl-right rtl-text-right">
                    <?php echo elessi_logo(); ?>
                </div>

                <!-- Group icon search -->
                <div class="large-6 columns rtl-right">
                    <!-- Search form in header -->
                    <div class="nasa-header-search-wrap nasa-search-relative">
                        <?php echo elessi_search('full'); ?>
                    </div>
                </div>

                <!-- Group icon header -->
                <div class="large-3 columns rtl-left rtl-text-left">
                    <?php echo $nasa_header_icons; ?>
                </div>
            </div>
            
            <!-- Main menu -->
            <?php if (!$fullwidth_main_menu) : ?>
            <div class="row">
                <div class="large-12 columns">
            <?php endif; ?>
                    <div class="nasa-elements-wrap nasa-elements-wrap-main-menu nasa-hide-for-mobile nasa-bg-dark text-center">
                        <div class="row">
                            <div class="large-12 columns">
                                <div class="wide-nav nasa-wrap-width-main-menu nasa-bg-wrap<?php echo esc_attr($menu_warp_class); ?>">
                                    <div class="nasa-menus-wrapper-reponsive" data-padding_y="<?php echo (int) $data_padding_y; ?>" data-padding_x="<?php echo (int) $data_padding_x; ?>">
                                        <?php elessi_get_main_menu(); ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            <?php if (!$fullwidth_main_menu) : ?>
                </div>
            </div>
            <?php endif; ?>
            
            <?php if (isset($show_cat_top_filter) && $show_cat_top_filter) : ?>
                <div class="nasa-top-cat-filter-wrap">
                    <?php echo elessi_get_all_categories(false, true); ?>
                    <a href="javascript:void(0);" title="<?php esc_attr_e('Close categories filter', 'elessi-theme'); ?>" class="nasa-close-filter-cat"><i class="pe-7s-close"></i></a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

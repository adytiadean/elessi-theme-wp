<div class="header-wrapper header-type-builder">
    <?php
    /**
     * Hook - top bar header
     */
    do_action('nasa_topbar_header');
    ?>
    <div class="header-content-builder nasa-header-content-builder">
        <div id="masthead" class="site-header">
            <?php echo isset($header_builder) ? $header_builder : ''; ?>
        </div>
    </div>
</div>

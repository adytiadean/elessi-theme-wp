<?php
/*
  Template name: Page Right Sidebar
 */

get_header();

if (has_excerpt()) : ?>
    <div class="page-header">
        <?php the_excerpt(); ?>
    </div>
<?php endif; ?>

<div class="container-wrap page-right-sidebar">
    <div class="row">
        
        <div id="content" class="large-9 desktop-padding-right-30 left columns">
            <div class="page-inner">
                <?php
                while (have_posts()) :
                    the_post();
                    get_template_part('content', 'page');
                    
                    if (comments_open() || '0' != get_comments_number()) :
                        comments_template();
                    endif;
                endwhile;
                wp_reset_postdata();
                ?>
            </div>
        </div>

        <div class="large-3 columns right col-sidebar">
            <a href="javascript:void(0);" title="<?php echo esc_attr__('Close', 'elessi-theme'); ?>" class="hidden-tag nasa-close-sidebar">
                <?php echo esc_html__('Close', 'elessi-theme'); ?>
            </a>
            <?php get_sidebar(); ?>
        </div>

    </div>
</div>

<?php
get_footer();

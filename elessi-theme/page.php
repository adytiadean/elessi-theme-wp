<?php
/**
 * The template for displaying all pages.
 *
 * @package nasatheme
 */

get_header();

/* Hook Display popup window */
do_action('nasa_before_page_wrapper');

/*if (has_excerpt()): ?>
    <div class="page-header">
        <?php the_excerpt(); ?>
    </div>
<?php endif; */

while (have_posts()) :
    the_post();
    the_content();
endwhile;

do_action('nasa_after_page_wrapper');

get_footer();

<?php

/**
 * Shop breadcrumb
 *
 * @author 	WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.3.0
 */
if (!defined('ABSPATH')) :
    exit; // Exit if accessed directly
endif;

if (!empty($breadcrumb)) {
    global $post, $nasa_opt, $wp_query;
    
    /**
     * Breadcrumb single row
     */
    if (isset($nasa_opt['breadcrumb_row']) && $nasa_opt['breadcrumb_row'] == 'single') {
        /**
         * Single Portfolio
         */
        if (is_singular('portfolio')) {
            $breadcrumb = elessi_rebuilt_breadcrumb_portfolio($breadcrumb);
        }

        /**
         * Archive Portfolio
         */
        else {
            $queried_object = $wp_query->get_queried_object();

            if (isset($queried_object->taxonomy) && $queried_object->taxonomy == 'portfolio_category') {
                $breadcrumb = elessi_rebuilt_breadcrumb_portfolio($breadcrumb, false);
            }
        }

        echo $wrap_before;

        $key = 0;
        $sizeof = sizeof($breadcrumb);
        foreach ($breadcrumb as $crumb) {
            echo $before;

            echo (!empty($crumb[1]) && $sizeof !== $key + 1) ?
                '<a href="' . esc_url($crumb[1]) . '" title="' . esc_attr($crumb[0]) . '">' .
                    esc_html($crumb[0]) .
                '</a>' : esc_html($crumb[0]);

            echo $after;

            if ($sizeof !== $key + 1) {
                echo $delimiter;
            }

            $key++;
        }

        echo $wrap_after;
    }
    
    /**
     * Breadcrumb double row
     */
    else {
        $queried_object = $wp_query->get_queried_object();

        $title = '';
        $count = count($breadcrumb);

        /**
         * Single product - Single post
         */
        if (is_product() || is_singular('post')) {
            if (isset($breadcrumb[$count-1][1])) {
                unset($breadcrumb[$count-1][1]);
            }

            $h2 = $breadcrumb[$count-1];
            unset($breadcrumb[$count-1]);

            $title = isset($h2[0]) ? esc_html($h2[0]) : '';
        }
        

        /**
         * Single Portfolio
         */
        elseif (is_singular('portfolio')) {
            $title = get_the_title();
            $breadcrumb = elessi_rebuilt_breadcrumb_portfolio($breadcrumb);
        }

        /**
         * Archive Portfolio
         */
        elseif (isset($queried_object->taxonomy) && $queried_object->taxonomy == 'portfolio_category') {
            $title = $queried_object->name;
            $breadcrumb = elessi_rebuilt_breadcrumb_portfolio($breadcrumb, false);
        }

        /**
         * page Other
         */
        else {
            if ($count > 1) {
                $endBreadcrumb = $breadcrumb[$count - 1];
                unset($breadcrumb[$count - 1]);
                $title = esc_html($endBreadcrumb[0]);

                /**
                 * Page search
                 */
                if (is_search() && $count > 2 && isset($breadcrumb[$count-2][1])) {
                    unset($breadcrumb[$count-2][1]);
                }
            }
        }

        echo $title ? '<span class="nasa-first-breadcrumb">' . $before . $title . $after . '</span>' : '';

        echo $wrap_before;

        $key = 0;
        $sizeof = sizeof($breadcrumb);
        foreach ($breadcrumb as $crumb) {
            echo $before;
            echo (!empty($crumb[1])) ? '<a href="' . esc_url($crumb[1]) . '" title="' . esc_attr($crumb[0]) . '">' . esc_html($crumb[0]) . '</a>' : esc_html($crumb[0]);
            echo $after;
            echo ($sizeof !== $key + 1) ? $delimiter : '';

            $key++;
        }

        echo $wrap_after;
    }
}

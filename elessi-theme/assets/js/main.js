jQuery(window).trigger('resize').trigger('scroll');
var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);

var wow_enable = false,
    fullwidth = 1200,
    nasa_quick_viewing = false,
    _single_variations = [],
    _lightbox_variations = [],
    _count_wishlist_items = 0,
    searchProducts = null,
    _cookie_live = 7;
    
/* Document ready */
jQuery(document).ready(function($) {
"use strict";

/**
 * Check enable mobile layout
 * 
 * @type Boolean
 */
var _nasa_in_mobile = $('input[name="nasa_mobile_layout"]').length ? true : false;

/**
 * Before Load site
 */
if ($('#nasa-before-load').length) {
    $('#nasa-before-load').fadeOut(100);
    
    setTimeout(function() {
        $('#nasa-before-load').remove();
    }, 100);
}

/**
 * Site Loaded
 */
$('body').addClass('nasa-body-loaded');

// Init Wow effect
if ($('body').hasClass('nasa-enable-wow')) {
    wow_enable = true;
    new WOW({mobile: false}).init();
}

/**
 * Delay Click yith wishlist
 */
if ($('.nasa_yith_wishlist_premium-wrap').length && $('.nasa-wishlist-count.wishlist-number').length) {
    $(document).ajaxComplete(function() {
        setTimeout(function() {
            $('.nasa_yith_wishlist_premium-wrap').each(function() {
                var _this = $(this);
                if (!$(_this).parents('.wishlist_sidebar').length) {
                    var _countWishlist = $(_this).find('.wishlist_table tbody tr .wishlist-empty').length ? '0' : $(_this).find('.wishlist_table tbody tr').length;
                    $('.nasa-mini-number.wishlist-number').html(_countWishlist);

                    if (_countWishlist === '0') {
                        $('.nasa-mini-number.wishlist-number').addClass('nasa-product-empty');
                    }
                }
            });
        }, 300);
    }).ajaxError(function() {
        console.log('Error with wishlist premium.');
    });
}

/**
 * Load Content Static Blocks
 */
if (
    typeof nasa_ajax_params !== 'undefined' &&
    typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
) {
    var _urlAjaxStaticContent = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_ajax_static_content');

    var _data_static_content = {};
    var _call_static_content = false;
    
    if ($('input[name="nasa_yith_wishlist_actived"]').length) {
        _data_static_content['reload_yith_wishlist'] = '1';
        _call_static_content = true;
    }
    
    if ($('input[name="nasa-caching-enable"]').length && $('input[name="nasa-caching-enable"]').val() === '1') {
        if ($('.nasa-login-register-ajax').length) {
            _data_static_content['reload_my_account'] = '1';
            _call_static_content = true;
        }
        
        if ($('.nasa-hello-acc').length) {
            _data_static_content['reload_login_register'] = '1';
            _call_static_content = true;
        }
    }
    
    if (_call_static_content) {
        if ($('.nasa-value-gets').length && $('.nasa-value-gets').find('input').length) {
            $('.nasa-value-gets').find('input').each(function() {
                var _key = $(this).attr('name');
                var _val = $(this).val();
                _data_static_content[_key] = _val;
            });
        }

        $.ajax({
            url: _urlAjaxStaticContent,
            type: 'post',
            data: _data_static_content,
            cache: false,
            success: function(result) {
                if (typeof result !== 'undefined' && result.success === '1') {
                    $.each(result.content, function(key, value) {
                        if ($(key).length) {
                            $(key).replaceWith(value);

                            if (key === '#nasa-wishlist-sidebar-content') {
                                initWishlistIcons($);
                            }
                        }
                    });
                }

                $('body').trigger('nasa_after_load_static_content');
            }
        });
    }
}

// Fix vertical mega menu
if ($('.vertical-menu-wrapper').length) {
    $('.vertical-menu-wrapper').attr('data-over', '0');

    var width_default = 200;
    
    $('.vertical-menu-container').each(function() {
        var _this = $(this);
        var _h_vertical = $(_this).height();
        $(_this).find('.nasa-megamenu >.nav-dropdown').each(function() {
            $(this).find('>.sub-menu').css({'min-height': _h_vertical});
        });
    });

    $('body').on('mousemove', '.vertical-menu-container .nasa-megamenu', function() {
        var _wrap = $(this).parents('.vertical-menu-wrapper');
        var _h_vertical = $(_wrap).outerHeight();
        
        $(_wrap).find('.nasa-megamenu').removeClass('nasa-curent-hover');
        $(_wrap).addClass('nasa-curent-hover');

        var _row = $(_wrap).parents('.row').length ? $(_wrap).parents('.row') : $(_wrap).parents('.nasa-row');
        var _w_mega, _w_mega_df, _w_ss;
        var total_w = $(_row).length ? $(_row).width() : 900;
        
        $(_wrap).find('.nasa-megamenu').each(function() {
            var _this = $(this);
            
            var current_w = $(_this).outerWidth();
            _w_mega = _w_mega_df = total_w - current_w;
        
            if ($(_this).hasClass('cols-5') || $(_this).hasClass('fullwidth')) {
                _w_mega = _w_mega - 20;
            } else {
                if ($(_this).hasClass('cols-2')) {
                    _w_mega = _w_mega / 5 * 2 + 50;
                    _w_ss = width_default * 2;
                    _w_mega = (_w_ss > _w_mega && _w_ss < _w_mega_df) ? _w_ss : _w_mega;
                }
                else if ($(_this).hasClass('cols-3')) {
                    _w_mega = _w_mega / 5 * 3 + 50;
                    _w_ss = width_default * 3;
                    _w_mega = (_w_ss > _w_mega && _w_ss < _w_mega_df) ? _w_ss : _w_mega;
                }
                else if ($(_this).hasClass('cols-4')) {
                    _w_mega = _w_mega / 5 * 4 + 50;
                    _w_ss = width_default * 4;
                    _w_mega = (_w_ss > _w_mega && _w_ss < _w_mega_df) ? _w_ss : _w_mega;
                }
            }
            
            $(_this).find('>.nav-dropdown').css({'width': _w_mega});
            if ($(_this).find('>.nav-dropdown >.sub-menu').length) {
                $(_this).find('>.nav-dropdown >.sub-menu').css({'min-height': _h_vertical});
            }
        });
    });

    $('body').on('mouseover', '.vertical-menu-wrapper .menu-item-has-children.default-menu', function() {
        var _wrap = $(this).parents('.vertical-menu-wrapper');
        $(this).find('> .nav-dropdown > .sub-menu').css({'width': width_default});
        
        var _row = $(_wrap).parents('.row').length ? $(_wrap).parents('.row') : $(_wrap).parents('.nasa-row');

        var _w_mega, _w_mega_df, _w_ss;
        var total_w = $(_row).length ? $(_row).width() : 900;
        
        $(_wrap).find('.nasa-megamenu').each(function() {
            var _this = $(this);
            
            var current_w = $(_this).outerWidth();
            _w_mega = _w_mega_df = total_w - current_w;
            
            if ($(_this).hasClass('cols-5') || $(_this).hasClass('fullwidth')) {
                _w_mega = _w_mega - 20;
            } else {
                if ($(_this).hasClass('cols-2')) {
                    _w_mega = _w_mega / 5 * 2 + 50;
                    _w_ss = width_default * 2;
                    _w_mega = (_w_ss > _w_mega && _w_ss < _w_mega_df) ? _w_ss : _w_mega;
                }
                else if ($(_this).hasClass('cols-3')) {
                    _w_mega = _w_mega / 5 * 3 + 50;
                    _w_ss = width_default * 3;
                    _w_mega = (_w_ss > _w_mega && _w_ss < _w_mega_df) ? _w_ss : _w_mega;
                }
                else if ($(_this).hasClass('cols-4')) {
                    _w_mega = _w_mega / 5 * 4 + 50;
                    _w_ss = width_default * 4;
                    _w_mega = (_w_ss > _w_mega && _w_ss < _w_mega_df) ? _w_ss : _w_mega;
                }
            }
            
            $(_this).find('>.nav-dropdown').css({'width': _w_mega});
        });
    });
}

/**
 * For Header Builder Icon menu mobile switcher
 */
if ($('.header-type-builder').length && $('.nasa-nav-extra-warp').length <= 0) {
    $('.static-position').append('<div class="nasa-nav-extra-warp nasa-show"><div class="desktop-menu-bar"><div class="mini-icon-mobile"><a href="javascript:void(0);" class="nasa-mobile-menu_toggle bar-mobile_toggle"><span class="fa fa-bars"></span></a></div></div></div>');
}

/**
 * Init menu mobile
 */
$('body').on('click', '.nasa-mobile-menu_toggle', function() {
    initMenuMobile($);
    
    if ($('#mobile-navigation').length) {
        if ($('#mobile-navigation').attr('data-show') !== '1') {
            if ($('#nasa-menu-sidebar-content').hasClass('nasa-dark')) {
                $('.black-window').addClass('nasa-transparent');
            }
            
            $('.black-window').show().addClass('desk-window');
            
            if ($('#nasa-menu-sidebar-content').length && !$('#nasa-menu-sidebar-content').hasClass('nasa-active')) {
                $('#nasa-menu-sidebar-content').addClass('nasa-active');
            }
            
            $('#mobile-navigation').attr('data-show', '1');
        } else {
            $('.black-window').trigger('click');
        }
    }
});

$('body').on('click', '.nasa-close-menu-mobile, .nasa-close-sidebar', function() {
    $('.black-window').trigger('click');
});

/**
 * Accordion Mobile Menu
 */
$('body').on('click', '.nasa-menu-accordion .li_accordion > a.accordion', function(e) {
    e.preventDefault();
    var ths = $(this).parent();
    var cha = $(ths).parent();
    if (!$(ths).hasClass('active')) {
        var c = $(cha).children('li.active');
        $(c).removeClass('active').children('.nav-dropdown-mobile').css({height:'auto'}).slideUp(300);
        $(ths).children('.nav-dropdown-mobile').slideDown(300).parent().addClass('active');
    } else {
        $(ths).find('>.nav-dropdown-mobile').slideUp(300).parent().removeClass('active');
    }
    return false;
});

/**
 * Accordion Element
 */
if ($('.nasa-accordion .li_accordion > a.accordion').length) {
    $('body').on('click', '.nasa-accordion .li_accordion > a.accordion', function() {
        var _current = $(this);
        
        var ths = $(_current).parent();
        var cha = $(ths).parent();
        
        if (!$(ths).hasClass('active')) {
            $(cha).removeClass('nasa-current-tax-parent').removeClass('current-tax-item');
            var c = $(cha).children('li.active');
            $(c).removeClass('active').children('.children').slideUp(300);
            $(ths).addClass('active').children('.children').slideDown(300);
        }
        
        else {
            $(ths).removeClass('active').children('.children').slideUp(300);
        }
        
        return false;
    });
}

/*
 * Quick view
 */
var quickview_html = [];
var setMaxHeightQVPU;
$('body').on('click', '.quick-view', function(e) {
    $.magnificPopup.close();
    
    if (
        typeof nasa_ajax_params !== 'undefined' &&
        typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
    ) {
        var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_quick_view');
        var _this = $(this);
        var _product_type = $(_this).attr('data-product_type');
        
        if (_product_type === 'woosb' && typeof $(_this).attr('data-href') !== 'undefined') {
            window.location.href = $(_this).attr('data-href');
        }
        
        else {
            var _wrap = $(_this).parents('.product-item'),
                product_id = $(_this).attr('data-prod'),
                _wishlist = ($(_this).attr('data-from_wishlist') === '1') ? '1' : '0';

            if ($(_wrap).length <= 0) {
                _wrap = $(_this).parents('.item-product-widget');
            }

            if ($(_wrap).length <= 0) {
                _wrap = $(_this).parents('.wishlist-item-warper');
            }
            
            if ($(_wrap).length) {
                $(_wrap).append('<div class="nasa-light-fog"></div><div class="nasa-loader"></div>');
            }

            var _data = {
                product: product_id,
                nasa_wishlist: _wishlist
            };
            
            nasa_quick_viewing = true;

            if ($('.nasa-value-gets').length && $('.nasa-value-gets').find('input').length) {
                $('.nasa-value-gets').find('input').each(function() {
                    var _key = $(this).attr('name');
                    var _val = $(this).val();
                    _data[_key] = _val;
                });
            }

            var sidebar_holder = $('#nasa-quickview-sidebar').length === 1 ? true : false;
            
            _data.quickview = sidebar_holder ? 'sidebar' : 'popup';
            
            var _callAjax = true;

            if (typeof quickview_html[product_id] !== 'undefined') {
                _callAjax = false;
            }

            if (_callAjax) {
                $.ajax({
                    url : _urlAjax,
                    type: 'post',
                    dataType: 'json',
                    data: _data,
                    cache: false,
                    beforeSend: function() {
                        if (sidebar_holder) {
                            $('#nasa-quickview-sidebar #nasa-quickview-sidebar-content').html(
                                '<div class="nasa-loader"></div>'
                            );
                            $('.black-window').fadeIn(200).addClass('desk-window');
                            $('#nasa-viewed-sidebar').removeClass('nasa-active');

                            if ($('#nasa-quickview-sidebar').length && !$('#nasa-quickview-sidebar').hasClass('nasa-active')) {
                                $('#nasa-quickview-sidebar').addClass('nasa-active');
                            }
                        }

                        if ($('.nasa-static-wrap-cart-wishlist').length && $('.nasa-static-wrap-cart-wishlist').hasClass('nasa-active')) {
                            $('.nasa-static-wrap-cart-wishlist').removeClass('nasa-active');
                        }

                        if (typeof setMaxHeightQVPU !== 'undefined') {
                            clearInterval(setMaxHeightQVPU);
                        }
                    },
                    success: function(response) {
                        quickview_html[product_id] = response;
                        
                        // Sidebar hoder
                        if (sidebar_holder) {
                            $('#nasa-quickview-sidebar #nasa-quickview-sidebar-content').html('<div class="product-lightbox">' + response.content + '</div>');
                            
                            setTimeout(function() {
                                $('#nasa-quickview-sidebar #nasa-quickview-sidebar-content .product-lightbox').addClass('nasa-loaded');
                            }, 600);
                        }

                        // Popup classical
                        else {
                            $.magnificPopup.open({
                                mainClass: 'my-mfp-zoom-in',
                                items: {
                                    src: '<div class="product-lightbox">' + response.content + '</div>',
                                    type: 'inline'
                                },
                                tClose: $('input[name="nasa-close-string"]').val(),
                                callbacks: {
                                    beforeClose: function() {
                                        this.st.removalDelay = 350;
                                    },
                                    afterClose: function() {
                                        if (typeof setMaxHeightQVPU !== 'undefined') {
                                            clearInterval(setMaxHeightQVPU);
                                        }
                                    }
                                }
                            });

                            $('.black-window').trigger('click');
                        }
                        
                        /**
                         * Init Gallery image
                         */
                        $('body').trigger('nasa_init_product_gallery_lightbox');

                        if ($(_this).hasClass('nasa-view-from-wishlist')) {
                            $('.wishlist-item').animate({opacity: 1}, 500);
                            if (!sidebar_holder) {
                                $('.wishlist-close a').trigger('click');
                            }
                        }

                        if ($(_wrap).length) {
                            $(_wrap).find('.nasa-loader, .color-overlay, .nasa-dark-fog, .nasa-light-fog').remove();
                        }

                        var formLightBox = $('.product-lightbox').find('.variations_form');
                        if ($(formLightBox).length && $(formLightBox).find('.single_variation_wrap').length) {
                            $(formLightBox).find('.single_variation_wrap').hide();
                            $(formLightBox).wc_variation_form_lightbox(response.mess_unavailable);
                            $(formLightBox).find('select').change();
                            if ($(formLightBox).find('.variations select option[selected="selected"]').length) {
                                $(formLightBox).find('.variations .reset_variations').css({'visibility': 'visible'}).show();
                            }
                            if ($('input[name="nasa_attr_ux"]').length === 1 && $('input[name="nasa_attr_ux"]').val() === '1') {
                                $(formLightBox).nasa_attr_ux_variation_form();
                            }
                        }

                        var groupLightBox = $('.product-lightbox').find('.woocommerce-grouped-product-list-item');
                        if ($(groupLightBox).length) {
                            $(groupLightBox).removeAttr('style');
                            $(groupLightBox).removeClass('wow');
                        }

                        if (!sidebar_holder) {
                            setMaxHeightQVPU = setInterval(function() {
                                var _h_l = $('.product-lightbox .product-img').outerHeight();

                                $('.product-lightbox .product-quickview-info').css({
                                    'max-height': _h_l,
                                    'overflow-y': 'auto'
                                });

                                if (!$('.product-lightbox .product-quickview-info').hasClass('nasa-active')) {
                                    $('.product-lightbox .product-quickview-info').addClass('nasa-active');
                                }

                                if (_nasa_in_mobile) {
                                    clearInterval(setMaxHeightQVPU);
                                }
                            }, 1000);
                        }

                        add_class_btn_single_button($);
                        
                        $('body').trigger('nasa_after_quickview');
                        
                        setTimeout(function() {
                            $('body').trigger('nasa_after_quickview_timeout');
                        }, 600);

                        setTimeout(function() {
                            $(window).resize();
                        }, 800);
                    }
                });
            } else {
                var quicview_obj = quickview_html[product_id];
                
                if (sidebar_holder) {
                    $('#nasa-quickview-sidebar #nasa-quickview-sidebar-content').html(
                        '<div class="nasa-loader"></div>'
                    );
                    $('.black-window').fadeIn(200).addClass('desk-window');
                    $('#nasa-viewed-sidebar').removeClass('nasa-active');

                    if ($('#nasa-quickview-sidebar').length && !$('#nasa-quickview-sidebar').hasClass('nasa-active')) {
                        $('#nasa-quickview-sidebar').addClass('nasa-active');
                    }
                }

                if ($('.nasa-static-wrap-cart-wishlist').length && $('.nasa-static-wrap-cart-wishlist').hasClass('nasa-active')) {
                    $('.nasa-static-wrap-cart-wishlist').removeClass('nasa-active');
                }

                if (typeof setMaxHeightQVPU !== 'undefined') {
                    clearInterval(setMaxHeightQVPU);
                }
                
                // Sidebar hoder
                if (sidebar_holder) {
                    $('#nasa-quickview-sidebar #nasa-quickview-sidebar-content').html('<div class="product-lightbox hidden-tag">' + quicview_obj.content + '</div>');

                    setTimeout(function() {
                        $('#nasa-quickview-sidebar #nasa-quickview-sidebar-content .product-lightbox').fadeIn(1000);
                    }, 600);
                }

                // Popup classical
                else {
                    $.magnificPopup.open({
                        mainClass: 'my-mfp-zoom-in',
                        items: {
                            src: '<div class="product-lightbox">' + quicview_obj.content + '</div>',
                            type: 'inline'
                        },
                        tClose: $('input[name="nasa-close-string"]').val(),
                        callbacks: {
                            beforeClose: function() {
                                this.st.removalDelay = 350;
                            },
                            afterClose: function() {
                                if (typeof setMaxHeightQVPU !== 'undefined') {
                                    clearInterval(setMaxHeightQVPU);
                                }
                            }
                        }
                    });

                    $('.black-window').trigger('click');
                }

                /**
                 * Init Gallery image
                 */
                $('body').trigger('nasa_init_product_gallery_lightbox');

                if ($(_this).hasClass('nasa-view-from-wishlist')) {
                    $('.wishlist-item').animate({opacity: 1}, 500);
                    if (!sidebar_holder) {
                        $('.wishlist-close a').trigger('click');
                    }
                }

                if ($(_wrap).length) {
                    $(_wrap).find('.nasa-loader, .color-overlay, .nasa-dark-fog, .nasa-light-fog').remove();
                }

                var formLightBox = $('.product-lightbox').find('.variations_form');
                if ($(formLightBox).length && $(formLightBox).find('.single_variation_wrap').length) {
                    $(formLightBox).find('.single_variation_wrap').hide();
                    $(formLightBox).wc_variation_form_lightbox(quicview_obj.mess_unavailable);
                    $(formLightBox).find('select').change();
                    if ($(formLightBox).find('.variations select option[selected="selected"]').length) {
                        $(formLightBox).find('.variations .reset_variations').css({'visibility': 'visible'}).show();
                    }
                    if ($('input[name="nasa_attr_ux"]').length === 1 && $('input[name="nasa_attr_ux"]').val() === '1') {
                        $(formLightBox).nasa_attr_ux_variation_form();
                    }
                }

                var groupLightBox = $('.product-lightbox').find('.woocommerce-grouped-product-list-item');
                if ($(groupLightBox).length) {
                    $(groupLightBox).removeAttr('style');
                    $(groupLightBox).removeClass('wow');
                }

                if (!sidebar_holder) {
                    setMaxHeightQVPU = setInterval(function() {
                        var _h_l = $('.product-lightbox .product-img').outerHeight();

                        $('.product-lightbox .product-quickview-info').css({
                            'max-height': _h_l,
                            'overflow-y': 'auto'
                        });

                        if (!$('.product-lightbox .product-quickview-info').hasClass('nasa-active')) {
                            $('.product-lightbox .product-quickview-info').addClass('nasa-active');
                        }

                        if (_nasa_in_mobile) {
                            clearInterval(setMaxHeightQVPU);
                        }
                    }, 1000);
                }

                add_class_btn_single_button($);

                $('body').trigger('nasa_after_quickview');
                
                setTimeout(function() {
                    $('body').trigger('nasa_after_quickview_timeout');
                }, 600);

                setTimeout(function() {
                    $(window).resize();
                }, 800);
            }
        }
    }
    
    e.preventDefault();
});

/**
 * Change gallery for variation - Quick view
 */
$('body').on('nasa_changed_gallery_variable_quickview', function() {
    $('body').trigger('nasa_load_slick_slider');
});

/**
 * Change gallery for variation - single
 */
$('body').on('nasa_changed_gallery_variable_single', function() {
    loadSlickSingleProduct($, true);
    loadGalleryPopup($);

    $('body').trigger('nasa_compatible_jetpack');

    setTimeout(function() {
        $('.product-gallery').css({'min-height': 'auto'});
        $(window).resize();
    }, 100);
});

/**
 * Change Countdown for variation - Quick view
 */
$('body').on('nasa_changed_countdown_variable_single', function() {
    $('body').trigger('nasa_load_countdown');
});

/**
 * Add class btn fullwidth for add to cart in single product - quick view
 */
add_class_btn_single_button($);

$(".gallery a[href$='.jpg'], .gallery a[href$='.jpeg'], .featured-item a[href$='.jpeg'], .featured-item a[href$='.gif'], .featured-item a[href$='.jpg'], .page-featured-item .slider > a, .page-featured-item .page-inner a > img, .gallery a[href$='.png'], .gallery a[href$='.jpeg'], .gallery a[href$='.gif']").parent().magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: '<div class="nasa-loader"></div>',
    tClose: $('input[name="nasa-close-string"]').val(),
    mainClass: 'my-mfp-zoom-in',
    gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0,1]
    },
    image: {
        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
    }
});

var _loadingBeforeResize = setTimeout(function() {
    /**
     * Fix height for full width to side
     */
    loadHeightFullWidthToSide($);

    /**
     * Main menu Reponsive
     */
    loadResponsiveMainMenu($);
}, 100);

var _load_equal_height_columns = setTimeout(function() {
    /**
     * Equal height columns
     */
    row_equal_height_columns($);
}, 100);

var _load_equal_height_columns_scroll;

// **********************************************************************// 
// ! Fixed header
// **********************************************************************//
var headerHeight = $('#header-content').height();
var timeOutFixedHeader;
$(window).scroll(function() {
    var scrollTop = $(this).scrollTop();
    
    if ($('input[name="nasa_fixed_single_add_to_cart"]').length) {
        if ($('.nasa-product-details-page .single_add_to_cart_button').length) {
            var addToCart = $('.nasa-product-details-page .woocommerce-tabs') || $('.nasa-product-details-page .single_add_to_cart_button');
            if ($(addToCart).length) {
                var addToCartOffset = $(addToCart).offset();

                if (scrollTop >= addToCartOffset.top) {
                    if (!$('body').hasClass('has-nasa-cart-fixed')) {
                        $('body').addClass('has-nasa-cart-fixed');
                    }
                } else {
                    $('body').removeClass('has-nasa-cart-fixed');
                }
            }
        }
    }
    
    if ($('body').find('.nasa-header-sticky').length && $('.sticky-wrapper').length) {
        var fix_top = 0;
        if ($('#wpadminbar').length) {
            fix_top = $('#wpadminbar').height();
        }
        var _heightFixed = $('.sticky-wrapper').outerHeight();
        
        if (scrollTop > headerHeight) {
            if (typeof timeOutFixedHeader !== 'undefined') {
                clearTimeout(timeOutFixedHeader);
            }
            
            if (!$('.sticky-wrapper').hasClass('fixed-already')) {
                $('.sticky-wrapper').addClass('fixed-already');
                $('.nasa-header-sticky').css({'margin-bottom': _heightFixed});
                if (fix_top > 0) {
                    $('.sticky-wrapper').css({top: fix_top});
                }
            }
        } else {
            $('.sticky-wrapper').removeClass('fixed-already');
            $('.nasa-header-sticky').removeAttr('style');
            $('.sticky-wrapper').removeAttr('style');
            
            if ($('body').hasClass('rtl')) {
                $('.sticky-wrapper').css({'overflow': 'hidden'});
            
                timeOutFixedHeader = setTimeout(function() {
                    $('.sticky-wrapper').css({'overflow': 'unset'});
                }, 10);
            }
            
            _heightFixed = $('.sticky-wrapper').outerHeight();
        }
    }
    
    if ($('.nasa-nav-extra-warp').length) {
        if (scrollTop > headerHeight) {
            if (!$('.nasa-nav-extra-warp').hasClass('nasa-show')) {
                $('.nasa-nav-extra-warp').addClass('nasa-show');
            }
        } else {
            if ($('.nasa-nav-extra-warp').hasClass('nasa-show')) {
                $('.nasa-nav-extra-warp').removeClass('nasa-show');
            }
        }
    }
    
    /* Back to Top */
    if ($('#nasa-back-to-top').length) {
        if (typeof intervalBTT !== 'undefined' && intervalBTT) {
            clearInterval(intervalBTT);
        }
        var intervalBTT = setInterval(function() {
            var _height_win = $(window).height() / 2;
            if (scrollTop > _height_win) {
                if (!$('#nasa-back-to-top').hasClass('nasa-show')) {
                    $('#nasa-back-to-top').addClass('nasa-show');
                }
            } else {
                $('#nasa-back-to-top').removeClass('nasa-show');
            }
            
            clearInterval(intervalBTT);
        }, 100);
    }
    
    /**
     * Equal height columns
     */
    clearTimeout(_load_equal_height_columns_scroll);
    _load_equal_height_columns_scroll = setTimeout(function() {
        row_equal_height_columns($, true);
    }, 100);
});

// **********************************************************************// 
// ! Header slider overlap for Transparent
// **********************************************************************//
$(window).resize(function() {
    var _mobileView = $('.nasa-check-reponsive.nasa-switch-check').length && $('.nasa-check-reponsive.nasa-switch-check').width() === 1 ? true : false;
    
    var _inMobile = $('body').hasClass('nasa-in-mobile') ? true : false;

    // Fix Sidebar Mobile, Search Mobile display switch to desktop
    var desk = $('.black-window').hasClass('desk-window');
    if (!_mobileView && !desk && !_inMobile) {
        if ($('.col-sidebar').length) {
            $('.col-sidebar').removeClass('nasa-active');
        }
        if ($('.warpper-mobile-search').length && !$('.warpper-mobile-search').hasClass('show-in-desk')) {
            $('.warpper-mobile-search').removeClass('nasa-active');
        }
        if ($('.black-window').length) {
            $('.black-window').hide();
        }
    }
    
    /**
     * Active Filter cat top
     */
    initTopCategoriesFilter($);

    /* Fix width menu vertical */
    if ($('.wide-nav .nasa-vertical-header').length) {
        var _v_width = $('.wide-nav .nasa-vertical-header').width();
        _v_width = _v_width < 280 ? 280: _v_width;
        $('.wide-nav .vertical-menu-container').css({'width': _v_width});
    }
    
    var _height_adminbar = $('#wpadminbar').length ? $('#wpadminbar').height() : 0;
    if (_height_adminbar > 0 && $('#mobile-navigation').length === 1) {
        $('#nasa-menu-sidebar-content').css({'top': _height_adminbar});
        
        if ($('#mobile-navigation').attr('data-show') === '1' && !_mobileView) {
            var _scrollTop = $(window).scrollTop();
            var _headerHeight = $('#header-content').height() + 50;
            if (_scrollTop <= _headerHeight) {
                $('.black-window').trigger('click');
            }
        }
    }
    
    /* Fix scroll single product */
    loadScrollSingleProduct($);
    
    clearTimeout(_loadingBeforeResize);
    _loadingBeforeResize = setTimeout(function() {
        /**
         * Fix height for full width to side
         */
        loadHeightFullWidthToSide($);
        
        /**
         * Main menu Reponsive
         */
        loadResponsiveMainMenu($);
    }, 1100);
    
    clearTimeout(_load_equal_height_columns);
    _load_equal_height_columns = setTimeout(function() {
        /**
         * Equal height columns
         */
        row_equal_height_columns($, false);
    }, 1150);
    
    clearTimeout(_positionMobileMenu);
    _positionMobileMenu = setTimeout(function() {
        positionMenuMobile($);
    }, 100);
});

var _positionMobileMenu = setTimeout(function() {
    positionMenuMobile($);
}, 100);

/* Fix width menu vertical =============================================== */
if ($('.wide-nav .nasa-vertical-header').length) {
    var _v_width = $('.wide-nav .nasa-vertical-header').width();
    _v_width = _v_width < 280 ? 280: _v_width;
    $('.wide-nav .vertical-menu-container').css({'width': _v_width});
    if ($('.wide-nav .vertical-menu-container.nasa-allways-show').length) {
        $('.wide-nav .vertical-menu-container.nasa-allways-show').addClass('nasa-active');
    }
}

/**
 * Accordions
 */
init_accordion($);
$('body').on('click', '.nasa-accordions-content .nasa-accordion-title a', function() {
    var _this = $(this);
    var warp = $(_this).parents('.nasa-accordions-content');
    var _global = $(warp).hasClass('nasa-no-global') ? true : false;
    $(warp).removeClass('nasa-accodion-first-show');
    var _id = $(_this).attr('data-id');
    var _index = false;
    if (typeof _id === 'undefined' || !_id) {
        _index = $(_this).attr('data-index');
    }
    
    var _current = _index ? $(warp).find('.' + _index) : $(warp).find('#nasa-section-' + _id);

    if (!$(_this).hasClass('active')) {
        if (!_global) {
            $(warp).find('.nasa-accordion-title a').removeClass('active');
            $(warp).find('.nasa-panel.active').removeClass('active').slideUp(200);
        }
        
        $(_this).addClass('active');
        if ($(_current).length) {
            $(_current).addClass('active').slideDown(200);
        }
    } else {
        $(_this).removeClass('active');
        if ($(_current).length) {
            $(_current).removeClass('active').slideUp(200);
        }
    }

    return false;
});

/**
 * After Quick view
 */
$('body').on('nasa_after_quickview_timeout', function() {
    init_accordion($);
    
    /**
     * VC Progress bar
     */
    if ($('.product-lightbox .vc_progress_bar .vc_bar').length) {
        $('.product-lightbox .vc_progress_bar .vc_bar').each(function() {
            var _this = $(this);
            var _per = $(_this).attr('data-percentage-value');
            $(_this).css({'width': _per + '%'});
        });
    }
});

/**
 * Tabs Content
 */
$('body').on('click', '.nasa-tabs a', function(e) {
    e.preventDefault();
    
    var _this = $(this);
    if (!$(_this).parent().hasClass('active')) {
        var _root = $(_this).parents('.nasa-tabs-content');
        var _nasa_tabs = $(_root).find('.nasa-tabs');
        
        
        var currentTab = $(_this).attr('data-id');
        if (typeof currentTab === 'undefined' || !currentTab) {
            var _index = $(_this).attr('data-index');
            currentTab = $(_root).find('.' + _index);
        }
        
        $(_root).find('.nasa-tabs > li').removeClass('active');
        $(_this).parent().addClass('active');
        $(_root).find('.nasa-panel').removeClass('active').hide();
        
        if ($(currentTab).length) {
            $(currentTab).addClass('active').show();
        }

        if ($(_nasa_tabs).hasClass('nasa-slide-style')) {
            nasa_tab_slide_style($, _nasa_tabs, 500);
        }
        
        $('body').trigger('nasa_after_changed_tab_content', [currentTab]);
    }
});

/**
 * After changed tab content
 */
$('body').on('nasa_after_changed_tab_content', function(ev, currentTab) {
    if (wow_enable && $(currentTab).length) {
        var _delay = 0;
        $(currentTab).find('.wow').each(function() {
            var _wow = $(this);
            $(_wow).css({
                'animation-name': 'fadeInUp',
                'visibility': 'visible',
                'opacity': 0
            });
            
            _delay += parseInt($(_wow).attr('data-wow-delay'));
            
            setTimeout(function() {
                $(_wow).animate({'opacity': 1}, 100);
            }, _delay);
        });
    }
});

if ($('.nasa-tabs.nasa-slide-style').length) {
    $('.nasa-slide-style').each(function() {
        var _this = $(this);
        nasa_tab_slide_style($, _this, 500);
    });

    $(window).resize(function() {
        $('.nasa-slide-style').each(function() {
            var _this = $(this);
            nasa_tab_slide_style($, _this, 50);
        });
    });
}

if ($('.nasa_banner .center').length) {
    $('.nasa_banner .center').vAlign();
    $(window).resize(function() {
        $('.nasa_banner .center').vAlign();
    });
}

if ($('.col_hover_focus').length) {
    $('body').on('hover', '.col_hover_focus', function() {
        $(this).parent().find('.columns > *').css('opacity', '0.5');
    }, function() {
        $(this).parent().find('.columns > *').css('opacity', '1');
    });
}

$('.row ~ br, .columns ~ br, .columns ~ p').remove();
/*********************************************************************
// ! Promo popup
/ *******************************************************************/
var et_popup_closed = $.cookie('nasa_popup_closed');
if (et_popup_closed !== 'do-not-show' && $('.nasa-popup').length && $('body').hasClass('open-popup')) {
    var _delayremoVal = parseInt($('.nasa-popup').attr('data-delay'));
    _delayremoVal = !_delayremoVal ? 300 : _delayremoVal * 1000;
    var _disableMobile = $('.nasa-popup').attr('data-disable_mobile') === 'true' ? true : false;
    var _one_time = $('.nasa-popup').attr('data-one_time');
    
    $('.nasa-popup').magnificPopup({
        items: {
            src: '#nasa-popup',
            type: 'inline'
        },
        tClose: $('input[name="nasa-close-string"]').val(),
        removalDelay: 300, //delay removal by X to allow out-animation
        fixedContentPos: true,
        callbacks: {
            beforeOpen: function() {
                this.st.mainClass = 'my-mfp-slide-bottom';
            },
            beforeClose: function() {
                var showagain = $('#showagain:checked').val();
                if (showagain === 'do-not-show' || _one_time === '1') {
                    $.cookie('nasa_popup_closed', 'do-not-show', {expires: _cookie_live, path: '/'});
                }
            }
        },
        disableOn: function() {
            if (_disableMobile && $(window).width() <= 640) {
                return false;
            }
            
            return true;
        }
    });
    
    setTimeout(function() {
        $('.nasa-popup').magnificPopup('open');
    }, _delayremoVal);
    
    $('body').on('click', '#nasa-popup input[type="submit"]', function() {
        $(this).ajaxSuccess(function(event, request, settings) {
            if (typeof request === 'object' && request.responseJSON.status === 'mail_sent') {
                $('body').append('<div id="nasa-newsletter-alert" class="hidden-tag"><div class="wpcf7-response-output wpcf7-mail-sent-ok">' + request.responseJSON.message + '</div></div>');

                $.cookie('nasa_popup_closed', 'do-not-show', {expires: _cookie_live, path: '/'});
                $.magnificPopup.close();

                setTimeout(function() {
                    $('#nasa-newsletter-alert').fadeIn(300);

                    setTimeout(function() {
                        $('#nasa-newsletter-alert').fadeOut(500);
                    }, 2000);
                }, 300);
            }
        });
    });
}

/*
 * Compare products
 */
$('body').on('click', '.btn-compare', function() {
    var _this = $(this);
    if (!$(_this).hasClass('nasa-compare')) {
        var _button = $(_this).parent();
        if ($(_button).find('.compare-button .compare').length) {
            $(_button).find('.compare-button .compare').trigger('click');
        }
    } else {
        var _id = $(_this).attr('data-prod');
        if (_id) {
            add_compare_product(_id, $);
        }
    }
    
    return false;
});

/**
 * Remove item from Compare
 */
$('body').on('click', '.nasa-remove-compare', function() {
    var _id = $(this).attr('data-prod');
    if (_id) {
        remove_compare_product(_id, $);
    }
    
    return false;
});

/**
 * Remove All items from Compare
 */
$('body').on('click', '.nasa-compare-clear-all', function() {
    removeAll_compare_product($);
    
    return false;
});

/**
 * Show Compare
 */
$('body').on('click', '.nasa-show-compare', function() {
    loadCompare($);
    
    if (!$(this).hasClass('nasa-showed')) {
        showCompare($);
    } else {
        hideCompare($);
    }
    
    return false;
});

/**
 * Wishlist products
 */
$('body').on('click', '.btn-wishlist', function() {
    var _this = $(this);
    if (!$(_this).hasClass('nasa-disabled')) {
        $('.btn-wishlist').addClass('nasa-disabled');
        
        /**
         * NasaTheme Wishlist
         */
        if ($(_this).hasClass('btn-nasa-wishlist')) {
            var _pid = $(_this).attr('data-prod');
            
            if (!$(_this).hasClass('nasa-added')) {
                $(_this).addClass('nasa-added');
                nasa_process_wishlist($, _pid, 'nasa_add_to_wishlist');
            } else {
                $(_this).removeClass('nasa-added');
                nasa_process_wishlist($, _pid, 'nasa_remove_from_wishlist');
            }
        }
        
        /**
         * Yith WooCommerce Wishlist
         */
        else {
            if (!$(_this).hasClass('nasa-added')) {
                $(_this).addClass('nasa-added');

                if ($('#tmpl-nasa-global-wishlist').length) {
                    var _pid = $(_this).attr('data-prod');
                    var _origin_id = $(_this).attr('data-original-product-id');
                    var _ptype = $(_this).attr('data-prod_type');
                    var _wishlist_tpl = $('#tmpl-nasa-global-wishlist').html();
                    if ($('.nasa-global-wishlist').length <= 0) {
                        $('body').append('<div class="nasa-global-wishlist"></div>');
                    }

                    _wishlist_tpl = _wishlist_tpl.replace(/%%product_id%%/g, _pid);
                    _wishlist_tpl = _wishlist_tpl.replace(/%%product_type%%/g, _ptype);
                    _wishlist_tpl = _wishlist_tpl.replace(/%%original_product_id%%/g, _origin_id);

                    $('.nasa-global-wishlist').html(_wishlist_tpl);
                    $('.nasa-global-wishlist').find('.add_to_wishlist').trigger('click');
                } else {
                    var _button = $(_this).parent();
                    if ($(_button).find('.add_to_wishlist').length) {
                        $(_button).find('.add_to_wishlist').trigger('click');
                    }
                }
            } else {
                var _pid = $(_this).attr('data-prod');
                if (_pid && $('#yith-wcwl-row-' + _pid).length && $('#yith-wcwl-row-' + _pid).find('.nasa-remove_from_wishlist').length) {
                    $(_this).removeClass('nasa-added');
                    $(_this).addClass('nasa-unliked');
                    $('#yith-wcwl-row-' + _pid).find('.nasa-remove_from_wishlist').trigger('click');

                    setTimeout(function() {
                        $(_this).removeClass('nasa-unliked');
                    }, 1000);
                } else {
                    $('.btn-wishlist').removeClass('nasa-disabled');
                }
            }
        }
    }
    
    return false;
});

/* ADD PRODUCT WISHLIST NUMBER */
$('body').on('added_to_wishlist', function() {
    if (typeof nasa_ajax_params !== 'undefined' && typeof nasa_ajax_params.ajax_url !== 'undefined') {
        var _data = {};
        _data.action = 'nasa_update_wishlist';
        _data.added = true;

        if ($('.nasa-value-gets').length && $('.nasa-value-gets').find('input').length) {
            $('.nasa-value-gets').find('input').each(function() {
                var _key = $(this).attr('name');
                var _val = $(this).val();
                _data[_key] = _val;
            });
        }
        
        $.ajax({
            url: nasa_ajax_params.ajax_url,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: _data,
            beforeSend: function() {

            },
            success: function(res) {
                $('.wishlist_sidebar').replaceWith(res.list);
                var _sl_wishlist = (res.count).toString().replace('+', '');
                var sl_wislist = parseInt(_sl_wishlist);
                $('.nasa-mini-number.wishlist-number').html(res.count);

                if (sl_wislist > 0) {
                    $('.nasa-mini-number.wishlist-number').removeClass('nasa-product-empty');
                } else if (sl_wislist === 0 && !$('.nasa-mini-number.wishlist-number').hasClass('nasa-product-empty')) {
                    $('.nasa-mini-number.wishlist-number').addClass('nasa-product-empty');
                }

                if ($('#yith-wcwl-popup-message').length && typeof res.mess !== 'undefined' && res.mess !== '') {
                    if ($('.nasa-close-notice').length) {
                        $('.nasa-close-notice').trigger('click');
                    }

                    $('#yith-wcwl-popup-message').html(res.mess);

                    $('#yith-wcwl-popup-message').fadeIn();
                    setTimeout( function() {
                        $('#yith-wcwl-popup-message').fadeOut();
                    }, 2000);
                }

                setTimeout(function() {
                    initWishlistIcons($, true);
                    $('.btn-wishlist').removeClass('nasa-disabled');
                }, 350);
            },
            error: function() {
                $('.btn-wishlist').removeClass('nasa-disabled');
            }
        });
    }
});

/* REMOVE PRODUCT WISHLIST NUMBER */
$('body').on('click', '.nasa-remove_from_wishlist', function() {
    if (typeof nasa_ajax_params !== 'undefined' && typeof nasa_ajax_params.ajax_url !== 'undefined') {
        var _wrap_item = $(this).parents('.nasa-tr-wishlist-item');
        if ($(_wrap_item).length) {
            $(_wrap_item).css({opacity: 0.3});
        }

        /**
         * Support Yith WooCommercen Wishlist
         */
        if (!$(this).hasClass('btn-nasa-wishlist')) {
            var _data = {};
            _data.action = 'nasa_remove_from_wishlist';

            if ($('.nasa-value-gets').length && $('.nasa-value-gets').find('input').length) {
                $('.nasa-value-gets').find('input').each(function() {
                    var _key = $(this).attr('name');
                    var _val = $(this).val();
                    _data[_key] = _val;
                });
            }

            var _pid = $(this).attr('data-prod_id');
            _data.remove_from_wishlist = _pid;
            _data.wishlist_id = $('.wishlist_table').attr('data-id');
            _data.pagination = $('.wishlist_table').attr('data-pagination');
            _data.per_page = $('.wishlist_table').attr('data-per-page');
            _data.current_page = $('.wishlist_table').attr('data-page');

            $.ajax({
                url: nasa_ajax_params.ajax_url,
                type: 'post',
                dataType: 'json',
                cache: false,
                data: _data,
                beforeSend: function() {
                    $.magnificPopup.close();
                },
                success: function(res) {
                    if (res.error === '0') {
                        $('.wishlist_sidebar').replaceWith(res.list);
                        var _sl_wishlist = (res.count).toString().replace('+', '');
                        var sl_wislist = parseInt(_sl_wishlist);
                        $('.nasa-mini-number.wishlist-number').html(res.count);
                        if (sl_wislist > 0) {
                            $('.wishlist-number').removeClass('nasa-product-empty');
                        } else if (sl_wislist === 0 && !$('.nasa-mini-number.wishlist-number').hasClass('nasa-product-empty')) {
                            $('.nasa-mini-number.wishlist-number').addClass('nasa-product-empty');
                            $('.black-window').trigger('click');
                        }

                        if ($('.btn-wishlist[data-prod="' + _pid + '"]').length) {
                            $('.btn-wishlist[data-prod="' + _pid + '"]').removeClass('nasa-added');

                            if ($('.btn-wishlist[data-prod="' + _pid + '"]').find('.added').length) {
                                $('.btn-wishlist[data-prod="' + _pid + '"]').find('.added').removeClass('added');
                            }
                        }

                        if ($('#yith-wcwl-popup-message').length && typeof res.mess !== 'undefined' && res.mess !== '') {
                            if ($('.nasa-close-notice').length) {
                                $('.nasa-close-notice').trigger('click');
                            }

                            $('#yith-wcwl-popup-message').html(res.mess);

                            $('#yith-wcwl-popup-message').fadeIn();
                            setTimeout( function() {
                                $('#yith-wcwl-popup-message').fadeOut();
                            }, 2000);
                        }
                    }

                    $('.btn-wishlist').removeClass('nasa-disabled');
                },
                error: function() {
                    $('.btn-wishlist').removeClass('nasa-disabled');
                }
            });
        }
    }
    
    return false;
});

// Target quantity inputs on product pages
$('body').find('input.qty:not(.product-quantity input.qty)').each(function() {
    var min = parseFloat($(this).attr('min'));
    if (min && min > 0 && parseFloat($(this).val()) < min) {
        $(this).val(min);
    }
});

$('body').on('click', '.plus, .minus', function() {
    // Get values
    var $qty = $(this).parents('.quantity').find('.qty'),
        button_add = $(this).parent().parent().find('.single_add_to_cart_button'),
        currentVal = parseFloat($qty.val()),
        max = parseFloat($qty.attr('max')),
        min = parseFloat($qty.attr('min')),
        step = $qty.attr('step');
        
    // Format values
    currentVal = !currentVal ? 0 : currentVal;
    max = !max ? '' : max;
    min = !min ? 1 : min;
    if (
        step === 'any' ||
        step === '' ||
        typeof step === 'undefined' ||
        parseFloat(step) === 'NaN'
    ) {
        step = 1;
    }
    // Change the value
    if ($(this).is('.plus')) {
        if (max && (max == currentVal || currentVal > max)) {
            $qty.val(max);
            if (button_add.length) {
                button_add.attr('data-quantity', max);
            }
        } else {
            $qty.val(currentVal + parseFloat(step));
            if (button_add.length) {
                button_add.attr('data-quantity', currentVal + parseFloat(step));
            }
        }
    } else {
        if (min && (min == currentVal || currentVal < min)) {
            $qty.val(min);
            if (button_add.length) {
                button_add.attr('data-quantity', min);
            }
        } else if (currentVal > 0) {
            $qty.val(currentVal - parseFloat(step));
            if (button_add.length) {
                button_add.attr('data-quantity', currentVal - parseFloat(step));
            }
        }
    }
    // Trigger change event
    $qty.trigger('change');
});

/**
 * Ajax search Products
 */
if ($('input.live-search-input').length && typeof search_options !== 'undefined') {
    if (
        typeof nasa_ajax_params !== 'undefined' &&
        typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
    ) {
        var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_search_products');
        var empty_mess = $('#nasa-empty-result-search').html();
        
        var searchProducts = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: _urlAjax,
            limit: search_options.limit_results,
            remote: {
                url: _urlAjax + '&s=%QUERY',
                wildcard: '%QUERY'
            }
        });

        $('.live-search-input').typeahead({
            minLength: 3,
            hint: true,
            highlight: true,
            backdrop: {
                "opacity": 0.8,
                "filter": "alpha(opacity=80)",
                "background-color": "#eaf3ff"
            },
            searchOnFocus: true,
            callback: {
                onInit: function() {
                    searchProducts.initialize();
                },
                onSubmit: function(node, form, item, event) {
                    form.submit();
                }
            }
        },
        {
            name: 'search',
            source: searchProducts,
            display: 'title',
            displayKey: 'value',
            limit: search_options.limit_results * 2,
            templates: {
                empty : '<p class="empty-message nasa-notice-empty">' + empty_mess + '</p>',
                suggestion: Handlebars.compile(search_options.live_search_template),
                pending: function(query) {
                    return '<div class="nasa-loader nasa-live-search-loader"></div>';
                }
            }
        });
    }
}

/**
 * Banner Lax
 */
if ($('.hover-lax').length) {
    var windowWidth = $(window).width();
    $(window).resize(function() {
        windowWidth = $(window).width();
        if (windowWidth <= 768) {
            $('.hover-lax').css('background-position', 'center center');
        }
    });

    $('body').on('mousemove', '.hover-lax', function(e) {
        var lax_bg = $(this);
        var minWidth = $(lax_bg).attr('data-minwidth') ? $(lax_bg).attr('data-minwidth') : 768;

        if (windowWidth > minWidth) {
            var amountMovedX = (e.pageX * -1 / 6);
            var amountMovedY = (e.pageY * -1 / 6);
            $(lax_bg).css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
        }else{
            $(lax_bg).css('background-position', 'center center');
        }
    });
}

/**
 * Mobile Search
 */
$('body').on('click', '.mobile-search', function() {
    $('.black-window').fadeIn(200);
    
    var height_adminbar = $('#wpadminbar').length ? $('#wpadminbar').height() : 0;
    
    if (height_adminbar > 0) {
        $('.warpper-mobile-search').css({top: height_adminbar});
    }
    
    if (!$('.warpper-mobile-search').hasClass('nasa-active')) {
        $('.warpper-mobile-search').addClass('nasa-active');
    }
    
    /**
     * Focus input
     * @returns {undefined}
     */
    setTimeout(function() {
        if ($('.warpper-mobile-search').find('label').length) {
            $('.warpper-mobile-search').find('label').trigger('click');
        }
    }, 1000);
});

/**
 * In Desktop Search
 * @type Boolean
 */
var _hotkeyInit = false;
$('body').on('click', '.desk-search', function(e) {
    var _this_click = $(this);
    
    if (!$(_this_click).hasClass('nasa-disable')) {
        $(_this_click).addClass('nasa-disable');
        var _focus_input = $(_this_click).parents('.nasa-wrap-event-search').find('.nasa-show-search-form');
        var _opened = $(_this_click).attr('data-open');
        
        if (_opened === '0') {
            $('#header-content').find('.nasa-show-search-form').after('<div class="nasa-tranparent" />');
        } else {
            $('#header-content').find('.nasa-tranparent').remove();
        }
        
        $('.desk-search').each(function() {
            var _this = $(this);
            var _root_wrap = $(_this).parents('.nasa-wrap-event-search');
            var _elements = $(_root_wrap).find('.nasa-elements-wrap');
            var _search = $(_root_wrap).find('.nasa-show-search-form');

            if (typeof _opened === 'undefined' || _opened === '0') {
                $(_this).attr('data-open', '1');
                if (!$(_search).hasClass('nasa-show')) {
                    $(_search).addClass('nasa-show');
                }

                $(_elements).addClass('nasa-invisible');
            } else {
                $(_this).attr('data-open', '0');
                if ($(_search).hasClass('nasa-show')) {
                    $(_search).removeClass('nasa-show');
                }

                $(_elements).removeClass('nasa-invisible');
            }
        });
        
        if (_hotkeyInit) {
            setTimeout(function() {
                $(_this_click).removeClass('nasa-disable');
                
                if ($(_focus_input).find('label').length) {
                    $(_focus_input).find('label').trigger('click');
                }
            }, 1000);
        } else {
            $(_this_click).removeClass('nasa-disable');
            
            /**
             * Hot keywords search
             */
            setTimeout(function() {
                _hotkeyInit = true;
                var _oldStr = '';

                if ($(_focus_input).find('input[name="s"]').length) {
                    var _inputCurrent = $(_focus_input).find('input[name="s"]');
                    _oldStr = $(_inputCurrent).val();

                    if (_oldStr !== '') {
                        $(_inputCurrent).val(_oldStr);
                    }

                    autoFillInputPlaceHolder($, _inputCurrent);
                    
                    if ($(_focus_input).find('label').length) {
                        $(_focus_input).find('label').trigger('click');
                    }
                }
            }, 1000);
        }
    }
    
    e.preventDefault();
});

$('body').on('click', '.nasa-close-search, .nasa-tranparent', function() {
    $(this).parents('.nasa-wrap-event-search').find('.desk-search').trigger('click');
});

$('body').on('click', '.toggle-sidebar-shop', function() {
    $('.transparent-window').fadeIn(200);
    if (!$('.nasa-side-sidebar').hasClass('nasa-show')) {
        $('.nasa-side-sidebar').addClass('nasa-show');
    }
});

/**
 * For topbar type 1 Mobile
 */
$('body').on('click', '.toggle-topbar-shop-mobile', function() {
    $('.transparent-mobile').fadeIn(200);
    if (!$('.nasa-top-sidebar').hasClass('nasa-active')) {
        $('.nasa-top-sidebar').addClass('nasa-active');
    }
});

$('body').on('click', '.toggle-sidebar', function() {
    $('.black-window').fadeIn(200);
    if ($('.col-sidebar').length && !$('.col-sidebar').hasClass('nasa-active')) {
        $('.col-sidebar').addClass('nasa-active');
    }
});

if ($('input[name="nasa_cart_sidebar_show"]').length && $('input[name="nasa_cart_sidebar_show"]').val() === '1') {
    setTimeout(function() {
        $('.cart-link').trigger('click');
    }, 300);
}

/**
 * Show mini Cart sidebar
 */
$('body').on('click', '.cart-link', function() {
    if ($('form.nasa-shopping-cart-form').length || $('form.woocommerce-checkout').length) {
        return false;
    } else {
        $('.black-window').fadeIn(200).addClass('desk-window');
        if ($('#cart-sidebar').length && !$('#cart-sidebar').hasClass('nasa-active')) {
            $('#cart-sidebar').addClass('nasa-active');

            if ($('#cart-sidebar').find('input[name="nasa-mini-cart-empty-content"]').length) {
                $('#cart-sidebar').append('<div class="nasa-loader"></div>');

                reloadMiniCart($);
            } else {
                /**
                 * notification free shipping
                 */
                init_shipping_free_notification($);
            }
        }
    }
    
    if ($('.nasa-close-notice').length) {
        $('.nasa-close-notice').trigger('click');
    }
});

$('body').on('click', '.wishlist-link', function() {
    if ($(this).hasClass('wishlist-link-premium')) {
        return;
    } else {
        if ($(this).hasClass('nasa-wishlist-link')) {
            loadWishlist($);
        }
        
        $('.black-window').fadeIn(200).addClass('desk-window');
        if ($('#nasa-wishlist-sidebar').length && !$('#nasa-wishlist-sidebar').hasClass('nasa-active')) {
            $('#nasa-wishlist-sidebar').addClass('nasa-active');
        }
    }
});

$('body').on('nasa_processed_wishlish', function() {
    if ($('.nasa-tr-wishlist-item').length <= 0) {
        $('.black-window').trigger('click');
    }
});

$('body').on('click', '#nasa-init-viewed', function() {
    $('.black-window').fadeIn(200).addClass('desk-window');
    
    if ($('#nasa-viewed-sidebar').length && !$('#nasa-viewed-sidebar').hasClass('nasa-active')) {
        $('#nasa-viewed-sidebar').addClass('nasa-active');
    }
});

/**
 * Close by fog window
 */
$('body').on('click', '.black-window, .white-window, .transparent-desktop, .transparent-mobile, .transparent-window, .nasa-close-mini-compare, .nasa-sidebar-close a, .nasa-sidebar-return-shop, .login-register-close', function() {
    nasa_quick_viewing = false;
    
    var _mobileView = $('.nasa-check-reponsive.nasa-switch-check').length && $('.nasa-check-reponsive.nasa-switch-check').width() === 1 ? true : false;
    
    var _inMobile = $('body').hasClass('nasa-in-mobile') ? true : false;
    
    $('.black-window').removeClass('desk-window');
    
    if ($('#mobile-navigation').length === 1 && $('#mobile-navigation').attr('data-show') === '1') {
        if ($('#nasa-menu-sidebar-content').length) {
            $('#nasa-menu-sidebar-content').removeClass('nasa-active');
        }
        
        $('#mobile-navigation').attr('data-show', '0');
        setTimeout(function() {
            $('.black-window').removeClass('nasa-transparent');
        }, 1000);
    }
    
    if ($('.warpper-mobile-search').length) {
        $('.warpper-mobile-search').removeClass('nasa-active');
        if ($('.warpper-mobile-search').hasClass('show-in-desk')) {
            setTimeout(function() {
                $('.warpper-mobile-search').removeClass('show-in-desk');
            }, 600);
        }
    }
    
    /**
     * Close sidebar
     */
    if ($('.col-sidebar').length && (_mobileView || _inMobile)) {
        $('.col-sidebar').removeClass('nasa-active');
    }
    
    /**
     * Close Dokan sidebar
     */
    if ($('.dokan-store-sidebar').length) {
        $('.dokan-store-sidebar').removeClass('nasa-active');
    }

    /**
     * Close cart sidebar
     */
    if ($('#cart-sidebar').length) {
        $('#cart-sidebar').removeClass('nasa-active');
    }

    /**
     * Close wishlist sidebar
     */
    if ($('#nasa-wishlist-sidebar').length) {
        $('#nasa-wishlist-sidebar').removeClass('nasa-active');
    }
    
    /**
     * Close viewed sidebar
     */
    if ($('#nasa-viewed-sidebar').length) {
        $('#nasa-viewed-sidebar').removeClass('nasa-active');
    }
    
    /**
     * Close quick view sidebar
     */
    if ($('#nasa-quickview-sidebar').length) {
        $('#nasa-quickview-sidebar').removeClass('nasa-active');
    }
    
    /**
     * Close filter categories sidebar in mobile
     */
    if ($('.nasa-top-cat-filter-wrap-mobile').length) {
        $('.nasa-top-cat-filter-wrap-mobile').removeClass('nasa-show');
    }
    
    /**
     * Close sidebar
     */
    if ($('.nasa-side-sidebar').length) {
        $('.nasa-side-sidebar').removeClass('nasa-show');
    }
    
    if ($('.nasa-top-sidebar').length) {
        $('.nasa-top-sidebar').removeClass('nasa-active');
    }
    
    /**
     * Close login or register
     */
    if ($('.nasa-login-register-warper').length) {
        $('.nasa-login-register-warper').removeClass('nasa-active');
    }
    
    /**
     * Languages
     */
    if ($('.nasa-current-lang').length) {
        var _wrapLangs = $('.nasa-current-lang').parents('.nasa-select-languages');
        if ($(_wrapLangs).length) {
            $(_wrapLangs).removeClass('nasa-active');
        }
    }
    
    /**
     * Currencies
     */
    if ($('.wcml-cs-item-toggle').length) {
        var _wrapCurrs = $('.wcml-cs-item-toggle').parents('.nasa-select-currencies');
        if ($(_wrapCurrs).length) {
            $(_wrapCurrs).removeClass('nasa-active');
        }
    }
    
    /**
     * Hide compare product
     */
    hideCompare($);

    $('.black-window, .white-window, .transparent-mobile, .transparent-window, .transparent-desktop').fadeOut(1000);
});

/**
 * ESC from keyboard
 */
$(document).on('keyup', function(e) {
    if (e.keyCode === 27) {
        $('.nasa-tranparent').trigger('click');
        $('.nasa-tranparent-filter').trigger('click');
        $('.black-window, .white-window, .transparent-desktop, .transparent-mobile, .transparent-window, .nasa-close-mini-compare, .nasa-sidebar-close a, .login-register-close, .nasa-transparent-topbar, .nasa-close-filter-cat').trigger('click');
        $.magnificPopup.close();
    }
});

$('body').on('click', '.add_to_cart_button', function() {
    if (!$(this).hasClass('product_type_simple')) {
        var _href = $(this).attr('href');
        window.location.href = _href;
    }
});

/*
 * Single add to cart from wishlist
 */
$('body').on('click', '.nasa_add_to_cart_from_wishlist', function() {
    var _this = $(this),
        _id = $(_this).attr('data-product_id');
    if (_id && !$(_this).hasClass('loading')) {
        var _type = $(_this).attr('data-type'),
            _quantity = $(_this).attr('data-quantity'),
            _data_wislist = {};
            
        if ($('.wishlist_table').length && $('.wishlist_table').find('#yith-wcwl-row-' + _id).length) {
            _data_wislist = {
                from_wishlist: '1',
                wishlist_id: $('.wishlist_table').attr('data-id'),
                pagination: $('.wishlist_table').attr('data-pagination'),
                per_page: $('.wishlist_table').attr('data-per-page'),
                current_page: $('.wishlist_table').attr('data-page')
            };
        }
        
        nasa_single_add_to_cart($, _this, _id, _quantity, _type, null, null, _data_wislist);
    }
    
    return false;
});

/*
 * Add to cart in quick-view Or single product
 */
$('body').on('click', 'form.cart .single_add_to_cart_button', function() {
    $('.nasa-close-notice').trigger('click');
    
    var _flag_adding = true;
    var _this = $(this);
    var _form = $(_this).parents('form.cart');
    
    $('body').trigger('nasa_before_click_single_add_to_cart', [_form]);
    
    if ($(_form).find('#yith_wapo_groups_container').length) {
        $(_form).find('input[name="nasa-enable-addtocart-ajax"]').remove();
        
        if ($(_form).find('.nasa-custom-fields input[name="nasa_cart_sidebar"]').length) {
            $(_form).find('.nasa-custom-fields input[name="nasa_cart_sidebar"]').val('1');
        } else {
            $(_form).find('.nasa-custom-fields').append('<input type="hidden" name="nasa_cart_sidebar" value="1" />');
        }
    }
    
    var _enable_ajax = $(_form).find('input[name="nasa-enable-addtocart-ajax"]');
    if ($(_enable_ajax).length <= 0 || $(_enable_ajax).val() !== '1') {
        _flag_adding = false;
        return;
    } else {
        var _disabled = $(_this).hasClass('disabled') || $(_this).hasClass('nasa-ct-disabled') ? true : false;
        var _id = !_disabled ? $(_form).find('input[name="data-product_id"]').val() : false;
        if (_id && !$(_this).hasClass('loading')) {
            var _type = $(_form).find('input[name="data-type"]').val(),
                _quantity = $(_form).find('.quantity input[name="quantity"]').val(),
                _variation_id = $(_form).find('input[name="variation_id"]').length ? parseInt($(_form).find('input[name="variation_id"]').val()) : 0,
                _variation = {},
                _data_wislist = {},
                _from_wishlist = (
                    $(_form).find('input[name="data-from_wishlist"]').length === 1 &&
                    $(_form).find('input[name="data-from_wishlist"]').val() === '1'
                ) ? '1' : '0';
                
            if (_type === 'variable' && !_variation_id) {
                _flag_adding = false;
                return false;
            } else {
                if (_variation_id > 0 && $(_form).find('.variations').length) {
                    $(_form).find('.variations').find('select').each(function() {
                        _variation[$(this).attr('name')] = $(this).val();
                    });
                    
                    if ($('.wishlist_table').length && $('.wishlist_table').find('tr#yith-wcwl-row-' + _id).length) {
                        _data_wislist = {
                            from_wishlist: _from_wishlist,
                            wishlist_id: $('.wishlist_table').attr('data-id'),
                            pagination: $('.wishlist_table').attr('data-pagination'),
                            per_page: $('.wishlist_table').attr('data-per-page'),
                            current_page: $('.wishlist_table').attr('data-page')
                        };
                    }
                }
            }
            
            if (_flag_adding) {
                nasa_single_add_to_cart($, _this, _id, _quantity, _type, _variation_id, _variation, _data_wislist);
            }
        }
        
        return false;
    }
});

/**
 * Click bundle add to cart
 */
$('body').on('click', '.nasa_bundle_add_to_cart', function() {
    var _this = $(this),
        _id = $(_this).attr('data-product_id');
    if (_id) {
        var _type = $(_this).attr('data-type'),
            _quantity = $(_this).attr('data-quantity'),
            _variation_id = 0,
            _variation = {},
            _data_wislist = {};
        
        nasa_single_add_to_cart($, _this, _id, _quantity, _type, _variation_id, _variation, _data_wislist);
    }
    
    return false;
});

/**
 * Click to variation add to cart
 */
$('body').on('click', '.product_type_variation.add-to-cart-grid', function() {
    var _this = $(this);
    if (!$(_this).hasClass('nasa-disable-ajax')) {
        if (!$(_this).hasClass('loading')) {
            var _id = $(_this).attr('data-product_id');
            if (_id) {
                var _type = 'variation',
                    _quantity = $(_this).attr('data-quantity'),
                    _variation_id = 0,
                    _variation = null,
                    _data_wislist = {};

                    if (typeof $(this).attr('data-variation') !== 'undefined') {
                        _variation = JSON.parse($(this).attr('data-variation'));
                    }
                if (_variation) {
                    nasa_single_add_to_cart($, _this, _id, _quantity, _type, _variation_id, _variation, _data_wislist);
                }
            }
        }

        return false;
    }
});

/**
 * Click select option
 */
$('body').on('click', '.product_type_variable', function() {
    if ($('body').hasClass('nasa-quickview-on')) {
        var _this = $(this);
        
        if (!$(_this).hasClass('add-to-cart-grid')) {
            var _href = $(_this).attr('href');
            if (_href) {
                window.location.href = _href;
            }

            return;
        }
        
        else {
            if ($(_this).parents('.compare-list').length) {
                return;
            }

            else {
                if (!$(_this).hasClass('btn-from-wishlist')) {
                    
                    if ($(_this).hasClass('nasa-before-click')) {
                        $('body').trigger('nasa_after_click_select_option', [_this]);
                    }
                    
                    else {
                        var _parent = $(_this).parents('.nasa-group-btns');
                        $(_parent).find('.quick-view').trigger('click');
                    }
                }
                
                /**
                 * From Wishlist
                 */
                else {
                    var _parent = $(_this).parents('.add-to-cart-wishlist');
                    if ($(_parent).length && $(_parent).find('.quick-view').length) {
                        $(_parent).find('.quick-view').trigger('click');
                    }
                }

                return false;
            }
        }
    } else {
        return;
    }
});

/**
 * After remove cart item in mini cart
 */
$('body').on('wc_fragments_loaded', function() {
    if ($('#cart-sidebar .woocommerce-mini-cart-item').length <= 0) {
        $('.black-window').trigger('click');
    }
});

$('body').on('wc_fragments_refreshed', function() {
    
});

$('body').on('updated_wc_div', function() {
    /**
     * notification free shipping
     */
    init_shipping_free_notification($);
});

/**
 * Before Add To Cart
 */
var _nasa_clear_added_to_cart;
$('body').on('adding_to_cart', function() {
    if ($('.nasa-close-notice').length) {
        $('.nasa-close-notice').trigger('click');
    }

    if (typeof _nasa_clear_added_to_cart !== 'undefined') {
        clearTimeout(_nasa_clear_added_to_cart);
    }
});

/**
 * After Add To Cart
 */
$('body').on('added_to_cart', function(ev, fragments) {
    var _mobileView = $('.nasa-check-reponsive.nasa-switch-check').length && $('.nasa-check-reponsive.nasa-switch-check').width() === 1 ? true : false;
    
    var _inMobile = $('body').hasClass('nasa-in-mobile') ? true : false;
    
    /**
     * Close quick-view
     */
    if ($('.nasa-after-add-to-cart-popup').length <= 0) {
        $.magnificPopup.close();
    }
    
    var _event_add = $('input[name="nasa-event-after-add-to-cart"]').length && $('input[name="nasa-event-after-add-to-cart"]').val();
    
    /* Loading content After Add To Cart - Popup your order */
    if (_event_add === 'popup' && $('form.nasa-shopping-cart-form').length <= 0 && $('form.woocommerce-checkout').length <= 0) {
        after_added_to_cart($);
    }
    
    /**
     * Only show Notice in cart or checkout page or Mobile
     */
    if ($('form.nasa-shopping-cart-form').length || $('form.woocommerce-checkout').length || _mobileView || _inMobile) {
        _event_add = 'notice';
    }
   
    /**
     * Show Mini Cart Sidebar
     */
    if (_event_add === 'sidebar') {
        $('#nasa-quickview-sidebar').removeClass('nasa-active');
        $('#nasa-wishlist-sidebar').removeClass('nasa-active');
        
        setTimeout(function() {
            $('.black-window').fadeIn(200).addClass('desk-window');
            $('#nasa-wishlist-sidebar').removeClass('nasa-active');
            
            if ($('#cart-sidebar').length && !$('#cart-sidebar').hasClass('nasa-active')) {
                $('#cart-sidebar').addClass('nasa-active');
            }
            
            /**
             * notification free shipping
             */
            init_shipping_free_notification($);
        }, 200);
    }
    
    /**
     * Show notice
     */
    if (_event_add === 'notice' && typeof fragments['.woocommerce-message'] !== 'undefined') {
        if ($('.nasa-close-notice').length) {
            $('.nasa-close-notice').trigger('click');
        }
        
        setNotice($, fragments['.woocommerce-message']);
        
        if (typeof _nasa_clear_added_to_cart !== 'undefined') {
            clearTimeout(_nasa_clear_added_to_cart);
        }
        
        _nasa_clear_added_to_cart = setTimeout(function() {
            if ($('.nasa-close-notice').length) {
                $('.nasa-close-notice').trigger('click');
            }
        }, 5000);
    }
});

$('body').on('click', '.nasa-close-magnificPopup', function() {
    $.magnificPopup.close();
});

$('body').on('change', '.nasa-after-add-to-cart-popup input.qty', function() {
    $('.nasa-after-add-to-cart-popup .nasa-update-cart-popup').removeClass('nasa-disable');
});

$('body').on('click', '.remove_from_cart_popup', function() {
    if (!$(this).hasClass('loading')) {
        $(this).addClass('loading');
        nasa_block($('.nasa-after-add-to-cart-wrap'));
        
        var _id = $(this).attr('data-product_id');
        if ($('.widget_shopping_cart_content .remove_from_cart_button[data-product_id="' + _id +'"]').length) {
            $('.widget_shopping_cart_content .remove_from_cart_button[data-product_id="' + _id +'"]').trigger('click');
        } else {
            window.location.href = $(this).attt('href');
        }
    }
    
    return false;
});

$('body').on('removed_from_cart', function() {
    if ($('.nasa-after-add-to-cart-popup').length) {
        after_added_to_cart($);
    }
    
    /**
     * notification free shipping
     */
    init_shipping_free_notification($);
                    
    return false;
});

/**
 * Check if a node is blocked for processing.
 *
 * @param {JQuery Object} $node
 * @return {bool} True if the DOM Element is UI Blocked, false if not.
 */
var nasa_is_blocked = function($node) {
    return $node.is('.processing') || $node.parents('.processing').length;
};

/**
 * Block a node visually for processing.
 *
 * @param {JQuery Object} $node
 */
var nasa_block = function($node) {
    if (!nasa_is_blocked($node)) {
        $node.addClass('processing').block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });
    }
};

/**
 * Unblock a node after processing is complete.
 *
 * @param {JQuery Object} $node
 */
var nasa_unblock = function($node) {
    $node.removeClass('processing').unblock();
};

/**
 * Update cart in popup
 */
$('body').on('click', '.nasa-update-cart-popup', function() {
    var _this = $(this);
    if ($('.nasa-after-add-to-cart-popup').length && !$(_this).hasClass('nasa-disable')) {
        var _form = $(this).parents('form');
        if ($(_form).find('input[name=""]').length <= 0) {
            $(_form).append('<input type="hidden" name="update_cart" value="Update Cart" />');
        }
        $.ajax({
            type: $(_form).attr('method'),
            url: $(_form).attr('action'),
            data: $(_form).serialize(),
            dataType: 'html',
            beforeSend: function() {
                nasa_block($('.nasa-after-add-to-cart-wrap'));
            },
            success: function(res) {
                $(_form).find('input[name="update_cart"]').remove();
                $(_this).addClass('nasa-disable');
            },
            complete: function() {
                reloadMiniCart($);
                after_added_to_cart($);
            }
        });
    }
    
    return false;
});

if ($('.nasa-promotion-close').length) {
    var height = $('.nasa-promotion-news').outerHeight();
    
    if ($.cookie('promotion') !== 'hide') {
        setTimeout(function() {
            $('.nasa-position-relative').animate({'height': height + 'px'}, 500);
            $('.nasa-promotion-news').fadeIn(500);
            
            if ($('.nasa-promotion-news').find('.nasa-post-slider').length) {
                $('.nasa-promotion-news').find('.nasa-post-slider').addClass('nasa-slick-slider');
                $('body').trigger('nasa_load_slick_slider');
            }
        }, 1000);
    } else {
        $('.nasa-promotion-show').show();
    }
    
    $('body').on('click', '.nasa-promotion-close', function() {
        $.cookie('promotion', 'hide', {expires: _cookie_live, path: '/'});
        $('.nasa-promotion-show').show();
        $('.nasa-position-relative').animate({'height': '0'}, 500);
        $('.nasa-promotion-news').fadeOut(500);
    });
    
    $('body').on('click', '.nasa-promotion-show', function() {
        $.cookie('promotion', 'show', {expires: _cookie_live, path: '/'});
        $('.nasa-promotion-show').hide();
        $('.nasa-position-relative').animate({'height': height + 'px'}, 500);
        $('.nasa-promotion-news').fadeIn(500);
        
        if ($('.nasa-promotion-news').find('.nasa-post-slider').length && !$('.nasa-promotion-news').find('.nasa-post-slider').hasClass('nasa-slick-slider')) {
            $('.nasa-promotion-news').find('.nasa-post-slider').addClass('nasa-slick-slider');
            $('body').trigger('nasa_load_slick_slider');
        }
        
        setTimeout(function() {
            $(window).trigger('resize');
        }, 1000);
    });
};

// Logout click
$('body').on('click', '.nasa_logout_menu a', function() {
    if ($('input[name="nasa_logout_menu"]').length) {
        window.location.href = $('input[name="nasa_logout_menu"]').val();
    }
});

// Show more | Show less
$('body').on('click', '.nasa_show_manual > a', function() {
    var _this = $(this),
        _val = $(_this).attr('data-show'),
        _li = $(_this).parent(),
        _delay = $(_li).attr('data-delay') ? parseInt($(_li).attr('data-delay')) : 100,
        _fade = $(_li).attr('data-fadein') === '1' ? true : false,
        _text_attr = $(_this).attr('data-text'),
        _text = $(_this).text();
        
    $(_this).html(_text_attr);
    $(_this).attr('data-text', _text);
    
    if (_val === '1') {
        $(_li).parent().find('.nasa-show-less').each(function() {
            if (!_fade) {
                $(this).slideDown(_delay);
            } else {
                $(this).fadeIn(_delay);
            }
        });
        
        $(_this).attr('data-show', '0');
    } else {
        $(_li).parent().find('.nasa-show-less').each(function() {
            if (!$(this).hasClass('nasa-chosen') && !$(this).find('.nasa-active').length) {
                if (!_fade) {
                    $(this).slideUp(_delay);
                } else {
                    $(this).fadeOut(_delay);
                }
            }
        });
        
        $(_this).attr('data-show', '1');
    }
});

// Login Register Form
$('body').on('click', '.nasa-switch-register', function() {
    $('#nasa-login-register-form .nasa-message').html('');
    $('.nasa_register-form, .register-form').animate({'left': '0'}, 350);
    $('.nasa_login-form, .login-form').animate({'left': '-100%'}, 350);
    
    setTimeout(function() {
        $('.nasa_register-form, .register-form').css({'position': 'relative'});
        $('.nasa_login-form, .login-form').css({'position': 'absolute'});
    }, 350);
});

/**
 * Switch Login | Register forms
 */
$('body').on('click', '.nasa-switch-login', function() {
    $('#nasa-login-register-form .nasa-message').html('');
    $('.nasa_register-form, .register-form').animate({'left': '100%'}, 350);
    $('.nasa_login-form, .login-form').animate({'left': '0'}, 350);
    
    setTimeout(function() {
        $('.nasa_register-form, .register-form').css({'position': 'absolute'});
        $('.nasa_login-form, .login-form').css({'position': 'relative'});
    }, 350);
});

if ($('.nasa-login-register-ajax').length && $('#nasa-login-register-form').length) {
    $('body').on('click', '.nasa-login-register-ajax', function() {
        if ($(this).attr('data-enable') === '1' && $('#customer_login').length <= 0) {
            $('#nasa-menu-sidebar-content').removeClass('nasa-active');
            $('#mobile-navigation').attr('data-show', '0');
            
            $('.black-window').fadeIn(200).removeClass('nasa-transparent').addClass('desk-window');
            
            if (!$('.nasa-login-register-warper').hasClass('nasa-active')) {
                $('.nasa-login-register-warper').addClass('nasa-active');
            }
            
            return false;
        }
    });
    
    /**
     * Must login to login Ajax Popup
     */
    if ($('.must-log-in > a').length) {
        $('body').on('click', '.must-log-in a', function() {
            if ($('.nasa-login-register-ajax').length) {
                $('.nasa-login-register-ajax').trigger('click');
                return false;
            }
        });
    }
    
    /**
     * Login Ajax
     */
    $('body').on('click', '.nasa_login-form .button[type="submit"][name="nasa_login"]', function(e) {
        e.preventDefault();
        
        if (typeof nasa_ajax_params !== 'undefined' && typeof nasa_ajax_params.ajax_url !== 'undefined') {
            var _form = $(this).parents('form.login');

            var _validate = true;
            $(_form).find('.form-row').each(function() {
                var _inputText = $(this).find('input.input-text');
                var _require = $(this).find('.required');
                if ($(_inputText).length) {
                    $(_inputText).removeClass('nasa-error');
                    if ($(_require).length && $(_require).height() && $(_require).width() && $(_inputText).val().trim() === '') {
                        _validate = false;

                        $(_inputText).addClass('nasa-error');
                    }
                }
            });

            if (_validate) {
                var _data = $(_form).serializeArray();
                $.ajax({
                    url: nasa_ajax_params.ajax_url,
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {
                        'action': 'nasa_process_login',
                        'data': _data,
                        'login': true
                    },
                    beforeSend: function() {
                        $('#nasa-login-register-form #nasa_customer_login').css({opacity: 0.3});
                        $('#nasa-login-register-form #nasa_customer_login').after('<div class="nasa-loader"></div>');
                    },
                    success: function(res) {
                        $('#nasa-login-register-form #nasa_customer_login').css({opacity: 1});
                        $('#nasa-login-register-form').find('.nasa-loader').remove();
                        var _warning = (res.error === '0') ? 'nasa-success' : 'nasa-error';
                        $('#nasa-login-register-form .nasa-message').html('<h4 class="' + _warning + '">' + res.mess + '</h4>');

                        if (res.error === '0') {
                            $('#nasa-login-register-form .nasa-form-content').remove();
                            window.location.href = res.redirect;
                        } else {
                            if (res._wpnonce === 'error') {
                                setTimeout(function() {
                                    var _href = false;
                                    if ($('.nasa-login-register-ajax').length) {
                                        _href = $('.nasa-login-register-ajax').attr('href');
                                    }
                                    
                                    if (_href) {
                                        window.location.href = _href;
                                    } else {
                                        window.location.reload();
                                    }
                                }, 2000);
                            }
                        }

                        $('body').trigger('nasa_after_process_login');
                    }
                });
            } else {
                $(_form).find('.nasa-error').first().focus();
            }
        }
        
        return false;
    });

    /**
     * Register Ajax
     */
    $('body').on('click', '.nasa_register-form .button[type="submit"][name="nasa_register"]', function(e) {
        e.preventDefault();
        
        if (typeof nasa_ajax_params !== 'undefined' && typeof nasa_ajax_params.ajax_url !== 'undefined') {
            var _form = $(this).parents('form.register');
            var _validate = true;
            $(_form).find('.form-row').each(function() {
                var _inputText = $(this).find('input.input-text');
                var _require = $(this).find('.required');
                if ($(_inputText).length) {
                    $(_inputText).removeClass('nasa-error');
                    if ($(_require).length && $(_require).height() && $(_require).width() && $(_inputText).val().trim() === '') {
                        _validate = false;

                        $(_inputText).addClass('nasa-error');
                    }
                }
            });

            if (_validate) {
                var _data = $(_form).serializeArray();
                $.ajax({
                    url: nasa_ajax_params.ajax_url,
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {
                        'action': 'nasa_process_register',
                        'data': _data,
                        'register': true
                    },
                    beforeSend: function() {
                        $('#nasa-login-register-form #nasa_customer_login').css({opacity: 0.3});
                        $('#nasa-login-register-form #nasa_customer_login').after('<div class="nasa-loader"></div>');
                    },
                    success: function(res) {
                        $('#nasa-login-register-form #nasa_customer_login').css({opacity: 1});
                        $('#nasa-login-register-form').find('.nasa-loader').remove();
                        var _warning = (res.error === '0') ? 'nasa-success' : 'nasa-error';
                        $('#nasa-login-register-form .nasa-message').html('<h4 class="' + _warning + '">' + res.mess + '</h4>');

                        if (res.error === '0') {
                            $('#nasa-login-register-form .nasa-form-content').remove();
                            window.location.href = res.redirect;
                        } else {
                            if (res._wpnonce === 'error') {
                                setTimeout(function() {
                                    window.location.reload();
                                }, 2000);
                            }
                        }

                        $('body').trigger('nasa_after_process_register');
                    }
                });
            } else {
                $(_form).find('.nasa-error').first().focus();
            }
        }
        
        return false;
    });
    
    $('body').on('keyup', '#nasa-login-register-form input.input-text.nasa-error', function() {
        if ($(this).val() !== '') {
            $(this).removeClass('nasa-error');
        }
    });
    
    /**
     * Compatible with Dokan
     */
    if (typeof dokan !== 'undefined' && typeof DokanValidateMsg !== 'undefined') {
        popupRegistrationDokan($);
    }
}

$('body').on('click', '.btn-combo-link', function() {
    var _width = $(window).outerWidth();
    var _this = $(this);
    var show_type = $(_this).attr('data-show_type');
    var wrap_item = $(_this).parents('.products.list');
    if (_width < 946 || $(wrap_item).length === 1) {
        show_type = 'popup';
    }
    
    switch (show_type) {
        default :
            loadComboPopup($, _this);
            break;
    }
    
    return false;
});

if ($('.nasa-active').length) {
    $('.nasa-active').each(function() {
        if ($(this).parents('.nasa-show-less').length === 1) {
            $(this).parents('.nasa-show-less').show();
        }
    });
}

/**
 * Event nasa git featured
 */
$('body').on('click', '.nasa-gift-featured-event', function() {
    var _wrap = $(this).parents('.product-item');
    if ($(_wrap).find('.nasa-product-grid .btn-combo-link').length === 1) {
        $(_wrap).find('.nasa-product-grid .btn-combo-link').trigger('click');
    } else {
        if ($(_wrap).find('.nasa-product-list .btn-combo-link').length === 1) {
            $(_wrap).find('.nasa-product-list .btn-combo-link').trigger('click');
        }
    }
});

/**
 * Change language
 */
if ($('.nasa-current-lang').length) {
    $('body').on('click', '.nasa-current-lang', function() {
        var _wrap = $(this).parents('.nasa-select-languages');
        if ($(_wrap).length) {
            if ($(_wrap).parents('#nasa-menu-sidebar-content').length === 0) {
                if ($('.static-position').find('.transparent-desktop').length === 0) {
                    $('.static-position').append('<div class="transparent-desktop"></div>');
                }
                
                $('.transparent-desktop').fadeIn(200);
            }
            $(_wrap).toggleClass('nasa-active');
            $('.nasa-select-currencies').removeClass('nasa-active');
        }
        
        return false;
    });
}

/**
 * Change Currencies
 */
if ($('.wcml-cs-item-toggle').length) {
    $('body').on('click', '.wcml-cs-item-toggle', function() {
        var _wrap = $(this).parents('.nasa-select-currencies');
        if ($(_wrap).length) {
            if ($(_wrap).parents('#nasa-menu-sidebar-content').length === 0) {
                if ($('.static-position').find('.transparent-desktop').length === 0) {
                    $('.static-position').append('<div class="transparent-desktop"></div>');
                }
                
                $('.transparent-desktop').fadeIn(200);
            }
            $(_wrap).toggleClass('nasa-active');
            $('.nasa-select-languages').removeClass('nasa-active');
        }
        
        return false;
    });
}

/**
 * Scroll tabs
 */
$('body').on('click', '.nasa-anchor', function() {
    var _target = $(this).attr('data-target');
    if ($(_target).length) {
        animate_scroll_to_top($, _target, 1000);
    }
    
    return false;
});

/**
 * Tab reviewes
 */
$('body').on('click', '.nasa-product-details-page .woocommerce-review-link', function() {
    if (
        $('.woocommerce-tabs .reviews_tab a').length ||
        $('.woocommerce-tabs .nasa-accordion-reviews').length ||
        $('.woocommerce-tabs .nasa-anchor[data-target="#nasa-anchor-reviews"].active').length
    ) {
        var _obj = $('.woocommerce-tabs .reviews_tab a');
        if ($(_obj).length <= 0) {
            _obj = $('.woocommerce-tabs .nasa-accordion-reviews');
        }
        if ($(_obj).length <= 0) {
            _obj = $('.woocommerce-tabs .nasa-anchor[data-target="#nasa-anchor-reviews"].active');
        }
        
        if ($(_obj).length) {
            animate_scroll_to_top($, _obj, 500);
            setTimeout(function() {
                if (!$(_obj).hasClass('active')) {
                    $(_obj).trigger('click');
                    $(_obj).mousemove();
                }
            }, 500);
        }
    }
    
    return false;
});

var _hash = location.hash || null;
if (_hash) {
    if ($('a[href="' + _hash + '"], a[data-id="' + _hash + '"], a[data-target="' + _hash + '"]').length) {
        setTimeout(function() {
            $('a[href="' + _hash + '"], a[data-id="' + _hash + '"], a[data-target="' + _hash + '"]').trigger('click');
        }, 500);
    }
    
    if ($(_hash).length) {
        setTimeout(function() {
            animate_scroll_to_top($, _hash, 500);
        }, 1000);
    }
}

/**
 * Retina logo
 */
if ($('.nasa-logo-retina').length) {
    var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
    if (pixelRatio > 1) {
        var _image_width, _image_height;
        var _src_retina = '';
        
        var _init_retina = setInterval(function() {
            $('.nasa-logo-retina img').each(function() {
                var _this = $(this);
                
                if (!$(_this).hasClass('nasa-inited') && $(_this).width() && $(_this).height()) {
                    if (typeof _src_retina === 'undefined' || _src_retina === '') {
                        _src_retina = $(_this).attr('data-src-retina');
                    }

                    if (typeof _src_retina !== 'undefined' && _src_retina !== '') {
                        var _fix_size = $(_this).parents('.nasa-no-fix-size-retina').length === 1 ? false : true;
                        _image_width = _image_height = 'auto';

                        if (_fix_size) {
                            var _w = parseInt($(_this).attr('width'));
                            _image_width = _w ? _w : $(_this).width();

                            var _h = parseInt($(this).attr('height'));
                            _image_height = _h ? _h : $(_this).height();
                        }

                        if ((_image_width && _image_height) || _image_width === 'auto') {
                            $(_this).css("width", _image_width);
                            $(_this).css("height", _image_height);

                            $(_this).attr('src', _src_retina);
                            $(_this).removeAttr('srcset');
                        }
                        
                        $(_this).addClass('nasa-inited');
                    }
                }
                
                if ($('.nasa-logo-retina img').length === $('.nasa-logo-retina img.nasa-inited').length) {
                    clearInterval(_init_retina);
                }
            });
        }, 50);
    }
}

/**
 * nasa-top-cat-filter
 */
initTopCategoriesFilter($);
hoverTopCategoriesFilter($);
hoverChilrenTopCatogoriesFilter($);
$('body').on('click', '.filter-cat-icon', function() {
    var _this_click = $(this);
    
    if (!$(_this_click).hasClass('nasa-disable')) {
        $(_this_click).addClass('nasa-disable');
        $('.nasa-elements-wrap').addClass('nasa-invisible');
        $('#header-content .nasa-top-cat-filter-wrap').addClass('nasa-show');
        if ($('.nasa-has-filter-ajax').length <= 0) {
            $('#header-content .nasa-top-cat-filter-wrap').before('<div class="nasa-tranparent-filter nasa-hide-for-mobile" />');
        }
        
        setTimeout(function() {
            $(_this_click).removeClass('nasa-disable');
        }, 600);
    }
});

$('body').on('click', '.filter-cat-icon-mobile', function() {
    var _this_click = $(this);
    var _mobileDetect = $('body').hasClass('nasa-in-mobile') || $('input[name="nasa_mobile_layout"]').length ? true : false;
    
    if (!$(_this_click).hasClass('nasa-disable')) {
        $(_this_click).addClass('nasa-disable');
        $('.nasa-top-cat-filter-wrap-mobile').addClass('nasa-show');
        $('.transparent-mobile').fadeIn(300);
        
        setTimeout(function() {
            $(_this_click).removeClass('nasa-disable');
        }, 600);
        
        var _mobileView = $('.nasa-check-reponsive.nasa-switch-check').length && $('.nasa-check-reponsive.nasa-switch-check').width() === 1 ? true : false;
        
        if ((_mobileView || _mobileDetect) && $('.nasa-top-cat-filter-wrap-mobile').find('.nasa-top-cat-filter').length <= 0) {
            if ($('#nasa-main-cat-filter').length && $('#nasa-mobile-cat-filter').length) {
                var _mobile_cats_filter = $('#nasa-main-cat-filter').clone().html();
                $('#nasa-mobile-cat-filter').html(_mobile_cats_filter);
                
                if (_mobileDetect) {
                    $('#nasa-main-cat-filter').remove();
                }
            }
        }
    }
});

$('body').on('click', '.nasa-close-filter-cat, .nasa-tranparent-filter', function() {
    $('.nasa-elements-wrap').removeClass('nasa-invisible');
    $('#header-content .nasa-top-cat-filter-wrap').removeClass('nasa-show');
    $('.nasa-tranparent-filter').remove();
    $('.transparent-mobile').trigger('click');
});

$('body').on('nasa_init_topbar_categories', function() {
    initTopCategoriesFilter($);
});

/**
 * Show coupon in shopping cart
 */
$('body').on('click', '.nasa-show-coupon', function() {
    if ($('.nasa-coupon-wrap').length === 1) {
        $('.nasa-coupon-wrap').toggleClass('nasa-active');
        setTimeout(function() {
            $('.nasa-coupon-wrap.nasa-active input[name="coupon_code"]').focus();
        }, 100);
    }
});

/**
 * Scroll single product
 */
loadScrollSingleProduct($, true);

/**
 * init Mini wishlist icon
 */
initMiniWishlist($);

/**
 * init wishlist icon
 */
initWishlistIcons($);

/**
 * init Compare icons
 */
initCompareIcons($, true);

/**
 * Topbar toggle
 */
if ($('.nasa-topbar-wrap.nasa-topbar-toggle').length) {
    $('body').on('click', '.nasa-topbar-wrap .nasa-icon-toggle', function() {
        var _wrap = $(this).parents('.nasa-topbar-wrap');
        $(_wrap).toggleClass('nasa-topbar-hide');
    });
}

$('body').on('click', '.black-window-mobile', function() {
    $(this).removeClass('nasa-push-cat-show');
    $('.nasa-push-cat-filter').removeClass('nasa-push-cat-show');
    $('.nasa-products-page-wrap').removeClass('nasa-push-cat-show');
});

$('body').on('click', '.nasa-widget-show-more a.nasa-widget-toggle-show', function() {
    var _showed = $(this).attr('data-show');
    var _text = '';
    
    if (_showed === '0') {
        _text = $('input[name="nasa-widget-show-less-text"]').length ? $('input[name="nasa-widget-show-less-text"]').val() : 'Less -';
        $(this).attr('data-show', '1');
        $('.nasa-widget-toggle.nasa-widget-show-less').addClass('nasa-widget-show');
    } else {
        _text = $('input[name="nasa-widget-show-more-text"]').length ? $('input[name="nasa-widget-show-more-text"]').val() : 'More +';
        $(this).attr('data-show', '0');
        $('.nasa-widget-toggle.nasa-widget-show-less').removeClass('nasa-widget-show');
    }
    
    $(this).html(_text);
});

$('body').on('click', '.nasa-mobile-icons-wrap .nasa-toggle-mobile_icons', function() {
    $(this).parents('.nasa-mobile-icons-wrap').toggleClass('nasa-hide-icons');
});

/**
 * Single Product
 * Variable change image
 */
if ($('.nasa-product-details-page .nasa-gallery-variation-supported').length === 1) {
    changeGalleryVariableSingleProduct($);
} else {
    /**
     * Load single product image
     */
    loadSlickSingleProduct($);
    
    /* Product Gallery Popup */
    loadGalleryPopup($);
    changeImageVariableSingleProduct($);
}
/**
 * Event click single product thumbnail
 */
$('body').on('click', '.nasa-single-product-slide .nasa-single-product-thumbnails .slick-slide', function() {
    var _wrap = $(this).parents('.nasa-single-product-thumbnails');
    var _speed = parseInt($(_wrap).attr('data-speed'));
    _speed = !_speed ? 600 : _speed;
    $(_wrap).append('<div class="nasa-slick-fog"></div>');

    setTimeout(function() {
        $(_wrap).find('.nasa-slick-fog').remove();
    }, _speed);
});

/* Product Gallery Popup */
$('body').on('click', '.product-lightbox-btn', function(e) {
    if ($('.nasa-single-product-slide').length) {
        $('.product-images-slider').find('.slick-current.slick-active a').trigger('click');
    }

    else if ($('.nasa-single-product-scroll').length) {
        $('#nasa-main-image-0 a').trigger('click');
    }

    e.preventDefault();
});

/* Product Video Popup */
$('body').on('click', "a.product-video-popup", function(e) {
    if (! $('body').hasClass('nasa-disable-lightbox-image')) {
        $('.product-images-slider').find('.first a').trigger('click');
        var galeryPopup = $.magnificPopup.instance;
        galeryPopup.prev();
    }
    
    else {
        var productVideo = $(this).attr('href');
        $.magnificPopup.open({
            items: {
                src: productVideo
            },
            type: 'iframe',
            tLoading: '<div class="nasa-loader"></div>'
        }, 0);
    }
    
    e.preventDefault();
});

/**
 * Next Prev Single Product Slider
 */
$('body').on('click', '.nasa-single-arrow', function() {
    var _this = $(this);
    if (!$(_this).hasClass('nasa-disabled')) {
        var _action = $(_this).attr('data-action');
        var _wrap = $(_this).parents('.product-images-slider');
        var _slides = $(_wrap).find('.nasa-single-product-main-image');
        if ($(_slides).find('.slick-arrow.slick-' + _action).length) {
            var _real = $(_slides).find('.slick-arrow.slick-' + _action);
            $(_real).trigger('click');
        }
    }
});

/**
 * Next Prev Single Product Slider add class "nasa-disabled"
 */
$('body').on('nasa_after_single_product_slick_inited', function(ev, _thumbs, _num_ver) {
    $('.nasa-single-product-slide .nasa-single-product-main-image').on('afterChange', function(){
        var _this = $(this);
        var _wrap = $(_this).parents('.product-images-slider');

        if ($(_wrap).find('.nasa-single-arrow').length) {
            var _prev = $(_this).find('.slick-prev');
            var _next = $(_this).find('.slick-next');

            $(_wrap).find('.nasa-single-arrow').removeClass('nasa-disabled');

            if ($(_prev).hasClass('slick-disabled')) {
                $(_wrap).find('.nasa-single-arrow[data-action="prev"]').addClass('nasa-disabled');
            }

            if ($(_next).hasClass('slick-disabled')) {
                $(_wrap).find('.nasa-single-arrow[data-action="next"]').addClass('nasa-disabled');
            }
        }
    });
    
    if (_thumbs) {
        if ($(_thumbs).find('.slick-slide').length <= _num_ver && !$(_thumbs).hasClass('not-full-items')) {
            $(_thumbs).addClass('not-full-items');
        }
    }
});

/**
 * Fixed Single form add to cart
 */
if (
    $('input[name="nasa_fixed_single_add_to_cart"]').length &&
    $('.nasa-product-details-page').length
) {
    var _mobile_fixed_addToCart = 'no';
    if ($('input[name="nasa_fixed_mobile_single_add_to_cart_layout"]').length) {
        _mobile_fixed_addToCart = $('input[name="nasa_fixed_mobile_single_add_to_cart_layout"]').val();
    }
    var _can_render = true;
    if (_nasa_in_mobile && (_mobile_fixed_addToCart === 'no' || _mobile_fixed_addToCart === 'btn')) {
        _can_render = false;
        $('body').addClass('nasa-cart-fixed-desktop');
    }
    if (_mobile_fixed_addToCart === 'btn') {
        $('body').addClass('nasa-cart-fixed-mobile-btn');
        
        if ($('.nasa-buy-now').length) {
            $('body').addClass('nasa-has-buy-now');
        }
    }
    
    /**
     * Render in desktop
     */
    if (_can_render && $('.nasa-add-to-cart-fixed').length <= 0) {
        $('body').append('<div class="nasa-add-to-cart-fixed"><div class="nasa-wrap-content-inner"><div class="nasa-wrap-content"></div></div></div>');

        if (_mobile_fixed_addToCart === 'no' || _mobile_fixed_addToCart === 'btn') {
            $('.nasa-add-to-cart-fixed').addClass('nasa-not-show-mobile');
            $('body').addClass('nasa-cart-fixed-desktop');
        }

        var _addToCartWrap = $('.nasa-add-to-cart-fixed .nasa-wrap-content');

        /**
         * Main Image clone
         */
        $(_addToCartWrap).append('<div class="nasa-fixed-product-info"></div>');
        var _src = '';
        if ($('.nasa-product-details-page .product-thumbnails').length) {
            _src = $('.nasa-product-details-page .product-thumbnails .nasa-wrap-item-thumb:eq(0)').attr('data-thumb_org') || $('.nasa-product-details-page .product-thumbnails .nasa-wrap-item-thumb:eq(0) img').attr('src');
        } else {
            _src = $('.nasa-product-details-page .main-images .item-wrap:eq(0) a.product-image').attr('data-o_href') || $('.nasa-product-details-page .main-images .item-wrap:eq(0) img').attr('src');
        }
        
        if (_src !== '') {
            $('.nasa-fixed-product-info').append('<div class="nasa-thumb-clone"><img src="' + _src + '" /></div>');
        }

        /**
         * Title clone
         */
        if ($('.nasa-product-details-page .product-info .product_title').length) {
            var _title = $('.nasa-product-details-page .product-info .product_title').html();

            $('.nasa-fixed-product-info').append('<div class="nasa-title-clone"><h3>' + _title +'</h3></div>');
        }

        /**
         * Price clone
         */
        if ($('.nasa-product-details-page .product-info .price.nasa-single-product-price').length) {
            var _price = $('.nasa-product-details-page .product-info .price.nasa-single-product-price').html();
            if ($('.nasa-title-clone').length) {
                $('.nasa-title-clone').append('<span class="price">' + _price + '</span>');
            }
            else {
                $('.nasa-fixed-product-info').append('<div class="nasa-title-clone"><span class="price">' + _price + '</span></div>');
            }
        }

        /**
         * Variations clone
         */
        if ($('.nasa-product-details-page .variations_form').length) {
            $(_addToCartWrap).append('<div class="nasa-fixed-product-variations-wrap"><div class="nasa-fixed-product-variations"></div><a class="nasa-close-wrap" href="javascript:void(0);"></a></div>');

            /**
             * Variations
             * 
             * @type type
             */
            var _k = 1,
                _item = 1;
            $('.nasa-product-details-page .variations_form .variations tr').each(function() {
                var _this = $(this);
                var _classWrap = 'nasa-attr-wrap-' + _k.toString();
                var _type = $(_this).find('select').attr('data-attribute_name') || $(_this).find('select').attr('name');

                if ($(_this).find('.nasa-attr-ux_wrap').length) {
                    $('.nasa-fixed-product-variations').append('<div class="nasa-attr-ux_wrap-clone ' + _classWrap + '"></div>');

                    $(_this).find('.nasa-attr-ux').each(function() {
                        var _obj = $(this);
                        var _classItem = 'nasa-attr-ux-' + _item.toString();
                        var _classItemClone = 'nasa-attr-ux-clone-' + _item.toString();
                        var _classItemClone_target = _classItemClone;

                        if ($(_obj).hasClass('nasa-attr-ux-image')) {
                            _classItemClone += ' nasa-attr-ux-image-clone';
                        }

                        if ($(_obj).hasClass('nasa-attr-ux-color')) {
                            _classItemClone += ' nasa-attr-ux-color-clone';
                        }

                        if ($(_obj).hasClass('nasa-attr-ux-label')) {
                            _classItemClone += ' nasa-attr-ux-label-clone';
                        }

                        var _selected = $(_obj).hasClass('selected') ? ' selected' : '';
                        var _contentItem = $(_obj).html();

                        $(_obj).addClass(_classItem);
                        $(_obj).attr('data-target', '.' + _classItemClone_target);

                        $('.nasa-attr-ux_wrap-clone.' + _classWrap).append('<a href="javascript:void(0);" class="nasa-attr-ux-clone' + _selected + ' ' + _classItemClone + ' nasa-' + _type + '" data-target=".' + _classItem + '">' + _contentItem + '</a>');

                        _item++;
                    });
                } else {
                    $('.nasa-fixed-product-variations').append('<div class="nasa-attr-select_wrap-clone ' + _classWrap + '"></div>');

                    var _obj = $(_this).find('select');

                    var _label = $(_this).find('.label').length ? $(_this).find('.label').html() : '';

                    var _classItem = 'nasa-attr-select-' + _item.toString();
                    var _classItemClone = 'nasa-attr-select-clone-' + _item.toString();

                    var _contentItem = $(_obj).html();

                    $(_obj).addClass(_classItem).addClass('nasa-attr-select');
                    $(_obj).attr('data-target', '.' + _classItemClone);

                    $('.nasa-attr-select_wrap-clone.' + _classWrap).append(_label + '<select name="' + _type + '" class="nasa-attr-select-clone ' + _classItemClone + ' nasa-' + _type + '" data-target=".' + _classItem + '">' + _contentItem + '</select>');

                    _item++;
                }

                _k++;
            });
        }
        /**
         * Class wrap simple product
         */
        else {
            $(_addToCartWrap).addClass('nasa-fixed-single-simple');
        }

        /**
         * Add to cart button
         */
        setTimeout(function() {
            var _button_wrap = nasa_clone_add_to_cart($);
            $(_addToCartWrap).append('<div class="nasa-fixed-product-btn"></div>');
            $('.nasa-fixed-product-btn').html(_button_wrap);
            var _val = $('.nasa-product-details-page form.cart input[name="quantity"]').val();
            $('.nasa-single-btn-clone input[name="quantity"]').val(_val);
        }, 250);

        setTimeout(function() {
            if ($('.nasa-attr-ux').length) {
                $('.nasa-attr-ux').each(function() {
                    var _this = $(this);
                    var _targetThis = $(_this).attr('data-target');

                    if ($(_targetThis).length) {
                        var _disable = $(_this).hasClass('nasa-disable') ? true : false;
                        if (_disable) {
                            if (!$(_targetThis).hasClass('nasa-disable')) {
                                $(_targetThis).addClass('nasa-disable');
                            }
                        } else {
                            $(_targetThis).removeClass('nasa-disable');
                        }
                    }
                });
            }
        }, 550);

        /**
         * Change Ux
         */
        $('body').on('click', '.nasa-attr-ux', function() {
            var _target = $(this).attr('data-target');
            if ($(_target).length) {
                var _wrap = $(_target).parents('.nasa-attr-ux_wrap-clone');
                $(_wrap).find('.nasa-attr-ux-clone').removeClass('selected');
                if ($(this).hasClass('selected')) {
                    $(_target).addClass('selected');
                }

                if ($('.nasa-fixed-product-btn').length) {
                    setTimeout(function() {
                        var _button_wrap = nasa_clone_add_to_cart($);
                        $('.nasa-fixed-product-btn').html(_button_wrap);
                        var _val = $('.nasa-product-details-page form.cart input[name="quantity"]').val();
                        $('.nasa-single-btn-clone input[name="quantity"]').val(_val);
                    }, 250);
                }

                setTimeout(function() {
                    if ($('.nasa-attr-ux').length) {
                        $('.nasa-attr-ux').each(function() {
                            var _this = $(this);
                            var _targetThis = $(_this).attr('data-target');

                            if ($(_targetThis).length) {
                                var _disable = $(_this).hasClass('nasa-disable') ? true : false;
                                if (_disable) {
                                    if (!$(_targetThis).hasClass('nasa-disable')) {
                                        $(_targetThis).addClass('nasa-disable');
                                    }
                                } else {
                                    $(_targetThis).removeClass('nasa-disable');
                                }
                            }
                        });
                    }
                }, 250);
            }
        });

        /**
         * Change Ux clone
         */
        $('body').on('click', '.nasa-attr-ux-clone', function() {
            var _target = $(this).attr('data-target');
            if ($(_target).length) {
                $(_target).trigger('click');
            }
        });

        /**
         * Change select
         */
        $('body').on('change', '.nasa-attr-select', function() {
            var _this = $(this);
            var _target = $(_this).attr('data-target');
            var _value = $(_this).val();

            if ($(_target).length) {
                setTimeout(function() {
                    var _html = $(_this).html();
                    $(_target).html(_html);
                    $(_target).val(_value);
                }, 100);

                setTimeout(function() {
                    var _button_wrap = nasa_clone_add_to_cart($);
                    $('.nasa-fixed-product-btn').html(_button_wrap);
                    var _val = $('.nasa-product-details-page form.cart input[name="quantity"]').val();
                    $('.nasa-single-btn-clone input[name="quantity"]').val(_val);

                    if ($('.nasa-attr-ux').length) {
                        $('.nasa-attr-ux').each(function() {
                            var _this = $(this);
                            var _targetThis = $(_this).attr('data-target');

                            if ($(_targetThis).length) {
                                var _disable = $(_this).hasClass('nasa-disable') ? true : false;
                                if (_disable) {
                                    if (!$(_targetThis).hasClass('nasa-disable')) {
                                        $(_targetThis).addClass('nasa-disable');
                                    }
                                } else {
                                    $(_targetThis).removeClass('nasa-disable');
                                }
                            }
                        });
                    }
                }, 250);
            }
        });

        /**
         * Change select clone
         */
        $('body').on('change', '.nasa-attr-select-clone', function() {
            var _target = $(this).attr('data-target');
            var _value = $(this).val();
            if ($(_target).length) {
                $(_target).val(_value).change();
            }
        });

        /**
         * Reset variations
         */
        $('body').on('click', '.reset_variations', function() {
            $(_addToCartWrap).find('.selected').removeClass('selected');

            setTimeout(function() {
                var _button_wrap = nasa_clone_add_to_cart($);
                $('.nasa-fixed-product-btn').html(_button_wrap);
                var _val = $('.nasa-product-details-page form.cart input[name="quantity"]').val();
                $('.nasa-single-btn-clone input[name="quantity"]').val(_val);

                if ($('.nasa-attr-ux').length) {
                    $('.nasa-attr-ux').each(function() {
                        var _this = $(this);
                        var _targetThis = $(_this).attr('data-target');

                        if ($(_targetThis).length) {
                            var _disable = $(_this).hasClass('nasa-disable') ? true : false;
                            if (_disable) {
                                if (!$(_targetThis).hasClass('nasa-disable')) {
                                    $(_targetThis).addClass('nasa-disable');
                                }
                            } else {
                                $(_targetThis).removeClass('nasa-disable');
                            }
                        }
                    });
                }
            }, 250);
        });

        /**
         * Plus, Minus button
         */
        $('body').on('click', '.nasa-product-details-page form.cart .quantity .plus, .nasa-product-details-page form.cart .quantity .minus', function() {
            if ($('.nasa-single-btn-clone input[name="quantity"]').length) {
                var _val = $('.nasa-product-details-page form.cart input[name="quantity"]').val();
                $('.nasa-single-btn-clone input[name="quantity"]').val(_val);
            }
        });

        /**
         * Plus clone button
         */
        $('body').on('click', '.nasa-single-btn-clone .plus', function() {
            if ($('.nasa-product-details-page form.cart .quantity .plus').length) {
                $('.nasa-product-details-page form.cart .quantity .plus').trigger('click');
            }
        });

        /**
         * Minus clone button
         */
        $('body').on('click', '.nasa-single-btn-clone .minus', function() {
            if ($('.nasa-product-details-page form.cart .quantity .minus').length) {
                $('.nasa-product-details-page form.cart .quantity .minus').trigger('click');
            }
        });

        /**
         * Quantily input
         */
        $('body').on('keyup', '.nasa-product-details-page form.cart input[name="quantity"]', function() {
            var _val = $(this).val();
            $('.nasa-single-btn-clone input[name="quantity"]').val(_val);
        });

        /**
         * Quantily input clone
         */
        $('body').on('keyup', '.nasa-single-btn-clone input[name="quantity"]', function() {
            var _val = $(this).val();
            $('.nasa-product-details-page form.cart input[name="quantity"]').val(_val);
        });

        /**
         * Add to cart click
         */
        $('body').on('click', '.nasa-single-btn-clone .single_add_to_cart_button', function() {
            if ($('.nasa-product-details-page form.cart .single_add_to_cart_button').length) {
                $('.nasa-product-details-page form.cart .single_add_to_cart_button').trigger('click');
            }
        });
        
        /**
         * Buy Now click
         */
        $('body').on('click', '.nasa-single-btn-clone .nasa-buy-now', function() {
            if ($('.nasa-product-details-page form.cart .nasa-buy-now').length) {
                $('.nasa-product-details-page form.cart .nasa-buy-now').trigger('click');
            }
        });

        /**
         * Toggle Select Options
         */
        $('body').on('click', '.nasa-toggle-variation_wrap-clone', function() {
            if ($('.nasa-fixed-product-variations-wrap').length) {
                $('.nasa-fixed-product-variations-wrap').toggleClass('nasa-active');
            }
        });
        
        $('body').on('click', '.nasa-close-wrap', function() {
            if ($('.nasa-fixed-product-variations-wrap').length) {
                $('.nasa-fixed-product-variations-wrap').removeClass('nasa-active');
            }
        });
    }
}

/**
 * Buy Now
 */
$('body').on('click', 'form.cart .nasa-buy-now', function() {
    if (!$(this).hasClass('nasa-waiting')) {
        $(this).addClass('nasa-waiting');
        
        var _form = $(this).parents('form.cart');
        if ($(_form).find('.single_add_to_cart_button.disabled').length) {
            $(this).removeClass('nasa-waiting');
            $(_form).find('.single_add_to_cart_button.disabled').trigger('click');
        } else {
            if ($(_form).find('input[name="nasa_buy_now"]').length) {
                if ($('input[name="nasa-enable-addtocart-ajax"]').length) {
                    $('input[name="nasa-enable-addtocart-ajax"]').val('0');
                }
                $(_form).find('input[name="nasa_buy_now"]').val('1');
                $(_form).find('.single_add_to_cart_button').trigger('click');
            }
        }
    }
    
    return false;
});

/**
 * Toggle Widget
 */
$('body').on('click', '.nasa-toggle-widget', function() {
    var _this = $(this);
    var _widget = $(_this).parents('.widget');
    var _key = $(_widget).attr('id');
    
    if ($(_widget).length && $(_widget).find('.nasa-open-toggle').length) {
        var _hide = $(_this).hasClass('nasa-hide');
        if (!_hide) {
            $(_this).addClass('nasa-hide');
            $(_widget).find('.nasa-open-toggle').slideUp(200);
            $.cookie(_key, 'hide', {expires: 7, path: '/'});
        } else {
            $(_this).removeClass('nasa-hide');
            $(_widget).find('.nasa-open-toggle').slideDown(200);
            $.cookie(_key, 'show', {expires: 7, path: '/'});
        }
    }
});

/**
 * init Widgets
 */
init_widgets($);

/**
 * Lightbox image Single product page
 */
$('body').on('click', '.easyzoom-flyout', function() {
    if (!$('body').hasClass('nasa-disable-lightbox-image')) {
        var _click = $(this).parents('.easyzoom');
        if ($(_click).length && $(_click).find('a.product-image').length) {
            $(_click).find('a.product-image').trigger('click');
        }
    }
});

/**
 * Notice Woocommerce
 */
if (!$('body').hasClass('woocommerce-cart')) {
    $('.woocommerce-notices-wrapper').each(function() {
        var _this = $(this);
        setTimeout(function() {
            if ($(_this).find('a').length <= 0) {
                $(_this).html('');
            }
            
            if ($(_this).find('.woocommerce-message').length) {
                $(_this).find('.woocommerce-message').each(function() {
                    if ($(this).find('a').length <= 0) {
                        $(this).fadeOut(200);
                    }
                });
            }
        }, 3000);
    });
}

initNotices($);
$('body').on('click', '.woocommerce-notices-wrapper .nasa-close-notice', function() {
    var _this = $(this).parents('.woocommerce-notices-wrapper');
    $(_this).html('');
});

var _toggle = $('input[name="nasa-toggle-width-product-content"]').length ? parseInt($('input[name="nasa-toggle-width-product-content"]').val()) : 180;
$('body').on('mouseover', '.product-item', function() {
    var _this = $(this);
    if ($(_this).outerWidth() < _toggle) {
        if (
            $(_this).find('.add-to-cart-grid').length &&
            !$(_this).find('.add-to-cart-grid').hasClass('nasa-disabled-hover')
        ) {
            $(_this).find('.add-to-cart-grid').addClass('nasa-disabled-hover');
        }
        
        if (
            $(_this).find('.nasa-sc-pdeal-countdown')  &&
            !$(_this).find('.nasa-sc-pdeal-countdown').hasClass('nasa-countdown-small')) {
            $(_this).find('.nasa-sc-pdeal-countdown').addClass('nasa-countdown-small');
        }
    } else {
        if ($(_this).find('.add-to-cart-grid').length) {
            $(_this).find('.add-to-cart-grid').removeClass('nasa-disabled-hover');
        }
        
        if ($(_this).find('.nasa-sc-pdeal-countdown')) {
            $(_this).find('.nasa-sc-pdeal-countdown').removeClass('nasa-countdown-small');
        }
    }
});

/**
 * Bar icons bottom in mobile detect
 */
if ($('.nasa-bottom-bar-icons').length) {
    if ($('.top-bar-wrap-type-1').length) {
        $('body').addClass('nasa-top-bar-in-mobile');
    }
    
    if ($('.toggle-topbar-shop-mobile, .nasa-toggle-top-bar-click, .toggle-sidebar-shop, .toggle-sidebar').length || ($('.dokan-single-store').length && $('.dokan-store-sidebar').length)) {
        $('.nasa-bot-item.nasa-bot-item-sidebar').removeClass('hidden-tag');
    } else {
        $('.nasa-bot-item.nasa-bot-item-search').removeClass('hidden-tag');
    }
    
    var col = $('.nasa-bottom-bar-icons .nasa-bot-item').length - $('.nasa-bottom-bar-icons .nasa-bot-item.hidden-tag').length;;
    if (col) {
        $('.nasa-bottom-bar-icons').addClass('nasa-' + col.toString() + '-columns');
    }
    
    $('.nasa-bottom-bar-icons').addClass('nasa-active');
    
    $('body').css({'padding-bottom': $('.nasa-bottom-bar-icons').outerHeight()});
    
    /**
     * Event sidebar in bottom mobile layout
     */
    $('body').on('click', '.nasa-bot-icon-sidebar', function() {
        $('.toggle-topbar-shop-mobile, .nasa-toggle-top-bar-click, .toggle-sidebar-shop, .toggle-sidebar, .toggle-sidebar-dokan').trigger('click');
    });
    
    /**
     * Event cart sidebar in bottom mobile layout
     */
    $('body').on('click', '.botbar-cart-link', function() {
        if ($('.cart-link').length) {
            $('.cart-link').trigger('click');
        }
    });
    
    /**
     * Event search in bottom mobile layout
     */
    $('body').on('click', '.botbar-mobile-search', function() {
        if ($('.mobile-search').length) {
            $('.mobile-search').trigger('click');
        }
    });
}

/**
 * notification free shipping
 */
setTimeout(function() {
    init_shipping_free_notification($);
}, 1000);

/**
 * Hover product-item in Mobile
 */
$('body').on("touchstart", '.product-item', function() {
    $('.product-item').removeClass('nasa-mobile-hover');
    if (!$(this).hasClass('nasa-mobile-hover')) {
        $(this).addClass('nasa-mobile-hover');
    }
});

/**
 * GDPR Notice
 */
// $.cookie('nasa_gdpr_notice', '0', {expires: 30, path: '/'});
if ($('.nasa-cookie-notice-container').length) {
    var nasa_gdpr_notice = $.cookie('nasa_gdpr_notice');
    if (typeof nasa_gdpr_notice === 'undefined' || !nasa_gdpr_notice || nasa_gdpr_notice === '0') {
        setTimeout(function() {
            $('.nasa-cookie-notice-container').addClass('nasa-active');
        }, 1000);
    }
    
    $('body').on('click', '.nasa-accept-cookie', function() {
        $.cookie('nasa_gdpr_notice', '1', {expires: 30, path: '/'});
        $('.nasa-cookie-notice-container').removeClass('nasa-active');
    });
}

/**
 * Remove title attribute of menu item
 */
$('body').on('mousemove', '.menu-item > a', function() {
    if ($(this).attr('title')) {
        $(this).removeAttr('title');
    }
});

/**
 * Captcha register form
 */
if ($('#tmpl-captcha-field-register').length) {
    $('body').on('click', '.nasa-reload-captcha', function() {
        var _time = $(this).attr('data-time');
        var _key = $(this).attr('data-key');
        _time = parseInt(_time) + 1;
        $(this).attr('data-time', _time);
        var _form = $(this).parents('form');
        $(_form).find('.nasa-img-captcha').attr('src', '?nasa-captcha-register=' + _key + '&time=' + _time);
    });

    var _count_captcha;
    if ($('.nasa-reload-captcha').length) {
        _count_captcha = parseInt($('.nasa-reload-captcha').first().attr('data-key'));
    } else {
        _count_captcha = 0;
    }
    var _captcha_row = $('#tmpl-captcha-field-register').html();
    $('.nasa-form-row-captcha').each(function() {
        _count_captcha = _count_captcha + 1;
        var _row = _captcha_row.replace(/{{key}}/g, _count_captcha);
        $(this).replaceWith(_row);
    });

    $('body').on('nasa_after_load_static_content', function() {
        if ($('.nasa-form-row-captcha').length) {
            if ($('.nasa-reload-captcha').length) {
                _count_captcha = parseInt($('.nasa-reload-captcha').first().attr('data-key'));
            } else {
                _count_captcha = 0;
            }
            $('.nasa-form-row-captcha').each(function() {
                _count_captcha = _count_captcha + 1;
                var _row = _captcha_row.replace(/{{key}}/g, _count_captcha);
                $(this).replaceWith(_row);
            });
        }
    });

    $('body').on('nasa_after_process_register', function() {
        if ($('.nasa_register-form').find('.nasa-error').length) {
            $('.nasa_register-form').find('.nasa-reload-captcha').trigger('click');
            $('.nasa_register-form').find('.nasa-text-captcha').val('');
        }
    });
}

/**
 * DOKAN Sidebar
 */
if ($('.dokan-store-sidebar').length && $('.dokan-single-store').length) {
    $('body').prepend(
        '<a class="toggle-sidebar-dokan hidden-tag" href="javascript:void(0);">' +
            '<i class="nasa-icon pe7-icon pe-7s-menu"></i>' +
        '</a>'
    );
    
    $('.dokan-store-sidebar').prepend('<a href="javascript:void(0);" class="hidden-tag nasa-close-sidebar"></a>');
    
    $('body').on('click', '.toggle-sidebar-dokan', function() {
        $('.black-window').fadeIn(200);
        if (!$('.dokan-store-sidebar').hasClass('nasa-active')) {
            $('.dokan-store-sidebar').addClass('nasa-active');
        }
    });
}

/**
 * Back to Top
 */
$('body').on('click', '#nasa-back-to-top', function() {
    $('html, body').animate({scrollTop: 0}, 800);
});

/**
 * After loaded ajax store
 */
$('body').on('nasa_after_loaded_ajax_complete', function(e, destroy_masonry) {
    afterLoadAjaxList($, destroy_masonry);
});

/**
 * Clone group btn for list layout
 */
cloneGroupBtnsProductItem($);

/**
 * Clone group btn for list layout after changed
 */
$('body').on('nasa_store_changed_layout_list', function() {
    cloneGroupBtnsProductItem($);
});

/**
 * Compatible with FancyProductDesigner
 */
$('body').on('modalDesignerClose', function(ev) {
    setTimeout(function() {
        if ($('.nasa-single-product-thumbnails .nasa-wrap-item-thumb').length) {
            var _src = $('.woocommerce-product-gallery__image img').attr('src');
            $('.nasa-single-product-thumbnails .nasa-wrap-item-thumb:first-child img').attr('src', _src);
            $('.nasa-single-product-thumbnails .nasa-wrap-item-thumb:first-child img').removeAttr('srcset');
        }
    }, 100);
});

/**
 * Check wpadminbar
 */
if ($('#wpadminbar').length) {
    $("head").append('<style media="screen">#wpadminbar {position: fixed !important;}</style>');
    
    var _mobileView = $('.nasa-check-reponsive.nasa-switch-check').length && $('.nasa-check-reponsive.nasa-switch-check').width() === 1 ? true : false;
    var _inMobile = $('body').hasClass('nasa-in-mobile') ? true : false;
    
    var height_adminbar = $('#wpadminbar').height();
    $('#cart-sidebar, #nasa-wishlist-sidebar, #nasa-viewed-sidebar, #nasa-quickview-sidebar, .nasa-top-cat-filter-wrap-mobile, .nasa-side-sidebar').css({'top' : height_adminbar});
    
    if (_mobileView || _inMobile) {
        $('.col-sidebar').css({'top' : height_adminbar});
        if ($('.dokan-store-sidebar').length && $('.dokan-single-store').length) {
            $('.dokan-store-sidebar').css({'top' : height_adminbar});
        }
    }
    
    $(window).resize(function() {
        _mobileView = $('.nasa-check-reponsive.nasa-switch-check').length && $('.nasa-check-reponsive.nasa-switch-check').width() === 1 ? true : false;
        height_adminbar = $('#wpadminbar').height();
        
        $('#cart-sidebar, #nasa-wishlist-sidebar, #nasa-viewed-sidebar, #nasa-quickview-sidebar, .nasa-top-cat-filter-wrap-mobile, .nasa-side-sidebar').css({'top' : height_adminbar});
        
        if (_mobileView || _inMobile) {
            $('.col-sidebar').css({'top' : height_adminbar});
        }
    });
}

/* End Document Ready */
});

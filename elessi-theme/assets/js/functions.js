"use strict";
var _eventMore = false;

/* Functions base */
function afterLoadAjaxList($, destroy_masonry) {
    var _destroy_masonry = typeof destroy_masonry !== 'undefined' ? destroy_masonry : false;
    
    /**
     * Trigger after load ajax - first event
     */
    $('body').trigger('nasa_after_load_ajax_first', [_destroy_masonry]);
    
    /**
     * Clone Group Btn for listview
     */
    cloneGroupBtnsProductItem($);
    
    /**
     * Init Top Categories
     */
    initTopCategoriesFilter($);
    
    /**
     * Init widgets
     */
    init_widgets($);
    
    /*
     * Parallax Breadcrumb
     */
    // if (!_eventMore) {
    //     $('body').trigger('nasa_parallax_breadcrum');
    // }
    
    /**
     * init wishlist icons
     */
    initWishlistIcons($);
    
    /**
     * init Compare icons
     */
    initCompareIcons($);
    
    _eventMore = false;
    
    $('body').trigger('nasa_after_load_ajax');
}

/**
 * Refresh carousel
 * @param {type} $
 * @returns {undefined}
 */
function refreshCarousel($) {
    loadSlickSingleProduct($, true);
    $('body').trigger('nasa_reload_slick_slider');
}

/**
 * Tabs slide
 * 
 * @param {type} $
 * @param {type} _this
 * @param {type} exttime
 * @returns {undefined}
 */
function nasa_tab_slide_style($, _this, exttime) {
    exttime = !exttime ? 500 : exttime;
    
    if ($(_this).find('.nasa-slide-tab').length <= 0) {
        $(_this).append('<li class="nasa-slide-tab"></li>');
    }
    
    var _tab = $(_this).find('.nasa-slide-tab');
    var _act = $(_this).find('.nasa-tab.active');
    
    if ($(_this).find('.nasa-tab-icon').length) {
        $(_this).find('.nasa-tab > a').css({'padding': '15px 30px'});
    }
    
    var _width_border = parseInt($(_this).css("border-top-width"));
    _width_border = !_width_border ? 0 : _width_border;
    
    var _pos = $(_act).position();
    $(_tab).show().animate({
        'height': $(_act).height() + (2*_width_border),
        'width': $(_act).width() + (2*_width_border),
        'top': _pos.top - _width_border,
        'left': _pos.left - _width_border
    }, exttime);
}

/**
 * Load Compare
 * 
 * @param {type} $
 * @returns {undefined}
 */
var _compare_init = false;
function loadCompare($) {
    if ($('#nasa-compare-sidebar-content').length && !_compare_init) {
        _compare_init = true;
        
        if (
            typeof nasa_ajax_params !== 'undefined' &&
            typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
        ) {
            var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_load_compare');

            var _compare_table = $('.nasa-wrap-table-compare').length ? true : false;
            $.ajax({
                url: _urlAjax,
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {
                    compare_table: _compare_table
                },
                beforeSend: function () {
                    
                },
                success: function (res) {
                    if (typeof res.success !== 'undefined' && res.success === '1') {
                        $('#nasa-compare-sidebar-content').replaceWith(res.content);
                    }

                    $('.nasa-compare-list-bottom').find('.nasa-loader').remove();
                },
                error: function () {

                }
            });
        }
    }
}

/**
 * Add Compare
 * 
 * @param {type} _id
 * @param {type} $
 * @returns {undefined}
 */
function add_compare_product(_id, $) {
    if (
        typeof nasa_ajax_params !== 'undefined' &&
        typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
    ) {
        var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_add_compare_product');
        
        var _compare_table = $('.nasa-wrap-table-compare').length ? true : false;

        $.ajax({
            url: _urlAjax,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                pid: _id,
                compare_table: _compare_table
            },
            beforeSend: function () {
                showCompare($);
                
                if ($('.nasa-compare-list-bottom').find('.nasa-loader').length <= 0) {
                    $('.nasa-compare-list-bottom').append('<div class="nasa-loader"></div>');
                }
            },
            success: function (res) {
                if (typeof res.result_compare !== 'undefined' && res.result_compare === 'success') {
                    if ($('#nasa-compare-sidebar-content').length) {
                        if (res.mini_compare === 'no-change') {
                            loadCompare($);
                        } else {
                            $('#nasa-compare-sidebar-content').replaceWith(res.mini_compare);
                        }
                    } else {
                        if (res.mini_compare !== 'no-change' && $('.nasa-compare-list').length) {
                            $('.nasa-compare-list').replaceWith(res.mini_compare);
                        }
                    }
                    
                    if (res.mini_compare !== 'no-change') {
                        if ($('.nasa-mini-number.compare-number').length) {
                            
                            $('.nasa-mini-number.compare-number').html(convert_count_items($, res.count_compare));
                            if (res.count_compare === 0) {
                                if (!$('.nasa-mini-number.compare-number').hasClass('nasa-product-empty')) {
                                    $('.nasa-mini-number.compare-number').addClass('nasa-product-empty');
                                }
                            } else {
                                if ($('.nasa-mini-number.compare-number').hasClass('nasa-product-empty')) {
                                    $('.nasa-mini-number.compare-number').removeClass('nasa-product-empty');
                                }
                            }
                        }

                        $('.nasa-compare-success').html(res.mess_compare);
                        $('.nasa-compare-success').fadeIn(200);

                        if (_compare_table) {
                            $('.nasa-wrap-table-compare').replaceWith(res.result_table);
                        }
                        
                    } else {
                        $('.nasa-compare-exists').html(res.mess_compare);
                        $('.nasa-compare-exists').fadeIn(200);
                    }

                    if (!$('.nasa-compare[data-prod="' + _id + '"]').hasClass('added')) {
                        $('.nasa-compare[data-prod="' + _id + '"]').addClass('added');
                    }

                    if (!$('.nasa-compare[data-prod="' + _id + '"]').hasClass('nasa-added')) {
                        $('.nasa-compare[data-prod="' + _id + '"]').addClass('nasa-added');
                    }

                    setTimeout(function () {
                        $('.nasa-compare-success').fadeOut(200);
                        $('.nasa-compare-exists').fadeOut(200);
                    }, 2000);
                }

                $('.nasa-compare-list-bottom').find('.nasa-loader').remove();
            },
            error: function () {

            }
        });
    }
}

/**
 * Remove Compare
 * 
 * @param {type} _id
 * @param {type} $
 * @returns {undefined}
 */
function remove_compare_product(_id, $) {
    if (
        typeof nasa_ajax_params !== 'undefined' &&
        typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
    ) {
        var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_remove_compare_product');
        
        var _compare_table = $('.nasa-wrap-table-compare').length ? true : false;

        $.ajax({
            url: _urlAjax,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                pid: _id,
                compare_table: _compare_table
            },
            beforeSend: function () {
                if ($('.nasa-compare-list-bottom').find('.nasa-loader').length <= 0) {
                    $('.nasa-compare-list-bottom').append('<div class="nasa-loader"></div>');
                }
                
                if ($('table.nasa-table-compare tr.remove-item td.nasa-compare-view-product_' + _id).length) {
                    $('table.nasa-table-compare').css('opacity', '0.3').prepend('<div class="nasa-loader"></div>');
                }
            },
            success: function (res) {
                if (typeof res.result_compare !== 'undefined' && res.result_compare === 'success') {
                    if (res.mini_compare !== 'no-change' && $('#nasa-compare-sidebar-content').length) {
                        $('#nasa-compare-sidebar-content').replaceWith(res.mini_compare);
                    } else {
                        if (res.mini_compare !== 'no-change' && $('.nasa-compare-list').length) {
                            $('.nasa-compare-list').replaceWith(res.mini_compare);
                        }
                    }
                    
                    if (res.mini_compare !== 'no-change' && $('.nasa-compare-list').length) {
                        $('.nasa-compare[data-prod="' + _id + '"]').removeClass('added');
                        $('.nasa-compare[data-prod="' + _id + '"]').removeClass('nasa-added');
                        if ($('.nasa-mini-number.compare-number').length) {
                            
                            $('.nasa-mini-number.compare-number').html(convert_count_items($, res.count_compare));
                            if (res.count_compare === 0) {
                                if (!$('.nasa-mini-number.compare-number').hasClass('nasa-product-empty')) {
                                    $('.nasa-mini-number.compare-number').addClass('nasa-product-empty');
                                }
                            } else {
                                if ($('.nasa-mini-number.compare-number').hasClass('nasa-product-empty')) {
                                    $('.nasa-mini-number.compare-number').removeClass('nasa-product-empty');
                                }
                            }
                        }

                        $('.nasa-compare-success').html(res.mess_compare);
                        $('.nasa-compare-success').fadeIn(200);

                        if (_compare_table) {
                            $('.nasa-wrap-table-compare').replaceWith(res.result_table);
                        }
                    } else {
                        $('.nasa-compare-exists').html(res.mess_compare);
                        $('.nasa-compare-exists').fadeIn(200);
                    }

                    setTimeout(function () {
                        $('.nasa-compare-success').fadeOut(200);
                        $('.nasa-compare-exists').fadeOut(200);
                        if (res.count_compare === 0) {
                            $('.nasa-close-mini-compare').trigger('click');
                        }
                    }, 2000);
                }

                $('table.nasa-table-compare').find('.nasa-loader').remove();
                $('.nasa-compare-list-bottom').find('.nasa-loader').remove();
            },
            error: function() {

            }
        });
    }
}

/**
 * Remove All Compare
 * 
 * @param {type} $
 * @returns {undefined}
 */
function removeAll_compare_product($) {
    if (
        typeof nasa_ajax_params !== 'undefined' &&
        typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
    ) {
        var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_remove_all_compare');
        
        var _compare_table = $('.nasa-wrap-table-compare').length ? true : false;
        $.ajax({
            url: _urlAjax,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                compare_table: _compare_table
            },
            beforeSend: function () {
                if ($('.nasa-compare-list-bottom').find('.nasa-loader').length <= 0) {
                    $('.nasa-compare-list-bottom').append('<div class="nasa-loader"></div>');
                }
            },
            success: function (res) {
                if (res.result_compare === 'success') {
                    if (res.mini_compare !== 'no-change' && $('.nasa-compare-list').length) {
                        $('.nasa-compare-list').replaceWith(res.mini_compare);
                        
                        $('.nasa-compare').removeClass('added');
                        $('.nasa-compare').removeClass('nasa-added');
                        
                        if ($('.nasa-mini-number.compare-number').length) {
                            $('.nasa-mini-number.compare-number').html('0');
                            if (!$('.nasa-mini-number.compare-number').hasClass('nasa-product-empty')) {
                                $('.nasa-mini-number.compare-number').addClass('nasa-product-empty');
                            }
                        }

                        $('.nasa-compare-success').html(res.mess_compare);
                        $('.nasa-compare-success').fadeIn(200);

                        if (_compare_table) {
                            $('.nasa-wrap-table-compare').replaceWith(res.result_table);
                        }
                    } else {
                        $('.nasa-compare-exists').html(res.mess_compare);
                        $('.nasa-compare-exists').fadeIn(200);
                    }

                    setTimeout(function () {
                        $('.nasa-compare-success').fadeOut(200);
                        $('.nasa-compare-exists').fadeOut(200);
                        $('.nasa-close-mini-compare').trigger('click');
                    }, 1000);
                }

                $('.nasa-compare-list-bottom').find('.nasa-loader').remove();
            },
            error: function() {

            }
        });
    }
}

/**
 * Show compare
 * 
 * @param {type} $
 * @returns {undefined}
 */
function showCompare($) {
    if ($('.nasa-compare-list-bottom').length) {
        $('.transparent-window').show();
        
        if ($('.nasa-show-compare').length && !$('.nasa-show-compare').hasClass('nasa-showed')) {
            $('.nasa-show-compare').addClass('nasa-showed');
        }
        
        if (!$('.nasa-compare-list-bottom').hasClass('nasa-active')) {
            $('.nasa-compare-list-bottom').addClass('nasa-active');
        }
    }
}

/**
 * Hide compare
 * 
 * @param {type} $
 * @returns {undefined}
 */
function hideCompare($) {
    if ($('.nasa-compare-list-bottom').length) {
        $('.transparent-window').fadeOut(550);
        
        if ($('.nasa-show-compare').length && $('.nasa-show-compare').hasClass('nasa-showed')) {
            $('.nasa-show-compare').removeClass('nasa-showed');
        }
        
        $('.nasa-compare-list-bottom').removeClass('nasa-active');
    }
}

/**
 * Single add to cart
 * 
 * @param {type} $
 * @param {type} _this
 * @param {type} _id
 * @param {type} _quantity
 * @param {type} _type
 * @param {type} _variation_id
 * @param {type} _variation
 * @param {type} _data_wishlist
 * @returns {undefined|Boolean}
 */
function nasa_single_add_to_cart($, _this, _id, _quantity, _type, _variation_id, _variation, _data_wishlist) {
    var _form = $(_this).parents('form.cart');
    
    if (_type === 'grouped') {
        if ($(_form).length) {
            if ($(_form).find('.nasa-custom-fields input[name="nasa_cart_sidebar"]').length) {
                $(_form).find('.nasa-custom-fields input[name="nasa_cart_sidebar"]').val('1');
            } else {
                $(_form).find('.nasa-custom-fields').append('<input type="hidden" name="nasa_cart_sidebar" value="1" />');
            }
            
            $(_form).submit();
        }
        
        return;
    }
    // Ajax add to cart
    else {
        if (
            typeof nasa_ajax_params !== 'undefined' &&
            typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
        ) {
            var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_single_add_to_cart');
            
            var _data = {
                product_id: _id,
                quantity: _quantity,
                product_type: _type,
                variation_id: _variation_id,
                variation: _variation,
                data_wislist: _data_wishlist
            };
            
            if ($(_form).length) {
                if (_type === 'simple') {
                    $(_form).find('.nasa-custom-fields').append('<input type="hidden" name="add-to-cart" value="' + _id + '" />');
                }
                
                _data = $(_form).serializeArray();
                $(_form).find('.nasa-custom-fields [name="add-to-cart"]').remove();
            }
            
            $.ajax({
                url: _urlAjax,
                type: 'post',
                dataType: 'json',
                cache: false,
                data: _data,
                beforeSend: function () {
                    $(_this).removeClass('added');
                    $(_this).removeClass('nasa-added');
                    $(_this).addClass('loading');
                },
                success: function (res) {
                    if (res.error) {
                        if ($(_this).hasClass('add-to-cart-grid')) {
                            var _href = $(_this).attr('href');
                            window.location.href = _href;
                        } else {
                            setNotice($, res.message);
                            $(_this).removeClass('loading');
                        }
                    } else {
                        if (typeof res.redirect !== 'undefined' && res.redirect) {
                            window.location.href = res.redirect;
                        } else {
                            var fragments = res.fragments;
                            if (fragments) {
                                $.each(fragments, function (key, value) {
                                    $(key).addClass('updating');
                                    $(key).replaceWith(value);
                                });

                                if (!$(_this).hasClass('added')) {
                                    $(_this).addClass('added');
                                }

                                if (!$(_this).hasClass('nasa-added')) {
                                    $(_this).addClass('nasa-added');
                                }
                            }

                            if ($('.wishlist_sidebar').length) {
                                if (typeof res.wishlist !== 'undefined') {
                                    $('.wishlist_sidebar').replaceWith(res.wishlist);

                                    setTimeout(function() {
                                        initWishlistIcons($, true);
                                    }, 350);

                                    if ($('.nasa-mini-number.wishlist-number').length) {
                                        var sl_wislist = parseInt(res.wishlistcount);
                                        $('.nasa-mini-number.wishlist-number').html(convert_count_items($, sl_wislist));
                                        if (sl_wislist > 0) {
                                            $('.nasa-mini-number.wishlist-number').removeClass('nasa-product-empty');
                                        }
                                        else if (sl_wislist === 0 && !$('.wishlist-number').hasClass('nasa-product-empty')) {
                                            $('.nasa-mini-number.wishlist-number').addClass('nasa-product-empty');
                                        }
                                    }

                                    if ($('.add-to-wishlist-' + _id).length) {
                                        $('.add-to-wishlist-' + _id).find('.yith-wcwl-add-button').show();
                                        $('.add-to-wishlist-' + _id).find('.yith-wcwl-wishlistaddedbrowse').hide();
                                        $('.add-to-wishlist-' + _id).find('.yith-wcwl-wishlistexistsbrowse').hide();
                                    }
                                }
                            }

                            if ($('.page-shopping-cart').length === 1) {
                                $.ajax({
                                    url: window.location.href,
                                    type: 'get',
                                    dataType: 'html',
                                    cache: false,
                                    data: {},
                                    success: function (res) {
                                        var $html = $.parseHTML(res);

                                        if ($('.nasa-shopping-cart-form').length === 1) {
                                            var $new_form   = $('.nasa-shopping-cart-form', $html);
                                            var $new_totals = $('.cart_totals', $html);
                                            var $notices    = $('.woocommerce-error, .woocommerce-message, .woocommerce-info', $html);
                                            $('.nasa-shopping-cart-form').replaceWith($new_form);

                                            if ($notices.length) {
                                                $('.nasa-shopping-cart-form').before($notices);
                                            }
                                            $('.cart_totals').replaceWith($new_totals);

                                        } else {
                                            var $new_content = $('.page-shopping-cart', $html);
                                            $('.page-shopping-cart').replaceWith($new_content);
                                        }

                                        $(document.body).trigger('updated_cart_totals');
                                        $(document.body).trigger('updated_wc_div');
                                        $('.nasa-shopping-cart-form').find('input[name="update_cart"]').prop('disabled', true);
                                    }
                                });
                            }

                            $(document.body).trigger('added_to_cart', [res.fragments, res.cart_hash, _this]);
                        }
                    }
                }
            });
        }
    }
    
    return false;
}

/**
 * Bundle Yith popup
 * 
 * @param {type} $
 * @param {type} _this
 * @returns {undefined}
 */
function loadComboPopup($, _this) {
    if (
        typeof nasa_ajax_params !== 'undefined' &&
        typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
    ) {
        var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_combo_products');
        
        var item = $(_this).parents('.product-item');
        if (!$(_this).hasClass('nasaing')) {
            $('.btn-combo-link').addClass('nasaing');
            var pid = $(_this).attr('data-prod');
            if (pid) {
                $.ajax({
                    url: _urlAjax,
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {
                        id: pid,
                        'title_columns': 2
                    },
                    beforeSend: function () {
                        $(item).append('<div class="nasa-loader" style="top:50%"></div>');
                        $(item).find('.product-inner').css('opacity', '0.3');
                    },
                    success: function (res) {
                        $.magnificPopup.open({
                            mainClass: 'my-mfp-slide-bottom nasa-combo-popup-wrap',
                            items: {
                                src: '<div class="row nasa-combo-popup nasa-combo-row comboed-row zoom-anim-dialog" data-prod="' + pid + '">' + res.content + '</div>',
                                type: 'inline'
                            },
                            removalDelay: 300,
                            callbacks: {
                                afterClose: function() {

                                }
                            }
                        });

                        $('body').trigger('nasa_load_slick_slider');

                        setTimeout(function () {
                            $('.btn-combo-link').removeClass('nasaing');
                            $(item).find('.nasa-loader').remove();
                            $(item).find('.product-inner').css('opacity', '1');
                            if (!wow_enable) {
                                $('.nasa-combo-popup').find('.product-item').css({'visibility': 'visible'});
                            } else {
                                var _data_animate, _delay;
                                $('.nasa-combo-popup').find('.product-item').each(function() {
                                    var _this = $(this);
                                    _data_animate = $(_this).attr('data-wow');
                                    _delay = parseInt($(_this).attr('data-wow-delay'));
                                    $(_this).css({
                                        'visibility': 'visible',
                                        'animation-delay': _delay + 'ms',
                                        'animation-name': _data_animate
                                    }).addClass('animated');
                                });
                            }
                        }, 500);
                    },
                    error: function () {
                        $('.btn-combo-link').removeClass('nasaing');
                    }
                });
            }
        }
    }
}

/**
 * Load height full to side
 */
function loadHeightFullWidthToSide($) {
    if ($('.columns.nasa-full-to-left, .columns.nasa-full-to-right').length) {
        var _wwin = $(window).width();
        
        $('.columns.nasa-full-to-left, .columns.nasa-full-to-right').each(function() {
            var _this = $(this);
            if (_wwin > 1200) {
                var _hElement = $(_this).outerHeight();
                var _hWrap = $(_this).parents('.row').length ? $(_this).parents('.row').height() : 0;
                if (_hWrap <= _hElement) {
                    $(_hWrap).css({'min-height': _hElement});
                } else {
                    $(_hWrap).css({'min-height': 'auto'});
                }
            } else {
                $(_hWrap).css({'min-height': 'auto'});
            }
        });
    }
}

/**
 * Main menu Reponsive
 */
function loadResponsiveMainMenu($) {
    if ($('.nasa-menus-wrapper-reponsive').length) {
        var _wwin = $(window).width();
        
        $('.nasa-menus-wrapper-reponsive').each(function() {
            var _this = $(this);
            
            var _tl = _wwin/1200;
            if (_tl < 1) {
                var _x = $(_this).attr('data-padding_x');
                var _params = {'font-size': (100*_tl).toString() + '%'};
                
                if (!$('body').hasClass('nasa-rtl')) {
                    _params['margin-right'] = (_tl*_x).toString() + 'px';
                    _params['margin-left'] = '0';
                } else {
                    _params['margin-left'] = (_tl*_x).toString() + 'px';
                    _params['margin-right'] = '0';
                }

                $(_this).find('.header-nav > li > a').css(_params);
                
                if ($(_this).find('.nasa-title-vertical-menu').length) {
                    $(_this).find('.nasa-title-vertical-menu').css({
                        'font-size': (100*_tl).toString() + '%'
                    });
                }
            } else {
                $(_this).find('.header-nav > li > a').removeAttr('style');
                if ($(_this).find('.nasa-title-vertical-menu').length) {
                    $(_this).find('.nasa-title-vertical-menu').removeAttr('style');
                }
            }
        });
    }
}

/**
 * Mobile Menu
 * 
 * @type initMenuMobile.mini_acc|initMenuMobile.head_menu|StringMain menu
 */
function initMenuMobile($) {
    if ($('#nasa-menu-sidebar-content .nasa-menu-for-mobile').length <= 0) {
        var _mobileDetect = $('input[name="nasa_mobile_layout"]').length ? true : false;
        
        var _mobile_menu = '';

        if ($('.nasa-to-menu-mobile').length) {
            $('.nasa-to-menu-mobile').each(function() {
                var _this = $(this);
                _mobile_menu += $(_this).html();
                if (_mobileDetect) {
                    $(_this).remove();
                }
            });
        }

        else if ($('.header-type-builder .header-nav').length) {
            $('.header-type-builder .header-nav').each(function() {
                _mobile_menu += $(this).html();
            });
        }

        /**
         * Vertical menu in header
         */
        if ($('.nasa-vertical-header .vertical-menu-wrapper').length){
            var ver_menu = $('.nasa-vertical-header .vertical-menu-wrapper').html();
            var ver_menu_title = $('.nasa-vertical-header .nasa-title-vertical-menu').html();
            var ver_menu_warp = '<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-parent-item default-menu root-item nasa-menu-none-event li_accordion"><a href="javascript:void(0);">' + ver_menu_title + '</a><div class="nav-dropdown-mobile"><ul class="sub-menu">' + ver_menu + '</ul></div></li>';
            
            if ($('.nasa-vertical-header').hasClass('nasa-focus-menu')) {
                _mobile_menu = ver_menu_warp + _mobile_menu;
            } else {
                _mobile_menu += ver_menu_warp;
            }
            
            if (_mobileDetect) {
                $('.nasa-vertical-header').remove();
            }
        }

        /**
         * Heading
         */
        if ($('#heading-menu-mobile').length === 1) {
            _mobile_menu = '<li class="menu-item root-item menu-item-heading">' + $('#heading-menu-mobile').html() + '</li>' + _mobile_menu;
            
            if (_mobileDetect) {
                $('#heading-menu-mobile').remove();
            }
        }

        /**
         * Vertical Menu in content page
         */
        if ($('.nasa-shortcode-menu.vertical-menu').length) {
            $('.nasa-shortcode-menu.vertical-menu').each(function() {
                var _this = $(this);
                var ver_menu_sc = $(_this).find('.vertical-menu-wrapper').html();
                var ver_menu_title_sc = $(_this).find('.section-title').html();
                
                if (!$('#nasa-menu-sidebar-content').hasClass('nasa-light-new')) {
                    ver_menu_title_sc = '<h5 class="menu-item-heading margin-top-35 margin-bottom-10">' + ver_menu_title_sc + '</h5>';
                } else {
                    ver_menu_title_sc = '<a href="javascript:void(0);">' + ver_menu_title_sc + '</a>';
                }
                
                var ver_menu_warp_sc = '<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-parent-item default-menu root-item nasa-menu-none-event li_accordion">' + ver_menu_title_sc + '<div class="nav-dropdown-mobile"><ul class="sub-menu">' + ver_menu_sc + '</ul></div></li>';
                
                _mobile_menu += ver_menu_warp_sc;
                
                if (_mobileDetect) {
                    $(_this).remove();
                }
            });
        }
        
        /**
         * Topbar menu
         */
        if ($('.nasa-topbar-menu').length) {
            _mobile_menu += $('.nasa-topbar-menu').html();
            
            if (_mobileDetect) {
                $('.nasa-topbar-menu').remove();
            }
        }

        /**
         * Mobile account
         */
        if ($('#mobile-account').length === 1) {
            if ($('#nasa-menu-sidebar-content').hasClass('nasa-light-new') && $('#mobile-account').find('.nasa-menu-item-account').length) {
                _mobile_menu += '<li class="menu-item root-item menu-item-account menu-item-has-children root-item">' + $('#mobile-account').find('.nasa-menu-item-account').html() + '</li>';
            } else {
                _mobile_menu += '<li class="menu-item root-item menu-item-account">' + $('#mobile-account').html() + '</li>';
            }
            
            if (_mobileDetect) {
                $('#mobile-account').remove();
            }
        }

        /**
         * Switch language
         */
        var switch_lang = '';
        if ($('.topbar-menu-container .header-switch-languages').length === 1) {
            switch_lang = $('.topbar-menu-container .header-switch-languages').html();
            if (_mobileDetect) {
                $('.topbar-menu-container .header-switch-languages').remove();
            }
        }

        if ($('.topbar-menu-container .header-multi-languages').length) {
            switch_lang = $('.topbar-menu-container .header-multi-languages').html();
            if (_mobileDetect) {
                $('.topbar-menu-container .header-multi-languages').remove();
            }
        }

        if ($('#nasa-menu-sidebar-content').hasClass('nasa-light-new')) {
            _mobile_menu = '<ul id="mobile-navigation" class="header-nav nasa-menu-accordion nasa-menu-for-mobile">' + _mobile_menu + switch_lang + '</ul>';
        } else {
            _mobile_menu = '<ul id="mobile-navigation" class="header-nav nasa-menu-accordion nasa-menu-for-mobile">' + switch_lang + _mobile_menu + '</ul>';
        }

        if ($('#nasa-menu-sidebar-content #mobile-navigation').length) {
            $('#nasa-menu-sidebar-content #mobile-navigation').replaceWith(_mobile_menu);
        } else {
            $('#nasa-menu-sidebar-content .nasa-mobile-nav-wrap').append(_mobile_menu);
        }
        
        var _nav = $('#nasa-menu-sidebar-content #mobile-navigation');
        
        if ($(_nav).find('.nasa-select-currencies').length) {
            var _currency = $(_nav).find('.nasa-select-currencies');
            var _class = $(_currency).find('.wcml_currency_switcher').attr('class');
            _class += ' menu-item-has-children root-item li_accordion';
            var _currencyObj = $(_currency).find('.wcml-cs-active-currency').clone();
            $(_currencyObj).addClass(_class);
            $(_currencyObj).find('.wcml-cs-submenu').addClass('sub-menu');
            
            $(_nav).find('.nasa-select-currencies').replaceWith(_currencyObj);
        }

        $(_nav).find('.root-item > a').removeAttr('style');
        $(_nav).find('.nav-dropdown').attr('class', 'nav-dropdown-mobile').removeAttr('style');
        $(_nav).find('.nav-column-links').addClass('nav-dropdown-mobile');

        /**
         * Fix for nasa-core not active.
         */
        $(_nav).find('.sub-menu').each(function() {
            if (!$(this).parent('.nav-dropdown-mobile').length) {
                $(this).wrap('<div class="nav-dropdown-mobile"></div>');
            }
        });

        $(_nav).find('.nav-dropdown-mobile').find('.sub-menu').removeAttr('style');
        $(_nav).find('hr.hr-nasa-megamenu').remove();
        $(_nav).find('li').each(function(){
            if ($(this).hasClass('menu-item-has-children')){
                $(this).addClass('li_accordion');
                if ($(this).hasClass('current-menu-ancestor') || $(this).hasClass('current-menu-parent')){
                    $(this).addClass('active');
                    $(this).prepend('<a href="javascript:void(0);" class="accordion"></a>');
                } else {
                    $(this).prepend('<a href="javascript:void(0);" class="accordion"></a>').find('>.nav-dropdown-mobile').hide();
                }
            }
        });
        
        $(_nav).find('a').removeAttr('style');
        
        $('body').trigger('nasa_after_load_mobile_menu');
    }
}

/**
 * position Mobile menu
 * 
 * @param {type} $
 * @returns {undefined}
 */
function positionMenuMobile($) {
    if ($('#nasa-menu-sidebar-content').length) {
        if ($('#mobile-navigation').length && $('#mobile-navigation').attr('data-show') !== '1') {
            $('#nasa-menu-sidebar-content').removeClass('nasa-active');
                
            var _h_adminbar = $('#wpadminbar').length ? $('#wpadminbar').height() : 0;

            if (_h_adminbar > 0) {
                $('#nasa-menu-sidebar-content').css({'top': _h_adminbar});
            }
        }
    }
}

/**
 * Top categories filter
 * 
 * @param {type} $
 * @returns {undefined}
 */
function initTopCategoriesFilter($) {
    if ($('.nasa-top-cat-filter').length) {
        var _act;
        var _obj;

        $('.nasa-top-cat-filter').each(function() {
            var _this_filter = $(this);
            var _root_item = $(_this_filter).find('.root-item');
            _act = false;
            _obj = null;
            if ($(_root_item).length) {

                $(_root_item).each(function() {
                    var _this = $(this);
                    if ($(_this).hasClass('active')) {
                        $(_this).addClass('nasa-current-top');
                        _obj =  $(_this);
                        _act = true;
                    }
                    
                    $(_this).find('.children .nasa-current-note').remove();
                });

                if (!_act) {
                    $(_root_item).each(function() {
                        var _this = $(this);
                        if ($(_this).hasClass('cat-parent') && !_act) {
                            $(_this).addClass('nasa-current-top');
                            _obj =  $(_this);
                            _act = true;
                        }
                    });
                }

                if (_obj !== null) {
                    var init_width = $(_obj).width();
                    if (init_width) {
                        var _pos = $(_obj).position();
                        var _note_act = $(_obj).parents('.nasa-top-cat-filter').find('.nasa-current-note');
                        $(_note_act).css({'visibility': 'visible', 'width': init_width, 'left': _pos.left, top: ($(_obj).height() - 1)});
                    }
                }
            }
        });
    }
}

/**
 * hover top categories filter
 * @param {type} $
 * @returns {undefined}
 */
function hoverTopCategoriesFilter($) {
    $('body').on('mouseover', '.nasa-top-cat-filter .root-item', function() {
        var _obj = $(this),
            _wrap = $(_obj).parents('.nasa-top-cat-filter');
        $(_wrap).find('.root-item').removeClass('nasa-current-top');
        $(_obj).addClass('nasa-current-top');

        var _pos = $(_obj).position();
        var _note_act = $(_wrap).find('> .nasa-current-note');
        $(_note_act).css({'visibility': 'visible', 'width': $(_obj).width(), 'left': _pos.left, top: ($(_obj).height() - 1)});
        
        return false;
    });
}

/**
 * hover top child categories filter
 * @param {type} $
 * @returns {undefined}
 */
function hoverChilrenTopCatogoriesFilter($) {
    $('body').on('mouseover', '.nasa-top-cat-filter .children .cat-item', function() {
        var _obj = $(this),
            _wrap = $(_obj).parent('.children');
        var _note_act = $(_wrap).find('>.nasa-current-note');
        
        if ($(_note_act).length <= 0) {
            $(_wrap).prepend('<li class="nasa-current-note" />');
            _note_act = $(_wrap).find('>.nasa-current-note');
        }
        
        $(_wrap).find('.cat-item').removeClass('nasa-current-child');
        $(_obj).addClass('nasa-current-child');

        var _pos = $(_obj).position();
        $(_note_act).css({'visibility': 'visible', 'width': $(_obj).width(), 'left': _pos.left, top: ($(_obj).height() - 1)});
        
        return false;
    });
}

/**
 * clone group btn loop products
 * 
 * @param {type} $
 * @returns {undefined}
 */
function cloneGroupBtnsProductItem($) {
    var _list = $('.products').length && $('.products').hasClass('list') ? true : false;
    
    if (_list && $('.nasa-content-page-products .nasa-btns-product-item').length) {
        $('.nasa-content-page-products .nasa-btns-product-item').each(function() {
            var _this = $(this);
            
            if (!$(_this).hasClass('nasa-list-cloned')) {
                $(_this).addClass('nasa-list-cloned');
                
                var _wrap = $(_this).parents('.product-item');
                if ($(_wrap).find('.group-btn-in-list').length <= 0) {
                    $(_wrap).append('<div class="group-btn-in-list nasa-group-btns hidden-tag"></div>');
                    
                    var _place = $(_wrap).find('.group-btn-in-list');
                    var _html = '';

                    if ($(_wrap).find('.price-wrap').length) {
                        var _price = $(_wrap).find('.price-wrap').html();
                        _html += _price ? '<div class="price-wrap">' + $(_wrap).find('.price-wrap').html() + '</div>' : '';
                    }

                    if ($(_wrap).find('.nasa-list-stock-wrap').length) {
                        _html += $(_wrap).find('.nasa-list-stock-wrap').html();
                        $(_wrap).find('.nasa-list-stock-wrap').remove();
                    }

                    _html += $(_this).html();
                    $(_place).html(_html);
                    if ($(_place).find('.btn-link').length) {
                        $(_place).find('.btn-link').each(function() {
                            if (
                                $(this).find('.nasa-icon-text').length <= 0 &&
                                $(this).find('.nasa-icon').length &&
                                $(this).attr('data-icon-text')
                            ) {
                                $(this).find('.nasa-icon').after(
                                    '<span class="nasa-icon-text">' +
                                        $(this).attr('data-icon-text') +
                                    '</span>'
                                );
                            }
                        });
                    }
                }
            }
        }); 
    }
}

/**
 * Single slick images
 * 
 * @param {type} $
 * @param {type} restart
 * @returns {undefined}
 */
function loadSlickSingleProduct($, restart) {
    if ($('.nasa-single-product-slide .nasa-single-product-main-image').length) {
        var _restart = typeof restart === 'undefined' ? false : true;
        var _rtl = $('body').hasClass('nasa-rtl') ? true : false;
        
        var _root_wrap = $('.nasa-single-product-slide');
        var _main = $(_root_wrap).find('.nasa-single-product-main-image'),
            _thumb = $(_root_wrap).find('.nasa-single-product-thumbnails').length ? $(_root_wrap).find('.nasa-single-product-thumbnails') : null,
            
            _autoplay = $(_root_wrap).attr('data-autoplay') === 'true' ? true : false,
            _speed = parseInt($(_root_wrap).attr('data-speed')),
            _delay = parseInt($(_root_wrap).attr('data-delay')),
            _dots = $(_root_wrap).attr('data-dots') === 'true' ? true : false,
            _num_main = parseInt($(_root_wrap).attr('data-num_main'));

        _speed = !_speed ? 600 : _speed;
        _delay = !_delay ? 6000 : _delay;
        _num_main = !_num_main ? 1 : _num_main;
        
        if (_restart) {
            if ($(_main).length && $(_main).hasClass('slick-initialized')) {
                $(_main).slick('unslick');
            }
            
            if ($(_thumb).length && $(_thumb).hasClass('slick-initialized')) {
                $(_thumb).slick('unslick');
            }
        }
        
        var _interval = setInterval(function() {
            if ($(_main).find('#nasa-main-image-0 img').height()) {
                if (!$(_main).hasClass('slick-initialized')) {
                    $(_main).slick({
                        rtl: _rtl,
                        slidesToShow: _num_main,
                        slidesToScroll: _num_main,
                        autoplay: _autoplay,
                        autoplaySpeed: _delay,
                        speed: _speed,
                        arrows: true,
                        dots: _dots,
                        infinite: false,
                        asNavFor: _thumb,
                        responsive: [
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    });
                }

                if (_thumb && !$(_thumb).hasClass('slick-initialized')) {
                    var _num_ver = parseInt($(_root_wrap).attr('data-num_thumb'));
                    _num_ver = !_num_ver ? 4 : _num_ver;

                    var _vertical = true;
                    var wrapThumb = $(_thumb).parents('.nasa-thumb-wrap');

                    if ($(wrapThumb).length && $(wrapThumb).hasClass('nasa-thumbnail-hoz')) {
                        _vertical = false;
                        _num_ver = 5;
                    }

                    var _setting = {
                        vertical: _vertical,
                        slidesToShow: _num_ver,
                        slidesToScroll: 1,
                        dots: false,
                        arrows: true,
                        infinite: false
                    };

                    if (!_vertical) {
                        _setting.rtl = _rtl;
                    } else {
                        _setting.verticalSwiping = true;
                    }

                    _setting.asNavFor = _main;
                    _setting.centerMode = false;
                    _setting.centerPadding = '0';
                    _setting.focusOnSelect = true;

                    $(_thumb).slick(_setting);
                    $(_thumb).attr('data-speed', _speed);
                }
                
                clearInterval(_interval);
                
                $('body').trigger('nasa_after_single_product_slick_inited', [_thumb, _num_ver]);
            }
        }, 100);
        
        setTimeout(function() {
            if ($('.nasa-single-product-slide .nasa-single-product-main-image .slick-list').length <= 0 || $('.nasa-single-product-slide .nasa-single-product-main-image .slick-list').height() < 2) {
                loadSlickSingleProduct($, true);
            }
        }, 500);
    }
}

/**
 * loadScrollSingleProduct
 */
function loadScrollSingleProduct($, _click) {
    var clickEvent = typeof _click !== 'undefined' ? _click : false;
    if ($('.nasa-single-product-scroll').length && $('.nasa-end-scroll').length) {
        var _hasThumbs = $('.nasa-single-product-thumbnails').length ? true : false;
        if ($('.nasa-single-product-thumbnails').hasClass('nasa-single-fixed')) {
            var _thumb_wrap = $('.nasa-single-product-thumbnails').parents('.nasa-thumb-wrap');
            var _pos_thumb = $(_thumb_wrap).offset();
            $('.nasa-single-product-thumbnails').css({
                'left': _pos_thumb.left,
                'width': $(_thumb_wrap).width()
            });
        }
        
        if ($('.nasa-product-info-scroll').hasClass('nasa-single-fixed')) {
            var _scroll_wrap = $('.nasa-product-info-scroll').parents('.nasa-product-info-wrap');
            var _pos_wrap = $(_scroll_wrap).offset();
            $('.nasa-product-info-scroll').css({
                'left': _pos_wrap.left,
                'width': $(_scroll_wrap).width()
            });
        }
        
        var _col_main = parseInt($('.nasa-single-product-scroll').attr('data-num_main'));
        var _main_images = [];
        $('.nasa-item-main-image-wrap').each(function() {
            var p = {
                id: '#' + $(this).attr('id'),
                pos: $(this).offset().top
            };
            
            _main_images.push(p);
        });
        
        if (clickEvent) {
            var _timeOutThumbItem;
            $('body').on('click', '.nasa-thumb-wrap .nasa-wrap-item-thumb', function() {
                if (typeof _timeOutThumbItem !== 'undefined') {
                    clearTimeout(_timeOutThumbItem);
                }

                var _main = $(this).attr('data-main');

                var _topfix = 0;
                if ($('.fixed-already').length === 1) {
                    _topfix += $('.fixed-already').outerHeight();
                }

                if ($('#wpadminbar').length === 1) {
                    _topfix += $('#wpadminbar').outerHeight();
                }

                var _pos_top = $(_main).offset().top - _topfix;

                _timeOutThumbItem = setTimeout(function() {
                    $('html, body').animate({scrollTop: _pos_top - 10}, 300);
                }, 100);
            });
        }
        
        var lastScrollTop = 0; 
        $(window).scroll(function(){
            var scrollTop = $(this).scrollTop();
            var bodyHeight = $(window).height();
            var _inMobile = $('.nasa-check-reponsive.nasa-switch-check').length && $('.nasa-check-reponsive.nasa-switch-check').width() === 1 ? true : false;
            if (!_inMobile) {
                var _down = scrollTop > lastScrollTop ? true : false;
                lastScrollTop = scrollTop;
                
                var _pos = $('.nasa-main-wrap').offset();
                var _pos_end = $('.nasa-end-scroll').offset();

                var _topfix = 0;
                if ($('.fixed-already').length === 1) {
                    _topfix += $('.fixed-already').outerHeight();
                }

                if ($('#wpadminbar').length === 1) {
                    _topfix += $('#wpadminbar').outerHeight();
                }
                
                var _higherInfo = true;
                if ($('.nasa-product-info-scroll').outerHeight() < (bodyHeight + 10 - _topfix)) {
                    _higherInfo = false;
                }

                var _higherThumb = true;
                if (_hasThumbs && $('.nasa-single-product-thumbnails').outerHeight() < (bodyHeight + 10 - _topfix)) {
                    _higherThumb = false;
                }
                
                var _start_top = _pos.top - _topfix;

                var _info_height = $('.nasa-product-info-scroll').height();
                var _thumb_height = _hasThumbs ? $('.nasa-single-product-thumbnails').height() : 0;
                
                var _moc_end_info = scrollTop + bodyHeight - (bodyHeight - _info_height) + _topfix + 10;
                var _moc_end_thumb = scrollTop + bodyHeight - (bodyHeight - _thumb_height) + _topfix + 10;
                var _topbar = scrollTop - _start_top;
                
                if (_pos_end.top > _moc_end_info) {
                    if (_topbar >= 0){
                        var _scroll_wrap = $('.nasa-product-info-scroll').parents('.nasa-product-info-wrap');
                        var _pos_wrap = $(_scroll_wrap).offset();
                        if (!$('.nasa-product-info-scroll').hasClass('nasa-single-fixed')) {
                            $('.nasa-product-info-scroll').addClass('nasa-single-fixed');
                        }
                        
                        if (!_higherInfo) {
                            $('.nasa-product-info-scroll').css({
                                '-webkit-transform': 'translate3d(0,0,0)',
                                '-moz-transform': 'translate3d(0,0,0)',
                                '-ms-transform': 'translate3d(0,0,0)',
                                'transform': 'translate3d(0,0,0)',
                                'top': _topfix + 10,
                                'bottom': 'auto',
                                'left': _pos_wrap.left,
                                'width': $(_scroll_wrap).width()
                            });
                            
                            $('.nasa-product-info-scroll').css({'margin-top': _topbar + 10});
                        }
                        
                        else {
                            $('.nasa-product-info-scroll').css({
                                '-webkit-transform': 'translate3d(0,0,0)',
                                '-moz-transform': 'translate3d(0,0,0)',
                                '-ms-transform': 'translate3d(0,0,0)',
                                'transform': 'translate3d(0,0,0)',
                                'left': _pos_wrap.left,
                                'width': $(_scroll_wrap).width()
                            });
                            
                            if (_down) {
                                $('.nasa-product-info-scroll').css({
                                    'top': 'auto',
                                    'bottom': 0
                                });

                                $('.nasa-product-info-scroll').css({'margin-top': _topbar + 10});
                            }
                            
                            else {
                                $('.nasa-product-info-scroll').css({
                                    'top': _topfix + 10,
                                    'bottom': 'auto'
                                });
                            }
                        }
                    } else {
                        if ($('.nasa-product-info-scroll').hasClass('nasa-single-fixed')) {
                            $('.nasa-product-info-scroll').removeClass('nasa-single-fixed');
                        }
                        $('.nasa-product-info-scroll').css({'margin-top': 0});
                    }
                } else {
                    if ($('.nasa-product-info-scroll').hasClass('nasa-single-fixed')) {
                        $('.nasa-product-info-scroll').removeClass('nasa-single-fixed');
                    }
                }
                
                /**
                 * Scroll Thumbnails
                 */
                if (_hasThumbs) {
                    if (_pos_end.top > _moc_end_thumb) {
                        if (_topbar >= 0){
                            var _thumb_wrap = $('.nasa-single-product-thumbnails').parents('.nasa-thumb-wrap');
                            var _pos_thumb = $(_thumb_wrap).offset();
                            if (!$('.nasa-single-product-thumbnails').hasClass('nasa-single-fixed')) {
                                $('.nasa-single-product-thumbnails').addClass('nasa-single-fixed');
                            }
                            
                            if (!_higherThumb) {
                                $('.nasa-single-product-thumbnails').css({
                                    '-webkit-transform': 'translate3d(0, 0, 0)',
                                    '-moz-transform': 'translate3d(0, 0, 0)',
                                    '-ms-transform': 'translate3d(0, 0, 0)',
                                    'transform': 'translate3d(0, 0, 0)',
                                    'top': _topfix + 10,
                                    'bottom': 'auto',
                                    'left': _pos_thumb.left,
                                    'width': $(_thumb_wrap).width()
                                });
                                
                                $('.nasa-single-product-thumbnails').css({'margin-top': _topbar  + 10});
                            }
                            
                            else {
                                $('.nasa-single-product-thumbnails').css({
                                    '-webkit-transform': 'translate3d(0, 0, 0)',
                                    '-moz-transform': 'translate3d(0, 0, 0)',
                                    '-ms-transform': 'translate3d(0, 0, 0)',
                                    'transform': 'translate3d(0, 0, 0)',
                                    'left': _pos_thumb.left,
                                    'width': $(_thumb_wrap).width()
                                });
                                
                                if (_down) {
                                    $('.nasa-single-product-thumbnails').css({
                                        'top': 'auto',
                                        'bottom': 0
                                    });
                                    
                                    $('.nasa-single-product-thumbnails').css({'margin-top': _topbar  + 10});
                                } else {
                                    $('.nasa-single-product-thumbnails').css({
                                        'top': _topfix + 10,
                                        'bottom': 'auto'
                                    });
                                }
                            }
                        } else {
                            if ($('.nasa-single-product-thumbnails').hasClass('nasa-single-fixed')) {
                                $('.nasa-single-product-thumbnails').removeClass('nasa-single-fixed');
                            }
                            $('.nasa-single-product-thumbnails').css({'margin-top': 0});
                        }
                    } else {
                        if ($('.nasa-single-product-thumbnails').hasClass('nasa-single-fixed')) {
                            $('.nasa-single-product-thumbnails').removeClass('nasa-single-fixed');
                        }
                    }
                }

                // Active image scroll
                var i = _main_images.length;
                if (i) {
                    for(i; i>0; i--) {
                        if (_main_images[i-1].pos <= scrollTop + _topfix + 50){
                            var _key = $(_main_images[i-1].id).attr('data-key');
                            $('.nasa-thumb-wrap .nasa-wrap-item-thumb').removeClass('nasa-active');
                            $('.nasa-thumb-wrap .nasa-wrap-item-thumb[data-key="' + _key + '"]').addClass('nasa-active');
                            if (_col_main % 2 === 0) {
                                var _before_key = (parseInt(_key) - 1).toString();
                                if ($('.nasa-thumb-wrap .nasa-wrap-item-thumb[data-key="' + _before_key + '"]').length) {
                                    $('.nasa-thumb-wrap .nasa-wrap-item-thumb[data-key="' + _before_key + '"]').addClass('nasa-active');
                                }
                            }
                            
                            break;
                        }
                    }
                }
            } else {
                $('.nasa-product-info-scroll').removeAttr('style');
                if (_hasThumbs) {
                    $('.nasa-single-product-thumbnails').removeAttr('style');
                }
                $('.nasa-thumb-wrap .nasa-wrap-item-thumb').removeClass('nasa-active');
                $('.nasa-thumb-wrap .nasa-wrap-item-thumb[data-key="0"]').addClass('nasa-active');
            }
        });
    }
}

/**
 * Init Mini Wishlist Icon
 * 
 * @param {type} $
 * @returns {undefined}
 */
function initMiniWishlist($) {
    if ($('input[name="nasa_wishlist_cookie_name"]').length) {
        var _wishlistArr = get_wishlist_ids($);
        if (_wishlistArr.length) {
            if ($('.nasa-mini-number.wishlist-number').length) {
                var sl_wislist = _wishlistArr.length;
                $('.nasa-mini-number.wishlist-number').html(convert_count_items($, sl_wislist));
                
                if (sl_wislist > 0) {
                    $('.nasa-mini-number.wishlist-number').removeClass('nasa-product-empty');
                }
                
                if (sl_wislist === 0 && !$('.wishlist-number').hasClass('nasa-product-empty')) {
                    $('.nasa-mini-number.wishlist-number').addClass('nasa-product-empty');
                }
            }
        }
    }
}

/**
 * init Wishlist icons
 */
function initWishlistIcons($, init) {
    var _init = typeof init === 'undefined' ? false : init;
    
    /**
     * NasaTheme Wishlist
     */
    if ($('input[name="nasa_wishlist_cookie_name"]').length) {
        var _wishlistArr = get_wishlist_ids($);
        if (_wishlistArr.length) {
            $('.btn-wishlist').each(function() {
                var _this = $(this);
                var _prod = $(_this).attr('data-prod');

                if (_wishlistArr.indexOf(_prod) !== -1) {
                    if (!$(_this).hasClass('nasa-added')) {
                        $(_this).addClass('nasa-added');
                    }

                    if (!$(_this).find('.wishlist-icon').hasClass('added')) {
                        $(_this).find('.wishlist-icon').addClass('added');
                    }
                }

                else if (_init) {
                    if ($(_this).hasClass('nasa-added')) {
                        $(_this).removeClass('nasa-added');
                    }

                    if ($(_this).find('.wishlist-icon').hasClass('added')) {
                        $(_this).find('.wishlist-icon').removeClass('added');
                    }
                }
            });
        }
    }
    
    /**
     * support Yith WooCommerce Wishlist
     */
    else {
    
        if (
            $('.wishlist_sidebar .wishlist_table').length ||
            $('.wishlist_sidebar .nasa_yith_wishlist_premium-wrap .wishlist_table').length
        ) {
            var _wishlistArr = [];
            if ($('.wishlist_sidebar .wishlist_table .nasa-tr-wishlist-item').length) {
                $('.wishlist_sidebar .wishlist_table .nasa-tr-wishlist-item').each(function() {
                    _wishlistArr.push($(this).attr('data-row-id'));
                });
            }

            if ($('.wishlist_sidebar .nasa_yith_wishlist_premium-wrap .wishlist_table tbody tr').length) {
                $('.wishlist_sidebar .nasa_yith_wishlist_premium-wrap .wishlist_table tbody tr').each(function() {
                    _wishlistArr.push($(this).attr('data-row-id'));
                });
            }

            $('.btn-wishlist').each(function() {
                var _this = $(this);
                var _prod = $(_this).attr('data-prod');

                if (_wishlistArr.indexOf(_prod) !== -1) {
                    if (!$(_this).hasClass('nasa-added')) {
                        $(_this).addClass('nasa-added');
                    }

                    if (!$(_this).find('.wishlist-icon').hasClass('added')) {
                        $(_this).find('.wishlist-icon').addClass('added');
                    }
                }

                else if (_init) {
                    if ($(_this).hasClass('nasa-added')) {
                        $(_this).removeClass('nasa-added');
                    }

                    if ($(_this).find('.wishlist-icon').hasClass('added')) {
                        $(_this).find('.wishlist-icon').removeClass('added');
                    }
                }
            });
        }
    }
}

/**
 * init Compare icons
 */
function initCompareIcons($, _init) {
    var init = typeof _init !== 'undefined' ? _init : false;
    var _comparetArr = get_compare_ids($);
    
    if (init && $('.nasa-mini-number.compare-number').length) {
        var _slCompare = _comparetArr.length;
        $('.nasa-mini-number.compare-number').html(convert_count_items($, _slCompare));
        
        if (_slCompare <= 0) {
            if (!$('.nasa-mini-number.compare-number').hasClass('nasa-product-empty')) {
                $('.nasa-mini-number.compare-number').addClass('nasa-product-empty');
            }
        } else {
            $('.nasa-mini-number.compare-number').removeClass('nasa-product-empty');
        }
    }

    if (_comparetArr.length && $('.btn-compare').length) {
        $('.btn-compare').each(function() {
            var _this = $(this);
            var _prod = $(_this).attr('data-prod');

            if (_comparetArr.indexOf(_prod) !== -1) {
                if (!$(_this).hasClass('added')) {
                    $(_this).addClass('added');
                }
                if (!$(_this).hasClass('nasa-added')) {
                    $(_this).addClass('nasa-added');
                }
            } else {
                $(_this).removeClass('added');
                $(_this).removeClass('nasa-added');
            }
        });
    }
}

/**
 * Equal Height Columns
 * 
 * @param {type} $
 * @param {type} _scrollTo
 * @returns {undefined}
 */
function row_equal_height_columns($, _scrollTo) {
    if ($('.nasa-row-cols-equal-height').length) {
        var _scroll = typeof _scrollTo === 'undefined' ? false : _scrollTo;
        
        var _mobileView = $('.nasa-check-reponsive.nasa-switch-check').length && $('.nasa-check-reponsive.nasa-switch-check').width() === 1 ? true : false;
        
        $('.nasa-row-cols-equal-height').each(function() {
            var _this = $(this);
            
            var _offset = false;
            
            if (_scroll) {
                _offset = $(_this).offset();
            }
            
            if ($(_this).find('> .row > .columns').length || $(_this).find('> .nasa-row > .columns').length) {
                var _childs = $(_this).find('> .row').length ?
                    $(_this).find('> .row > .columns') : $(_this).find('> .nasa-row > .columns');
                
                var _placement = $(_this).attr('data-content_placement');
                var _h = 0;
                
                if (typeof _offset.top !== 'undefined') {
                    var _scrollTop = $(window).scrollTop();
                    if (_scrollTop >= _offset.top + 10 && !$(_this).hasClass('nasa-height-scroll')) {
                        $(_this).addClass('nasa-height-scroll');
                        $(_childs).removeAttr('style');
                        if (!_mobileView) {
                            $(_childs).each(function() {
                                var _col = $(this);
                                var _h_col = $(_col).outerHeight();
                                _h = _h < (_h_col-1) ? _h_col-1 : _h;
                            });

                            $(_childs).each(function() {
                                var _col2 = $(this);
                                var _h_col2 = $(_col2).outerHeight();
                                if (_h_col2 < _h) {
                                    if (_placement === 'middle') {
                                        $(_col2).css({
                                            'height': _h,
                                            'padding-top': (_h - _h_col2) / 2
                                        });
                                    }

                                    else if (_placement === 'bottom') {
                                        $(_col2).css({
                                            'height': _h,
                                            'padding-top': _h - _h_col2
                                        });
                                    }

                                    else {
                                        $(_col2).css({
                                            'height': _h
                                        });
                                    }
                                }
                            });
                        }
                    }
                } else {
                    $(_this).removeClass('nasa-height-scroll');
                    $(_childs).removeAttr('style');
                    if (!_mobileView) {
                        $(_childs).each(function() {
                            var _col = $(this);
                            var _h_col = $(_col).outerHeight();
                            _h = _h < (_h_col-1) ? _h_col-1 : _h;
                        });

                        $(_childs).each(function() {
                            var _col2 = $(this);
                            var _h_col2 = $(_col2).outerHeight();
                            if (_h_col2 < _h) {
                                if (_placement === 'middle') {
                                    $(_col2).css({
                                        'height': _h,
                                        'padding-top': (_h - _h_col2) / 2
                                    });
                                }

                                else if (_placement === 'bottom') {
                                    $(_col2).css({
                                        'height': _h,
                                        'padding-top': _h - _h_col2
                                    });
                                }

                                else {
                                    $(_col2).css({
                                        'height': _h
                                    });
                                }
                            }
                        });
                    }
                }
            }
        });
    }
}

/**
 * Change image variable Single product
 */
function changeImageVariableSingleProduct($) {
    /**
     * Trigger Easy Zoom
     */
    $('body').trigger('nasa_before_changed_src_main_img');
    
    /**
     * Change gallery for single product variation
     */
    if (typeof wc_add_to_cart_variation_params !== 'undefined'){
        $.fn.wc_variations_image_update = function(variation) {
            var $form = this;
            
            if (variation && variation.image && variation.image.src && variation.image.src.length > 1) {
                var _countSelect = $form.find('.variations .value select').length;
                var _selected = 0;
                if (_countSelect) {
                    $form.find('.variations .value select').each(function() {
                        if ($(this).val() !== '') {
                            _selected++;
                        }
                    });
                }
                
                if (_countSelect && _selected === _countSelect) {
                    var src_thumb = false;

                    /**
                     * Support Bundle product
                     */
                    if ($('.nasa-product-details-page .woosb-product').length) {
                        if (variation.image.thumb_src !== 'undefined' || variation.image.gallery_thumbnail_src !== 'undefined') {
                            src_thumb = variation.image.gallery_thumbnail_src ? variation.image.gallery_thumbnail_src :  variation.image.thumb_src;
                        }

                        if (src_thumb) {
                            $form.parents('.woosb-product').find('.woosb-thumb-new').html('<img src="' + src_thumb + '" />');
                            $form.parents('.woosb-product').find('.woosb-thumb-ori').hide();
                            $form.parents('.woosb-product').find('.woosb-thumb-new').show();
                        }
                    }
                    
                    else {
                        var _src_large = typeof variation.image_single_page !== 'undefined' ?
                            variation.image_single_page : variation.image.url;
                            
                        $('.main-images .nasa-item-main-image-wrap:eq(0) img').attr('src', _src_large);
                        $('.main-images .nasa-item-main-image-wrap:eq(0) a').attr('href', variation.image.url);

                        /**
                         * Trigger Easy Zoom
                         */
                        $('body').trigger('nasa_after_changed_src_main_img', [_src_large, variation.image.url]);
                        
                        $('.main-images .nasa-item-main-image-wrap:eq(0) img').removeAttr('srcset');

                        /**
                         * For thumnail
                         */
                        if ($('.product-thumbnails').length) {
                            if (variation.image.thumb_src !== 'undefined') {
                                src_thumb = variation.image.thumb_src;
                            } else {
                                var thumb_wrap = $('.product-thumbnails .nasa-wrap-item-thumb:eq(0)');
                                if (typeof $(thumb_wrap).attr('data-thumb_org') === 'undefined') {
                                    $(thumb_wrap).attr('data-thumb_org', $(thumb_wrap).find('img').attr('src'));
                                }

                                src_thumb = $(thumb_wrap).attr('data-thumb_org');
                            }

                            if (src_thumb) {
                                $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) img').attr('src', src_thumb).removeAttr('srcset');
                                if ($('body').hasClass('nasa-focus-main-image') && $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) a').length) {
                                    $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) a').trigger('click');
                                }

                                if ($('.nasa-thumb-clone img').length) {
                                    $('.nasa-thumb-clone img').attr('src', src_thumb);
                                }
                            }
                        }
                        
                        else if ($('.nasa-thumb-clone img').length && _src_large) {
                            $('.nasa-thumb-clone img').attr('src', _src_large);
                        }
                    }
                }
                
            } else {
                /**
                 * Support Bundle product
                 */
                if ($('.nasa-product-details-page .woosb-product').length) {
                    $form.parents('.woosb-product').find('.woosb-thumb-ori').show();
                    $form.parents('.woosb-product').find('.woosb-thumb-new').hide();
                } else {
                    var image_link = typeof $('.nasa-product-details-page .woocommerce-main-image').attr('data-full_href') !== 'undefined' ?
                        $('.nasa-product-details-page .woocommerce-main-image').attr('data-full_href') :
                        $('.nasa-product-details-page .woocommerce-main-image').attr('data-o_href');
                    var image_large = $('.nasa-product-details-page .woocommerce-main-image').attr('data-o_href');
                    
                    $('.main-images .nasa-item-main-image-wrap:eq(0) img').attr('src', image_large).removeAttr('srcset');
                    $('.main-images .nasa-item-main-image-wrap:eq(0) a').attr('href', image_link);
                    
                    /**
                     * Trigger Easy Zoom
                     */
                    $('body').trigger('nasa_after_changed_src_main_img', [image_large, image_link]);

                    if ($('.product-thumbnails').length) {
                        var thumb_wrap = $('.product-thumbnails .nasa-wrap-item-thumb:eq(0)');
                        if (typeof $(thumb_wrap).attr('data-thumb_org') === 'undefined') {
                            $(thumb_wrap).attr('data-thumb_org', $(thumb_wrap).find('img').attr('src'));
                        }

                        var src_thumb = $(thumb_wrap).attr('data-thumb_org');
                        if (src_thumb) {
                            $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) img').attr('src', src_thumb);
                            if ($('body').hasClass('nasa-focus-main-image') && $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) a').length) {
                                $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) a').trigger('click');
                            }

                            if ($('.nasa-thumb-clone img').length) {
                                $('.nasa-thumb-clone img').attr('src', src_thumb);
                            }
                        }
                    } else if ($('.nasa-thumb-clone img').length && image_large) {
                        $('.nasa-thumb-clone img').attr('src', image_large);
                    }
                }
            }

            /**
             * deal time
             */
            if ($('.nasa-detail-product-deal-countdown').length) {
                if (
                    variation && variation.variation_id &&
                    variation.is_in_stock && variation.is_purchasable
                ) {
                    if (typeof _single_variations[variation.variation_id] === 'undefined') {
                        if (
                            typeof nasa_ajax_params !== 'undefined' &&
                            typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
                        ) {
                            var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_get_deal_variation');
                            
                            $.ajax({
                                url: _urlAjax,
                                type: 'post',
                                cache: false,
                                data: {
                                    pid: variation.variation_id
                                },
                                beforeSend: function () {
                                    if (!$form.hasClass('nasa-processing-countdown')) {
                                        $form.addClass('nasa-processing-countdown');
                                    }
                                    
                                    $('.nasa-detail-product-deal-countdown').html('');
                                    $('.nasa-detail-product-deal-countdown').removeClass('nasa-show');
                                },
                                success: function (res) {
                                    $form.removeClass('nasa-processing-countdown');
                                    
                                    if (typeof res.success !== 'undefined' && res.success === '1') {
                                        _single_variations[variation.variation_id] = res.content;
                                    } else {
                                        _single_variations[variation.variation_id] = '';
                                    }
                                    $('.nasa-detail-product-deal-countdown').html(_single_variations[variation.variation_id]);
                                    if (_single_variations[variation.variation_id] !== '') {
                                        /**
                                         * Trigger after changed Countdown
                                         */
                                        $('body').trigger('nasa_changed_countdown_variable_single');
                                        
                                        if (!$('.nasa-detail-product-deal-countdown').hasClass('nasa-show')) {
                                            $('.nasa-detail-product-deal-countdown').addClass('nasa-show');
                                        }
                                    } else {
                                        $('.nasa-detail-product-deal-countdown').removeClass('nasa-show');
                                    }
                                },
                                error: function() {
                                    $form.removeClass('nasa-processing-countdown');
                                }
                            });
                        }
                    } else {
                        $('.nasa-detail-product-deal-countdown').html(_single_variations[variation.variation_id]);
                        if (_single_variations[variation.variation_id] !== '') {
                            
                            /**
                             * Trigger after changed Countdown
                             */
                            $('body').trigger('nasa_changed_countdown_variable_single');
                            
                            if (!$('.nasa-detail-product-deal-countdown').hasClass('nasa-show')) {
                                $('.nasa-detail-product-deal-countdown').addClass('nasa-show');
                            }
                        } else {
                            $('.nasa-detail-product-deal-countdown').removeClass('nasa-show');
                        }
                    }
                } else {
                    $('.nasa-detail-product-deal-countdown').html('');
                    $('.nasa-detail-product-deal-countdown').removeClass('nasa-show');
                }
            }
        };
    }
}

/**
 * Gallery for variation of Single Product
 * @type Boolean
 */
var _inited_gallery = false;
var _inited_gallery_key = 0;
var _timeout_changed;
function changeGalleryVariableSingleProduct($) {
    /**
     * Default init
     */
    
    var _df_main = $('.nasa-main-image-default-wrap').clone();
    if ($(_df_main).find('.nasa-single-slider-arrows').length) {
        $(_df_main).find('.nasa-single-slider-arrows').remove();
    }
    
    _single_variations[0] = {
        'main_image': $(_df_main).html(),
        'thumb_image': $('.nasa-thumbnail-default-wrap').html()
    };

    if (typeof wc_add_to_cart_variation_params !== 'undefined'){
        $.fn.wc_variations_image_update = function(variation) {
            var $form = this;

            if (variation && variation.image && variation.image.src && variation.image.src.length > 1) {
                var _countSelect = $form.find('.variations .value select').length;
                var _selected = 0;
                if (_countSelect) {
                    $form.find('.variations .value select').each(function() {
                        if ($(this).val() !== '') {
                            _selected++;
                        }
                    });
                }

                if (_countSelect && _selected === _countSelect) {
                    _inited_gallery = false;
                    _inited_gallery_key = 1;

                    var _data = {
                        'variation_id': variation.variation_id,
                        'main_id': (variation.image_id ? variation.image_id : 0),
                        'gallery': variation.nasa_gallery_variation
                    };

                    if (
                        $('.nasa-detail-product-deal-countdown').length &&
                        variation.is_in_stock && variation.is_purchasable
                    ) {
                        _data.deal_variation = '1';
                    }

                    if (typeof _single_variations[variation.variation_id] === 'undefined') {
                        if (
                            typeof nasa_ajax_params !== 'undefined' &&
                            typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
                        ) {
                            var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_get_gallery_variation');

                            $.ajax({
                                url: _urlAjax,
                                type: 'post',
                                dataType: 'json',
                                cache: false,
                                data: {
                                    data: _data
                                },
                                beforeSend: function () {
                                    if (!$form.hasClass('nasa-processing')) {
                                        $form.addClass('nasa-processing');
                                    }
                    
                                    $('.nasa-detail-product-deal-countdown').html('');
                                    $('.nasa-detail-product-deal-countdown').removeClass('nasa-show');

                                    $('.nasa-product-details-page').find('.product-gallery').append('<div class="nasa-loading"></div>');
                                    $('.nasa-product-details-page').find('.product-gallery').append('<div class="nasa-loader" style="top:45%"></div>');
                                    $('.product-gallery').css({'min-height': $('.product-gallery').outerHeight()});
                                },
                                success: function (result) {
                                    $form.removeClass('nasa-processing');
                                    
                                    $('.nasa-product-details-page').find('.product-gallery .nasa-loading').remove();
                                    $('.nasa-product-details-page').find('.product-gallery .nasa-loader').remove();

                                    _single_variations[variation.variation_id] = result;

                                    /**
                                     * Deal
                                     */
                                    if (typeof result.deal_variation !== 'undefined') {
                                        $('.nasa-detail-product-deal-countdown').html(result.deal_variation);

                                        if (result.deal_variation !== '') {
                                            /**
                                             * Trigger after changed Countdown
                                             */
                                            $('body').trigger('nasa_changed_countdown_variable_single');
                                            
                                            if (!$('.nasa-detail-product-deal-countdown').hasClass('nasa-show')) {
                                                $('.nasa-detail-product-deal-countdown').addClass('nasa-show');
                                            }
                                        }

                                        else {
                                            $('.nasa-detail-product-deal-countdown').removeClass('nasa-show');
                                        }
                                    } else {
                                        $('.nasa-detail-product-deal-countdown').removeClass('nasa-show');
                                    } 

                                    /**
                                     * Main image
                                     */
                                    if (typeof result.main_image !== 'undefined') {
                                        $('.nasa-main-image-default').replaceWith(result.main_image);
                                    }

                                    /**
                                     * Thumb image
                                     */
                                    if ($('.nasa-thumbnail-default').length && typeof result.thumb_image !== 'undefined') {
                                        $('.nasa-thumbnail-default').replaceWith(result.thumb_image);

                                        if ($('.nasa-thumb-clone img').length && $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) img').length) {
                                            $('.nasa-thumb-clone img').attr('src', $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) img').attr('src'));
                                        }
                                    } else if ($('.nasa-thumb-clone img').length && typeof result.main_image !== 'undefined') {
                                        $('.nasa-thumb-clone img').attr('src', $('.main-images .item-wrap:eq(0) img').attr('src'));
                                    }
                                    
                                    /**
                                     * Trigger after changed Gallery for Single product
                                     */
                                    $('body').trigger('nasa_changed_gallery_variable_single');
                                },
                                error: function() {
                                    $form.removeClass('nasa-processing');
                                }
                            });
                        }
                    } else {
                        var result = _single_variations[variation.variation_id];

                        /**
                         * Deal
                         */
                        if (typeof result.deal_variation !== 'undefined') {
                            $('.nasa-detail-product-deal-countdown').html(result.deal_variation);

                            if (result.deal_variation !== '') {
                                /**
                                 * Trigger after changed Countdown
                                 */
                                $('body').trigger('nasa_changed_countdown_variable_single');
                                            
                                if (!$('.nasa-detail-product-deal-countdown').hasClass('nasa-show')) {
                                    $('.nasa-detail-product-deal-countdown').addClass('nasa-show');
                                }
                            }

                            else {
                                $('.nasa-detail-product-deal-countdown').removeClass('nasa-show');
                            }
                        } else {
                            $('.nasa-detail-product-deal-countdown').removeClass('nasa-show');
                        }

                        /**
                         * Main image
                         */
                        if (typeof result.main_image !== 'undefined') {
                            $('.nasa-product-details-page').find('.product-gallery').append('<div class="nasa-loading"></div>');
                            $('.nasa-product-details-page').find('.product-gallery').append('<div class="nasa-loader" style="top:45%"></div>');
                            $('.product-gallery').css({'min-height': $('.product-gallery').outerHeight()});
                            $('.nasa-main-image-default').replaceWith(result.main_image);
                            if (typeof _timeout_changed !== 'undefined') {
                                clearTimeout(_timeout_changed);
                            }
                            
                            _timeout_changed = setTimeout(function() {
                                $('.nasa-product-details-page .product-gallery').find('.nasa-loader, .nasa-loading').remove();
                                $('.product-gallery').css({'min-height': 'auto'});
                            }, 200);
                        }

                        /**
                         * Thumb image
                         */
                        if ($('.nasa-thumbnail-default').length && typeof result.thumb_image !== 'undefined') {
                            $('.nasa-thumbnail-default').replaceWith(result.thumb_image);

                            if ($('.nasa-thumb-clone img').length && $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) img').length) {
                                $('.nasa-thumb-clone img').attr('src', $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) img').attr('src'));
                            }
                        } else if ($('.nasa-thumb-clone img').length && typeof result.main_image !== 'undefined') {
                            $('.nasa-thumb-clone img').attr('src', $('.main-images .item-wrap:eq(0) img').attr('src'));
                        }

                        /**
                         * Trigger after changed Gallery for Single product
                         */
                        $('body').trigger('nasa_changed_gallery_variable_single');
                    }
                }
            }

            /**
             * Default
             */
            else {
                if (!_inited_gallery) {

                    _inited_gallery = true;

                    var result = _single_variations[0];
                    if ($('.nasa-detail-product-deal-countdown').length) {
                        $('.nasa-detail-product-deal-countdown').removeClass('nasa-show').html('');
                    }

                    /**
                     * Main image
                     */
                    if (typeof result.main_image !== 'undefined') {
                        $('.nasa-main-image-default').replaceWith(result.main_image);
                    }

                    /**
                     * Thumb image
                     */
                    if (typeof result.thumb_image !== 'undefined') {
                        $('.nasa-thumbnail-default').replaceWith(result.thumb_image);

                        if ($('.nasa-thumb-clone img').length && $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) img').length) {
                            $('.nasa-thumb-clone img').attr('src', $('.product-thumbnails .nasa-wrap-item-thumb:eq(0) img').attr('src'));
                        }
                    }

                    /**
                     * Trigger after changed Gallery for Single product
                     */
                    $('body').trigger('nasa_changed_gallery_variable_single');
                }
            }
        };
    }
}

/**
 * Lightbox image single product page
 */
function loadGalleryPopup($) {
    if ($('.main-images').length) {
        if (! $('body').hasClass('nasa-disable-lightbox-image')) {
            $('.main-images').magnificPopup({
                delegate: 'a',
                type: 'image',
                tLoading: '<div class="nasa-loader"></div>',
                removalDelay: 300,
                closeOnContentClick: true,
                tClose: $('input[name="nasa-close-string"]').val(),
                gallery: {
                    enabled: true,
                    navigateByImgClick: false,
                    preload: [0,1]
                },
                image: {
                    verticalFit: false,
                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                },
                callbacks: {
                    beforeOpen: function() {
                        var productVideo = $('.product-video-popup').attr('href');

                        if (productVideo){
                            // Add product video to gallery popup
                            this.st.mainClass = 'has-product-video';
                            var galeryPopup = $.magnificPopup.instance;
                            galeryPopup.items.push({
                                src: productVideo,
                                type: 'iframe'
                            });

                            galeryPopup.updateItemHTML();
                        }
                    },
                    open: function() {

                    }
                }
            });
        }
        
        /**
         * Disable lightbox image
         */
        else {
            $('body').on('click', '.main-images a.woocommerce-additional-image', function() {
                return false;
            });
        }
    }
}

/**
 * clone add to cart button fixed
 * 
 * @param {type} $
 * @returns {String}
 */
function nasa_clone_add_to_cart($) {
    var _ressult = '';
    
    if ($('.nasa-product-details-page').length) {
        var _wrap = $('.nasa-product-details-page');
        
        /**
         * Variations
         */
        if ($(_wrap).find('.single_variation_wrap').length) {
            var _price = $(_wrap).find('.single_variation_wrap .woocommerce-variation .woocommerce-variation-price').length && $(_wrap).find('.single_variation_wrap .woocommerce-variation').css('display') !== 'none' ? $(_wrap).find('.single_variation_wrap').find('.woocommerce-variation-price').html() : '';
            
            /**
             * Clone form
             */
            var _addToCart = $(_wrap).find('.single_variation_wrap').find('.woocommerce-variation-add-to-cart').clone();
            
            /**
             * Remove id
             */
            $(_addToCart).find('*').removeAttr('id');
            
            /**
             * Remove Style
             */
            if ($(_addToCart).find('.single_add_to_cart_button').length) {
                $(_addToCart).find('.single_add_to_cart_button').removeAttr('style');
            }
            
            /**
             * Remove Buy Now
             */
            if ($(_addToCart).find('.nasa-buy-now').length && !$(_addToCart).find('.nasa-buy-now').hasClass('has-sticky-in-desktop')) {
                $(_addToCart).find('.nasa-buy-now').remove();
            }
            
            /**
             * Remove tags not use in sticky
             */
            if ($(_addToCart).find('.nasa-not-in-sticky').length) {
                $(_addToCart).find('.nasa-not-in-sticky').remove();
            }
            
            /**
             * Compatible with Uni CPO/Rangeslider.ion Plugin
             */
            if ($(_addToCart).find('.uni-builderius-container').length) {
                $(_addToCart).find('.uni-builderius-container').remove();
            }
            
            var _btn = $(_addToCart).html();
            
            var _disable = $(_wrap).find('.single_variation_wrap').find('.woocommerce-variation-add-to-cart-disabled').length ? ' nasa-clone-disable' : '';

            _ressult = '<div class="nasa-single-btn-clone single_variation_wrap-clone' + _disable + '">' + _price + '<div class="woocommerce-variation-add-to-cart-clone">' + _btn + '</div></div>';
            
            var _options_txt = $('input[name="nasa_select_options_text"]').length ? $('input[name="nasa_select_options_text"]').val() : 'Select Options';
            
            _ressult = '<a class="nasa-toggle-variation_wrap-clone" href="javascript:void(0);">' + _options_txt + '</a>' + _ressult;
        }

        /**
         * Simple
         */
        else if ($(_wrap).find('.cart').length){
            /**
             * Clone form
             */
            var _addToCart = $(_wrap).find('.cart').clone();
            
            /**
             * Remove id
             */
            $(_addToCart).find('*').removeAttr('id');
            
            /**
             * Remove Style
             */
            if ($(_addToCart).find('.single_add_to_cart_button').length) {
                $(_addToCart).find('.single_add_to_cart_button').removeAttr('style');
            }
            
            /**
             * Remove Buy Now
             */
            if ($(_addToCart).find('.nasa-buy-now').length && !$(_addToCart).find('.nasa-buy-now').hasClass('has-sticky-in-desktop')) {
                $(_addToCart).find('.nasa-buy-now').remove();
            }
            
            /**
             * Remove tags not use in sticky
             */
            if ($(_addToCart).find('.nasa-not-in-sticky').length) {
                $(_addToCart).find('.nasa-not-in-sticky').remove();
            }
            
            /**
             * Compatible with Uni CPO/Rangeslider.ion Plugin
             */
            if ($(_addToCart).find('.uni-builderius-container').length) {
                $(_addToCart).find('.uni-builderius-container').remove();
            }
            
            var _btn = $(_addToCart).html();
            
            _ressult = '<div class="nasa-single-btn-clone">' + _btn + '</div>';
        }
    }
    
    return _ressult;
}

/**
 * Auto fill text to input
 * 
 * @param {type} $
 * @param {type} _input
 * @param {type} index
 * @returns {undefined}
 */
function autoFillInputPlaceHolder($, _input, index) {
    var _index = typeof index !== 'undefined' ? index : 0;
    if (_index === 0) {
        $(_input).trigger('focus');
    }
    
    if (!$(_input).hasClass('nasa-placeholder')) {
        $(_input).addClass('nasa-placeholder');
        var _place = $(_input).attr('placeholder');
        $(_input).attr('data-placeholder', _place);
    }
    
    var str = $(_input).attr('data-suggestions');
    
    if (str && _index <= str.length) {
        if (!$(_input).hasClass('nasa-filling')) {
            $(_input).addClass('nasa-filling');
        }
        
        $(_input).attr('placeholder', str.substr(0, _index++));
        
        setTimeout(function() {
            autoFillInputPlaceHolder($, _input, _index);
        }, 90);
    } else {
        if (!$(_input).hasClass('nasa-done')) {
            $(_input).addClass('nasa-done');
        }
        
        $(_input).removeClass('nasa-filling');
        
        setTimeout(function() {
            reverseFillInputPlaceHolder($, _input);
        }, 400);
    }
}

/**
 * Reverse fill text to input
 * 
 * @param {type} $
 * @param {type} _input
 * @param {type} index
 * @returns {undefined}
 */
function reverseFillInputPlaceHolder($, _input, index) {
    var _str = $(_input).attr('data-suggestions');
    var _index = typeof index !== 'undefined' ? index : (_str ? _str.length : 0);
    if (_index > 0) {
        $(_input).attr('placeholder', _str.substr(0, _index--));
        
        setTimeout(function() {
            reverseFillInputPlaceHolder($, _input, _index);
        }, 20);
    } else {
        var _place = $(_input).attr('data-placeholder');
        $(_input).attr('placeholder', _place);
    }
}

/**
 * LOCK HOVER Add to cart
 */
function init_content_product_addtocart($, reset) {
    var _reset = typeof reset === 'undefined' ? false : reset;
    
    if (_reset) {
        $('.nasa-product-more-hover').removeClass('nasa-inited');
    }
    
    if ($('.nasa-product-more-hover .add-to-cart-grid, .nasa-product-more-hover .quick-view').length) {
        var toggleWidth = $('input[name="nasa-toggle-width-add-to-cart"]').length ? parseInt($('input[name="nasa-toggle-width-add-to-cart"]').val()) : 100;
        if (!toggleWidth) {
            toggleWidth = 100;
        }
        
        $('.nasa-product-more-hover .add-to-cart-grid, .nasa-product-more-hover .quick-view').each(function() {
            var _this = $(this);
            var _wrap = $(_this).parents('.nasa-product-more-hover');
            if (!$(_wrap).hasClass('nasa-inited')) {
                if ($(_this).width() < toggleWidth) {
                    $(_wrap).find('.quick-view .nasa-icon').removeClass('hidden-tag');
                    $(_wrap).find('.quick-view .nasa-text').addClass('hidden-tag');
                    
                    $(_wrap).find('.add-to-cart-grid .nasa-icon').show();
                    $(_wrap).find('.add-to-cart-grid .nasa-text').hide();
                } else {
                    $(_wrap).find('.quick-view .nasa-icon').addClass('hidden-tag');
                    $(_wrap).find('.quick-view .nasa-text').removeClass('hidden-tag');
                    
                    $(_wrap).find('.add-to-cart-grid .nasa-icon').hide();
                    $(_wrap).find('.add-to-cart-grid .nasa-text').show();
                }
                
                $(_wrap).addClass('nasa-inited');
            }
        });
    }
}

/**
 * Event after added to cart
 * Popup Your Order
 * 
 * @param {type} $
 * @returns {undefined}
 */
function after_added_to_cart($) {
    if (
        typeof nasa_ajax_params !== 'undefined' &&
        typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
    ) {
        var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_after_add_to_cart');
        
        $.ajax({
            url: _urlAjax,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                'nasa_action': 'nasa_after_add_to_cart'
            },
            beforeSend: function () {
                
            },
            success: function (response) {
                if (response.success === '1') {
                    if ($('.nasa-after-add-to-cart-popup').length) {
                        $('.nasa-after-add-to-cart-popup .nasa-after-add-to-cart-wrap').html(response.content);
                        if ($('.nasa-after-add-to-cart-popup .nasa-slick-slider').length) {
                            afterLoadAjaxList($, false);
                        }
                    }
                    else {
                        $.magnificPopup.open({
                            items: {
                                src: '<div class="nasa-after-add-to-cart-popup nasa-bot-to-top"><div class="nasa-after-add-to-cart-wrap">' + response.content + '</div></div>',
                                type: 'inline'
                            },
                            tClose: $('input[name="nasa-close-string"]').val(),
                            callbacks: {
                                open: function() {
                                    if ($('.nasa-after-add-to-cart-popup .nasa-slick-slider').length) {
                                        afterLoadAjaxList($, false);
                                    }
                                },
                                beforeClose: function() {
                                    this.st.removalDelay = 350;
                                }
                            }
                        });
                    }

                    setTimeout(function() {
                        $('.after-add-to-cart-shop_table').addClass('shop_table');
                        $('.nasa-table-wrap').addClass('nasa-active');
                    }, 100);
                    
                    $('.black-window').trigger('click');
                } else {
                    $.magnificPopup.close();
                }
                
                $('.nasa-after-add-to-cart-wrap').removeAttr('style');
                $('.nasa-after-add-to-cart-wrap').removeClass('processing');
                
                setTimeout(function() {
                    init_shipping_free_notification($);
                }, 300);
            },
            error: function () {
                $.magnificPopup.close();
            }
        });
    }
}

/**
 * Reload MiniCart
 * 
 * @param {type} $
 * @returns {undefined}
 */
function reloadMiniCart($) {
    if (
        typeof nasa_ajax_params !== 'undefined' &&
        typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
    ) {
        var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_reload_fragments');
        
        $.ajax({
            url: _urlAjax,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                time: new Date().getTime()
            },
            success: function (data) {
                if (data && data.fragments) {

                    $.each(data.fragments, function(key, value) {
                        if ($(key).length) {
                            $(key).replaceWith(value);
                        }
                    });

                    if (typeof $supports_html5_storage !== 'undefined' && $supports_html5_storage) {
                        sessionStorage.setItem(
                            wc_cart_fragments_params.fragment_name,
                            JSON.stringify(data.fragments)
                        );
                        set_cart_hash(data.cart_hash);

                        if (data.cart_hash) {
                            set_cart_creation_timestamp();
                        }
                    }

                    $(document.body).trigger('wc_fragments_refreshed');
                    
                    /**
                     * notification free shipping
                     */
                    init_shipping_free_notification($);
                }

                $('#cart-sidebar').find('.nasa-loader').remove();
            },
            error: function () {
                $(document.body).trigger('wc_fragments_ajax_error');
                $('#cart-sidebar').find('.nasa-loader').remove();
            }
        });
    }
}

/**
 * Init Shipping free notification
 * 
 * @param {type} $
 * @returns {undefined}
 */
function init_shipping_free_notification($) {
    if ($('.nasa-total-condition').length) {
        $('.nasa-total-condition').each(function() {
            if (!$(this).hasClass('nasa-active')) {
                $(this).addClass('nasa-active');
                var _per = $(this).attr('data-per');
                $(this).find('.nasa-total-condition-hint, .nasa-subtotal-condition').css({'width': _per + '%'});
            }
        });
    }
}

/**
 * Init Widgets Toggle
 */
function init_widgets($) {
    if ($('.widget').length && !$('body').hasClass('nasa-disable-toggle-widgets')) {
        $('.widget').each(function() {
            var _this = $(this);
            if (!$(_this).hasClass('nasa-inited')) {

                var _key = $(_this).attr('id');

                var _title = '';

                if ($(_this).find('.widget-title').length) {
                    _title = $(_this).find('.widget-title').clone();
                    $(_this).find('.widget-title').remove();
                }

                if (_key && _title !== '') {
                    var _cookie = $.cookie(_key);
                    var _a_toggle = '<a href="javascript:void(0);" class="nasa-toggle-widget"></a>';
                    var _wrap = '<div class="nasa-open-toggle"></div>';
                    if (_cookie === 'hide') {
                        _a_toggle = '<a href="javascript:void(0);" class="nasa-toggle-widget nasa-hide"></a>';
                        _wrap = '<div class="nasa-open-toggle widget-hidden"></div>';
                    }
                    
                    $(_this).wrapInner(_wrap);
                    
                    $(_this).prepend(_a_toggle);
                    $(_this).prepend(_title);
                }

                $(_this).addClass('nasa-inited');
            }
        });
    }
}

/**
 * init Notices
 * 
 * @param {type} $
 * @returns {undefined}
 */
function initNotices($) {
    if ($('.woocommerce-notices-wrapper').length) {
        $('.woocommerce-notices-wrapper').each(function() {
            if ($(this).find('*').length && $(this).find('.nasa-close-notice').length <= 0) {
                $(this).append('<a class="nasa-close-notice" href="javascript:void(0);"></a>');
            }
        });
    }
}

/**
 * set Notice
 * 
 * @param {type} $
 * @param {type} content
 * @returns {undefined}
 */
function setNotice($, content) {
    if ($('.woocommerce-notices-wrapper').length <= 0) {
        $('body').append('<div class="woocommerce-notices-wrapper"></div>');
    }

    $('.woocommerce-notices-wrapper').html(content);
    initNotices($);
}

/**
 * Dokan Registration
 */
function popupRegistrationDokan($) {
    var Popup_Dokan_Vendor_Registration = {

        init: function () {
            var form = $('form.register');

            // bind events
            $('.user-role input[type=radio]', form).on('change', this.showSellerForm);
            $('.tc_check_box', form).on('click', this.onTOC);
            $('#shop-phone', form).keydown(this.ensurePhoneNumber);
            $('#company-name', form).on('focusout', this.generateSlugFromCompany);

            $('#seller-url', form).keydown(this.constrainSlug);
            $('#seller-url', form).keyup(this.renderUrl);
            $('#seller-url', form).on('focusout', this.checkSlugAvailability);

            this.validationLocalized();
        },

        validate: function (self) {

            $('form.register').validate({
                errorPlacement: function (error, element) {
                    var form_group = $(element).closest('.form-group');
                    form_group.addClass('has-error').append(error);
                },
                success: function (label, element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                submitHandler: function (form) {
                    form.submit();
                }
            });
        },

        showSellerForm: function () {
            var value = $(this).val();

            if (value === 'seller') {
                $('.show_if_seller').find('input, select').removeAttr('disabled');
                $('.show_if_seller').slideDown();

                if ($('.tc_check_box').length > 0) {
                    $('button[name=register]').attr('disabled', 'disabled');
                }

            } else {
                $('.show_if_seller').find('input, select').attr('disabled', 'disabled');
                $('.show_if_seller').slideUp();

                if ($('.tc_check_box').length > 0) {
                    $('button[name=register]').removeAttr('disabled');
                }
            }
        },

        onTOC: function () {
            var chk_value = $(this).val();

            if ($(this).prop("checked")) {
                $('input[name=register]').removeAttr('disabled');
                $('button[name=register]').removeAttr('disabled');
                $('input[name=dokan_migration]').removeAttr('disabled');
            } else {
                $('input[name=register]').attr('disabled', 'disabled');
                $('button[name=register]').attr('disabled', 'disabled');
                $('input[name=dokan_migration]').attr('disabled', 'disabled');
            }
        },

        ensurePhoneNumber: function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 91, 107, 109, 110, 187, 189, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }

            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        },

        generateSlugFromCompany: function () {
            var value = $(this).val();
            
            if (!value) {
                value = "";
            }
            
            value = decodeURIComponent(value);

            $('#seller-url').val(value);
            $('#url-alart').text(value);
            $('#seller-url').focus();
        },
        
        constrainSlug: function (e) {
            var text = $(this).val();

            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 91, 109, 110, 173, 189, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }

            if ((e.shiftKey || (e.keyCode < 65 || e.keyCode > 90) && (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        },

        checkSlugAvailability: function () {
            var self = $(this),
                data = {
                    action: 'shop_url',
                    url_slug: self.val(),
                    _nonce: dokan.nonce
                };

            if (self.val() === '') {
                return;
            }

            var row = self.closest('.form-row');
            row.block({
                message: null,
                overlayCSS: {
                    background: '#fff url(' + dokan.ajax_loader + ') no-repeat center',
                    opacity: 0.6
                }
            });

            $.post(dokan.ajaxurl, data, function (resp) {

                if (resp.success === true) {
                    $('#url-alart').removeClass('text-danger').addClass('text-success');
                    $('#url-alart-mgs').removeClass('text-danger').addClass('text-success').text(dokan.seller.available);
                } else {
                    $('#url-alart').removeClass('text-success').addClass('text-danger');
                    $('#url-alart-mgs').removeClass('text-success').addClass('text-danger').text(dokan.seller.notAvailable);
                }

                row.unblock();

            });
        },

        renderUrl: function () {
            $('#url-alart').text($(this).val());
        },

        validationLocalized: function () {
            var dokan_messages = DokanValidateMsg;

            dokan_messages.maxlength = $.validator.format(dokan_messages.maxlength_msg);
            dokan_messages.minlength = $.validator.format(dokan_messages.minlength_msg);
            dokan_messages.rangelength = $.validator.format(dokan_messages.rangelength_msg);
            dokan_messages.range = $.validator.format(dokan_messages.range_msg);
            dokan_messages.max = $.validator.format(dokan_messages.max_msg);
            dokan_messages.min = $.validator.format(dokan_messages.min_msg);

            $.validator.messages = dokan_messages;
        }
    };
    
    if ($('input[name="nasa-caching-enable"]').length && $('input[name="nasa-caching-enable"]').val() === '1') {
        $('body').on('nasa_after_load_static_content', function() {
            if ($('#nasa-login-register-form form.register').length) {
                Popup_Dokan_Vendor_Registration.init();

                $('.show_if_seller').find('input, select').attr('disabled', 'disabled');

                // trigger change if there is an error while registering
                var shouldTrigger = $('.woocommerce ul').hasClass('woocommerce-error') && !$('.show_if_seller').is(':hidden');

                if (shouldTrigger) {
                    var form = $('form.register');

                    $('.user-role input[type=radio]', form).trigger('change');
                }

                // disable migration button if checkbox isn't checked
                if ($('.tc_check_box').length > 0) {
                    $('input[name=dokan_migration]').attr('disabled', 'disabled');
                    $('input[name=register]').attr('disabled', 'disabled');
                }
            }
        });
    }
    
    else {
        if ($('#nasa-login-register-form form.register').length) {
            Popup_Dokan_Vendor_Registration.init();

            $('.show_if_seller').find('input, select').attr('disabled', 'disabled');

            // trigger change if there is an error while registering
            var shouldTrigger = $('.woocommerce ul').hasClass('woocommerce-error') && !$('.show_if_seller').is(':hidden');

            if (shouldTrigger) {
                var form = $('form.register');

                $('.user-role input[type=radio]', form).trigger('change');
            }

            // disable migration button if checkbox isn't checked
            if ($('.tc_check_box').length > 0) {
                $('input[name=dokan_migration]').attr('disabled', 'disabled');
                $('input[name=register]').attr('disabled', 'disabled');
            }
        }
    }
}

/**
 * 
 * @param {type} $
 * @returns {undefined}get Compare ids
 */
function get_compare_ids($) {
    if ($('input[name="nasa_woocompare_cookie_name"]').length) {
        var _cookie_compare = $('input[name="nasa_woocompare_cookie_name"]').val();
        var _pids = $.cookie(_cookie_compare);
        if (_pids) {
            _pids = _pids.replace('[','').replace(']','').split(",").map(String);
            
            if (_pids.length === 1 && !_pids[0]) {
                return [];
            }
        }
        
        return typeof _pids !== 'undefined' && _pids.length ? _pids : [];
    } else {
        return [];
    }
}

/**
 * 
 * @param {type} $
 * @returns {undefined}get Compare ids
 */
function get_wishlist_ids($) {
    if ($('input[name="nasa_wishlist_cookie_name"]').length) {
        var _cookie_wishlist = $('input[name="nasa_wishlist_cookie_name"]').val();
        var _pids = $.cookie(_cookie_wishlist);
        if (_pids) {
            _pids = _pids.replace('[', '').replace(']', '').split(",").map(String);
            
            if (_pids.length === 1 && !_pids[0]) {
                return [];
            }
        }
        
        return typeof _pids !== 'undefined' && _pids.length ? _pids : [];
    } else {
        return [];
    }
}

/**
 * Load Wishlist
 */
var _wishlist_init = false;
function loadWishlist($) {
    if ($('#nasa-wishlist-sidebar-content').length && !_wishlist_init) {
        _wishlist_init = true;
        
        if (
            typeof nasa_ajax_params !== 'undefined' &&
            typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
        ) {
            var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_load_wishlist');
            $.ajax({
                url: _urlAjax,
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {},
                beforeSend: function () {
                    
                },
                success: function (res) {
                    if (typeof res.success !== 'undefined' && res.success === '1') {
                        $('#nasa-wishlist-sidebar-content').replaceWith(res.content);
                        
                        if ($('.nasa-tr-wishlist-item.item-invisible').length) {
                            var _remove = [];
                            $('.nasa-tr-wishlist-item.item-invisible').each(function() {
                                var product_id = $(this).attr('data-row-id');
                                if (product_id) {
                                    _remove.push(product_id);
                                }
                                
                                $(this).remove();
                            });
                            
                            var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', 'nasa_remove_wishlist_hidden');
                            
                            $.ajax({
                                url: _urlAjax,
                                type: 'post',
                                dataType: 'json',
                                cache: false,
                                data: {
                                    product_ids: _remove
                                },
                                beforeSend: function () {

                                },
                                success: function (response) {
                                    if (typeof response.success !== 'undefined' && response.success === '1') {
                                        var sl_wislist = parseInt(response.count);
                                        $('.nasa-mini-number.wishlist-number').html(convert_count_items($, sl_wislist));
                                        if (sl_wislist > 0) {
                                            $('.nasa-mini-number.wishlist-number').removeClass('nasa-product-empty');
                                        }
                                        else if (sl_wislist === 0 && !$('.nasa-mini-number.wishlist-number').hasClass('nasa-product-empty')) {
                                            $('.nasa-mini-number.wishlist-number').addClass('nasa-product-empty');
                                        }
                                    }
                                },
                                error: function () {

                                }
                            });
                        }
                    }
                },
                error: function () {

                }
            });
        }
    }
}

/**
 * Add wishlist item NasaTheme Wishlist
 * @param {type} $
 * @param {type} _pid
 * @returns {undefined}
 */
var _nasa_clear_notice_wishlist;
function nasa_process_wishlist($, _pid, _action) {
    if (
        typeof nasa_ajax_params !== 'undefined' &&
        typeof nasa_ajax_params.wc_ajax_url !== 'undefined'
    ) {
        var _urlAjax = nasa_ajax_params.wc_ajax_url.toString().replace('%%endpoint%%', _action);
        
        var _data = {
            product_id: _pid
        };
        
        if ($('.widget_shopping_wishlist_content').length) {
            _data['show_content'] = '1';
        }
        $.ajax({
            url: _urlAjax,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: _data,
            beforeSend: function () {
                if ($('.nasa-close-notice').length) {
                    $('.nasa-close-notice').trigger('click');
                }
                
                if (typeof _nasa_clear_notice_wishlist !== 'undefined') {
                    clearTimeout(_nasa_clear_notice_wishlist);
                }
            },
            success: function (res) {
                if (typeof res.success !== 'undefined' && res.success === '1') {
                    var sl_wislist = parseInt(res.count);
                    $('.nasa-mini-number.wishlist-number').html(convert_count_items($, sl_wislist));
                    if (sl_wislist > 0) {
                        $('.nasa-mini-number.wishlist-number').removeClass('nasa-product-empty');
                    }
                    else if (sl_wislist === 0 && !$('.nasa-mini-number.wishlist-number').hasClass('nasa-product-empty')) {
                        $('.nasa-mini-number.wishlist-number').addClass('nasa-product-empty');
                    }
                    
                    if (_action === 'nasa_add_to_wishlist') {
                        $('.btn-wishlist[data-prod="' + _pid + '"]').each(function() {
                            if (!$(this).hasClass('nasa-added')) {
                                $(this).addClass('nasa-added');
                            }
                        });
                    }
                    
                    if (_action === 'nasa_remove_from_wishlist') {
                        $('.btn-wishlist[data-prod="' + _pid + '"]').removeClass('nasa-added');
                    }
                    
                    if ($('.widget_shopping_wishlist_content').length && typeof res.content !== 'undefined' && res.content) {
                        $('.widget_shopping_wishlist_content').replaceWith(res.content);
                    }

                    if (typeof res.mess !== 'undefined' && res.mess) {
                        setNotice($, res.mess);
                    }

                    _nasa_clear_notice_wishlist = setTimeout(function() {
                        if ($('.nasa-close-notice').length) {
                            $('.nasa-close-notice').trigger('click');
                        }
                    }, 5000);
                    
                    $('body').trigger('nasa_processed_wishlish', [_pid, _action]);
                }
                
                $('.btn-wishlist').removeClass('nasa-disabled');
            },
            error: function () {
                $('.btn-wishlist').removeClass('nasa-disabled');
            }
        });
    }
}

/**
 * Convert Count Items
 * 
 * @param {type} number
 * @returns {String}
 */
function convert_count_items($, number) {
    var _number = parseInt(number);
    if ($('input[name="nasa_less_total_items"]').length && $('input[name="nasa_less_total_items"]').val() === '1') {
        return _number > 9 ? '9+' : _number.toString();
    } else {
        return _number.toString();
    }
}

/**
 * add class single product button add to cart
 * 
 * @param {type} $
 * @returns {undefined}
 */
function add_class_btn_single_button($) {
    if ($('.cart input[type="hidden"][name="quantity"]').length) {
        $('.cart input[type="hidden"][name="quantity"]').each(function() {
            var _wrap = $(this).parents('.cart');
            if ($(_wrap).find('.single_add_to_cart_button').length) {
                $(_wrap).find('.single_add_to_cart_button').addClass('nasa-fullwidth');
            }
        });
    }
}

/**
 * Animate Scroll to Top
 * 
 * @param {type} $
 * @param {type} _dom
 * @param {type} _ms
 * @returns {undefined}
 */
function animate_scroll_to_top($, _dom, _ms) {
    var ms = typeof _ms === 'undefined' ? 500 : _ms;
    var _pos_top = 0;
    if (typeof _dom !== 'undefined' && _dom && $(_dom).length) {
        _pos_top = $(_dom).offset().top;
    }

    if (_pos_top) {
        if ($('body').find('.nasa-header-sticky').length && $('.sticky-wrapper').length) {
            _pos_top = _pos_top - 100;
        }

        if ($('#wpadminbar').length) {
            _pos_top = _pos_top - $('#wpadminbar').height();
        }
        
        _pos_top = _pos_top - 10;
    }

    $('html, body').animate({scrollTop: _pos_top}, ms);
}

/**
 * init accordion
 */
function init_accordion($) {
    if ($('.nasa-accordions-content .nasa-accordion-title a').length) {
        $('.nasa-accordions-content').each(function() {
            if ($(this).hasClass('nasa-accodion-first-hide')) {
                $(this).find('.nasa-accordion.first').removeClass('active');
                $(this).find('.nasa-panel.first').removeClass('active');
                $(this).removeClass('nasa-accodion-first-hide');
            } else {
                $(this).find('.nasa-panel.first.active').slideDown(200);
            }
        });
    }
}
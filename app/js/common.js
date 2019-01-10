"use strict";

$(function () {
    const goodsObj = {};
    // Upload goods - start
    (function loadGoods() {
        $.getJSON('js/goods.json', (data) => {
            let out = '';
            for (let key in data) {
                goodsObj[key] = data[key];
                out += `<div class="col col-lg-3 col-md-6 col-sm-6 col-12 wrap-goods__item">
                            <div class="wrap-goods__item-img">
                                <img src="${data[key]['img']}" alt="">
                            </div>
                            <div class="wrap-goods__item-desc">
                                <h4>${data[key]['name']}</h4>
                                <p>${data[key]['price']}</p>
                            </div>
                            <div class="wrap-goods__item-info">
                                <div class="size-goods">
                                    <p>size</p>
                                    <input type="checkbox" id="${data[key]['id']}1">
                                    <label for="${data[key]['id']}1">${data[key].size[0]}</label>
                                 
                                    <input type="checkbox" id="${data[key]['id']}2">
                                    <label for="${data[key]['id']}2">${data[key].size[1]}</label>
                                    
                                    <input type="checkbox" id="${data[key]['id']}3">
                                    <label for="${data[key]['id']}3">${data[key].size[2]}</label>
                                </div>
                                <div class="id-goods">#${data[key]['id']}</div>
                            </div>
                            <div class="wrap-goods__item-buttons">
                                <button data-art="${key}" class="item-toCart">add to cart</button>
                                <button class="item-favorite"></button>
                            </div>
                         </div>`
            }
            console.log(goodsObj);
            checkCart();
            $('#goods').html(out);
            $('.item-toCart').on('click', addToCart)
        })
    })();
    // Upload goods - end

    // Add goods to cart - start
    let cartObj = {};

    function addToCart() {
        const article = $(this).attr('data-art');

        if (cartObj[article] !== undefined) {
            return
        } else {
            for (let key in goodsObj) {
                cartObj[article] = goodsObj[article];
            }
        }

        // set goods items on localeStorage
        localStorage.setItem('goods', JSON.stringify(cartObj));
        drawCart(cartObj);
        checkCart();
    }
    // Add goods to cart - end

    // Check cart of items - start
    function checkCart() {
        if (localStorage.getItem('goods') !== null) {
            cartObj = JSON.parse(localStorage.getItem('goods'));

            drawCart(cartObj);
        }
    };
    // Check cart of items - end

    // Show cart items - start
    function drawCart(obj) {
        let out = '',
            sumGoods = 0,
            countCat = 0;

        if ($.isEmptyObject(obj)) {
            cleanCart();
        } else {
            for (let key in obj) {
                out += `<div class="goods-item">
                    <div class="goods-item__close"><button data-art="${key}"></button></div>
                    <div class="cart-content__img">
                        <img src="${obj[key]['img']}" alt="">
                    </div>
                    <div class="cart-content__goods">
                        <div class="cart-content__goods-info">
                            <h4>${obj[key]['name']}</h4>
                            <p>size: <span>xs</span></p>
                        </div>
                        <div class="cart-content__goods-counter">
                            <div class="cart-counter">
                                <button class="count minus" data-art="${key}">-</button>
                                <input type="text" value="${obj[key].count}" disabled>
                                <button class="count plus" data-art="${key}">+</button>
                            </div>
                            <div class="cart-sum">
                                <p>${obj[key]['cost']}<span>UAH</span></p>
                            </div>
                        </div>
                    </div>
                </div>`;
                // Add sum price goods in cart
                sumGoods += +`${obj[key]['cost']}`;
                $('.total-price').html(sumGoods + '<span>UAH</span>');

                // Set number length in cart
                countCat += 1;
                $('.cart-head__info span').html('(' + countCat + ')');
                $('.cart-count').addClass('hasGoods');
                $('.cart-count').html(countCat);

                // View cart items
                $('.cart-content').html(out);

            }


            // Set count item in cart
            $('.plus').on('click', function (e) {
                e.stopPropagation();
                let article = $(this).attr('data-art'),
                    cartObjLocale = JSON.parse(localStorage.getItem('goods'));

                for (let key in cartObjLocale) {
                    if (key === article) {
                        console.log(cartObj[key]);
                        cartObjLocale[key].count++;
                        cartObjLocale[key].cost += cartObjLocale[key].price;
                        cartObj[key] = cartObjLocale[key];
                    }
                    cartObj[key] = cartObjLocale[key];
                }
                localStorage.setItem('goods', JSON.stringify(cartObj));
                drawCart(JSON.parse(localStorage.getItem('goods')));
            });


            // Remove count item in cart
            $('.minus').on('click', function (e) {
                e.stopPropagation();
                let article = $(this).attr('data-art'),
                    cartObjLocale = JSON.parse(localStorage.getItem('goods'));

                for (let key in cartObjLocale) {
                    if (key === article) {
                        cartObjLocale[key].count--;
                        cartObjLocale[key].cost -= cartObjLocale[key].price;
                        if ( cartObjLocale[key].count === 0) {
                            cartObjLocale[key].count = 1;
                            cartObjLocale[key].cost = cartObjLocale[key].price;
                        }
                        cartObj[key] = cartObjLocale[key];
                    }
                    cartObj[key] = cartObjLocale[key];
                }
                localStorage.setItem('goods', JSON.stringify(cartObj));
                drawCart(JSON.parse(localStorage.getItem('goods')));
            });


            // Delete item in cart
            $('.goods-item__close button').on('click', function (e) {
                e.stopPropagation();
                let article = $(this).attr('data-art');

                delete cartObj[article];
                localStorage.setItem('goods', JSON.stringify(cartObj));
                drawCart(JSON.parse(localStorage.getItem('goods')));
            })
        }
    }
    // Show cart items - end

    // Reset cart - start
    function cleanCart() {
        $('.cart-content').html('');
        $('.cart-head__info span').html('');
        $('.total-price').html(0 + '<span>UAH</span>');
        $('.cart-count').removeClass('hasGoods');
    }
    // Reset cart - end

    // Set scroll if items cart hover - start
    $('body').off().on('click', function(e) {
        e.stopPropagation();
        console.log('event: ', e);
        let cart = $('.cart');
        console.log('event: ', !cart.is(e.target), cart.has(e.target).length === 0);
        console.log('event: ',  cart.has(e.target));
        if (!cart.is(e.target) && cart.has(e.target).length === 0 ) {
            console.log('e.target.className: ', e.target.className);
            if (cart.hasClass('active')) {
                cart.removeClass('active');
            }
        }
    });
    // Set scroll if items cart hover - end

    // Set language - start
    $('.language-link').on('click', function () {
        if ($(this).hasClass('checked')) {
            return false;
        } else {
            $('.language-link').removeClass('checked');
            $(this).addClass('checked');
        }
    });
    // Set language - end


    // Slick Slider - start
    $('.wrap-slider').slick({
        prevArrow: '<button type="button" class="slick-prev"><span></span></button>',
        nextArrow: '<button type="button" class="slick-next"><span></span></button>'
    });
    // Slick Slider - end

    // Show/Hide cart - start
    $('.header-top__cart-cart').on('click', toggleClass);

    $('.cart-head__close').on('click', toggleClass);

    function toggleClass() {
        let cart = $('.cart');

        if (cart.hasClass('active')) {
            cart.removeClass('active');
        } else {
            cart.addClass('active');
        }
        return false;
    }
    // Show/Hide cart - end

    // Mobile menu toggle
    $('.header-bottom__nav .mobile-menu').on('click', function () {
        $(this).toggleClass('on');
    })


});

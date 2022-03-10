'use strict';
//jshint multistr:true

window.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', event => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (item == target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2022-03-10';

    function getTimeRemainig(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24 - 3),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor(t / 1000 % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num < 10 && num >= 0) {
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemainig(endtime);

            if (t.total >= 0) {
                days.innerHTML = getZero(t.days);
                hours.innerHTML = getZero(t.hours);
                minutes.innerHTML = getZero(t.minutes);
                seconds.innerHTML = getZero(t.seconds);
            } else {
                clearInterval(timeInterval);
                days.innerHTML = '0';
                hours.innerHTML = '0';
                minutes.innerHTML = '0';
                seconds.innerHTML = '0';
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTriggerBtns = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function openModal(element) {
        element.classList.add('show');
        element.classList.remove('hide');
        document.body.style.overflow = 'hidden';

        // clearInterval(modalTimer);
        alreadyShown = true;
    }

    modalTriggerBtns.forEach(item => {
        item.addEventListener('click', () => {
            openModal(modal);
        });
    });

    function closeModal(element) {
        element.classList.add('hide');
        element.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', event => {
        if (event.target == modal || event.target.getAttribute('data-modal-close') == '') {
            closeModal(modal);
        }
    });

    document.addEventListener('keydown', event => {
        if (modal.classList.contains('show') && event.code === 'Escape') {
            closeModal(modal);
        }
    });

    // Modal modification

    // Таймер по времени. Чтобы включить надо разкоментировать строку в функции openModal
    // const modalTimer = setTimeout(() => {
    //     openModal(modal);
    // }, 3000);

    let alreadyShown = false;

    function showModalByScroll() {
        const docElement = document.documentElement;
        if (window.scrollY + docElement.clientHeight >= docElement.scrollHeight - 10 && !alreadyShown) {
            openModal(modal);

            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Menu item classes

    class MenuCard {
        constructor(src, alt, title, descr, price, parent, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.transfer = 30;
            this.parent = document.querySelector(parent);
            this.changeToUAH();
        }

        changeToUAH() {
            this.price *= this.transfer;
        }

        render() {
            const card = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes.push('menu__item');
            }

            this.classes.forEach(className => card.classList.add(className));
            card.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;

            this.parent.append(card);
        }
    }

    const getResourse = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getResourse('http://localhost:3000/menu')
        .then(data => {
            data.forEach(obj => {
                new MenuCard(...Object.values(obj), '.menu .container').render();
            });
        });
    
    const forms = document.querySelectorAll('form');

    const message = {
        // loading: "Загрузка...",
        loading: "img/form/spinner.svg",
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так'
    };

    forms.forEach(item => bindPostData(item));

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', event => {
            event.preventDefault();


            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(response => console.log(response))
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);

                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal(modal);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-modal-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        modal.append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.toggle('hide');
            closeModal(modal);
        }, 4000);
    }

    // Slider

    const arrowSlideNext = document.querySelector('.offer__slider-next'),
        arrowSlidePrev = document.querySelector('.offer__slider-prev'),
        slides = document.querySelectorAll('.offer__slide'),
        amountSlidesInCounter = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;
        

        // amountSlides = slides.length - 1;

    let slideIndex = 1,
        offset = 0,
        widthWithoutPx = +width.slice(0, width.length - 2);

    function setAmountSlidesInCounter() {
        amountSlidesInCounter.textContent = getZero(slides.length);
    }

    setAmountSlidesInCounter();

    slidesField.style.cssText = `
        width: ${100 * slides.length}%;
        display: flex;
        transition: .5s all;
    `;
    slides.forEach(slide => slide.style.width = width);
    slidesWrapper.style.overflow = 'hidden';

    arrowSlideNext.addEventListener('click', () => {
        if (offset == widthWithoutPx * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += widthWithoutPx;
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex === slides.length) {
            slideIndex = 1;
            current.textContent = getZero(slideIndex);
        } else {
            slideIndex++;
            current.textContent = getZero(slideIndex);
        }
    });

    arrowSlidePrev.addEventListener('click', () => {
        if (offset == 0) {
            offset = widthWithoutPx * (slides.length - 1);
        } else {
            offset -= widthWithoutPx;
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex === 1) {
            slideIndex = slides.length;
            current.textContent = getZero(slideIndex);
        } else {
            slideIndex--;
            current.textContent = getZero(slideIndex);
        }
    });

    // let slideNumber = document.querySelector('#current');

    

    // function showSlide(i = 0) {
    //     slides.forEach(slide => slide.classList.add('hide'));
    //     slides[i].classList.remove('hide');
    // }

    // showSlide();

    // function switchSlide(i) {
    //     if (i - 1 > amountSlides) {
    //         i = 1;
    //     }
    //     if (i - 1 < 0) {
    //         i = amountSlides + 1;
    //     }
        
    //     showSlide(i - 1);
    //     slideNumber.textContent = getZero(i);
    // }

    // arrowSlideNext.addEventListener('click', () => {
    //     switchSlide(+slideNumber.textContent + 1);
    // });

    // arrowSlidePrev.addEventListener('click', () => {
    //     switchSlide(+slideNumber.textContent - 1);
    // });
});
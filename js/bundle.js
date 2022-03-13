/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

function calc() {
    const result = document.querySelector('.calculating__result span'),
        inputs = document.querySelector('.calculating__choose_medium').querySelectorAll('input');

    let sex,
        ratio,
        height,
        weight,
        age;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    if (localStorage.getItem('age')) {
        age = localStorage.getItem('age');
    }
    if (localStorage.getItem('height')) {
        height = localStorage.getItem('height');
    }
    if (localStorage.getItem('weight')) {
        weight = localStorage.getItem('weight');
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function initLocalVarForInput(elements) {
        elements.forEach(elem => {
            elem.value = localStorage.getItem(elem.getAttribute('id'));
        });
    }

    initLocalVarForInput(inputs);

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '0';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInfo(selector, classActive) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', event => {
                if (event.target.getAttribute('data-ratio')) {
                    ratio = +event.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else {
                    sex = event.target.id;
                    localStorage.setItem('sex', sex);
                }

                elements.forEach(element => element.classList.remove(classActive));
                event.target.classList.add(classActive);

                calcTotal();
            });
        });
    }

    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDinamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.search(/[a-z]/) == -1) {
                input.style.border = 'none';
            } else {
                input.style.border = '1px solid red';
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    localStorage.setItem('height', height);
                    break;
                case 'age':
                    age = +input.value;
                    localStorage.setItem('age', age);
                    break;
                case 'weight':
                    weight = +input.value;
                    localStorage.setItem('weight', weight);
                    break;
            }

            calcTotal();
        });
    }

    getDinamicInfo('#height');
    getDinamicInfo('#weight');
    getDinamicInfo('#age');
}

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {
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
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {
    const forms = document.querySelectorAll('form');

    const message = {
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
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
    const modalTriggerBtns = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    let alreadyShown = false;

    function openModal(element) {
        element.classList.add('show');
        element.classList.remove('hide');
        document.body.style.overflow = 'hidden';

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


    function showModalByScroll() {
        const docElement = document.documentElement;
        if (window.scrollY + docElement.clientHeight >= docElement.scrollHeight - 10 && !alreadyShown) {
            openModal(modal);

            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {
    const arrowSlideNext = document.querySelector('.offer__slider-next'),
        arrowSlidePrev = document.querySelector('.offer__slider-prev'),
        slides = document.querySelectorAll('.offer__slide'),
        amountSlidesInCounter = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width,
        widthWithoutPx = +width.replace(/[a-z]/g, '');

    let slideIndex = 1,
        offset = 0;

    function setAmountSlidesInCounter() {
        amountSlidesInCounter.textContent = getZero(slides.length);
    }

    setAmountSlidesInCounter();

    function showCurrentDot(array, indexFromOne) {
        array.forEach(dot => dot.style.opacity = '.5');
        array[indexFromOne - 1].style.opacity = 1;
    }

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

        if (slideIndex >= slides.length) {
            slideIndex = 1;
            current.textContent = getZero(slideIndex);
        } else {
            slideIndex++;
            current.textContent = getZero(slideIndex);
        }

        showCurrentDot(dots, slideIndex);
    });

    arrowSlidePrev.addEventListener('click', () => {
        if (offset == 0) {
            offset = widthWithoutPx * (slides.length - 1);
        } else {
            offset -= widthWithoutPx;
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex <= 1) {
            slideIndex = slides.length;
            current.textContent = getZero(slideIndex);
        } else {
            slideIndex--;
            current.textContent = getZero(slideIndex);
        }

        showCurrentDot(dots, slideIndex);
    });

    // Dots for slider (more in events for arrows of slider)

    const slider = document.querySelector('.offer__slider');

    const dotsWrapper = document.createElement('ul'),
        dots = [];
    dotsWrapper.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;

    slider.append(dotsWrapper);
    slider.style.position = 'relative';

    function createDot(parent, index) {
        const dot = document.createElement('li');
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        dot.setAttribute('data-index-dot-of-slide', index + 1);
        if (index == 0) {
            dot.style.opacity = 1;
        }

        dots.push(dot);
        parent.append(dot);
    }

    for (let i = 0; i < slides.length; i++) {
        createDot(dotsWrapper, i);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', event => {
            const dotIndexOfSlide = event.target.getAttribute('data-index-dot-of-slide');

            slideIndex = dotIndexOfSlide;
            offset = widthWithoutPx * (dotIndexOfSlide - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            showCurrentDot(dots, slideIndex);

            current.textContent = getZero(slideIndex);
        });
    });
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
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
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {
    const deadline = '2022-03-20';

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
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener('DOMContentLoaded', () => {
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
        modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
        timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
        cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
        calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js"),
        forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
        slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");

    tabs();
    modal();
    timer();
    cards();
    calc();
    forms();
    slider();

});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map
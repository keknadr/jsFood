import {getZero} from '../modules/timer';

function slider({container, slide, nextArrow, prevArrow, totalCounter, totalCurrent, wrapper, field}) {
    const arrowSlideNext = document.querySelector(nextArrow),
        arrowSlidePrev = document.querySelector(prevArrow),
        slides = document.querySelectorAll(slide),
        amountSlidesInCounter = document.querySelector(totalCounter),
        current = document.querySelector(totalCurrent),
        slidesWrapper = document.querySelector(wrapper),
        slidesField = document.querySelector(field),
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

    const slider = document.querySelector(container);

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

export default slider;
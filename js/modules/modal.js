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
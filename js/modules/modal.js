function openModal(modalSelector, modalTimer) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    console.log(modalTimer);
    if (modalTimer) {
        clearInterval(modalTimer);
    }
}
function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimer) {
    const modalTriggerBtns = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector);

    modalTriggerBtns.forEach(item => {
        item.addEventListener('click', () => openModal(modalSelector, modalTimer));
    });

    modal.addEventListener('click', event => {
        if (event.target == modal || event.target.getAttribute('data-modal-close') == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', event => {
        if (modal.classList.contains('show') && event.code === 'Escape') {
            closeModal(modalSelector);
        }
    });


    function showModalByScroll() {
        const docElement = document.documentElement;
        if (window.scrollY + docElement.clientHeight >= docElement.scrollHeight - 10) {
            openModal(modalSelector, modalTimer);

            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {closeModal, openModal};
(function () {
    const items = Array.from(document.querySelectorAll('.faq-item'));

    if (!items.length) {
        return;
    }

    const setOpenState = (item, isOpen) => {
        const trigger = item.querySelector('.faq-trigger');
        const panel = item.querySelector('.faq-panel');

        if (!trigger || !panel) {
            return;
        }

        item.classList.toggle('is-open', isOpen);
        trigger.setAttribute('aria-expanded', String(isOpen));
        panel.style.maxHeight = isOpen ? panel.scrollHeight + 'px' : '0px';
    };

    const closeOthers = (currentItem) => {
        items.forEach((item) => {
            if (item !== currentItem) {
                setOpenState(item, false);
            }
        });
    };

    items.forEach((item) => {
        const trigger = item.querySelector('.faq-trigger');

        if (!trigger) {
            return;
        }

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            closeOthers(item);
            setOpenState(item, !isOpen);
        });
    });

    // Ensure first item has proper animated height on load.
    items.forEach((item) => {
        const shouldOpen = item.classList.contains('is-open');
        setOpenState(item, shouldOpen);
    });

    window.addEventListener('resize', () => {
        items.forEach((item) => {
            if (item.classList.contains('is-open')) {
                const panel = item.querySelector('.faq-panel');
                if (panel) {
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                }
            }
        });
    });
})();

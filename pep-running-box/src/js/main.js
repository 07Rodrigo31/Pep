// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Validación del formulario de contacto (mantener)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                alert('Gracias por tu mensaje, ' + name + '! Nos pondremos en contacto contigo pronto.');
                contactForm.reset();
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    }

    // Animaciones de scroll suave (mantener)
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Contadores: almacenamiento y UI
    function keyFor(id) { return 'plan-count-' + id; }
    function loadCount(planId) {
        const v = localStorage.getItem(keyFor(planId));
        return v ? parseInt(v, 10) : 0;
    }
    function saveCount(planId, val) {
        localStorage.setItem(keyFor(planId), String(val));
    }

    const planItems = Array.from(document.querySelectorAll('.plan-item'));

    // Inicializar contadores en tarjetas
    planItems.forEach(item => {
        const id = item.getAttribute('data-plan-id');
        const span = item.querySelector('.count');
        if (id && span) span.textContent = loadCount(id);
    });

    // Actualiza una tarjeta concreta
    function updateCardDisplay(planId, val) {
        const card = document.querySelector('.plan-item[data-plan-id="' + planId + '"]');
        if (!card) return;
        const span = card.querySelector('.count');
        if (span) span.textContent = val;
    }

    // Renderiza badge total y lista del modal (con controles +/-)
    function renderTotalsAndList() {
        let total = 0;
        const listEl = document.getElementById('inscriptions-list');
        if (!listEl) return;
        listEl.innerHTML = '';

        planItems.forEach(item => {
            const id = item.getAttribute('data-plan-id');
            const title = (item.querySelector('.card-title') || { textContent: id }).textContent.trim();
            const count = loadCount(id);
            total += count;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.planId = id;

            const left = document.createElement('div');
            left.textContent = title;

            const controls = document.createElement('div');
            controls.className = 'd-flex align-items-center';

            const minus = document.createElement('button');
            minus.type = 'button';
            minus.className = 'btn btn-sm btn-outline-secondary modal-minus mr-2';
            minus.textContent = '−';

            const cnt = document.createElement('span');
            cnt.className = 'mx-2 modal-count';
            cnt.textContent = count;

            const plus = document.createElement('button');
            plus.type = 'button';
            plus.className = 'btn btn-sm btn-outline-secondary modal-plus ml-2';
            plus.textContent = '+';

            controls.appendChild(minus);
            controls.appendChild(cnt);
            controls.appendChild(plus);

            li.appendChild(left);
            li.appendChild(controls);
            listEl.appendChild(li);
        });

        const badge = document.getElementById('total-badge');
        if (badge) badge.textContent = total;
        const totalEl = document.getElementById('inscriptions-total');
        if (totalEl) totalEl.textContent = total;
    }

    // Cambio centralizado del contador
    function changeCount(planId, delta) {
        const current = loadCount(planId);
        const next = Math.max(0, current + delta);
        saveCount(planId, next);
        updateCardDisplay(planId, next);
        renderTotalsAndList();
    }

    // Delegación de clicks: modal +/-, y botones "Adquirir plan"
    document.addEventListener('click', function(e) {
        const plusModal = e.target.closest('.modal-plus');
        const minusModal = e.target.closest('.modal-minus');
        if (plusModal || minusModal) {
            const li = (plusModal || minusModal).closest('li');
            if (!li) return;
            const planId = li.dataset.planId;
            if (!planId) return;
            changeCount(planId, plusModal ? 1 : -1);
            return;
        }

        const acquire = e.target.closest('.acquire-btn');
        if (acquire) {
            const planId = acquire.getAttribute('data-plan');
            if (!planId) return;
            changeCount(planId, 1);
            const orig = acquire.textContent;
            acquire.textContent = '¡Adquirido!';
            acquire.disabled = true;
            setTimeout(() => { acquire.textContent = orig; acquire.disabled = false; }, 800);
        }
    });

    // Resetear todos
    const resetBtn = document.getElementById('reset-all');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (!confirm('¿Resetear todas las inscripciones a 0?')) return;
            planItems.forEach(item => {
                const id = item.getAttribute('data-plan-id');
                saveCount(id, 0);
                updateCardDisplay(id, 0);
            });
            renderTotalsAndList();
        });
    }

    // Render inicial y refrescar al abrir modal (usa Bootstrap/jQuery)
    renderTotalsAndList();
    if (typeof $ !== 'undefined') {
        $('#inscriptionsModal').on('show.bs.modal', function () {
            renderTotalsAndList();
        });
    }
});
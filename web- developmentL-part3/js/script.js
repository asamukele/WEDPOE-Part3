/* The Matric Dance Foundation - Part 3 scripts */
(function () {
    'use strict';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    /* ---------- Accordion ---------- */
    $$('.accordion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const open = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!open));
            btn.nextElementSibling.hidden = open;
        });
    });

    /* ---------- Modal (donation details) ---------- */
    const modal = $('#donate-modal');
    if (modal) {
        $$('[data-open-modal]').forEach(b => b.addEventListener('click', () => { modal.hidden = false; $('.modal-close', modal).focus(); }));
        const close = () => { modal.hidden = true; };
        $('.modal-close', modal).addEventListener('click', close);
        modal.addEventListener('click', e => { if (e.target === modal) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    /* ---------- Lightbox gallery ---------- */
    const lb = $('#lightbox');
    if (lb) {
        const img = $('img', lb), cap = $('figcaption', lb);
        $$('.gallery img').forEach(t => t.addEventListener('click', () => {
            img.src = t.dataset.large || t.src; img.alt = t.alt; cap.textContent = t.alt; lb.hidden = false;
        }));
        const close = () => { lb.hidden = true; };
        lb.addEventListener('click', close);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    /* ---------- Dynamic events: load, search, filter, sort ---------- */
    const list = $('#event-list');
    if (list) {
        const events = [
            { title: 'Dress Drive: Gauteng', type: 'Clothing', date: '2026-03-14', place: 'Johannesburg', text: 'Drop off new or gently used formal wear for matric learners.' },
            { title: 'Hair & Beauty Day', type: 'Beauty', date: '2026-04-18', place: 'Pretoria', text: 'Volunteer stylists give learners free hair and make-up trials.' },
            { title: 'Suit Fitting Saturday', type: 'Clothing', date: '2026-05-09', place: 'Benoni', text: 'Learners try on donated suits and get on-the-spot alterations.' },
            { title: 'School Partnership Evening', type: 'Community', date: '2026-06-20', place: 'Soweto', text: 'Meet schools and sponsors who help make matric dances possible.' },
            { title: 'Matric Dance Send-off', type: 'Community', date: '2026-09-12', place: 'Cape Town', text: 'Photographers and volunteers celebrate learners before their big night.' },
            { title: 'Beauty Product Collection', type: 'Beauty', date: '2026-10-03', place: 'Durban', text: 'Collecting make-up, hair products and accessories for learners.' }
        ];
        const q = $('#event-search'), f = $('#event-filter'), s = $('#event-sort'), count = $('#event-count');
        const render = () => {
            const term = q.value.trim().toLowerCase();
            let out = events.filter(e => (f.value === 'all' || e.type === f.value) &&
                (e.title + e.place + e.text).toLowerCase().includes(term));
            out.sort((a, b) => s.value === 'title' ? a.title.localeCompare(b.title) : a.date.localeCompare(b.date));
            list.innerHTML = '';
            out.forEach(e => {
                const card = document.createElement('article');
                card.className = 'event-card fade-in';
                card.innerHTML = '<span class="tag"></span><h3></h3><p class="meta"></p><p class="desc"></p>';
                $('.tag', card).textContent = e.type;
                $('h3', card).textContent = e.title;
                $('.meta', card).textContent = new Date(e.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + e.place;
                $('.desc', card).textContent = e.text;
                list.appendChild(card);
            });
            count.textContent = out.length ? out.length + ' event(s) found' : 'No events match your search.';
        };
        [q, f, s].forEach(el => el.addEventListener('input', render));
        render();
    }

    /* ---------- Leaflet map (contact page) ---------- */
    if ($('#map') && window.L) {
        const map = L.map('map').setView([-26.2041, 28.0473], 11);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
        L.marker([-26.2041, 28.0473]).addTo(map).bindPopup('The Matric Dance Foundation<br>Johannesburg, South Africa').openPopup();
    }

    /* ---------- Form validation + AJAX ---------- */
    const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const phoneOk = v => /^(\+27|0)[0-9]{9}$/.test(v.replace(/[\s-]/g, ''));
    const setErr = (el, msg) => {
        const box = el.closest('.form-group').querySelector('.error');
        box.textContent = msg; el.setAttribute('aria-invalid', msg ? 'true' : 'false');
        return !msg;
    };
    function validate(form) {
        let ok = true;
        $$('[data-rule]', form).forEach(el => {
            const v = el.value.trim(), r = el.dataset.rule;
            let m = '';
            if (!v) m = 'This field is required.';
            else if (r === 'name' && v.length < 2) m = 'Please enter at least 2 characters.';
            else if (r === 'email' && !emailOk(v)) m = 'Enter a valid email address, e.g. name@example.com.';
            else if (r === 'phone' && !phoneOk(v)) m = 'Enter a valid SA number, e.g. 082 123 4567.';
            else if (r === 'message' && v.length < 10) m = 'Please write at least 10 characters.';
            else if (r === 'number' && (!(+v >= 1) || +v > 500)) m = 'Enter a number between 1 and 500.';
            ok = setErr(el, m) && ok;
        });
        return ok;
    }

    // Replace with your own Formspree (or similar) endpoint to send real emails.
    const ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

    $$('form[data-ajax]').forEach(form => {
        $$('[data-rule]', form).forEach(el => el.addEventListener('blur', () => validate(form)));
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const status = $('.form-status', form);
            if (!validate(form)) { status.textContent = 'Please fix the highlighted fields.'; status.className = 'form-status bad'; return; }
            const data = Object.fromEntries(new FormData(form));
            status.className = 'form-status'; status.textContent = 'Sending...';
            if (form.id === 'enquiry-form') { showQuote(data); }
            try {
                const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                if (!res.ok) throw new Error('bad response');
                status.textContent = 'Thank you! Your message has been sent.'; status.className = 'form-status good';
                form.reset();
            } catch (err) {
                // Fallback: compile the details into an email the user can send.
                const body = Object.entries(data).map(([k, v]) => k + ': ' + v).join('\n');
                location.href = 'mailto:info@TheMatricDanceFoundation.org?subject=' + encodeURIComponent('Website ' + form.dataset.ajax) + '&body=' + encodeURIComponent(body);
                status.textContent = 'Your email app has opened with the details. Press send to finish.'; status.className = 'form-status good';
            }
        });
    });

    /* Enquiry: instant response about cost and availability */
    function showQuote(d) {
        const rates = { outfit: ['Outfit sponsorship', 1200], beauty: ['Hair & beauty package', 450], volunteer: ['Volunteering', 0], sponsor: ['Learner sponsorship (outfit + beauty)', 1650] };
        const [label, rate] = rates[d.topic] || ['General', 0];
        const n = +d.learners || 1, out = $('#quote');
        out.hidden = false;
        out.innerHTML = '';
        const h = document.createElement('h3'); h.textContent = 'Thank you, ' + d.name + '!';
        const p = document.createElement('p');
        p.textContent = rate
            ? label + ' for ' + n + ' learner(s): estimated R' + (rate * n).toLocaleString('en-ZA') + '. Spots are currently available for the 2026 season.'
            : 'Volunteer places are open. Our team will email you the next available dates.';
        out.append(h, p);
    }
})();

const setup = () => {
    // ====== Config / globale variabelen ======
    const USERS = ["Jeroen", "Leila", "Alex", "Aisha"];
    const LS_MESSAGES_KEY = "exam_chat_messages_v1";
    const SS_USER_KEY     = "exam_chat_current_user_v1";

    let currentUser = null;
    let messages = [];
    let timer = null; // gereserveerd

    // ====== Helpers ======
    const $ = (sel, root = document) => root.querySelector(sel);
    const el = (tag, props = {}, ...kids) => {
        const node = document.createElement(tag);
        Object.entries(props).forEach(([k, v]) => {
            if (k === "class") node.className = v;
            else if (k === "dataset") Object.entries(v).forEach(([dk, dv]) => node.dataset[dk] = dv);
            else if (k in node) node[k] = v;
            else node.setAttribute(k, v);
        });
        kids.forEach(k => node.append(k));
        return node;
    };

    // opslag
    function loadMessages() {
        try {
            const raw = localStorage.getItem(LS_MESSAGES_KEY);
            messages = raw ? JSON.parse(raw) : [];
            messages.sort((a, b) => b.timestamp - a.timestamp);
        } catch { messages = []; }
    }
    function saveMessages() {
        localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(messages));
    }

    function loadUser() {
        const saved = sessionStorage.getItem(SS_USER_KEY);
        currentUser = saved && USERS.includes(saved)
            ? saved
            : USERS[Math.floor(Math.random() * USERS.length)];
        sessionStorage.setItem(SS_USER_KEY, currentUser);
    }
    function setUser(u) {
        if (!USERS.includes(u)) return;
        currentUser = u;
        sessionStorage.setItem(SS_USER_KEY, u);
        renderAll();
    }

    // emoji vervanging
    function applyEmojiShortcodes(text) {
        const map = new Map([
            [":)", "\u{1F604}"],
            [":P", "\u{1F608}"],
            [":p", "\u{1F608}"],
            [":(", "\u{1F614}"],
            [";)", "\u{1F609}"]
        ]);
        let out = text;
        for (const [find, rep] of map) out = out.split(find).join(rep);
        return out;
    }

    // timestamp
    function fmtTimestamp(ms) {
        const d = new Date(ms);
        const dag = String(d.getDate());
        const maanden = ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"];
        const maand = maanden[d.getMonth()];
        const jaar2 = String(d.getFullYear()).slice(-2);
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${dag} ${maand} ${jaar2} ${hh}:${mm}`;
    }

    // renderen
    function renderAll() {
        const list = $('#messages');
        list.textContent = '';
        for (const msg of messages) list.append(renderMessage(msg));
    }
    function renderMessage(msg) {
        const root = el('div', { class: 'message' + (msg.sender === currentUser ? ' mine' : '') });
        const ts = el('span', { class: 'timestamp' }, document.createTextNode(fmtTimestamp(msg.timestamp)));

        const senderWrap = el('span', { class: 'sender' });
        if (msg.sender === currentUser) {
            const delBtn = el('button', { title: 'Verwijder dit bericht', onclick: () => confirmDeleteOne(msg) });
            senderWrap.append(delBtn);
        }
        senderWrap.append(document.createTextNode(msg.sender));

        const textNode = document.createTextNode(applyEmojiShortcodes(msg.text));
        root.append(ts, senderWrap, textNode);
        return root;
    }

    // acties
    function confirmDeleteOne(msg) {
        if (!confirm('Dit bericht verwijderen?')) return;
        messages = messages.filter(m => !(m.timestamp === msg.timestamp && m.sender === msg.sender && m.text === msg.text));
        saveMessages();
        renderAll();
    }
    function confirmClearAll() {
        if (!messages.length) return;
        if (!confirm('Alle berichten wissen?')) return;
        messages = [];
        saveMessages();
        renderAll();
    }
    function sendMessage(rawText) {
        const text = rawText.trim();
        if (!text) return;

        const msg = {
            text: applyEmojiShortcodes(text),
            sender: currentUser,
            timestamp: Date.now()
        };
        messages.unshift(msg);
        saveMessages();

        $('#messages').prepend(renderMessage(msg));

        const input = $('#message-input');
        input.value = '';
        input.focus();
    }

    // init
    function init() {
        const sel = $('#user-select');
        sel.textContent = '';
        for (const u of USERS) sel.append(el('option', { value: u, textContent: u }));

        loadUser();
        sel.value = currentUser;

        sel.addEventListener('change', (e) => setUser(e.target.value));
        $('#clear-all').addEventListener('click', confirmClearAll);

        $('#composer').addEventListener('submit', (e) => {
            e.preventDefault();
            sendMessage($('#message-input').value);
        });

        loadMessages();
        renderAll();
    }

    init();
};

window.addEventListener("load", setup);

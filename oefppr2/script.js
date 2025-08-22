/*
  DIT BESTAND DOET ALLES STAP-VOOR-STAP:

  1) We definiëren vaste gebruikersnamen (droplist).
  2) We hebben globale "staat": huidige gebruiker, berichtenlijst.
  3) We koppelen events: verzenden, wissen, user wisselen.
  4) We bouwen berichten als DOM-elementen (zonder innerHTML → veilig).
  5) We zetten nieuwe berichten BOVENAAN (vereiste).
  6) We vervangen emoji shortcodes (zoals :), :(, ;), :P).
  7) We bewaren berichten in localStorage (blijven staan na refresh).
  8) We bewaren huidige gebruiker in sessionStorage (blijft in dit tabblad).
*/

/* ====== Opstart-patroon: voer setup uit als de pagina klaar is ====== */
const setup = () => {
    /* === 1) Config / constante waarden ===
       - Vaste lijst met gebruikers.
       - Sleutels voor webstorage (localStorage/sessionStorage).
    */
    const USERS = ["Jeroen", "Leila", "Alex", "Aisha"];
    const LS_MESSAGES_KEY = "exam_chat_messages_v1";      // berichten blijven na refresh (localStorage)
    const SS_USER_KEY     = "exam_chat_current_user_v1";  // huidige gebruiker voor dit tabblad (sessionStorage)

    /* === 2) Globale staat ===
       - currentUser: string met de naam van de actieve gebruiker.
       - messages: array met alle berichten (nieuwste bovenaan).
       - timer: gereserveerd (soms in opdrachten gevraagd; we gebruiken 'm hier niet).
    */
    let currentUser = null;
    let messages = [];
    let timer = null;

    /* === 3) Kleine helperfuncties === */

    // Snel element zoeken (i.p.v. document.querySelector(...))
    const $ = (sel, root = document) => root.querySelector(sel);

    // Handig element maken met props en children
    // el('div', { class: 'message' }, document.createTextNode('Hoi'))
    const el = (tag, props = {}, ...kids) => {
        const node = document.createElement(tag);
        Object.entries(props).forEach(([k, v]) => {
            if (k === 'class') node.className = v;            // class="..."
            else if (k in node) node[k] = v;                  // node.textContent = ...
            else node.setAttribute(k, v);                     // data-*, aria-*, id, etc.
        });
        kids.forEach(k => node.append(k));                  // voeg kinderen toe
        return node;
    };

    /* === 4) Opslag laden/bewaren === */

    // Berichten uit localStorage halen; sorteren op tijd (nieuwste eerst)
    function loadMessages() {
        try {
            const raw = localStorage.getItem(LS_MESSAGES_KEY);
            messages = raw ? JSON.parse(raw) : [];
            messages.sort((a, b) => b.timestamp - a.timestamp);
        } catch {
            messages = [];
        }
    }

    // Berichten terug naar localStorage schrijven
    function saveMessages() {
        localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(messages));
    }

    // Huidige gebruiker laden (uit sessionStorage) of random kiezen
    function loadUser() {
        const saved = sessionStorage.getItem(SS_USER_KEY);
        currentUser = saved && USERS.includes(saved)
            ? saved
            : USERS[Math.floor(Math.random() * USERS.length)];
        sessionStorage.setItem(SS_USER_KEY, currentUser);
    }

    // Gebruiker instellen en UI updaten
    function setUser(u) {
        if (!USERS.includes(u)) return;
        currentUser = u;
        sessionStorage.setItem(SS_USER_KEY, u);
        renderAll(); // zodat je eigen berichten weer de deleteknop tonen
    }

    /* === 5) Emoji-shortcodes vervangen ===
       Volgens opdracht:
        :) → 😄  (U+1F604)
        :P/:p → 😈  (U+1F608)
        :( → 😔  (U+1F614)
        ;) → 😉  (U+1F609)
    */
    function applyEmojiShortcodes(text) {
        return text
            .replaceAll(":)", "\u{1F604}")
            .replaceAll(":P", "\u{1F608}")
            .replaceAll(":p", "\u{1F608}")
            .replaceAll(":(", "\u{1F614}")
            .replaceAll(";)", "\u{1F609}");
    }

    /* === 6) Tijdstempel mooi formatteren ===
       Voorbeeld: "22 aug 25 14:03"
    */
    function fmtTimestamp(ms) {
        const d = new Date(ms);
        const dag = String(d.getDate());
        const maanden = ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"];
        const maand = maanden[d.getMonth()];
        const jaar2 = String(d.getFullYear()).slice(-2);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${dag} ${maand} ${jaar2} ${hh}:${mm}`;
    }

    /* === 7) Berichten renderen === */

    // Hele lijst opnieuw tekenen (bijv. na wissen of user wisselen)
    function renderAll() {
        const list = $('#messages');
        list.textContent = '';
        for (const msg of messages) {
            list.append(renderMessage(msg)); // berichten staan al newest→oldest
        }
    }

    // Eén bericht bouwen (zonder innerHTML, dus veilig)
    function renderMessage(msg) {
        // Root div met optionele 'mine' als het jouw bericht is
        const root = el('div', { class: 'message' + (msg.sender === currentUser ? ' mine' : '') });

        // Tijdstempel
        const ts = el('span', { class: 'timestamp' }, document.createTextNode(fmtTimestamp(msg.timestamp)));

        // Afzenderregel met evt. delete-knopje links voor je eigen berichten
        const senderWrap = el('span', { class: 'sender' });
        if (msg.sender === currentUser) {
            const delBtn = el('button', { title: 'Verwijder dit bericht', onclick: () => confirmDeleteOne(msg) });
            senderWrap.append(delBtn);
        }
        senderWrap.append(document.createTextNode(msg.sender));

        // De tekst zelf (al met emoji vervangen)
        const textNode = document.createTextNode(applyEmojiShortcodes(msg.text));

        // Alles aan elkaar hangen
        root.append(ts, senderWrap, textNode);
        return root;
    }

    /* === 8) Acties (verzenden / verwijderen) === */

    // Verzend een nieuw bericht
    function sendMessage(rawText) {
        const text = rawText.trim();
        if (!text) return; // leeg? niets doen

        const msg = {
            text: applyEmojiShortcodes(text), // emoji shortcodes meteen vervangen
            sender: currentUser,
            timestamp: Date.now()
        };

        // NIEUWSTE BERICHT BOVENAAN: daarom unshift (vooraan) i.p.v. push (achteraan)
        messages.unshift(msg);
        saveMessages();

        // UI: alleen het nieuwe bericht bovenaan toevoegen (sneller dan alles hertekenen)
        $('#messages').prepend(renderMessage(msg));
    }

    // Verwijder één specifiek bericht (met bevestiging)
    function confirmDeleteOne(msg) {
        if (!confirm('Dit bericht verwijderen?')) return;
        // Filter: laat alle berichten staan behalve exact die ene
        messages = messages.filter(m => !(m.timestamp === msg.timestamp && m.sender === msg.sender && m.text === msg.text));
        saveMessages();
        renderAll();
    }

    // Alles wissen (met bevestiging)
    function confirmClearAll() {
        if (!messages.length) return;
        if (!confirm('Alle berichten wissen?')) return;
        messages = [];
        saveMessages();
        renderAll();
    }

    /* === 9) Initialiseren === */

    function init() {
        // 9.1 dropdown vullen met USERS
        const sel = $('#user-select');
        sel.textContent = '';
        for (const u of USERS) sel.append(el('option', { value: u, textContent: u }));

        // 9.2 huidige user laden/zetten
        loadUser();
        sel.value = currentUser;

        // 9.3 events koppelen: user wisselen, alles wissen, verzenden
        sel.addEventListener('change', (e) => setUser(e.target.value));
        $('#clear-all').addEventListener('click', confirmClearAll);

        const form = $('#composer');
        form.addEventListener('submit', (e) => {
            e.preventDefault();                      // geen page reload
            const input = $('#message-input');
            sendMessage(input.value);                // maak bericht
            input.value = '';                        // leeg veld
            input.focus();                           // focus terug in input
        });

        // 9.4 berichten laden en tonen
        loadMessages();
        renderAll();
    }

    // Start!
    init();
};

// Start 'setup' zodra de pagina geladen is
window.addEventListener("load", setup);


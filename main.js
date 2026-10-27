const CHIAVE = "team-membri";
const colori = ["#3f6b4f", "#c9573f", "#4a6a86", "#6b5a86", "#3f8686", "#a8864a", "#7a4a6a", "#4f7a3f"];

// Membri iniziali. Per una foto vera aggiungi: foto: "imagini/male1.png"
const predefiniti = [
    {
        nome: "Marco Bianchi",
        ruolo: "Designer",
        email: "marcobianchi@team.com",
        foto: "imagini/Marco Bianchi.jpg"
    },
    {
        nome: "Laura Rossi",
        ruolo: "Front-end Developer",
        email: "laurarossi@team.com",
        foto: "imagini/Laura Rossi.jpg"
    },
    {
        nome: "Giorgio Verdi",
        ruolo: "Back-end Developer",
        email: "giorgioverdi@team.com",
        foto: "imagini/Giorgio Verdi.jpg"
    },
    {
        nome: "Marta Ipsum",
        ruolo: "SEO Specialist",
        email: "martaipsum@team.com",
        foto: "imagini/Marta Ipsum.jpg"
    },
    {
        nome: "Roberto Lorem",
        ruolo: "SEO Specialist",
        email: "robertolorem@team.com",
        foto: "imagini/Roberto Lorem.jpg"
    },
    {
        nome: "Daniela Amet",
        ruolo: "Analyst",
        email: "danielaamet@team.com",
        foto: "imagini/Daniela Amet.jpg"
    }
];

let team = carica();

function carica() {
    try {
        const salvato = localStorage.getItem(CHIAVE);
        if (salvato) {
            return JSON.parse(salvato);
        }
    } catch (e) { }
    return predefiniti.slice();
}

function salva() {
    try {
        localStorage.setItem(CHIAVE, JSON.stringify(team));
    } catch (e) { }
}

function avatar(nome, indice) {
    const colore = colori[indice % colori.length];
    const iniziali = nome.trim().split(/\s+/).map(p => p[0]).join("").slice(0, 2).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <rect width="240" height="240" fill="${colore}"/>
    <circle cx="120" cy="92" r="42" fill="rgba(255,255,255,.35)"/>
    <ellipse cx="120" cy="220" rx="76" ry="62" fill="rgba(255,255,255,.32)"/>
    <text x="120" y="136" font-family="sans-serif" font-size="46" font-weight="700" fill="#fff" text-anchor="middle">
    ${iniziali}
    </text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function creaCard(p, indice) {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = p.foto || avatar(p.nome, indice);
    img.alt = p.nome;
    img.onerror = () => {
        img.onerror = null;
        img.src = avatar(p.nome, indice);
    };

    const info = document.createElement("div");
    info.className = "info";

    const nome = document.createElement("h3");
    nome.className = "name";
    nome.textContent = p.nome;

    const ruolo = document.createElement("p");
    ruolo.className = "role";
    ruolo.textContent = p.ruolo;

    const email = document.createElement("a");
    email.className = "mail";
    email.href = "mailto:" + p.email;
    email.textContent = p.email;

    const rimuovi = document.createElement("button");
    rimuovi.type = "button";
    rimuovi.className = "remove";
    rimuovi.title = "Rimuovi";
    rimuovi.textContent = "x";
    rimuovi.addEventListener("click", () => {
        team.splice(indice, 1);
        salva();
        mostra();
    });

    info.append(nome, ruolo, email);
    card.append(img, info, rimuovi);
    return card;
}

const contenitore = document.getElementById("team");

function mostra() {
    contenitore.innerHTML = "";
    team.forEach((p, i) => contenitore.appendChild(creaCard(p, i)));
}

// Ridimensiona la foto caricata per non appesantire il salvataggio
function leggiFoto(file) {
    return new Promise(resolve => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const lato = 240;
                const canvas = document.createElement("canvas");
                canvas.width = lato;
                canvas.height = lato;
                const ctx = canvas.getContext("2d");
                const s = Math.min(img.width, img.height);
                ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, lato, lato);
                resolve(canvas.toDataURL("image/jpeg", 0.8));
            };
            img.onerror = () => resolve(null);
            img.src = reader.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
}

const form = document.getElementById("form-membro");
const campoFoto = document.getElementById("foto");
const etichettaFoto = document.getElementById("file-label");

campoFoto.addEventListener("change", () => {
    etichettaFoto.textContent = campoFoto.files[0] ? campoFoto.files[0].name : "Foto (facoltativa)";
});

form.addEventListener("submit", async e => {
    e.preventDefault();
    const foto = await leggiFoto(campoFoto.files[0]);
    team.push({
        nome: form.nome.value.trim(),
        ruolo: form.ruolo.value.trim(),
        email: form.email.value.trim(),
        foto: foto || undefined
    });
    salva();
    mostra();
    form.reset();
    etichettaFoto.textContent = "Foto (facoltativa)";
});

mostra();
// Utilidades básicas
function createEl(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.className) el.className = options.className;
    if (options.innerHTML) el.innerHTML = options.innerHTML;
    if (options.type) el.type = options.type;
    if (options.id) el.id = options.id;
    if (options.value) el.value = options.value;
    if (options.placeholder) el.placeholder = options.placeholder;
    if (options.for) el.htmlFor = options.for;
    if (options.src) el.src = options.src;
    if (options.max) el.max = options.max;
    if (options.style) el.style = options.style;
    return el;
}
function injectStyles(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.appendChild(style);
}
function formatDate(date) {
    return date.toISOString().slice(0, 10);
}
function formatDateBR(date) {
    return date.toLocaleDateString('pt-BR');
}

// INJETAR CSS
injectStyles(`
    * { margin:0; padding:0; box-sizing: border-box; }
    body { font-family:'Poppins',sans-serif; background: linear-gradient(135deg, #6b7280, #a855f7); min-height:100vh;
        display:flex; justify-content:center; align-items:center; padding:1rem; overflow-x:hidden; }
    .container { max-width:700px; width:100%; background:rgba(255,255,255,0.97); padding:2rem; border-radius:20px;
        box-shadow:0 10px 30px rgba(0,0,0,0.15); position:relative; animation:fadeIn 0.5s; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
    h1 { font-size:2rem; color:#1e3a8a; margin-bottom:1rem; text-align:center; }
    .category-container { display:flex; flex-direction:column; align-items:center; margin-bottom:1.5rem; }
    .category-container label { font-size:1.1rem; color:#1e3a8a; margin-bottom:0.5rem; }
    select { appearance:none; background:#f1f5f9; border:2px solid #a855f7; border-radius:10px;
        padding:0.75rem 1rem; font-size:1rem; width:200px; cursor:pointer; }
    select:focus { outline:none; border-color:#7c3aed; box-shadow:0 0 8px rgba(124,58,237,0.3); }
    .emojis { display:flex; justify-content: center; gap:1rem; flex-wrap:wrap; margin:1.5rem 0; }
    .emoji-container { display:flex; flex-direction:column; align-items:center; transition:transform 0.3s; }
    .emoji { font-size:3rem; cursor:pointer; transition:transform 0.3s, box-shadow 0.3s; }
    .emoji:hover { transform:scale(1.2) rotate(5deg); box-shadow:0 5px 15px rgba(0,0,0,0.10); }
    .selected { transform:scale(1.2); border:3px solid #7c3aed; border-radius:15px; padding:0.5rem; }
    .emoji-label { font-size:0.9rem; color:#1e3a8a; margin-top:0.5rem; font-weight:600; }
    .centered { display:flex; flex-direction:column; align-items:center; justify-content:center; }
    .date-today-label { font-size:1.1rem; font-weight:600; color:#1e3a8a; margin-bottom:0.7rem; text-align:center; }
    button { background: linear-gradient(90deg,#7c3aed,#a855f7); color:white; border:none; padding:0.75rem 2rem; font-size:1.1rem;
        font-weight:600; border-radius:50px; cursor:pointer; transition:transform 0.3s, box-shadow 0.3s; margin:1rem 0; }
    button:hover { transform:translateY(-3px); box-shadow:0 5px 15px rgba(124,58,237,0.3); }
    #totals { font-size:1.1rem; color:#1e3a8a; margin:1.0rem 0 1.5rem 0; font-weight:600; }
    #chartContainer { height:350px; width:100%; margin-top:2rem; background:#f1f5f9; border-radius:15px; padding:1rem; }
    #exportBtn { display:none; background:#16a34a!important; color:#fff; font-weight:700; }
    @media (max-width:600px) {
        h1 { font-size:1.5rem; }
        .emoji { font-size:2.5rem; }
        .emoji-label { font-size:0.8rem; }
        select { width:100%; max-width:180px; }
        button { padding:0.6rem 1.5rem; font-size:1rem; }
        #chartContainer { height:300px; }
    }
`);

// ESTRUTURA
const container = createEl('div', {className:'container'});
const h1 = createEl('h1', { innerHTML: 'Como você tá hoje? 😎' });

const today = new Date();
const todayLabel = createEl('div', { className: 'date-today-label', innerHTML: `Data de Hoje: <b id="todayDateBR">${formatDateBR(today)}</b>` });

const catCont = createEl('div', { className:'category-container' });
const catLabel = createEl('label', { for:'category', innerHTML:'Você é:' });
const catSelect = createEl('select', { id:'category' });
catSelect.innerHTML = `<option value="" selected>Selecione</option>
    <option value="aluno">Aluno</option>
    <option value="professor">Professor</option>`;
catCont.appendChild(catLabel);
catCont.appendChild(catSelect);

const emojisDiv = createEl('div', { className:'emojis', id:'emojis' });

const EMOJIS = [
    {val:'1', emoji:'😢', label:'Muito Triste'},
    {val:'2', emoji:'😔', label:'Triste'},
    {val:'3', emoji:'😐', label:'Neutro'},
    {val:'4', emoji:'😊', label:'Feliz'},
    {val:'5', emoji:'😄', label:'Muito Feliz'}
];

EMOJIS.forEach(({val, emoji, label}) => {
    const emojiCont = createEl('div', { className:'emoji-container'});
    const emojiSpan = createEl('span', { className:'emoji', innerHTML:emoji });
    emojiSpan.setAttribute('data-value', val);
    const emojiLabel = createEl('span', { className:'emoji-label', innerHTML:label });
    emojiCont.appendChild(emojiSpan);
    emojiCont.appendChild(emojiLabel);
    emojisDiv.appendChild(emojiCont);
});

const btnDiv = createEl('div', {className:'centered'});
const btn = createEl('button', { innerHTML: 'Enviar Vibes!' });
btn.onclick = submitResponse;
btnDiv.appendChild(btn);

const totalsDiv = createEl('div', { className:'centered', id:'totals', innerHTML:`
    <span>Total de Alunos: <span id="totalAlunos">0</span> | Total de Professores: <span id="totalProfessores">0</span></span>
` });

const chartContainer = createEl('div', { id:'chartContainer' });
const canvas = createEl('canvas', { id:'humorChart' });
chartContainer.appendChild(canvas);

container.appendChild(h1);
container.appendChild(todayLabel);
container.appendChild(catCont);
container.appendChild(emojisDiv);
container.appendChild(btnDiv);
container.appendChild(totalsDiv);
container.appendChild(chartContainer);

document.body.appendChild(container);

// ARMAZENAMENTO
function getStorageData() {
    return JSON.parse(localStorage.getItem('humorDataV2')) || {};
}
function saveStorageData(data) {
    localStorage.setItem('humorDataV2', JSON.stringify(data));
}
function getVotesForDate(dateString) {
    const data = getStorageData();
    if (!data[dateString]) {
        data[dateString] = {
            aluno: {1:0,2:0,3:0,4:0,5:0},
            professor: {1:0,2:0,3:0,4:0,5:0}
        }
    }
    return data[dateString];
}

// GRÁFICO
let selectedHumor = null;
const emojiEls = document.querySelectorAll('.emoji');
const chartCtx = canvas.getContext('2d');
const humorChart = new Chart(chartCtx, {
    type: 'bar',
    data: {
        labels: EMOJIS.map(e => `${e.emoji} ${e.label}`),
        datasets: [
            {
                label: 'Aluno',
                data: [0,0,0,0,0],
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            },
            {
                label: 'Professor',
                data: [0,0,0,0,0],
                backgroundColor: 'rgba(236, 72, 153, 0.6)',
                borderColor: 'rgba(236, 72, 153, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Número de Respostas', font: { family: 'Poppins', size: 14 } },
                grid: { color: 'rgba(0, 0, 0, 0.1)' }
            },
            x: {
                title: { display: true, text: 'Humor', font: { family: 'Poppins', size: 14 } },
                grid: { display: false }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Vibes do Dia',
                font: { family: 'Poppins', size: 20, weight: 'bold' },
                color: '#1e3a8a'
            },
            datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: value => value > 0 ? value : '',
                font: { family: 'Poppins', weight: 'bold', size: 12 }
            }
        }
    },
    plugins: [ChartDataLabels]
});

// EVENTOS
emojiEls.forEach(emoji => {
    emoji.addEventListener('click', function() {
        emojiEls.forEach(e => e.classList.remove('selected'));
        this.classList.add('selected');
        selectedHumor = this.getAttribute('data-value');
    });
});
function updateChartAndTotals(dateString) {
    const votes = getVotesForDate(dateString);
    humorChart.data.datasets[0].data = Object.values(votes.aluno);
    humorChart.data.datasets[1].data = Object.values(votes.professor);
    humorChart.update();
    document.getElementById('totalAlunos').textContent = Object.values(votes.aluno).reduce((a,b)=>a+b,0);
    document.getElementById('totalProfessores').textContent = Object.values(votes.professor).reduce((a,b)=>a+b,0);
}

function submitResponse() {
    const category = document.getElementById('category').value;
    if(category===''){
        alert('Obrigatório selecionar se você é Aluno ou Professor antes de enviar.');
        return;
    }
    if(selectedHumor===null){
        alert('Obrigatório selecionar como você está se sentindo antes de enviar.');
        return;
    }
    const todayString = formatDate(new Date());
    const data = getStorageData();
    const dayVotes = getVotesForDate(todayString);
    dayVotes[category][selectedHumor]++;
    data[todayString] = dayVotes;
    saveStorageData(data);
    updateChartAndTotals(todayString);
    alert('Vibes enviadas com sucesso! 🚀');
    emojiEls.forEach(e=>e.classList.remove('selected'));
    selectedHumor = null;
    document.getElementById('category').value = '';
}

// ============= BOTÃO EXPORTAÇÃO: atalho Ctrl + D + S =============
const exportBtn = createEl('button', {
    id: "exportBtn",
    innerHTML: 'Exportar Votos',
    style: "display:none;background:#16a34a!important;margin: 1rem;"
});
exportBtn.onclick = exportVotesFunc;
container.appendChild(exportBtn);

let ctrlDown = false;
let dPressed = false;
window.addEventListener('keydown', function(e){
    if(e.key === "Control") ctrlDown = true;
    if(ctrlDown && e.key.toLowerCase() === 'd') {
        dPressed = true;
    }
    if(ctrlDown && dPressed && e.key.toLowerCase() === 's') {
        exportBtn.style.display = "block";
        alert("Botão de exportação habilitado!");
        ctrlDown = false;
        dPressed = false;
    }
});
window.addEventListener('keyup', function(e){
    if(e.key === "Control") ctrlDown = false;
    if(e.key.toLowerCase() === 'd') dPressed = false;
});

// Função exportação: CSV e resumo por sentimento
function exportVotesFunc(){
    const data = getStorageData();
    const sentimentoLabels = {
        1: 'Muito Triste',
        2: 'Triste',
        3: 'Neutro',
        4: 'Feliz',
        5: 'Muito Feliz'
    };

    let csvRows = ["Data,Tipo,Sentimento,Votos"];
    let resumo = "";

    for(const dia in data){
        for(const tipo in data[dia]){
            let tipoNom = (tipo==="aluno") ? "Aluno" : "Professor";
            for(const val in data[dia][tipo]){
                if (data[dia][tipo][val] > 0) {
                    resumo += `${tipoNom} votou "${sentimentoLabels[val]}" ${data[dia][tipo][val]}x (${formatDateBR(new Date(dia))})\n`;
                }
                csvRows.push(`${formatDateBR(new Date(dia))},${tipoNom},${sentimentoLabels[val]},${data[dia][tipo][val]}`);
            }
        }
    }

    if (resumo === "") resumo = "Nenhum voto computado ainda.";
    alert(resumo);

    const blob = new Blob([csvRows.join("\n")],{type:"text/csv"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "votos_feira.csv";
    a.click();
}

// ============ AVISO AO SAIR ==============
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});

// ========== Inicialização ==========
updateChartAndTotals(formatDate(today));
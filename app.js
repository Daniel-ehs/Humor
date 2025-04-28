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
    // Adiciona verificação para garantir que 'date' é um objeto Date válido
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error("Tentativa de formatar data inválida:", date);
        return "Data Inválida"; // Retorna um placeholder ou lança um erro
    }
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); // Adiciona timeZone para consistência
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
    #exportBtn { background:#16a34a!important; color:#fff; font-weight:700; }
    .export-container { display:flex; justify-content:center; gap:1rem; margin-top:1.5rem; }
    .export-option { background:#f1f5f9; border:2px solid #a855f7; border-radius:10px; padding:0.75rem 1rem; 
        font-size:1rem; cursor:pointer; transition:all 0.3s; display:flex; align-items:center; gap:0.5rem; }
    .export-option:hover { background:#e9d5ff; transform:translateY(-2px); }
    .export-option input { margin-right:0.5rem; }
    @media (max-width:600px) {
        h1 { font-size:1.5rem; }
        .emoji { font-size:2.5rem; }
        .emoji-label { font-size:0.8rem; }
        select { width:100%; max-width:180px; }
        button { padding:0.6rem 1.5rem; font-size:1rem; }
        #chartContainer { height:300px; }
        .export-container { flex-direction:column; align-items:center; }
    }
`);

// ESTRUTURA
const container = createEl('div', { className: 'container' });
const h1 = createEl('h1', { innerHTML: 'Como você tá hoje? 😎' });

const today = new Date();
const todayLabel = createEl('div', { className: 'date-today-label', innerHTML: `Data de Hoje: <b id="todayDateBR">${formatDateBR(today)}</b>` });

const catCont = createEl('div', { className: 'category-container' });
const catLabel = createEl('label', { for: 'category', innerHTML: 'Você é:' });
const catSelect = createEl('select', { id: 'category' });
catSelect.innerHTML = `<option value="" selected>Selecione</option>
    <option value="aluno">Aluno</option>
    <option value="professor">Professor</option>`;
catCont.appendChild(catLabel);
catCont.appendChild(catSelect);

const emojisDiv = createEl('div', { className: 'emojis', id: 'emojis' });

const EMOJIS = [
    { val: '1', emoji: '😢', label: 'Muito Triste' },
    { val: '2', emoji: '😔', label: 'Triste' },
    { val: '3', emoji: '😐', label: 'Neutro' },
    { val: '4', emoji: '😊', label: 'Feliz' },
    { val: '5', emoji: '😄', label: 'Muito Feliz' }
];

EMOJIS.forEach(({ val, emoji, label }) => {
    const emojiCont = createEl('div', { className: 'emoji-container' });
    const emojiSpan = createEl('span', { className: 'emoji', innerHTML: emoji });
    emojiSpan.setAttribute('data-value', val);
    const emojiLabel = createEl('span', { className: 'emoji-label', innerHTML: label });
    emojiCont.appendChild(emojiSpan);
    emojiCont.appendChild(emojiLabel);
    emojisDiv.appendChild(emojiCont);
});

const btnDiv = createEl('div', { className: 'centered' });
const btn = createEl('button', { innerHTML: 'Enviar Vibes!' });
btn.onclick = submitResponse;
btnDiv.appendChild(btn);

const totalsDiv = createEl('div', { className: 'centered', id: 'totals', innerHTML: `
    <span>Total de Alunos: <span id="totalAlunos">0</span> | Total de Professores: <span id="totalProfessores">0</span></span>
` });

const chartContainer = createEl('div', { id: 'chartContainer' });
const canvas = createEl('canvas', { id: 'humorChart' });
chartContainer.appendChild(canvas);

container.appendChild(h1);
container.appendChild(todayLabel);
container.appendChild(catCont);
container.appendChild(emojisDiv);
container.appendChild(btnDiv);
container.appendChild(totalsDiv);
container.appendChild(chartContainer);

// Adicionar container de exportação
const exportContainer = createEl('div', { className: 'export-container' });
const exportBtn = createEl('button', {
    id: 'exportBtn',
    innerHTML: 'Exportar Dados'
});
exportBtn.onclick = showExportOptions;
exportContainer.appendChild(exportBtn);
container.appendChild(exportContainer);

document.body.appendChild(container);

// ARMAZENAMENTO
function getStorageData() {
    try {
        const data = localStorage.getItem('humorDataV2');
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error("Erro ao ler ou parsear dados do localStorage:", e);
        return {}; // Retorna objeto vazio em caso de erro
    }
}

function saveStorageData(data) {
    try {
        localStorage.setItem('humorDataV2', JSON.stringify(data));
    } catch (e) {
        console.error("Erro ao salvar dados no localStorage:", e);
        alert("Erro ao salvar dados. O armazenamento local pode estar cheio ou indisponível.");
    }
}

function getVotesForDate(dateString) {
    const data = getStorageData();
    if (!data[dateString]) {
        data[dateString] = {
            aluno: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            professor: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
    }
    // Garante que as chaves de humor existem para aluno e professor
    if (!data[dateString].aluno) data[dateString].aluno = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (!data[dateString].professor) data[dateString].professor = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (let i = 1; i <= 5; i++) {
        if (data[dateString].aluno[i] === undefined) data[dateString].aluno[i] = 0;
        if (data[dateString].professor[i] === undefined) data[dateString].professor[i] = 0;
    }
    return data[dateString];
}

// GRÁFICO
let selectedHumor = null;
const emojiEls = document.querySelectorAll('.emoji');
const chartCtx = canvas.getContext('2d');
let humorChart; // Declarar a variável do gráfico aqui

try {
    humorChart = new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels: EMOJIS.map(e => `${e.emoji} ${e.label}`),
            datasets: [
                {
                    label: 'Aluno',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Professor',
                    data: [0, 0, 0, 0, 0],
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
                    ticks: { stepSize: 1 }, // Garante incrementos inteiros no eixo Y
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
                },
                tooltip: {
                    titleFont: { family: 'Poppins' },
                    bodyFont: { family: 'Poppins' }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
} catch (e) {
    console.error("Erro ao inicializar Chart.js:", e);
    alert("Erro ao carregar o gráfico. Verifique se as bibliotecas Chart.js estão sendo carregadas corretamente.");
}

// EVENTOS
emojiEls.forEach(emoji => {
    emoji.addEventListener('click', function() {
        emojiEls.forEach(e => e.classList.remove('selected'));
        this.classList.add('selected');
        selectedHumor = this.getAttribute('data-value');
    });
});

function updateChartAndTotals(dateString) {
    if (!humorChart) return; // Não tenta atualizar se o gráfico não foi inicializado
    const votes = getVotesForDate(dateString);
    humorChart.data.datasets[0].data = Object.values(votes.aluno);
    humorChart.data.datasets[1].data = Object.values(votes.professor);
    humorChart.update();
    document.getElementById('totalAlunos').textContent = Object.values(votes.aluno).reduce((a, b) => a + b, 0);
    document.getElementById('totalProfessores').textContent = Object.values(votes.professor).reduce((a, b) => a + b, 0);
}

function submitResponse() {
    const category = document.getElementById('category').value;
    if (category === '') {
        alert('Obrigatório selecionar se você é Aluno ou Professor antes de enviar.');
        return;
    }
    if (selectedHumor === null) {
        alert('Obrigatório selecionar como você está se sentindo antes de enviar.');
        return;
    }
    const todayString = formatDate(new Date());
    const data = getStorageData();
    const dayVotes = getVotesForDate(todayString); // Garante que a estrutura para o dia existe
    dayVotes[category][selectedHumor]++;
    data[todayString] = dayVotes;
    saveStorageData(data);
    updateChartAndTotals(todayString);
    alert('Vibes enviadas com sucesso! 🚀');
    emojiEls.forEach(e => e.classList.remove('selected'));
    selectedHumor = null;
    document.getElementById('category').value = '';
}

// EXPORTAÇÃO DE DADOS
let isExporting = false;

// Função para mostrar opções de exportação
function showExportOptions() {
    // Criar modal de opções de exportação
    const modalOverlay = createEl('div', {
        id: 'exportModalOverlay', // Adiciona ID para fácil remoção
        style: 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000;'
    });
    
    const modalContent = createEl('div', {
        style: 'background:white;padding:2rem;border-radius:15px;max-width:500px;width:90%;'
    });
    
    const modalTitle = createEl('h2', {
        innerHTML: 'Exportar Dados',
        style: 'color:#1e3a8a;margin-bottom:1.5rem;text-align:center;'
    });
    
    const optionsContainer = createEl('div', {
        style: 'display:flex;flex-direction:column;gap:1rem;margin-bottom:1.5rem;'
    });
    
    // Opção CSV
    const csvOption = createEl('div', { className: 'export-option' });
    const csvRadio = createEl('input', { type: 'radio', id: 'csv', name: 'exportType', value: 'csv' });
    csvRadio.checked = true;
    const csvLabel = createEl('label', { for: 'csv', innerHTML: 'Exportar como CSV (para Excel, planilhas)' });
    csvOption.appendChild(csvRadio);
    csvOption.appendChild(csvLabel);
    
    // Opção JSON
    const jsonOption = createEl('div', { className: 'export-option' });
    const jsonRadio = createEl('input', { type: 'radio', id: 'json', name: 'exportType', value: 'json' });
    const jsonLabel = createEl('label', { for: 'json', innerHTML: 'Exportar como JSON (para desenvolvedores)' });
    jsonOption.appendChild(jsonRadio);
    jsonOption.appendChild(jsonLabel);
    
    // Opção Imagem
    const imgOption = createEl('div', { className: 'export-option' });
    const imgRadio = createEl('input', { type: 'radio', id: 'img', name: 'exportType', value: 'img' });
    const imgLabel = createEl('label', { for: 'img', innerHTML: 'Exportar como Imagem (captura do gráfico)' });
    imgOption.appendChild(imgRadio);
    imgOption.appendChild(imgLabel);
    
    // Opção Todos
    const allOption = createEl('div', { className: 'export-option' });
    const allRadio = createEl('input', { type: 'radio', id: 'all', name: 'exportType', value: 'all' });
    const allLabel = createEl('label', { for: 'all', innerHTML: 'Exportar tudo (CSV + JSON + Imagem)' });
    allOption.appendChild(allRadio);
    allOption.appendChild(allLabel);
    
    optionsContainer.appendChild(csvOption);
    optionsContainer.appendChild(jsonOption);
    optionsContainer.appendChild(imgOption);
    optionsContainer.appendChild(allOption);
    
    const buttonsContainer = createEl('div', {
        style: 'display:flex;justify-content:center;gap:1rem;'
    });
    
    const cancelBtn = createEl('button', {
        innerHTML: 'Cancelar',
        style: 'background:#f1f5f9;color:#1e3a8a;border:2px solid #a855f7;'
    });
    
    const confirmBtn = createEl('button', {
        innerHTML: 'Baixar',
        style: 'background:#16a34a;'
    });
    
    buttonsContainer.appendChild(cancelBtn);
    buttonsContainer.appendChild(confirmBtn);
    
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(optionsContainer);
    modalContent.appendChild(buttonsContainer);
    modalOverlay.appendChild(modalContent);
    
    document.body.appendChild(modalOverlay);
    
    // Função para remover o modal
    function removeModal() {
        const modal = document.getElementById('exportModalOverlay');
        if (modal) {
            document.body.removeChild(modal);
        }
    }

    // Eventos dos botões
    cancelBtn.onclick = removeModal;
    
    confirmBtn.onclick = function() {
        const selectedType = document.querySelector('input[name="exportType"]:checked').value;
        removeModal();
        exportVotesFunc(selectedType);
    };
}

// Função de exportação corrigida e completa
function exportVotesFunc(exportType = 'all') {
    if (isExporting) return;
    isExporting = true;
    console.log(`Iniciando exportação: ${exportType}`); // Log para depuração

    const data = getStorageData();
    if (Object.keys(data).length === 0) {
        alert("Nenhum dado para exportar ainda.");
        isExporting = false;
        console.log("Exportação cancelada: sem dados.");
        return;
    }

    const sentimentoLabels = {
        1: 'Muito Triste',
        2: 'Triste',
        3: 'Neutro',
        4: 'Feliz',
        5: 'Muito Feliz'
    };

    // Preparar dados para exportação
    let csvRows = ["Data,Tipo,Sentimento,Votos"];
    let resumo = "";
    let jsonData = [];

    for (const dia in data) {
        // Validar formato da data antes de usar
        let dataFormatadaBR;
        try {
            // Tenta criar um objeto Date. Adiciona 'T00:00:00Z' para tratar como UTC.
            const dateObj = new Date(dia + 'T00:00:00Z'); 
            if (isNaN(dateObj.getTime())) throw new Error('Data inválida');
            dataFormatadaBR = formatDateBR(dateObj);
        } catch (e) {
            console.error(`Data inválida encontrada no localStorage: ${dia}. Pulando esta entrada. Erro: ${e.message}`);
            continue; // Pula para a próxima iteração se a data for inválida
        }

        for (const tipo in data[dia]) {
            // Garante que 'tipo' é 'aluno' ou 'professor'
            if (tipo !== 'aluno' && tipo !== 'professor') continue;
            let tipoNom = tipo === "aluno" ? "Aluno" : "Professor";
            for (const val in data[dia][tipo]) {
                 // Garante que 'val' é uma chave de sentimento válida (1 a 5)
                if (!sentimentoLabels[val]) continue;
                const votos = data[dia][tipo][val] || 0; // Garante que votos seja um número
                
                if (votos > 0) {
                    resumo += `${tipoNom} votou "${sentimentoLabels[val]}" ${votos}x (${dataFormatadaBR})\n`;
                }
                csvRows.push(`${dataFormatadaBR},${tipoNom},${sentimentoLabels[val]},${votos}`);

                // Adicionar ao JSON apenas se houver votos
                if (votos > 0) { 
                    jsonData.push({
                        data: dataFormatadaBR,
                        tipo: tipoNom,
                        sentimento: sentimentoLabels[val],
                        valor: votos
                    });
                }
            }
        }
    }

    if (resumo === "") resumo = "Nenhum voto computado ainda.";

    let downloadsInitiated = 0;
    let expectedDownloads = 0;
    if (exportType === 'csv') expectedDownloads = 1;
    if (exportType === 'json') expectedDownloads = 1;
    if (exportType === 'img') expectedDownloads = 1;
    if (exportType === 'all') expectedDownloads = 3;

    // Função auxiliar para criar e clicar no link de download
    function triggerDownload(blob, filename) {
        try {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link); // Necessário para Firefox
            link.click();
            document.body.removeChild(link); // Limpar
            URL.revokeObjectURL(url);
            console.log(`Download iniciado: ${filename}`); // Log para depuração
            downloadsInitiated++;
        } catch (err) {
            console.error(`Erro ao iniciar download para ${filename}:`, err);
            alert(`Erro ao tentar baixar o arquivo ${filename}. Verifique o console.`);
        } finally {
             // Resetar isExporting após a última tentativa de download esperada (exceto imagem)
            if (exportType !== 'img' && exportType !== 'all' && downloadsInitiated >= expectedDownloads) {
                isExporting = false;
                console.log(`Exportação (${exportType}) concluída, isExporting resetado.`);
            }
        }
    }

    // Exportar conforme o tipo selecionado
    if (exportType === 'csv' || exportType === 'all') {
        if (csvRows.length > 1) { // Verifica se há dados além do cabeçalho
            const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" }); // Adicionado BOM para Excel
            triggerDownload(blob, "vibes_do_dia.csv");
        } else {
             console.log("Nenhum dado CSV para exportar.");
             if (exportType === 'csv') alert("Nenhum dado para exportar como CSV.");
             if (exportType === 'all') expectedDownloads--; // Reduz o número esperado se não houver CSV
        }
    }

    if (exportType === 'json' || exportType === 'all') {
        if (jsonData.length > 0) {
            const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json;charset=utf-8;" });
            triggerDownload(jsonBlob, "vibes_do_dia.json");
        } else {
            console.log("Nenhum dado JSON para exportar.");
            if (exportType === 'json') alert("Nenhum dado para exportar como JSON.");
            if (exportType === 'all') expectedDownloads--; // Reduz o número esperado se não houver JSON
        }
    }

    if (exportType === 'img' || exportType === 'all') {
        if (!humorChart) {
            alert("Gráfico não inicializado, não é possível exportar imagem.");
            if (exportType === 'img') isExporting = false;
            if (exportType === 'all') expectedDownloads--;
        } else {
            // Capturar tela com gráfico
            try {
                console.log("Tentando capturar a tela com html2canvas..."); // Log para depuração
                humorChart.update(); // Forçar atualização do gráfico
                html2canvas(document.querySelector('.container'), {
                    useCORS: true,
                    scale: 2,
                    logging: true // Ativar logs para depuração
                }).then(canvas => {
                    console.log("html2canvas concluído com sucesso."); // Log para depuração
                    // Adicionar um pequeno atraso para garantir que a renderização esteja completa
                    setTimeout(() => {
                        canvas.toBlob(function(blob) {
                            if (blob) {
                                triggerDownload(blob, 'vibes_do_dia.png');
                            } else {
                                console.error("Erro ao converter canvas para Blob.");
                                alert("Erro ao gerar a imagem PNG.");
                            }
                            // Resetar isExporting apenas após a conclusão da imagem (ou falha)
                            downloadsInitiated++; // Incrementa mesmo se falhar a conversão para blob
                            if (downloadsInitiated >= expectedDownloads) {
                               isExporting = false;
                               console.log("Exportação (imagem) concluída/falhou, isExporting resetado.");
                            }
                        }, 'image/png');
                    }, 500); // Atraso de 500ms
                }).catch(err => {
                    console.error('Erro ao capturar a tela com html2canvas:', err);
                    alert('Erro ao capturar a tela. Verifique o console para mais detalhes.');
                    downloadsInitiated++; // Incrementa mesmo em caso de erro
                    if (downloadsInitiated >= expectedDownloads) {
                        isExporting = false; // Resetar em caso de erro
                        console.log("Exportação (imagem) falhou (catch html2canvas), isExporting resetado.");
                    }
                });
            } catch (err) {
                console.error('Erro geral ao tentar exportar imagem:', err);
                alert('Erro ao exportar imagem. Verifique o console para mais detalhes.');
                downloadsInitiated++; // Incrementa mesmo em caso de erro
                if (downloadsInitiated >= expectedDownloads) {
                    isExporting = false; // Resetar em caso de erro
                    console.log("Exportação (imagem) falhou (catch geral), isExporting resetado.");
                }
            }
        }
    } else {
        // Se não for exportar imagem e não for 'all', resetar isExporting se todos os downloads esperados foram iniciados
        if (exportType !== 'all' && downloadsInitiated >= expectedDownloads) {
            isExporting = false;
            console.log(`Exportação (${exportType}) concluída (sem imagem), isExporting resetado.`);
        }
    }

    // Mostrar resumo apenas se não for exportação de imagem e houver dados
    if (exportType !== 'img' && resumo !== "Nenhum voto computado ainda.") {
         // Usar setTimeout para garantir que o alerta apareça após os downloads iniciarem
         setTimeout(() => {
            alert("Resumo dos dados:\n\n" + resumo + "\n\nDownloads iniciados.");
         }, 100);
    } else if (exportType !== 'img' && resumo === "Nenhum voto computado ainda." && (exportType === 'csv' || exportType === 'json')) {
         // Alerta específico se tentou exportar CSV/JSON e não havia dados
         setTimeout(() => {
            alert(resumo);
         }, 100);
    }
}


// AVISO AO SAIR (Opcional, pode ser irritante para o usuário)
/*
window.addEventListener('beforeunload', function (e) {
    // Verifica se há dados não salvos ou ações em andamento, se necessário
    // e.preventDefault(); // Padrão para mostrar prompt
    // e.returnValue = ''; // Necessário para alguns navegadores
});
*/

// INICIALIZAÇÃO
// Garante que o DOM está pronto antes de inicializar
document.addEventListener('DOMContentLoaded', (event) => {
    // Chama updateChartAndTotals apenas se humorChart foi inicializado com sucesso
    if (humorChart) {
        updateChartAndTotals(formatDate(today));
    } else {
        console.error("Gráfico não inicializado, não foi possível chamar updateChartAndTotals na inicialização.");
    }
});


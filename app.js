// Função para gerar e baixar a planilha CSV
function generateAndDownloadCSV() {
    const data = getStorageData();
    const sentimentoLabels = {
        1: 'Muito Triste',
        2: 'Triste',
        3: 'Neutro',
        4: 'Feliz',
        5: 'Muito Feliz'
    };

    let csvRows = ["Data,Tipo,Sentimento,Votos"];
    for (const dia in data) {
        for (const tipo in data[dia]) {
            let tipoNom = tipo === "aluno" ? "Aluno" : "Professor";
            for (const val in data[dia][tipo]) {
                if (data[dia][tipo][val] > 0) {
                    csvRows.push(`${formatDateBR(new Date(dia))},${tipoNom},${sentimentoLabels[val]},${data[dia][tipo][val]}`);
                }
            }
        }
    }

    if (csvRows.length === 1) {
        alert("Nenhum voto computado para exportar.");
        return;
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `votos_feira_${formatDate(new Date())}.csv`;
    a.click();
}

// Modificar o evento do atalho Ctrl + D + S
let ctrlDown = false;
let dPressed = false;
window.addEventListener('keydown', function(e) {
    if (e.key === "Control") ctrlDown = true;
    if (ctrlDown && e.key.toLowerCase() === 'd') {
        dPressed = true;
    }
    if (ctrlDown && dPressed && e.key.toLowerCase() === 's') {
        generateAndDownloadCSV();
        ctrlDown = false;
        dPressed = false;
    }
});
window.addEventListener('keyup', function(e) {
    if (e.key === "Control") ctrlDown = false;
    if (e.key.toLowerCase() === 'd') dPressed = false;
});

// Gerar planilha ao tentar fechar a página
window.addEventListener('beforeunload', function (e) {
    generateAndDownloadCSV();
    e.preventDefault();
    e.returnValue = '';
});

// Remover o botão de exportação, já que não será mais necessário
exportBtn.remove();
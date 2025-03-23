// Parancsok keresése
function searchFunction() {
    const input = document.getElementById("pInput");
    const filter = input.value.toUpperCase();
    const table = document.querySelector(".commands");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].getElementsByTagName("td")[0];
        if (cell) {
            const cellClone = cell.cloneNode(true);
            
            const codeElements = cellClone.querySelectorAll("code");
            codeElements.forEach(code => code.remove());
            
            const txtValue = cellClone.textContent || cellClone.innerText;
            
            rows[i].style.display = txtValue.toUpperCase().includes(filter) ? "" : "none";
        }
    }
}

// Tooltip-pek kezelése
let paramTooltip = {};

fetch("https://raw.githubusercontent.com/sassvagyok/sasOS-data/main/parameterTooltips.json")
    .then(x => x.json())
    .then(data => {
        paramTooltip = data,
        addParameterTooltips();
    });

    function addParameterTooltips() {
        const commandRows = document.querySelectorAll("tr[data-command]");
        
        commandRows.forEach(row => {
            const commandAttr = row.getAttribute("data-command");
            const commandNames = commandAttr.split(" ");
            const codeElements = row.querySelectorAll("code:not([data-bs-toggle])");
            
            codeElements.forEach(code => {
                const paramName = code.textContent.trim();
                let tooltipText = "";
                
                for (let i = 0; i < commandNames.length; i++) {
                    tooltipText = paramTooltip[commandNames[i]]?.[paramName] || "";
                    if (tooltipText) break;
                }
                
                if (tooltipText) {
                    code.setAttribute("data-bs-toggle", "tooltip");
                    code.setAttribute("data-bs-html", "true");
                    code.setAttribute("title", tooltipText);
                }
            });
        });
        
        const tooltipTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle='tooltip']"));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

document.addEventListener("DOMContentLoaded", async function () {
    // Verziószám lekérése
    const fetchVersion = await fetch("https://api.github.com/repos/sassvagyok/sasOS-docs/commits/main");
    const fetchedVersionJson = await fetchVersion.json();

    document.getElementById("version").innerHTML = fetchedVersionJson.commit.message.indexOf("\n") > -1 ? fetchedVersionJson.commit.message.substring(0, fetchedVersionJson.commit.message.indexOf("\n")) : fetchedVersionJson.commit.message;
});
const version = document.querySelector("#version");
const changelog = document.querySelector("#changelog");
const accordionSearch = document.querySelector("#accordionSearch");
const accordionCollapses = document.querySelectorAll(".offcanvas .accordion-collapse");
const anim = document.querySelectorAll(".anim");

// Parancsok keresése
accordionSearch.addEventListener("input", onSearch);

function onSearch() {
    const keyword = accordionSearch.value.trim().toLowerCase();

    accordionCollapses.forEach(collapse => {
        const lis = collapse.querySelectorAll("ul li");
        let hasVisibleItems = false;
        
        lis.forEach(li => {
            const text = li.textContent.toLowerCase();
            if (!keyword || text.includes(keyword)) {
                li.style.display = "";
                hasVisibleItems = true;
            } else li.style.display = "none";
        });

        if (hasVisibleItems) {
            if (!collapse.classList.contains("show")) new bootstrap.Collapse(collapse, { show: true });
        } else {
            if (collapse.classList.contains("show")) new bootstrap.Collapse(collapse, { toggle: true });
        }
    });
}

function onPageLoad() {
    displayVersion();
    loadChangelog();

    anim.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add("slide-in");
        }, 100 + i * 120);
    });
}

// Verziószám kiírása
async function displayVersion() {
    const fetchVersion = await fetch("https://api.github.com/repos/sassvagyok/sasBot-docs/commits/main");
    const fetchedVersionJson = await fetchVersion.json();

    version.innerHTML = fetchedVersionJson.commit.message.indexOf("\n") > -1 ? fetchedVersionJson.commit.message.substring(0, fetchedVersionJson.commit.message.indexOf("\n")) : fetchedVersionJson.commit.message;
}

// Változáslista kiírása
async function loadChangelog() {
    const fetchChangelog = await fetch("https://raw.githubusercontent.com/sassvagyok/sasBot-data/main/changelog.json");
    const fetchedChangelogJson = await fetchChangelog.json();

    let selectedChangelog = fetchedChangelogJson.find(x => x.version === fetchedChangelogJson[fetchedChangelogJson.length - 1].version);

    let formattedChangelog = `<h3 class="changelog">${selectedChangelog.version} | <code>${selectedChangelog.date}</code></h3>`;
    formattedChangelog += `<p>${formatChangelog(removeDashHashLines(selectedChangelog.changelog))}</p>`;

    if (selectedChangelog.subversions && selectedChangelog.subversions.length > 0) {
        for (let i = 0; i < selectedChangelog.subversions.length; i++) {
            const subversion = selectedChangelog.subversions[i];
            formattedChangelog += `<hr><h3 class="changelog">${subversion.version} | <code>${subversion.date}</code></h3>`;
            formattedChangelog += `<p>${formatChangelog(removeDashHashLines(subversion.changelog))}</p>`;
        }
    }

    changelog.innerHTML = formattedChangelog;
}

// Changelog formázása
function formatChangelog(text) {
    if (typeof marked !== "undefined") {
        return marked.parse(text);
    }
    
    return text;
}

function removeDashHashLines(text) {
    return text.replace(/^-#\s?/gm, "\n");
}

onPageLoad();
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

document.addEventListener("DOMContentLoaded", async function () {
    // Verziószám lekérése
    const fetchVersion = await fetch("https://api.github.com/repos/sassvagyok/sasBot-docs/commits/main");
    const fetchedVersionJson = await fetchVersion.json();
    
    document.getElementById("version").innerHTML = fetchedVersionJson.commit.message.indexOf("\n") > -1 ? fetchedVersionJson.commit.message.substring(0, fetchedVersionJson.commit.message.indexOf("\n")) : fetchedVersionJson.commit.message;

    // Változáslista kezelése
    const fetchChangelog = await fetch("https://raw.githubusercontent.com/sassvagyok/sasBot-data/main/changelog.json");
    const fetchedChangelogJson = await fetchChangelog.json();

    let selectedChangelog = fetchedChangelogJson.find(x => x.version == fetchedChangelogJson[fetchedChangelogJson.length - 1].version);
    
    let formattedChangelog = `<h3 class="changelog">${selectedChangelog.version}</h3>`;
    formattedChangelog += `<p class="date">${selectedChangelog.date}</p>`
    formattedChangelog += `<p class="changelog">${formatChangelog(removeDashHashLines(selectedChangelog.changelog))}</p>`;
    
    if (selectedChangelog.subversions && selectedChangelog.subversions.length > 0) {
        for (let i = 0; i < selectedChangelog.subversions.length; i++) {
            const subversion = selectedChangelog.subversions[i];
            formattedChangelog += `<hr><h3 class="changelog">${subversion.version}</h3>`;
            formattedChangelog += `<p class="date">${subversion.date}</p>`
            formattedChangelog += `<p class="changelog">${formatChangelog(removeDashHashLines(subversion.changelog))}</p>`;
        }
    }
    
    const changelogElem = document.getElementById("changelog");
    if (changelogElem) {
        changelogElem.innerHTML = formattedChangelog;
    }

    // Animáció betöltéskor
    document.querySelectorAll(".anim").forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('slide-in');
        }, 100 + i * 120);
    });

    // Parancs keresés
    const searchInput = document.getElementById("accordionSearch");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const keyword = searchInput.value.trim().toLowerCase();

            const accordionCollapses = document.querySelectorAll('.offcanvas .accordion-collapse');
            accordionCollapses.forEach(collapse => {
                const lis = collapse.querySelectorAll('ul li');
                let hasVisibleItems = false;
                
                lis.forEach(li => {
                    const text = li.textContent.toLowerCase();
                    if (!keyword || text.includes(keyword)) {
                        li.style.display = '';
                        hasVisibleItems = true;
                    } else {
                        li.style.display = 'none';
                    }
                });

                if (hasVisibleItems) {
                    if (!collapse.classList.contains("show")) {
                        new bootstrap.Collapse(collapse, { show: true });
                    }
                } else {
                    if (collapse.classList.contains("show")) {
                        new bootstrap.Collapse(collapse, { toggle: true });
                    }
                }
            });
        });
    }
});
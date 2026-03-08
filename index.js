const version = document.querySelector("#version");
const changelog = document.querySelector("#changelog");
const accordionSearch = document.querySelector("#accordionSearch");
const accordionCollapses = document.querySelectorAll(".offcanvas .accordion-collapse");
const anim = document.querySelectorAll(".anim");
const pageTitle = document.querySelector("title");
const accordionMod = document.querySelector("#flush-mod .accordion-body");
const accordionMusic = document.querySelector("#flush-music .accordion-body");
const accordionConfig = document.querySelector("#flush-config .accordion-body");
const accordionMisc = document.querySelector("#flush-misc .accordion-body");
const accordionInfo = document.querySelector("#flush-info .accordion-body");
const accordionButtonMod = document.querySelector("#button-mod");
const accordionButtonMusic = document.querySelector("#button-music");
const accordionButtonConfig = document.querySelector("#button-config");
const accordionButtonMisc = document.querySelector("#button-misc");
const accordionButtonInfo = document.querySelector("#button-info");
const navbarTop = document.querySelector(".navbar-collapse")

accordionSearch.addEventListener("input", onSearch);

async function offcanvas() {
    let fetchCommands = await fetch("/commands.json");

    const fetchedCommandsJson = await fetchCommands.json();
    const currentPage = pageTitle.innerHTML.split(" ")[0].toLowerCase();

    const accordions = [accordionMod, accordionMusic, accordionConfig, accordionMisc, accordionInfo];
    const buttons = [accordionButtonMod, accordionButtonMusic, accordionButtonConfig, accordionButtonMisc, accordionButtonInfo];
    const buttonTags = ["Moderáció", "Zenehallgatás", "Konfiguráció", "Sokszínű", "Információ"];

    for (let i = 0; i < fetchedCommandsJson.length; i++) {
        buttons[i].innerHTML = `${buttonTags[i]} - ${fetchedCommandsJson[i].length}`;
        accordions[i].innerHTML = `<ul>${fetchedCommandsJson[i].map(x => `<li><a href="/commands/${x}.html" class="${x === currentPage ? "active" : ""}">${x.charAt(0).toUpperCase() + x.slice(1)}</a></li>`).join("")}</ul>`;
    }
}

function navbar() {
    navbarTop.innerHTML += `<ul class="navbar-nav flex-fill justify-content-end">
                                <li class="nav-item">
                                    <a class="nav-link" href="https://github.com/sassvagyok/sasBot" target="_blank" title="sasBot Github"><i class="fa-brands fa-github fa-2xl"></i></a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link invite" href="https://discord.com/oauth2/authorize?client_id=742556187425505312&permissions=1099816889494&integration_type=0&scope=bot+applications.commands" target="_blank" title="sasBot meghívása"><i class="fa-solid fa-plus"></i></a>
                                </li>
                            </ul>`;
}

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
    offcanvas();
    navbar();

    anim.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add("slide-in");
        }, 100 + i * 120);
    });
}

async function displayVersion() {
    const fetchVersion = await fetch("https://api.github.com/repos/sassvagyok/sasBot-docs/commits/main");
    const fetchedVersionJson = await fetchVersion.json();

    version.innerHTML = fetchedVersionJson.commit.message.indexOf("\n") > -1 ? fetchedVersionJson.commit.message.substring(0, fetchedVersionJson.commit.message.indexOf("\n")) : fetchedVersionJson.commit.message;
}

async function loadChangelog() {
    if (!changelog) return;
    const fetchChangelog = await fetch("https://raw.githubusercontent.com/sassvagyok/sasBot/refs/heads/main/data/changelog.json");
    const fetchedChangelogJson = await fetchChangelog.json();

    let selectedChangelog = fetchedChangelogJson.find(x => x.version === fetchedChangelogJson[fetchedChangelogJson.length - 1].version);

    const date = new Date(selectedChangelog.date * 1000);
    const formattedDate = date.toLocaleDateString('hu-HU');

    let formattedChangelog = `<h3 class="changelog">${selectedChangelog.version} | <code>${formattedDate}</code></h3>`;
    formattedChangelog += `<p>${formatChangelog(removeDashHashLines(selectedChangelog.changelog))}</p>`;

    changelog.innerHTML = formattedChangelog;
}

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
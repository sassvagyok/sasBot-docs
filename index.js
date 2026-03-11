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
const navbarTop = document.querySelector(".navbar-collapse");

accordionSearch.addEventListener("input", onSearch);

async function offcanvas() {
    const fetchCommands = await fetch("/commands.json");
    const fetchedCommandsJson = await fetchCommands.json();
    const currentPage = pageTitle.innerHTML.split(" ")[0].toLowerCase();
    const accordions = [accordionMod, accordionMusic, accordionConfig, accordionMisc, accordionInfo];
    const buttons = [accordionButtonMod, accordionButtonMusic, accordionButtonConfig, accordionButtonMisc, accordionButtonInfo];
    const categories = {
        miscellaneous: "Sokszínű",
        moderation: "Moderáció",
        information: "Információ",
        music: "Zenelejátszás",
        configuration: "Konfiguráció"
    }

    const keys = Object.keys(fetchedCommandsJson);
    for (let i = 0; i < keys.length; i++) {
        const cmds = fetchedCommandsJson[keys[i]];
        for (let j = 0; j < cmds.length; j++) {
            buttons[i].innerHTML = `${categories[keys[i]]} (${cmds.length})`;
            accordions[i].innerHTML = `<ul>${cmds.map(x => `<li><a href="/commands/${x}.html" class="${x === currentPage ? "active" : ""}">${x.charAt(0).toUpperCase() + x.slice(1)}</a></li>`).join("")}</ul>`;
        }
    }
}

function navbar() {
    navbarTop.innerHTML +=
    `<ul class="navbar-nav flex-fill justify-content-end">
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
        const item = collapse.closest(".accordion-item");

        if (!keyword) {
            lis.forEach(li => li.style.display = "");
            item.style.display = "";
            if (collapse.classList.contains("show")) {
                bootstrap.Collapse.getOrCreateInstance(collapse, { toggle: false }).hide();
            }
            return;
        }

        let hasVisibleItems = false;
        
        lis.forEach(li => {
            const text = li.textContent.toLowerCase();
            if (text.includes(keyword)) {
                li.style.display = "";
                hasVisibleItems = true;
            } else li.style.display = "none";
        });

        if (hasVisibleItems) {
            if (!collapse.classList.contains("show")) {
                bootstrap.Collapse.getOrCreateInstance(collapse, { toggle: false }).show();
            }
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}

const animationObserver = new IntersectionObserver(entries => {
    entries
    .filter(entry => entry.isIntersecting)
    .forEach(entry => {
        entry.target.classList.add("visible");
        animationObserver.unobserve(entry.target);
    });
});

anim.forEach(elem => {
    animationObserver.observe(elem);
});

function onPageLoad() {
    displayVersion();
    loadChangelog();
    offcanvas();
    navbar();

    // anim.forEach((el, i) => {
    //     setTimeout(() => {
    //         el.classList.add("slide-in");
    //     }, 100 + i * 120);
    // });
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

    let currentChangelog = fetchedChangelogJson.find(x => x.version === fetchedChangelogJson[fetchedChangelogJson.length - 1].version);

    const date = new Date(currentChangelog.date * 1000);
    const formattedDate = date.toLocaleDateString('hu-HU');

    let formattedChangelog = `<h3 class="changelog">${currentChangelog.version} | <code>${formattedDate}</code></h3>`;
    formattedChangelog += `<p>${formatChangelog(currentChangelog.changelog)}</p>`;

    changelog.innerHTML = formattedChangelog;
}

function formatChangelog(text) {
    text = text.replace(/^-#\s?/gm, "\n");
    if (typeof marked !== "undefined") {
        return marked.parse(text);
    }
    
    return text;
}

onPageLoad();
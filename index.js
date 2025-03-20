function searchFunction() {
    let input, filter, table, tr, td, i, txtValue;

    input = document.getElementById("pInput");
    filter = input.value.toUpperCase();
    table = document.querySelector(".commands");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];

        if (td) {
            txtValue = td.textContent || td.innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const fetchVersion = await fetch("https://api.github.com/repos/sassvagyok/sasOS-docs/commits/main");
    const fetchedVersionJson = await fetchVersion.json();

    document.getElementById("version").innerHTML = fetchedVersionJson.commit.message.indexOf('\n') > -1 ? fetchedVersionJson.commit.message.substring(0, fetchedVersionJson.commit.message.indexOf('\n')) : fetchedVersionJson.commit.message;
});
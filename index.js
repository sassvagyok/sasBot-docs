function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();

let button = document.getElementById("topButton");
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

function searchFunction() {
  var input, filter, tr, td, i;
  input = document.getElementById("pInput");
  filter = input.value.toUpperCase();

  for (i = 0; i < coll.length; i++) {
    coll[i].classList.toggle("active");
      var content = coll[i].nextElementSibling;
      if(filter.length > 0){
        content.style.display = "block";
      } else {
        content.style.display = "none";
      }
  }

  tables = document.querySelectorAll(".parancsok")

  tables.forEach(function(table) {
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        if (!tr[i].classList.contains('header')) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
              txtValue = td.textContent || td.innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[0].style.display = "";
                tr[i].style.display = "";
              } else {
                tr[i].style.display = "none";
              }
            }
          }
    }
}); 
}

document.addEventListener("DOMContentLoaded", async function(){
    const fetched = await fetch(`https://api.github.com/repos/sassvagyok/sasOS-docs/commits/main`)
    const res = await fetched.json()
    document.getElementById('message').innerHTML = res.commit.message.indexOf('\n') > -1 ? res.commit.message.substring(0, res.commit.message.indexOf('\n')) : res.commit.message
})
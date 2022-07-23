// ----------  S O R T B Y   B U T T O N  ----------------
function sortbyButton (){
    document.querySelector("#sortby ul").classList.toggle("active");
};

function sortBy (value){
    document.getElementById("sortInput").value = value;
    document.getElementById("filterForm").submit();
};

function filter_search_open (i){
    var target = document.querySelectorAll(".filter-group > input");
    target[i].classList.toggle("active");
};

function filter_search_close (e){
    e.classList.remove("active");
};

function fltr_showMore (i){
    var target = document.getElementsByClassName("filter-list")[i];
    var a = target.getElementsByTagName("ul");
    for(j=0; j<a.length; j++){
        a[j].style.maxHeight="unset";
    };
    document.getElementsByClassName("fltr-showMore")[i].classList.add("hide");
    document.getElementsByClassName("fltr-showLess")[i].classList.remove("hide");
};

function fltr_showLess (i){
    var target = document.getElementsByClassName("filter-list")[i];
    document.getElementsByClassName("fltr-showMore")[i].classList.remove("hide");
    document.getElementsByClassName("fltr-showLess")[i].classList.add("hide");
    var a = target.getElementsByTagName("ul");
    for(j=0; j<a.length; j++){
        a[j].style.maxHeight="11rem";
    };
};

const fltr_checkBox = document.querySelectorAll(".filter-list input");
var selectedFilters = document.getElementById("selected-filters");
for(i=0; i<fltr_checkBox.length; i++){
    if(fltr_checkBox[i].checked){
        var fltrName = fltr_checkBox[i].nextElementSibling.innerHTML;
        selectedFilters.innerHTML += `<li>${fltrName}<i class="fa fa-times" onclick="removeFltr(${i})"></i></li>`;
    };
};

function removeFltr(i){
    fltr_checkBox[i].checked = false;
    fltr_checkBox[i].form.submit();
};

(function searchFilters(){
    const fltr_search = document.querySelectorAll(".filter-group > input");
    for(i=0; i<fltr_search.length; i++){
        fltr_search[i].addEventListener("input", (e)=>{
            var searchValue = e.target.value.toLowerCase();
            var fg = e.target.parentElement;
            var items = fg.getElementsByTagName("li");
            for(j=0; j<items.length; j++){
                if (items[j].innerText.toLowerCase().includes(searchValue)) {
                    items[j].style.display = "block";
                }else{
                    items[j].style.display = "none";
                }
            }
        })
    };
})();

(function checkedFiltersOnTop () {
    const filterList = document.querySelectorAll(".filter-list ul");

    filterList.forEach(function (ul) {

        var arrListItems = ul.children;
        
        for (var i = 0; i < arrListItems.length; i++) {
            if (arrListItems[i].querySelector("input").checked) {
                ul.prepend(arrListItems[i]);
            };
        }
    });
})();

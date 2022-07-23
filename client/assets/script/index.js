function tab_list (i){
    const tabButton_list = document.querySelectorAll("#how-it-works li");
    const tabContents_list_mobile = document.querySelectorAll("#how-it-works ol .describe-item");
    const tabContents_list_pc = document.querySelector("#how-it-works .content > .describe-item");
    for(a=0; a<tabContents_list_mobile.length; a++){
        tabButton_list[a].classList.remove("active");
        tabContents_list_mobile[a].classList.remove("active");
    }
    tabButton_list[i].classList.add("active");
    tabContents_list_mobile[i].classList.add("active")
    tabContents_list_pc.innerHTML = tabContents_list_mobile[i].innerHTML;
}

var carousalClickedIndex_doctors=0;
const carousalRadio = document.querySelectorAll("#doctors .carousal-radios span");
function carousal_doctor(i){
    const doctorGroup = document.getElementsByClassName("doctor-group");
    carousalClickedIndex_doctors=i;
    for(a=0; a<carousalRadio.length; a++){
        carousalRadio[a].classList.remove("active");
        doctorGroup[a].classList.remove("active");
    }
    carousalRadio[i].classList.add("active");
    doctorGroup[i].classList.add("active");
}

var carousalClickedIndex_gallary=0
const carousal_gall_Radio = document.querySelectorAll("#featured-medical-treatment .carousal-radios span");
function carousal_gallary(i){
    const gallaryGroup = document.getElementsByClassName("gallary-group");
    carousalClickedIndex_gallary=i;
    for(a=0; a<carousal_gall_Radio.length; a++){
        carousal_gall_Radio[a].classList.remove("active");
        gallaryGroup[a].classList.remove("active");
    }
    carousal_gall_Radio[i].classList.add("active");
    gallaryGroup[i].classList.add("active");
}

setInterval(()=>{
    carousalClickedIndex_doctors++;
    carousalClickedIndex_gallary++;
    if(carousalClickedIndex_doctors===4) carousalClickedIndex_doctors=0;
    if(carousalClickedIndex_gallary===3) carousalClickedIndex_gallary=0;
    carousalRadio[carousalClickedIndex_doctors].click();
    carousal_gall_Radio[carousalClickedIndex_gallary].click();
}, 4000);

async function loadSearchValues(val){

    val.trim();
    var container = document.querySelector(".search-input-container");

    if(val.length>0){
        var res = await fetch("/searchSuggestions?search="+val);
        if(res.ok){
            var result = await res.json();
            var ul = document.createElement("ul");
            ul.setAttribute("class", "searchSuggestions");
            val = val.toLowerCase();

            for(var i=0; i<result.length; i++) {
                if (result[i].name.toLowerCase().includes(val)) {
                    ul.innerHTML += `<li onclick="window.location.href='/doctorsProfile?doctorId=${result[i]._id}'"><span>${result[i].name}</span><small>doctor</small></li>`;
                };
                for(var j=0; j<result[i].hospitals.length; j++){
                    if (result[i].hospitals[j].toLowerCase().includes(val) && !ul.innerHTML.includes(result[i].hospitals[j])) {
                        ul.innerHTML += `<li onclick="window.location.href='/doctors?hospitals=${result[i].hospitals[j]}'"><span>${result[i].hospitals[j]}</span><small>hospital</small></li>`;
                    };
                };
            };

            if(container.getElementsByTagName("ul")[0]) container.getElementsByTagName("ul")[0].remove();
            container.appendChild(ul);
        };
    }else{
        if(container.getElementsByTagName("ul")[0]) container.getElementsByTagName("ul")[0].remove();
    }
};
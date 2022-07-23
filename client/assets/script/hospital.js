countMoreTreatments();
function countMoreTreatments (){
    const famousTreatments = document.getElementsByClassName("famous-treatments");
    for(i=0; i<famousTreatments.length; i++){
        var more = famousTreatments[i].getElementsByClassName("hide");
        if(famousTreatments[i].children.length>6){
            famousTreatments[i].innerHTML += `<li onclick="showMoreTreatments(this)" class="more">+${more.length} more`;
        }
    }
}

function showMoreTreatments(li){
    var hiddenElems = li.parentElement.getElementsByClassName("hide");
    for(i=0; i<hiddenElems.length; i++){
        hiddenElems[i].style.display = "inline-block";
    }
    li.style.display="none";
}
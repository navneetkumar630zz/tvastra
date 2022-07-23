const moreServices = document.getElementById("more-services");
const leftBtn = moreServices.getElementsByTagName("i")[0];
const rightBtn = moreServices.getElementsByTagName("i")[1];
rightBtn.addEventListener("click", ()=>{
    var ms = moreServices.getElementsByClassName("card-group");
    for(i=0; i<ms.length; i++){
        if(ms[i].classList.contains("active")){
            ms[i].classList.remove("active");
            if(ms[i+1]){                
                ms[i+1].classList.add("active");
                ms[i+1].style.animation = "next 0.6s";
            }else{
                ms[0].classList.add("active");
                ms[0].style.animation = "next 0.6s";
            }
            break;
        }
    }
});
leftBtn.addEventListener("click", ()=>{
    var ms = moreServices.getElementsByClassName("card-group");
    for(i=0; i<ms.length; i++){
        if(ms[i].classList.contains("active")){
            ms[i].classList.remove("active");
            if(ms[i-1]){                
                ms[i-1].classList.add("active");
                ms[i-1].style.animation = "previous 0.6s";
            }else{
                ms[ms.length-1].classList.add("active");
                ms[ms.length-1].style.animation = "previous 0.6s";
            }
            break;
        }
    }
});
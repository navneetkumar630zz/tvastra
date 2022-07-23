const firstContent = document.getElementById("accordian").getElementsByTagName("ul")[0].getElementsByTagName("div")[0];
firstContent.style.maxHeight = firstContent.scrollHeight + "px";
const buttons = document.getElementById("accordian").getElementsByTagName("h4");
for(i=0; i<buttons.length; i++){
    buttons[i].addEventListener("click", function(){
        var content = this.nextElementSibling;
        this.classList.toggle("active");
        if(content.style.maxHeight){
            content.style.maxHeight = null;
        }else{
            content.style.maxHeight = content.scrollHeight + "px";
        }
    })
}
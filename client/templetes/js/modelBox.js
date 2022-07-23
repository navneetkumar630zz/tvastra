const ModelBoxBg = document.getElementsByClassName("model-box-background")[0];
const ModelBox = document.getElementsByClassName("model-box")[0];

function closeModelBox(){
    ModelBox.style.animation="none)";
    ModelBox.style.transform="scale(0)";
    setTimeout(()=>{
        ModelBoxBg.style.display="none";
    }, 100);
}
function openModelBox(param){
    ModelBoxBg.style.display="flex";
    ModelBox.style.transform="scale(1)";
    modelBoxParam = param; // global variable for further use
};
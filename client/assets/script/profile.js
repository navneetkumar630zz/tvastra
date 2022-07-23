const toaster = document.getElementsByClassName("toaster")[0];
if(toaster){
    const icon = toaster.getElementsByTagName("i")[0];
    const h5 = toaster.getElementsByTagName("h5")[0];
    const p = toaster.getElementsByTagName("p")[0];
    if(p.innerText=="Profile updated successfully"){
        h5.innerText = "Success";
        icon.classList.replace("fa-exclamation-circle", "fa-check-circle");
        toaster.classList.replace("danger", "success");
    }
}
var tagInput = document.querySelectorAll("input.tags-input");
for(i=0; i<tagInput.length; i++){
    new Tagify(tagInput[i], {
        duplicates: false,
        trim: true,
        maxTags: 5,
        originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(', ')
    });
}
const avtarImg = document.querySelector("#profile-photo-group img");
const avtarInput = document.getElementById("avtar");
avtarInput.addEventListener("change", avtarThumbnail, false);
function avtarThumbnail (){
    if(this.files.length){
        avtarImg.src = URL.createObjectURL(this.files[0]);
        avtarImg.onload = function(){
            URL.revokeObjectURL(this.src);
        }
    }
};

function togglePhoneEdit(inpElem){
    if(inpElem.readOnly) {
        inpElem.readOnly = false;
        inpElem.focus();
    }
    else inpElem.readOnly = true;
}
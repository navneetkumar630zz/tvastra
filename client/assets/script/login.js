// forgot password button
const forgotPassBtn = document.getElementById("forgotPassword");
if (forgotPassBtn){
    forgotPassBtn.addEventListener("click", () => {
        document.getElementById("password").required = false;
        forgotPassBtn.form.action = "/forgotPassword";
        forgotPassBtn.form.submit();
    })
};
const toaster = document.getElementsByClassName("toaster")[0];
if(toaster){
    const icon = toaster.getElementsByTagName("i")[0];
    const h5 = toaster.getElementsByTagName("h5")[0];
    const p = toaster.getElementsByTagName("p")[0];
    if(p.innerText=="Logout successful"){
        h5.innerText = "Success";
        icon.classList.replace("fa-exclamation-circle", "fa-check-circle");
        toaster.classList.replace("danger", "success");
    }
}
function show (elem){
    const password = document.getElementById("password");
    elem.style.display = "none";
    elem.nextElementSibling.style.display = "inline-block";
    password.type = "text";
}
function hide (elem){
    const password = document.getElementById("password");
    elem.style.display = "none";
    elem.previousElementSibling.style.display = "inline-block";
    password.type = "password";
}
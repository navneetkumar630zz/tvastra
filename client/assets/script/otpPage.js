
const resendBtn = document.getElementById("resend");
var n = 60;
setInterval(function(){
    if(n>0){
        n--;
        resendBtn.innerText = "Resend in " + n;
    }else{
        resendBtn.innerText = "Resend";
        resendBtn.removeAttribute('disabled');
        clearInterval();
    }
},1000)

function resend(){
    if(resendBtn.form.subject=="forgotPassword"){
        resendBtn.form.action = "/forgotPassword";
    }else if(resendBtn.form.subject=="loginWithOtp"){
        resendBtn.form.action = "/loginWithOtp";
    }
    resendBtn.form.submit();
}
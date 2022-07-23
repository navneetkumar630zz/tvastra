document.querySelector(".model-box button.danger").addEventListener("click", (e)=>{
    window.location.href="/cancelAppointment?appointmentId=" + modelBoxParam;
})
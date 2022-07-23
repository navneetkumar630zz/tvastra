const burger = document.getElementById("burger-icon");
const burgerClose = document.getElementById("burger-close-icon");
const header = document.querySelector("header .container");
burger.addEventListener("click", ()=>{
    header.style.transform = "translateY(0)";
    burgerClose.style.display = "block";
});
burgerClose.addEventListener("click", ()=>{
    header.style.transform = "translateY(-110%)";
    burgerClose.style.display = "none";
});
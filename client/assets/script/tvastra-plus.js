const testGroup = document.getElementsByClassName("test-card-group");
const carousalButton = document.querySelectorAll("#tests .carousal-radios span");
// function carousal_test_group (i){
//     for(j=0; j<carousalButton.length; j++){
//         carousalButton[j].classList.remove("active");
//         testGroup[j].classList.remove("active");
//     };
//     carousalButton[i].classList.add("active");
//     testGroup[i].classList.add("active");
// }
const previousButton = carousalButton[0];
const nextButton = carousalButton[1];
nextButton.addEventListener("click", ()=>{
    testGroup[0].classList.remove("active");
    testGroup[1].classList.add("active");
    testGroup[1].style.animation = "next 0.4s";
    previousButton.classList.remove("active");
    nextButton.classList.add("active");
});
previousButton.addEventListener("click", ()=>{
    testGroup[0].classList.add("active");
    testGroup[1].classList.remove("active");
    testGroup[0].style.animation = "previous 0.4s";
    nextButton.classList.remove("active");
    previousButton.classList.add("active");
});
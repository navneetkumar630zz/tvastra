(() => {
    let carousal_clickedTimes = 0;
    const carousalRightBtn = document.querySelectorAll(".carousal-btn-right.mobile");
    for (let i = 0; i < carousalRightBtn.length; i++) {
        carousalRightBtn[i].addEventListener("click", e => {
            if(carousal_clickedTimes!=3){
                carousal_clickedTimes++;
                const bookingDate = e.target.parentElement.getElementsByClassName("booking-date");
                for (let j = 0; j < bookingDate.length; j++) {
                    bookingDate[j].style.transform += "translateY(-100%)";
                }
            }
        });
    }
    const carousalLeftBtn = document.querySelectorAll(".carousal-btn-left.mobile");
    for (let i = 0; i < carousalLeftBtn.length; i++) {
        carousalLeftBtn[i].addEventListener("click", e => {
            if(carousal_clickedTimes!=0){
                carousal_clickedTimes--;
                const bookingDate = e.target.parentElement.getElementsByClassName("booking-date");
                for (let j = 0; j < bookingDate.length; j++) {
                    bookingDate[j].style.transform += "translateY(100%)";
                }
            }
        });
    }
    const carousalRightBtnTab = document.querySelectorAll(".carousal-btn-right.tablet");
    for (let i = 0; i < carousalRightBtnTab.length; i++) {
        carousalRightBtnTab[i].addEventListener("click", e => {
            if(carousal_clickedTimes!=3){
                carousal_clickedTimes++;
                const bookingDate = e.target.parentElement.getElementsByClassName("booking-date");
                for (let j = 0; j < bookingDate.length; j++) {
                    bookingDate[j].style.transform += "translateX(-100%)";
                }
            }
        });
    }
    const carousalLeftBtnTab = document.querySelectorAll(".carousal-btn-left.tablet");
    for (let i = 0; i < carousalLeftBtnTab.length; i++) {
        carousalLeftBtnTab[i].addEventListener("click", e => {
            if(carousal_clickedTimes!=0){
                carousal_clickedTimes--;
                const bookingDate = e.target.parentElement.getElementsByClassName("booking-date");
                for (let j = 0; j < bookingDate.length; j++) {
                    bookingDate[j].style.transform += "translateX(100%)";
                }
            }
        });
    }
})();

(function toggle_Schedules_And_Slots () {
    const booking = document.getElementsByClassName("booking");

    // Show schedules
    for (let i = 0; i < booking.length; i++) {
        const bookingDateBtn = booking[i].getElementsByClassName("booking-date");
        const timesGroup = booking[i].getElementsByClassName("booking-times-group");
        for (let j = 0; j < bookingDateBtn.length; j++) {
            bookingDateBtn[j].addEventListener("click", e => {
                for (a = 0; a < timesGroup.length; a++) {
                    timesGroup[a].classList.remove("active");
                    bookingDateBtn[a].classList.remove("active");
                }
                timesGroup[j].classList.add("active");
                bookingDateBtn[j].classList.add("active");
                booking[i].style.maxHeight = booking[i].scrollHeight + "px";
            });
        }
    }

    // Show slots
    const bookingBtn = document.getElementsByClassName("toggleBooking");
    for (let i = 0; i < bookingBtn.length; i++) {
        bookingBtn[i].addEventListener("click", e => {
            if (booking[i].style.maxHeight) {
                booking[i].style.maxHeight = null
                booking[i].style.marginTop = "0"
            } else {
                booking[i].style.maxHeight = booking[i].scrollHeight + "px";
                booking[i].style.marginTop = "1rem";
            }
        });
    }
})();

(function render_Today_And_Tommorrow() {
    var bookingDateElem = document.querySelectorAll(".booking-dates-group");
    bookingDateElem.forEach(element => {
        element.querySelector(".booking-date span").innerHTML = "Today";
        element.querySelectorAll(".booking-date span")[1].innerHTML = "Tommorrow";
    });
})();

(function hidePastHours() {
    const bookingDates = document.getElementsByClassName("booking-dates-group");
    const bookingTimesGroup = document.querySelectorAll(".booking .booking-times-group:nth-child(2)");
    const now = new Date();
    for (let i = 0; i < bookingTimesGroup.length; i++) {
        const times = bookingTimesGroup[i].getElementsByTagName("li");
        let count = 0;
        for (let j = 0; j < times.length; j++) {
            const time = times[j].innerText;
            let hour = Number(time.slice(0,2));
            if(hour < 12 && time.slice(6)=="PM") hour += 12;
            if(hour < now.getHours() || ( hour == now.getHours() && Number(time.slice(3,5)) < now.getMinutes() )){
                times[j].style.display = "none";
                count++
            }
        };
        var nSlots = bookingDates[i].getElementsByTagName("small")[0];
        nSlots.innerText = `${Number(nSlots.innerText.slice(0,2)) - count} Slots Available`;
    }
})();

(function renderNextButton(){
    const target = document.querySelectorAll(".booking-dates-group small");
    const bookingTimesGroup = document.getElementsByClassName("booking-times-group");
    for(i=0; i<target.length; i++){
        if(target[i].innerText=="0 Slots Available"){
            bookingTimesGroup[i].innerHTML = `
            <div class="no-slots">
                <span>No slots available</span>
                <button class="btn-text next-slot-btn" onclick="goToNextAvailableSlot(this.parentElement.parentElement.parentElement)" >Go to next available slot</button>
            </div>`;
        };
    }
})();

function goToNextAvailableSlot(elem) {
    console.log(elem)
    const bookingDate = elem.getElementsByClassName("booking-date");
    var activeInd = 0;
    for (i = 0; i < bookingDate.length; i++) {
        if (bookingDate[i].classList.contains("active")) {
            activeInd = i;
        };
    };
    for (let i = activeInd; i < bookingDate.length; i++) {
        const small = bookingDate[i].querySelector("small");
        console.log(small);
        if (small.innerText.split(" ")[0] != 0) {
            bookingDate[i].click();
            return;
        };
    };
    alert("No schedule after this.");
    return;
}

function pageno(e, i) {
    e.preventDefault();
    document.getElementById("filterForm").action = "/doctors/" + i;
    document.getElementById("filterForm").submit();
};
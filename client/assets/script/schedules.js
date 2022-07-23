const scheduleTimes = document.getElementsByClassName("schedule-times");
function viewSlots (ind){
    if(scheduleTimes[ind].style.maxHeight){
        scheduleTimes[ind].style.maxHeight = null;
        scheduleTimes[ind].style.marginTop = null;
    }else{
        scheduleTimes[ind].style.marginTop = "2rem";
        scheduleTimes[ind].style.maxHeight = scheduleTimes[ind].scrollHeight + "px";
    }
};

const startTimeInput = document.querySelector("[name='startTime']");
const endTimeInput = document.querySelector("[name='endTime']");
const submitBtn = document.getElementById("createScheduleSubmitBtn");
const timeInputs = document.querySelector(".half-inputs");

[startTimeInput, endTimeInput].forEach(elem=>{

    elem.addEventListener("clocklet.closed", e=>{
        var message = document.createElement("small");
        if(moment(startTimeInput.value, "hh:mm A").isAfter(moment(endTimeInput.value, "hh:mm A")) || startTimeInput.value == endTimeInput.value){
            if(!submitBtn.disabled){
                submitBtn.disabled = true;
                message.innerText="Start time must be before endtime";
                timeInputs.append(message);
            }
        }else if(moment(startTimeInput.value, "hh:mm A").isBefore(moment("10:00 AM", "hh:mm A")) || moment(startTimeInput.value, "hh:mm A").isAfter(moment("10:00 PM", "hh:mm A")) || moment(endTimeInput.value, "hh:mm A").isAfter(moment("10:00 PM", "hh:mm A")) || moment(endTimeInput.value, "hh:mm A").isBefore(moment("10:00 AM", "hh:mm A"))){
            if(!submitBtn.disabled){
                submitBtn.disabled = true;
                message.innerText="Time must be between 10:00 AM to 10:00 PM";
                timeInputs.append(message);
            }
        }else{
            submitBtn.disabled = false;
            var errText = timeInputs.querySelector("small");
            if(errText){
                errText.remove()
            }
        }
    });
});

async function disableSlot(scheduleId, slotId, elem){
    var result = await fetch(`/disableSlot?scheduleId=${scheduleId}&slotId=${slotId}`);
    if(result.ok){
        if(await result.text()=="enabled"){
            elem.parentElement.classList.remove("disabled");
        }else{
            elem.parentElement.classList.add("disabled");
        }
    }
}
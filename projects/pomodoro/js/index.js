function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

"use strict";
var pomodoroClock = (function () {
    var workTime = document.querySelector("#workTime");
    var breakTime = document.querySelector("#breakTime");
    var startBtn = document.querySelector(".js-start-clock");
    var pauseBtn = document.querySelector(".js-pause-clock");
    var errMsg = document.querySelector(".js-err-msg");
    var sessionType = document.querySelector(".js-indicator");
    var intervalID = 0;
    var clockPaused = false;
    var isABreak = false;
    var tme;
    var promptChange = {
        workTime: false,
        breakTime: false
    };
    var validation = function (inputEvent) {
        var inputEle = inputEvent.target;
        var timeStr = inputEle.value;
        // specify time format as hh:mm:ss
        var re = /^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;
        // check length & characters
        if (timeStr.match(re) !== null) {
            promptChange[inputEle.id] = true;
            startBtn.disabled = false;
            pauseBtn.disabled = false;
            errMsg.innerText = '';
        }
        else {
            startBtn.disabled = true;
            pauseBtn.disabled = true;
            errMsg.innerText = "The format should be 'hh:mm:ss'";
        }
    };
    var readOnlyPrompts = function (bln) {
        if (bln) {
            workTime.readOnly = true;
            breakTime.readOnly = true;
        }
        else {
            workTime.readOnly = false;
            breakTime.readOnly = false;
        }
    };
    var startClock = function () {
        var clock = document.querySelector(".js-clock");
        // sets the clock's initial value
        var setTime = function (timeStr) {
            var newTme = new Date();
            var startTime = timeStr.split(':');
            var startTimeToNumbers = startTime.map(function (val) { return Number(val); });
            newTme.setHours.apply(newTme, startTimeToNumbers);
            clock.value = timeStr;
            return newTme;
        };
        // start the pomodoro clock countdown
        var countdown = function () {
            // handle transitions between work periods and break periods
            // mutiple date object functions in if statement used as a workaround
            // to handle Edge/IE bug when checking value of the clock input element.
            // (clock.value === '00:00:00' never returns 'true' in MS browsers)
            var alarmAudio = document.querySelector(".js-timer");
            if (tme.getHours() === 0 && tme.getMinutes() === 0 && tme.getSeconds() === 0) {
                clearInterval(intervalID);
                alarmAudio.play();
                if (!isABreak) {
                    isABreak = true;
                    sessionType.innerText = "Break Time";
                    tme = setTime(breakTime.value);
                }
                else {
                    isABreak = false;
                    sessionType.innerText = "Work Time";
                    tme = setTime(workTime.value);
                }
                intervalID = setInterval(countdown, 1000);
            }
            // decrement clock time by 1 second
            tme.setSeconds(tme.getSeconds() - 1);
            // display on the web document
            clock.value = tme.toLocaleTimeString('en-GB');
        };
        if (workTime.value === '00:00:00' || breakTime.value === '00:00:00') {
            errMsg.innerText = 'Be sure to enter a duration for each period!';
            return;
        }
        errMsg.innerText = '';
        startBtn.disabled = true;
        readOnlyPrompts(true);
        // ensure clock responds to user interaction
        if (!clockPaused) {
            tme = setTime(workTime.value);
            sessionType.innerText = "Work Time";
        }
        else if (promptChange.workTime && !isABreak) {
            tme = setTime(workTime.value);
        }
        else if (promptChange.breakTime && isABreak) {
            tme = setTime(breakTime.value);
        }
        clockPaused = false;
        promptChange.workTime = false;
        promptChange.breakTime = false;
        intervalID = setInterval(countdown, 1000);
    };
    var pauseClock = function () {
        clearInterval(intervalID);
        startBtn.disabled = false;
        readOnlyPrompts(false);
        clockPaused = true;
    };
    return {
        startClock: startClock,
        pauseClock: pauseClock,
        validation: validation,
    };
}());
document.querySelector('#workTime')
    .addEventListener('input', pomodoroClock.validation);
document.querySelector('#breakTime')
    .addEventListener('input', pomodoroClock.validation);
document.querySelector(".js-start-clock")
    .addEventListener("click", pomodoroClock.startClock);
document.querySelector(".js-pause-clock")
    .addEventListener("click", pomodoroClock.pauseClock);
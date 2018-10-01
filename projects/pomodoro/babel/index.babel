const pomodoroClock = (function () {
  "use strict";

  const workTime = document.querySelector(".workTime");
  const breakTime = document.querySelector(".breakTime");
  const startBtn = document.querySelector(".js-start-clock");
  const pauseBtn = document.querySelector(".js-pause-clock");
  const errMsg = document.querySelector(".js-err-msg");
  let intervalID = 0;
  let clockPaused = false;
  let isABreak = false;
  let promptChange = {'workTime': false, 'breakTime': false};
  let tme;

  const validation = (inputEvent) => {
    const inputEle = inputEvent.target;
    const timeStr = inputEle.value;
    // specify time format as hh:mm:ss
    const re = /^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;

    // check length & characters
    if (timeStr.match(re) !== null) {
      promptChange[inputEle.className] = true;
      startBtn.disabled = false;
      pauseBtn.disabled = false;
      inputEle.style.background = '#FFFFFF';
      errMsg.innerText = '';
    } else {
      startBtn.disabled = true;
      pauseBtn.disabled = true;
      inputEle.style.background = '#C02424';
      errMsg.innerText = 'hh:mm:ss';
    }
  };

  const readOnlyPrompts = (bln) => {
    if (bln) {
      workTime.readOnly = true;
      breakTime.readOnly = true;
    } else {
      workTime.readOnly = false;
      breakTime.readOnly = false;
    }
  };

  const startClock = () => {
    const clock = document.querySelector(".js-clock");

    // converts a time string to a date value, and sets the clock's initial value
    const setTime = (timeStr) => {
      const newTme = new Date();
      const startTimeArr = timeStr.split(':');

      newTme.setHours(...startTimeArr);
      clock.value = timeStr;

      return newTme;
    };

    // start the pomodoro clock countdown
    const countdown = () => {
      // handle transitions between work periods and break periods
      // mutiple date object functions in if statement used as a workaround
      // to handle Edge/IE bug when checking value of the clock input element.
      // (clock.value === '00:00:00' never returns 'true' in MS browsers)
      if (tme.getHours() === 0 && tme.getMinutes() === 0 && tme.getSeconds() === 0) {
        clearInterval(intervalID);
        document.querySelector(".js-timer").play();
        if (!isABreak) {
          isABreak = true;
          document.querySelector(".js-indicator").innerText = "Break Time";
          tme = setTime(breakTime.value);
        } else {
          isABreak = false;
          document.querySelector(".js-indicator").innerText = "Work Time";
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
      document.querySelector(".js-indicator").innerText = "Work Time";
    } else if (promptChange.workTime && !isABreak) {
      tme = setTime(workTime.value);
    } else if (promptChange.breakTime && isABreak) {
      tme = setTime(breakTime.value);
    }

    clockPaused = false;
    promptChange.workTime = false;
    promptChange.breakTime = false;
    intervalID = setInterval(countdown, 1000);
  };

  const pauseClock = () => {
    clearInterval(intervalID);
    startBtn.disabled = false;
    readOnlyPrompts(false);
    clockPaused = true;
  };

  return {
    startClock,
    pauseClock,
    validation,
  };
}());

document.querySelector('.workTime')
  .addEventListener('input', pomodoroClock.validation);

document.querySelector('.breakTime')
  .addEventListener('input', pomodoroClock.validation);

document.querySelector(".js-start-clock")
  .addEventListener("click", pomodoroClock.startClock);

document.querySelector(".js-pause-clock")
  .addEventListener("click", pomodoroClock.pauseClock);

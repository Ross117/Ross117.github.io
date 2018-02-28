'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var pomodoroClock = function createClock() {
  var workTime = document.querySelector('#workTime');
  var breakTime = document.querySelector('#breakTime');
  var startBtn = document.querySelector('.startClock');
  var errMsg = document.querySelector('.errMsg');
  var promptChange = { workTime: false, breakTime: false };
  var intervalID = 0;
  var clockPaused = false;
  var isABreak = false;

  var validation = function validation(inputEvent) {
    var inputEle = inputEvent.target;
    var timeStr = inputEle.value;
    // specify time format as hh:mm:ss
    var re = /^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;

    // check length & characters
    if (timeStr.match(re) !== null) {
      // handle cross browser differences in the input event object
      if (inputEvent.srcElement !== undefined) {
        promptChange[inputEvent.srcElement.id] = true;
      } else if (inputEvent.target !== undefined) {
        promptChange[inputEvent.target.id] = true;
      }
      startBtn.disabled = false;
      inputEle.style.background = '#FFFFFF';
      errMsg.innerText = '';
    } else {
      startBtn.disabled = true;
      inputEle.style.background = '#C02424';
      errMsg.innerText = 'hh:mm:ss';
    }
  };

  var readOnlyPrompts = function readOnlyPrompts(bln) {
    if (bln) {
      workTime.readOnly = true;
      breakTime.readOnly = true;
    } else {
      workTime.readOnly = false;
      breakTime.readOnly = false;
    }
  };

  var startClock = function startClock() {
    var clock = document.querySelector('.clock');
    var tme = void 0;

    // converts a time string to a date value, and sets the clock's initial value
    var setTime = function setTime(timeStr) {
      var newTme = new Date();
      var startTimeArr = timeStr.split(':');

      newTme.setHours.apply(newTme, _toConsumableArray(startTimeArr));
      clock.value = timeStr;

      return newTme;
    };

    // start the pomodoro clock countdown
    var countdown = function countdown() {
      // handle transitions between work periods and break periods
      if (clock.value === '00:00:00') {
        clearInterval(intervalID);
        document.querySelector('.timer').play();
        if (!isABreak) {
          isABreak = true;
          document.querySelector('.indicator').innerText = 'Break Time';
          tme = setTime(breakTime.value);
          intervalID = setInterval(countdown, 1000);
        } else {
          isABreak = false;
          document.querySelector('.indicator').innerText = 'Work Time';
          tme = setTime(workTime.value);
          intervalID = setInterval(countdown, 1000);
        }
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
      document.querySelector('.indicator').innerText = 'Work Time';
    } else if (promptChange.workTime && !isABreak) {
      tme = setTime(workTime.value);
    } else if (promptChange.breakTime && isABreak) {
      tme = setTime(breakTime.value);
    } else {
      tme = setTime(clock.value);
    }

    clockPaused = false;
    promptChange.workTime = false;
    promptChange.breakTime = false;
    intervalID = setInterval(countdown, 1000);
  };

  var pauseClock = function pauseClock() {
    clearInterval(intervalID);
    startBtn.disabled = false;
    readOnlyPrompts(false);
    clockPaused = true;
  };

  return {
    startClock: startClock,
    pauseClock: pauseClock,
    validation: validation
  };
}();

document.querySelector('#workTime').addEventListener('input', pomodoroClock.validation);

document.querySelector('#breakTime').addEventListener('input', pomodoroClock.validation);

document.querySelector('.startClock').addEventListener('click', pomodoroClock.startClock);

document.querySelector('.pauseClock').addEventListener('click', pomodoroClock.pauseClock);
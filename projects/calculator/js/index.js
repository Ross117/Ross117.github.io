'use strict';

function attachListeners() {
  var operatorRE = /^([+]|[-]|[x]|[÷])$/g;

  function digitBtn(clickEvent) {
    var userInputScreen = document.querySelector('.userInputScreen');
    var inputArr = userInputScreen.value.split(' ');
    var lastValue = inputArr[inputArr.length - 1];
    var btnValue = clickEvent.currentTarget.textContent;

    if (userInputScreen.value === '0') {
      userInputScreen.value = '';
    }

    //  if the last inputArr item is an operator, add a space
    if (lastValue.match(operatorRE) !== null) {
      userInputScreen.value += ' ' + btnValue;
    } else {
      userInputScreen.value += btnValue;
    }

    userInputScreen.focus();
  }

  function operatorBtn(clickEvent) {
    var userInputScreen = document.querySelector('.userInputScreen');
    var inputArr = userInputScreen.value.split(' ');
    var lastValue = inputArr[inputArr.length - 1];

    if (userInputScreen.value === '' || lastValue.match(operatorRE) !== null || lastValue[lastValue.length - 1] === '.') {
      return;
    }

    userInputScreen.value += ' ' + clickEvent.currentTarget.textContent;
    userInputScreen.focus();
  }

  function decimalPntBtn() {
    var userInputScreen = document.querySelector('.userInputScreen');
    var inputArr = userInputScreen.value.split(' ');
    var lastValue = inputArr[inputArr.length - 1];
    var btnValue = '.';
    var tailoredRE = /^([+]|[-]|[x]|[÷])$|[.]/g;

    if (userInputScreen.value === '' || lastValue.match(tailoredRE) !== null) return;

    userInputScreen.value += btnValue;
    userInputScreen.focus();
  }

  function calculate() {
    var userInputScreen = document.querySelector('.userInputScreen');
    var inputArr = userInputScreen.value.split(' ');
    var lastValue = inputArr[inputArr.length - 1];
    var nxtValue = void 0;

    // return true if the bodmas rule needs to be implemented
    function bodmasNeeded(arr) {
      if ((arr.indexOf('x') !== -1 || arr.indexOf('÷') !== -1) && (arr.indexOf('+') !== -1 || arr.indexOf('-') !== -1)) {
        return true;
      }
      return false;
    }

    // handle any precision errors
    function handlePrecisionErr(val) {
      var cleanedVal = Math.round(val * 1000000000) / 1000000000;
      return cleanedVal;
    }

    // implement BODMAS rules
    function orderOperations(arr) {
      var cleanedArr = arr.map(function (val) {
        return val;
      });

      for (var i = 0; i < cleanedArr.length; i += 1) {
        var newVal = void 0;
        var cleanedVal = void 0;

        if (!bodmasNeeded(cleanedArr)) return cleanedArr;

        var val = cleanedArr[i];

        if (i % 2 !== 0 && (val === 'x' || val === '÷')) {
          // if the current value is a multiplication or division operator,
          // perform that calcuation, and replace it in the array with the
          // return value - i.e. replace 3 values with a single value
          switch (val) {
            case 'x':
              newVal = +cleanedArr[i - 1] * +cleanedArr[i + 1];
              cleanedVal = handlePrecisionErr(newVal);
              cleanedArr.splice(i - 1, 3, cleanedVal);
              break;
            case '÷':
              newVal = +cleanedArr[i - 1] / +cleanedArr[i + 1];
              cleanedVal = handlePrecisionErr(newVal);
              cleanedArr.splice(i - 1, 3, cleanedVal);
              break;
            default:
              userInputScreen.value = 'Sorry, an error has occured';
          }
          // restart loop from the beginning of the altered array
          i = -1;
        }
      }

      return cleanedArr;
    }

    if (lastValue.match(operatorRE) || lastValue[lastValue.length - 1] === '.') return;

    // if the bodmas rule needs to be implemented, call a function which will
    // return an array which conforms to the rule
    if (bodmasNeeded(inputArr)) {
      inputArr = orderOperations(inputArr);
    }

    // the odd index numbers will be operators
    // calculate in groups of 3 (accumulator, operator & val following operator)
    var result = inputArr.reduce(function (accumulator, operator, index) {
      var val = void 0;
      var cleanedVal = void 0;

      // value following the operator
      nxtValue = inputArr[index + 1];

      // check if index is odd, if so value will be an operator,
      // and calculation can be performed
      if (index % 2 !== 0) {
        switch (operator) {
          case '+':
            val = +accumulator + +nxtValue;
            cleanedVal = handlePrecisionErr(val);
            return cleanedVal;
          case '-':
            val = +accumulator - +nxtValue;
            cleanedVal = handlePrecisionErr(val);
            return cleanedVal;
          case 'x':
            val = +accumulator * +nxtValue;
            cleanedVal = handlePrecisionErr(val);
            return cleanedVal;
          case '÷':
            val = +accumulator / +nxtValue;
            cleanedVal = handlePrecisionErr(val);
            return cleanedVal;
          default:
            return accumulator;
        }
      } else return accumulator;
    });

    // display result on calculator screen
    userInputScreen.value = result;
  }

  // clears calculator screen
  function cancel() {
    var userInputScreen = document.querySelector('.userInputScreen');

    userInputScreen.value = '';
    userInputScreen.placeholder = 0;
  }

  // clears last user entry
  function clearEntry() {
    var userInputScreen = document.querySelector('.userInputScreen');
    var inputArr = userInputScreen.value.split(' ');

    if (userInputScreen.value === '') return;

    // remove the last element in the array of values entered by the user
    inputArr.splice(inputArr.length - 1, 1);
    // update the calculator screen
    userInputScreen.value = inputArr.join(' ');

    userInputScreen.focus();
  }

  // switch the last value entered on calculator screen to either negative,
  // or positive
  function convert() {
    var userInputScreen = document.querySelector('.userInputScreen');
    var inputArr = userInputScreen.value.split(' ');
    var lastValue = inputArr[inputArr.length - 1];

    if (userInputScreen.value === '' || lastValue.match(operatorRE)) return;

    // check if last value is neg or pos, change accordingly
    if (lastValue > 0) {
      // add "-"
      lastValue = '-' + lastValue;
    } else {
      // remove "-"
      lastValue = lastValue.substr(1);
    }

    // replace the last element in the array of values entered by the user
    // with the newly converted value
    inputArr.splice(inputArr.length - 1, 1, lastValue);
    // update the calculator screen
    userInputScreen.value = inputArr.join(' ');

    userInputScreen.focus();
  }

  var digitBtns = document.querySelectorAll('.digitBtn');
  var operatorBtns = document.querySelectorAll('.operatorBtn');

  if (!Array.from) {
    for (var i = 0; i < digitBtns.length; i++) {
      digitBtns[i].addEventListener("click", digitBtn);
    }

    for (var i = 0; i < operatorBtns.length; i++) {
      operatorBtns[i].addEventListener("click", operatorBtn);
    }
  } else {
    Array.from(digitBtns).forEach((btn) => {
      btn.addEventListener("click", digitBtn);
    });

    Array.from(operatorBtns).forEach((btn) => {
      btn.addEventListener("click", operatorBtn);
    });
  }

  document.querySelector('.decimalPnt').addEventListener('click', decimalPntBtn);

  document.querySelector('.calcBtn').addEventListener('click', calculate);

  document.querySelector('.cancelBtn').addEventListener('click', cancel);

  document.querySelector('.clearEntryBtn').addEventListener('click', clearEntry);

  document.querySelector('.converter').addEventListener('click', convert);
}
// call attach event listeners function
attachListeners();
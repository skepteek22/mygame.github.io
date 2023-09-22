const placeHolder = document.getElementById('placeholder');
const timer = document.querySelector('.timer');
const wordsBox = document.querySelector('.words-box');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const refreshButton = document.querySelector('#refresh');
const popup = document.getElementById('popup');
const result = document.getElementById('result');



var answers = 0;
var count = 3;
var countdownInterval;
var wordsArray;
var currentIndex;
var timerInterval;
var targetTime = 30000;

startButton.addEventListener('click', () => {
    readyToPlay();
    setTimeout(startCountdown, 3500);
  });
stopButton.addEventListener('click', () =>{
  stopTimer();
  showResults();
  beDisable(stopButton);
} );
placeHolder.addEventListener('input', checkInput);

refreshButton.addEventListener('click', () =>{
  stopTimer();
  restartGame();
  readyToPlay();
  setTimeout(startCountdown, 3500);
})



function readyToPlay() {
    startButton.classList.add('hidden');
    stopButton.style.display = "block";
    stopButton.style.cursor = "not-allowed";
    refreshButton.style.cursor = "not-allowed";
    refreshButton.style.display = "block";
    placeHolder.style.display = "block";
    placeHolder.value = "good luck!";
    stopButton.style.marginRight = "420px";
    wordsBox.textContent = count;
    countdownInterval = setInterval(countdown, 1000);
}


function countdown() {
    count--;
    wordsBox.textContent = count;
    if (count <= 0) {
        wordsBox.textContent = "GO!";
        clearInterval(countdownInterval);
        addWordsToBox();
    }
}


async function addWordsToBox() {
    try {
        const response = await fetch('words.json');
        const data = await response.json();
        wordsArray = data;
        setTimeout(startGame, 300);
      } catch (error) {
        alert(`Error: ${error}`)
      }
}


function startGame() {
    wordsArray = getRandomArray(wordsArray);
    placeHolder.value = '';
    placeHolder.disabled = false;
    placeHolder.focus();
    currentIndex = 0;
    wordsBox.textContent = wordsArray[currentIndex];
}


function getRandomArray(array) {
    const shuffledArray = array.slice();
    
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }
    
    return shuffledArray;
  }


  function checkInput() {
    const inputValue = placeHolder.value;
    const currentWord = wordsArray[currentIndex];
    let html = '';

    for (let i = 0; i < currentWord.length; i++) {
      if (i < inputValue.length) {
        if (inputValue[i] === currentWord[i]) {
          html += `<span class="correct">${currentWord[i]}</span>`;
        } else {
          html += `<span class="incorrect">${currentWord[i]}</span>`;
        }
      } else {
        html += currentWord[i];
      }
    }

    wordsBox.innerHTML = html;

    if (inputValue === currentWord) {
      currentIndex++;
      answers++;
      placeHolder.value = '';

      if (currentIndex < wordsArray.length) {
        wordsBox.textContent = wordsArray[currentIndex];
      } else {
        wordsBox.textContent = 'You completed the words!';
      }
    }
  }



  function startCountdown() {
    var remainingTime = targetTime;
    stopButton.disabled = false;
    stopButton.style.cursor = "pointer";
    refreshButton.disabled = false;
    refreshButton.style.cursor = "pointer";
    
    
    timerInterval = setInterval(() => {
      remainingTime -= 10; 
      
      if(remainingTime === 15990){
        timer.classList.remove('normal');
        timer.classList.add('orange');
      }

      if (remainingTime === 5990) {
        timer.classList.remove('orange');
        timer.classList.add('red');
      }


      if (remainingTime === 5990) {
        timer.classList.add('jump');
      } else if (remainingTime === 0) {
        timer.classList.remove('jump');
      }
    

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        timer.textContent = '00:00:00';
        placeHolder.disabled = true;
        stopButton.disabled = true;
        stopButton.style.cursor = "not-allowed";
        showResults();
        return;
      }
  
      timer.textContent = formatTime(remainingTime);
    }, 10);
  }
  
  function formatTime(time) {
    var minutes = Math.floor(time / 60000);
    var seconds = Math.floor((time % 60000) / 1000);
    var milliseconds = time % 1000;
  
    return `${padZero(minutes)}:${padZero(seconds)}:${padZero(milliseconds, 3)}`;
  }
  
  function padZero(value, length = 2) {
    return value.toString().padStart(length, '0');
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function showResults() {
    result.textContent = `${answers}/${wordsArray.length}`;
    openPopup();
  }

function restartGame() {
  targetTime = 30000;
  count = 3;
  answers = 0;
  timer.textContent = formatTime(targetTime);
  wordsArray = getRandomArray(wordsArray);
  stopButton.disabled = true;
  refreshButton.disabled = true;
  placeHolder.disabled = true;
  timer.classList.remove('red');
  timer.classList.add('normal');
  timer.classList.remove('jump');
  closePopup();
}






function beDisable(btn){
  btn.disabled = true;
  btn.style.cursor = 'not-allowed';
  
}



// Функция открытия окна
function openPopup() {
  popup.style.top = '0';
}

// Функция закрытия окна
function closePopup() {
  popup.style.top = '-200px';
}




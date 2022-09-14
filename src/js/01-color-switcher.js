const refs = {
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
};

refs.startBtn.addEventListener('click', onChangeColor);
refs.stopBtn.addEventListener('click', onStopChangeColor);

// Функция смены цвета body 1 раз в секунду
function onChangeColor(e) {
  timerId = setInterval(() => {
    document.body.style.backgroundColor = `${getRandomHexColor()}`;
    console.log('Change Color, 1000ms');
    refs.startBtn.setAttribute('disabled', 'disabled');
    console.log(new Date());
    console.log('timerId', timerId);
  }, 1000);
}

// Функция остановки смены цвета на body
function onStopChangeColor(e) {
  clearInterval(timerId);
  refs.startBtn.removeAttribute('disabled', 'disabled');
  // document.body.style.backgroundColor = 'white';
  console.log('Stop Change Color');
}

// Функция генерации случайного цвета body
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

////////////////////////////////////////////////
// Вариант 2 - упрощенная запись в addEventListener

// refs.startBtn.addEventListener('click', () => {
//   timerId = setInterval(() => {
//     document.body.style.backgroundColor = `${getRandomHexColor()}`;
//     console.log('Change Color, 1000ms');
//     console.log(new Date());
//     console.log('timerId', timerId);
//   }, 1000);
// });

// refs.stopBtn.addEventListener('click', () => {
//   clearInterval(timerId);
//   document.body.style.backgroundColor = 'white';
//   console.log('Stop Change Color');
// });

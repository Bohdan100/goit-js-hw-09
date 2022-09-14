// Инициализация библиотеки flatpickr + npm i flatpickr --save
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// Инициализация библиотеки значков Notiflix + npm i notiflix
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  clockfaceDays: document.querySelector('[data-days]'),
  clockfaceHours: document.querySelector('[data-hours]'),
  clockfaceMinutes: document.querySelector('[data-minutes]'),
  clockfaceSeconds: document.querySelector('[data-seconds]'),
};

let chooseTime = 0;

// Подключение библиотеки к елементу input - полю выбора даты
// без настроек второго аргумента в {} - получается пустое поле input, выбор даты без часов, минут; отсутствие текущей даты и др.
const fp = flatpickr('#datetime-picker', {
  enableTime: true, // Включает выбор времени - час:минуты внизу таблицы, по умолчанию - false
  time_24hr: true, // включаем 24-часовой формат выбора времени, при false - 12-часовой с AM и PM
  defaultDate: new Date(), // устанавливает текущую дату и время в поле input - без него будет пустое поле обращения
  minuteIncrement: 1, // Регулирует шаг при вводе минут - установлен шаг в 1 минуту. По умолчанию переключает на 5 минут за одно нажатие кнопки

  // при закрытии окна onClose выводит в консоль выбраную дату - selectedDates
  // https://flatpickr.js.org/events/#onclose
  onClose(selectedDates) {
    if (selectedDates[0].getTime() < Date.now()) {
      // window.alert('Please choose a date in the future');

      // значки библиотеки Notiflix
      Notify.failure('Please choose a date in the future');
      return;
    }
    refs.startBtn.removeAttribute('disabled', 'disabled');
    chooseTime = selectedDates[0].getTime();
    console.log('chooseTime', chooseTime);
    return chooseTime;
  },
});

// Секундомер, внутри которого считается время: текущее минус стартовое
// Timer - ЭКЗЕМПЛЯР КЛАССА, методы start и stop у него лежат на прототипе
class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick; // ССЫЛКА НА updateClockface - ОБНОВЛЯЕТ ИНТЕРФЕЙС САЙТА

    this.init();
  }

  // При начальном открытии страницы один раз выполняется время - 00:00
  init() {
    // начальное время - 00:00
    const time = this.getTimeComponents(0);
    // ССЫЛКА НА updateClockface - ОБНОВЛЯЕТ ИНТЕРФЕЙС САЙТА
    this.onTick(time);
  }

  // Функция работы таймера, интервала времени, который он считает
  start() {
    // если таймер активный - считает - выйди и ничего не меняй
    // означает что нельзя перезапустить таймер, пока он работает и не досчитает
    if (this.isActive) {
      return;
    }

    // startTime - время начала работы таймера, определяется в милисекундах через Date.now();
    const startTime = chooseTime;
    this.isActive = true;

    // Через каждую секунду таймер считает разницу между текущим и стартовым временем
    // Интервал таймера - 1000 милисекунд - 1 секунда
    this.intervalId = setInterval(() => {
      // currentTime - текущее время сейчас, полученное через Date.now();
      const currentTime = Date.now();
      // deltaTime - разница между текущим временем и временем начала таймера - startTime
      const deltaTime = startTime - currentTime;
      if (deltaTime > 0) {
        console.log('run', deltaTime);
        // в time переводятся милисекунды 1662832 в 00:00:00
        // преобразовывает это функция getTimeComponents
        const time = this.getTimeComponents(deltaTime);
        // ССЫЛКА НА ФУНКЦИЮ updateClockface - ОБНОВЛЯЕТ ИНТЕРФЕЙС САЙТА, находится в самом низу кода
        this.onTick(time);
      }

      // Функция остановки таймера и очистки значения проработанного времени
      if (deltaTime <= 0) {
        console.log('stop', deltaTime);
        clearInterval(this.intervalId);
        // таймер неактивный
        this.isActive = false;
        // время к 00:00
        const time = this.getTimeComponents(0);
        // ССЫЛКА НА updateClockface - ОБНОВЛЯЕТ ИНТЕРФЕЙС САЙТА
        this.onTick(time);
        // неактивная кнопка
        refs.startBtn.setAttribute('disabled', 'disabled');
        return;
      }
    }, 1000);
  }

  // Функция возвращает 00:00:00 из строки милисекунд - 1662832342722
  //  высчитывает значения дней, часов, минут и секунд, которые
  // надо записать в таймер
  getTimeComponents(time) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.addLeadingZero(Math.floor(time / day));
    // высчитать сколько часов вмещается в милисекунды для записи в таймер
    const hours = this.addLeadingZero(Math.floor((time % day) / hour));
    // высчитывает сколько минут вмещается в милисекунды для записи в таймер
    const minutes = this.addLeadingZero(
      Math.floor(((time % day) % hour) / minute)
    );
    // высчитывает сколько секунд вмещается в милисекунды для записи в таймер
    const seconds = this.addLeadingZero(
      Math.floor((((time % day) % hour) % minute) / second)
    );

    // вернуть время - дни, часы, минуты, секунды
    return { days, hours, minutes, seconds };
  }

  /*
   * addLeadingZero - Принимает число, приводит к строке и добавляет в начало 0 если число меньше 2-х знаков
   */
  // addLeadingZero - преобразовывает время в строку  - String(value)
  // и ДОБАВЛЯЕТ СЛЕВА ОТ ЗНАЧЕНИИЯ - 00 (два нуля) - через padStart(2, "0");
  // приходит 7 - вернет 07; приходит 12 - вернет 12
  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

// КРУГОМ БУДЕТ ИДТИ ССЫЛКА НА updateClockface
// ЧЕРЕЗ this.onTick(time);
const timer = new Timer({
  onTick: updateClockface, // функция updateClockface ниже
});

// Начало работы таймера
refs.startBtn.addEventListener('click', timer.start.bind(timer));

/*
 * - Принимает время в миллисекундах
 * - Высчитывает сколько в них вмещается часов/минут/секунд
 * - Рисует интерфейс
 */

// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА - ЧЕРЕЗ updateClockface
// БЕЗ updateClockface ВНЕШНИЙ ВИД ВРЕМЕНИ НА САЙТЕ НЕ ОБНОВЛЯЕТСЯ
// updateClockface - принимает время в часы-минуты-секунды - { hours, mins, secs }
// КРУГОМ БУДЕТ ИДТИ ССЫЛКА НА updateClockface
// ЧЕРЕЗ this.onTick(time);
// обновляет значение textContent таймера - на НОВЫЕ дни-часы-минуты-секунды
function updateClockface({ days, hours, minutes, seconds }) {
  refs.clockfaceDays.textContent = `${days}:`;
  refs.clockfaceHours.textContent = `${hours}:`;
  refs.clockfaceMinutes.textContent = `${minutes}:`;
  refs.clockfaceSeconds.textContent = `${seconds}`;
}

// Инициализация библиотеки значков Notiflix + npm i notiflix
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formRef = document.querySelector('.form');
console.log(formRef);

formRef.addEventListener('submit', onBeginPromise);

function onBeginPromise(evt) {
  evt.preventDefault();

  let position = 0;
  let delay = Number(evt.currentTarget.elements.delay.value);
  console.log('delay in Form', delay);

  let step = Number(evt.currentTarget.elements.step.value);
  console.log('step in Form', step);

  let amount = Number(evt.currentTarget.elements.amount.value);
  console.log('amount in Form', amount);

  delay -= step;

  for (let i = 1; i <= amount; i += 1) {
    position += 1;

    delay = delay + step;

    console.log('position [i]', position);
    console.log('delay [i]', delay);

    createPromise(position, delay);
  }

  // Обновление функции и внешних параметров в инпутах для поторного цикла работы
  delay = 0;
  amount = 0;
  step = 0;
  position = 0;
  evt.currentTarget.elements.delay.value = '';
  evt.currentTarget.elements.step.value = '';
  evt.currentTarget.elements.amount.value = '';
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      if (shouldResolve) {
        resolve(
          Notify.success(`Fulfilled promise ${position} in ${delay}ms`)
          // console.log(`✅ Fulfilled promise ${position} in ${delay}ms`)
        );
      } else {
        reject(
          Notify.failure(`Rejected promise ${position} in ${delay}ms`)
          // console.log(`❌ Rejected promise ${position} in ${delay}ms`)
        );
      }
    }, delay);
  })
    .then(() => {
      console.log(`✅ Fulfilled promise ${position} in ${delay}ms`);
    })
    .catch(() => {
      console.log(`❌ Rejected promise ${position} in ${delay}ms`);
    });
}

// Скрипт для мінігри «Перезачаруй вивіски»

document.addEventListener('DOMContentLoaded', () => {
  // Отримуємо елементи інтерфейсу
  const startScreen = document.getElementById('start-screen');
  const startButton = document.getElementById('start-button');
  const gameContainer = document.getElementById('game-container');
  const board = document.getElementById('board');
  const answerOverlay = document.getElementById('answer-overlay');
  const currentWordEl = document.getElementById('current-word');
  const optionButtons = Array.from(document.querySelectorAll('.option-btn'));
  const correctCountEl = document.getElementById('correct-count');
  const totalCountEl = document.getElementById('total-count');
  const timerFill = document.getElementById('timer-fill');
  const timerText = document.getElementById('timer-text');
  const finishScreen = document.getElementById('finish-screen');

  // Масив даних: старі та нові форми слів і правильна відповідь
  const words = [
    // Для компонентів «міні», «віце», «топ», «преміум», «екс» правильна відповідь — разом
    { old: 'міні-спідниця', correct: 'мініспідниця', answer: 'разом' },
    // У новому словнику слово «часто-густо» пишеться через дефіс і не змінюється
    { old: 'часто-густо', correct: 'часто-густо', answer: 'через дефіс' },
    { old: 'віце президент', correct: 'віцепрезидент', answer: 'разом' },
    // Слово «білий-білий» пишеться через дефіс і залишається незмінним
    { old: 'білий-білий', correct: 'білий-білий', answer: 'через дефіс' },
    { old: 'топ-менеджер', correct: 'топменеджер', answer: 'разом' },
    { old: 'преміум-клас', correct: 'преміумклас', answer: 'разом' },
    { old: 'екс-президент', correct: 'експрезидент', answer: 'разом' }
  ];

  // Змінні для відстеження стану
  let currentWordIndex = null;
  let score = 0;
  let timeLeft = 30;
  let timerInterval;
  const answeredIndices = new Set();

  // Створюємо мерехтливі зірки на фоні
  function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 80;
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('span');
      star.classList.add('star');
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      starsContainer.appendChild(star);
    }
  }

  // Функція для запуску гри
  function startGame() {
    // Приховуємо стартовий та фінальний екрани
    startScreen.classList.add('hidden');
    finishScreen.classList.add('hidden');
    // Показуємо контейнер гри
    gameContainer.classList.remove('hidden');
    // Встановлюємо кількість слів
    totalCountEl.textContent = words.length;
    correctCountEl.textContent = 0;
    // Очищаємо та створюємо кнопки зі словами
    board.innerHTML = '';
    words.forEach((word, idx) => {
      const btn = document.createElement('button');
      btn.className = 'word-btn';
      btn.textContent = word.old;
      btn.dataset.index = idx;
      btn.addEventListener('click', handleWordClick);
      board.appendChild(btn);
    });
    // Скидаємо стан
    score = 0;
    timeLeft = 30;
    answeredIndices.clear();
    currentWordIndex = null;
    updateTimer();
    // Запускаємо таймер
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) {
        finishGame();
      }
    }, 1000);
  }

  // Оновлення відображення таймера
  function updateTimer() {
    timerText.textContent = `${timeLeft}\u00a0с`;
    const percent = (timeLeft / 30) * 100;
    timerFill.style.width = `${percent}%`;
  }

  // Обробник кліку на слово
  function handleWordClick(event) {
    const idx = Number(event.currentTarget.dataset.index);
    // Якщо вже відповіли на це слово — ігноруємо
    if (answeredIndices.has(idx)) return;
    currentWordIndex = idx;
    currentWordEl.textContent = words[idx].old;
    answerOverlay.classList.remove('hidden');
  }

  // Обробник вибору відповіді
  function handleOptionClick(event) {
    const chosen = event.currentTarget.dataset.value;
    // якщо нічого не вибрано — вихід
    if (currentWordIndex === null) return;
    const idx = currentWordIndex;
    const wordData = words[idx];
    const buttonEl = board.querySelector(`button[data-index='${idx}']`);
    // Перевіряємо, чи вже була відповідь
    if (!answeredIndices.has(idx)) {
      if (chosen === wordData.answer) {
        // Правильна відповідь
        buttonEl.classList.add('correct');
        // Змінюємо напис на правильний через невелику затримку для анімації
        setTimeout(() => {
          buttonEl.textContent = wordData.correct;
        }, 200);
        score++;
        correctCountEl.textContent = score;
      } else {
        // Неправильна відповідь
        buttonEl.classList.add('incorrect');
      }
      answeredIndices.add(idx);
    }
    // Закриваємо вікно відповіді
    answerOverlay.classList.add('hidden');
    currentWordIndex = null;
    // Якщо усі слова виправлено — завершуємо гру
    if (answeredIndices.size === words.length) {
      finishGame();
    }
  }

  // Завершення гри
  function finishGame() {
    clearInterval(timerInterval);
    // Приховуємо ігровий контейнер
    gameContainer.classList.add('hidden');
    // Оновлюємо прогрес бар (2/9)
    const fill = finishScreen.querySelector('.general-progress-fill');
    const text = finishScreen.querySelector('.general-progress-text');
    if (fill) {
      fill.style.width = `${(2 / 9) * 100}%`;
    }
    if (text) {
      text.innerHTML = `2&nbsp;/&nbsp;9`;
    }
    finishScreen.classList.remove('hidden');
  }

  // Події
  startButton.addEventListener('click', startGame);
  optionButtons.forEach((btn) => btn.addEventListener('click', handleOptionClick));
  // Створюємо зірковий фон
  createStars();
});
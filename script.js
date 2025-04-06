const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const playerTurnEl = document.getElementById('player-turn');
const resultEl = document.getElementById('result');
const finalResultEl = document.getElementById('final-result');
const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');
const messageEl = document.getElementById('message');
const finishedMsg = document.getElementById('player-finished');

const nameInput1 = document.getElementById('name1');
const nameInput2 = document.getElementById('name2');
const nameDisplay1 = document.getElementById('name-display1');
const nameDisplay2 = document.getElementById('name-display2');
const rewardBtn = document.getElementById('claim-btn');
const rewardDiv = document.getElementById('reward');

const intro = document.getElementById('intro');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('main-game');

let questions = [];
let currentQuestionIndex = 0;
let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let answersGiven = { 1: 0, 2: 0 };
let names = { 1: "Player 1", 2: "Player 2" };

startBtn.addEventListener('click', () => {
  const n1 = nameInput1.value.trim();
  const n2 = nameInput2.value.trim();
  if (n1 && n2) {
    names[1] = n1;
    names[2] = n2;
    nameDisplay1.innerText = n1;
    nameDisplay2.innerText = n2;
    intro.classList.add('d-none');
    gameContainer.classList.remove('d-none');
    fetchQuestions();
  } else {
    alert("Please enter names for both players.");
  }
});

rewardBtn.onclick = () => {
  rewardDiv.classList.remove('d-none');
  rewardBtn.classList.add('d-none');
};

async function fetchQuestions() {
  const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
  const data = await res.json();
  questions = data.results;
  showQuestion();
}

function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function showQuestion() {
  nextBtn.disabled = true;
  messageEl.innerText = "";
  finishedMsg.classList.add('d-none');
  const q = questions[currentQuestionIndex];
  const allOptions = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

  questionEl.innerText = decodeHtml(q.question);
  optionsEl.innerHTML = '';

  allOptions.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-secondary';
    btn.innerText = decodeHtml(option);
    btn.onclick = () => handleAnswer(option === q.correct_answer, decodeHtml(q.correct_answer), btn);
    optionsEl.appendChild(btn);
  });

  playerTurnEl.innerText = `🎮 ${names[currentPlayer]}'s Turn`;
}

function handleAnswer(isCorrect, correctAnswer, clickedBtn) {
  if (isCorrect) {
    scores[currentPlayer]++;
    messageEl.innerText = "✅ Correct!";
    messageEl.style.color = "#00ff88";
  } else {
    messageEl.innerText = `❌ Wrong! Correct answer is: ${correctAnswer}`;
    messageEl.style.color = "#ff4d4d";
  }

  answersGiven[currentPlayer]++;
  updateScoreboard();
  Array.from(optionsEl.children).forEach(btn => btn.disabled = true);
  clickedBtn.classList.remove('btn-outline-secondary');
  clickedBtn.classList.add(isCorrect ? 'btn-success' : 'btn-danger');
  nextBtn.disabled = false;
}

function updateScoreboard() {
  score1El.innerText = scores[1];
  score2El.innerText = scores[2];
}

nextBtn.onclick = () => {
  currentQuestionIndex++;
  if (answersGiven[currentPlayer] === 5) {
    finishedMsg.innerHTML = `✅ ${names[currentPlayer]} has finished with score ${scores[currentPlayer]}!`;
    finishedMsg.classList.remove('d-none');

    if (currentPlayer === 1) {
      currentPlayer = 2;
    } else {
      return endGame();
    }
  }

  setTimeout(() => {
    showQuestion();
  }, 1000);
};

function endGame() {
  document.getElementById('game').classList.add('d-none');
  resultEl.classList.remove('d-none');

  const [p1, p2] = [scores[1], scores[2]];
  if (p1 > p2) {
    finalResultEl.innerHTML = `🏆 ${names[1]} wins!<br/>Score: ${p1} - ${p2}`;
  } else if (p2 > p1) {
    finalResultEl.innerHTML = `🏆 ${names[2]} wins!<br/>Score: ${p1} - ${p2}`;
  } else {
    finalResultEl.innerHTML = `🤝 It's a Tie!<br/>Score: ${p1} - ${p2}`;
    rewardBtn.classList.add('d-none');
  }
}

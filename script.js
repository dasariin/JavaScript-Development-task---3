// Questions array
const quizQuestions = [
  {
    question: "Which language runs in a web browser?",
    answers: {
      a: "Java",
      b: "C",
      c: "Python",
      d: "JavaScript"
    },
    correctAnswer: "d"
  },
  {
    question: "What does CSS stand for?",
    answers: {
      a: "Central Style Sheets",
      b: "Cascading Style Sheets",
      c: "Computer Style Sheets",
      d: "Creative Style System"
    },
    correctAnswer: "b"
  },
  {
    question: "Which HTML tag is used to define JavaScript?",
    answers: {
      a: "<js>",
      b: "<javascript>",
      c: "<script>",
      d: "<code>"
    },
    correctAnswer: "c"
  }
];

// Get DOM elements
const quizContainer = document.getElementById("quiz");
const resultsContainer = document.getElementById("results");
const submitButton = document.getElementById("submit");
const restartButton = document.getElementById("restart");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const progressBar = document.getElementById("progress");
const currentQuestionElement = document.getElementById("current");
const totalQuestionsElement = document.getElementById("total");
const timerElement = document.getElementById("time");

// Quiz state
let currentQuestion = 0;
let userAnswers = Array(quizQuestions.length).fill(null);
let startTime;
let timerInterval;

// Initialize quiz
function initQuiz() {
  totalQuestionsElement.textContent = quizQuestions.length;
  startTimer();
  buildQuiz();
  updateProgressBar();
  updateNavigation();
}

// Start timer
function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(updateTimer, 1000);
}

// Update timer display
function updateTimer() {
  const now = new Date();
  const elapsed = new Date(now - startTime);
  const minutes = elapsed.getMinutes().toString().padStart(2, '0');
  const seconds = elapsed.getSeconds().toString().padStart(2, '0');
  timerElement.textContent = `${minutes}:${seconds}`;
}

// Stop timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Build quiz UI
function buildQuiz() {
  const output = [];
  const question = quizQuestions[currentQuestion];

  const answers = [];
  for (let letter in question.answers) {
    answers.push(
      `<div class="answer-item ${userAnswers[currentQuestion] === letter ? 'selected' : ''}">
        <input type="radio" id="answer-${letter}" name="question" value="${letter}" 
          ${userAnswers[currentQuestion] === letter ? 'checked' : ''}>
        <label for="answer-${letter}">${letter.toUpperCase()}: ${question.answers[letter]}</label>
      </div>`
    );
  }

  output.push(
    `<div class="question">${question.question}</div>
     <div class="answers">${answers.join("")}</div>`
  );

  quizContainer.innerHTML = output.join("");

  // Add event listeners to answer options
  const answerItems = quizContainer.querySelectorAll('.answer-item');
  answerItems.forEach(item => {
    item.addEventListener('click', () => {
      const input = item.querySelector('input');
      input.checked = true;
      
      // Update selected state
      answerItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      
      // Save user's answer
      userAnswers[currentQuestion] = input.value;
    });
  });
}

// Update progress bar
function updateProgressBar() {
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
  currentQuestionElement.textContent = currentQuestion + 1;
}

// Update navigation buttons state
function updateNavigation() {
  prevButton.disabled = currentQuestion === 0;
  nextButton.disabled = currentQuestion === quizQuestions.length - 1;
  
  // Show submit button on last question
  if (currentQuestion === quizQuestions.length - 1) {
    submitButton.style.display = 'block';
    nextButton.style.display = 'none';
  } else {
    submitButton.style.display = 'none';
    nextButton.style.display = 'block';
  }
}

// Show results
function showResults() {
  stopTimer();
  
  let score = 0;
  const resultsOutput = [];
  
  quizQuestions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      score++;
    }
  });
  
  const percentage = Math.round((score / quizQuestions.length) * 100);
  
  let feedback;
  if (percentage === 100) {
    feedback = "Perfect! You're a web development expert!";
  } else if (percentage >= 70) {
    feedback = "Great job! You have good web knowledge!";
  } else if (percentage >= 50) {
    feedback = "Good effort! Try again to improve your score.";
  } else {
    feedback = "Keep learning and try again!";
  }
  
  resultsContainer.innerHTML = `
    <div class="score-text">You scored ${score} out of ${quizQuestions.length}</div>
    <div class="score-percentage">${percentage}%</div>
    <div class="feedback">${feedback}</div>
  `;
  
  resultsContainer.style.display = 'block';
  submitButton.style.display = 'none';
  restartButton.style.display = 'block';
  document.querySelector('.navigation-buttons').style.display = 'none';
}

// Restart quiz
function restartQuiz() {
  currentQuestion = 0;
  userAnswers = Array(quizQuestions.length).fill(null);
  resultsContainer.style.display = 'none';
  restartButton.style.display = 'none';
  document.querySelector('.navigation-buttons').style.display = 'flex';
  initQuiz();
}

// Navigate to next question
function nextQuestion() {
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    buildQuiz();
    updateProgressBar();
    updateNavigation();
  }
}

// Navigate to previous question
function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    buildQuiz();
    updateProgressBar();
    updateNavigation();
  }
}

// Event listeners
submitButton.addEventListener('click', showResults);
restartButton.addEventListener('click', restartQuiz);
nextButton.addEventListener('click', nextQuestion);
prevButton.addEventListener('click', prevQuestion);

// Initialize the quiz
initQuiz();

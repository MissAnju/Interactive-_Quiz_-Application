//important Veriables

// #Variable	        #Purpose	   
// 1.questions:-   	Array to hold fetched quiz questions.
// 2.time:-	        Keeps track of current time remaining for a question.	Default 30 seconds.
// 3.score:-   	    User’s total correct answers.	.
// 4.currentQuestion:-	Index of the currently shown question.	
// 5.timer:-       	Stores the setInterval() reference so it can be cleared later.


const progressBar = document.querySelector(".progress-bar"),  // Selects the HTML element showing the visual progress of time left for each question.
  progressText = document.querySelector(".progress-text");   //Displays remaining time numerically.

//1.progress(value) :-Updates the progress bar and time text every second. value = current remaining time. Visually represents how much time is left.
const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector(".start"),   //Starts the quiz when clicked.
  numQuestions = document.querySelector("#num-questions"), //Lets user select how many questions to load.
  category = document.querySelector("#category"), // Lets user choose quiz category (e.g., Sports, Science).
  difficulty = document.querySelector("#difficulty"),  //Lets user choose question difficulty.
  timePerQuestion = document.querySelector("#time"),    //Defines time limit for each question.
  quiz = document.querySelector(".quiz"),               //Contains the actual quiz content. Hidden initially.
  startScreen = document.querySelector(".start-screen"); //Initial screen where user enters quiz preferences. Hidden once quiz starts.

let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;

//2.startQuiz() :- Triggered when user clicks Start. Fetches quiz questions using Open Trivia API. Shows a loading animation.After data loads, hides the start screen and shows the first question.

const startQuiz = () => {
  const num = numQuestions.value,
    cat = category.value,
    diff = difficulty.value;
  loadingAnimation();
  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(questions[0]);
      }, 1000);
    });
};

startBtn.addEventListener("click", startQuiz);
//3.showQuestion(question):-  Displays the current question and all answer options. Adds click event listeners to each (.answer). Enables the Submit button when one answer is selected. Starts the timer for this question using startTimer().
const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper");
  questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
                  <div class="answer ">
            <span class="text">${answer}</span>
            <span class="checkbox">
              <i class="fas fa-check"></i>
            </span>
          </div>
        `;
  });

  questionNumber.innerHTML = ` Question <span class="current">${
    questions.indexOf(question) + 1
  }</span>
            <span class="total">/${questions.length}</span>`;
  //add event listener to each answer
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  time = timePerQuestion.value;
  startTimer(time);
};
//4. startTimer(time):-   Starts a countdown timer for each question. Calls progress() every second to update the visual timer .When time runs out, it automatically calls checkAnswer().
const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === 3) {
      playAdudio("countdown.mp3");
    }
    if (time >= 0) {
      progress(time);
      time--;
    } else {
      checkAnswer();
    }
  }, 1000);
};
//5. loadingAnimation():-  Shows “Loading…” animation while questions are being fetched.
const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};

const submitBtn = document.querySelector(".submit"), //Submits the selected answer.
  nextBtn = document.querySelector(".next");   //Moves to the next question after submitting.
submitBtn.addEventListener("click", () => {
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});
//6. checkAnswer():-Stops the timer.

//Checks if user selected an answer:
// -> If yes → compare it with the correct answer.
// If correct → increase score and mark answer green.
// If wrong → mark wrong one red, show the correct one in green.
// Hides Submit button and shows Next button.

const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    console.log(currentQuestion);
    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++;
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      const correctAnswer = document
        .querySelectorAll(".answer")
        .forEach((answer) => {
          if (
            answer.querySelector(".text").innerHTML ===
            questions[currentQuestion - 1].correct_answer
          ) {
            answer.classList.add("correct");
          }
        });
    }
  } else {
    const correctAnswer = document
      .querySelectorAll(".answer")
      .forEach((answer) => {
        if (
          answer.querySelector(".text").innerHTML ===
          questions[currentQuestion - 1].correct_answer
        ) {
          answer.classList.add("correct");
        }
      });
  }
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};
//7. nextQuestion():- Moves to next question if any remain. Otherwise, shows the score screen.

const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    showScore();
  }
};

const endScreen = document.querySelector(".end-screen"),  //Final results screen shown after quiz completion.
  finalScore = document.querySelector(".final-score"),    //Shows total correct answers.
  totalScore = document.querySelector(".total-score");    //Displays total number of questions.

//8. showScore():- Displays total score at the end.

Hides quiz screen and shows result summary.
const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/ ${questions.length}`;
};
//9.restartBtn Event :- Reloads the page to restart the quiz from the beginning.
const restartBtn = document.querySelector(".restart");  //Restarts the quiz.
restartBtn.addEventListener("click", () => {
  window.location.reload();
});
//10.playAdudio(src):- Plays countdown sound when only 3 seconds are left.
const playAdudio = (src) => {
  const audio = new Audio(src);
  audio.play();

};

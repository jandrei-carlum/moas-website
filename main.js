
    // Init AOS scroll animations
    AOS.init({duration:700,once:true,offset:60});


    // utilities
  function scrollToId(id){
      const el = document.getElementById(id);
      if(!el) return window.scrollTo({top:0,behavior:'smooth'});
      el.scrollIntoView({behavior:'smooth',block:'start'});
    }

    // Lightbox
    function openLightbox(src){
      const box = document.getElementById('lightbox');
      document.getElementById('lightboxImg').src = src;
      box.style.display = 'flex';
    }

    function closeLightbox(){
      const box = document.getElementById('lightbox');
      box.style.display = 'none';
      document.getElementById('lightboxImg').src = '';
    }

    // Full apply modal
    function openApply(){ document.getElementById('applyModal').style.display = 'flex' }
    function closeApply(){ document.getElementById('applyModal').style.display = 'none' }

    // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Accessibility: close lightbox with escape
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){ closeLightbox(); closeApply(); }
    });

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const nav = document.querySelector('.nav');

// Toggle burger
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Change nav on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});


const modal = document.getElementById('logoExplainModal');
const modalImg = document.getElementById('modalImage');
const images = document.querySelectorAll('.logo-carousel img');
let currentIndex = 0;

// Open modal when image is clicked
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    openModal();
  });
});

function openModal() {
  modal.style.display = 'flex';
  modalImg.src = images[currentIndex].src;
}

// Close modal
document.getElementById('closeModal').onclick = () => {
  modal.style.display = 'none';
};

// Navigate left/right
document.getElementById('lprevBtn').onclick = () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  modalImg.src = images[currentIndex].src;
};

document.getElementById('lnextBtn').onclick = () => {
  currentIndex = (currentIndex + 1) % images.length;
  modalImg.src = images[currentIndex].src;
};

// Close modal when clicking outside image
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (modal.style.display === 'flex') {
    if (e.key === 'ArrowRight') document.getElementById('nextBtn').click();
    if (e.key === 'ArrowLeft') document.getElementById('prevBtn').click();
    if (e.key === 'Escape') modal.style.display = 'none';
  }
});

/**********************
 *  GLOBAL STATE
 **********************/
let jsonQuizContents = null; 
let quizData = [];
let guestAnswer = [];
let current_quiz = 0;

/**********************
 *  LOAD & RELOAD QUIZ
 **********************/
function reloadQuizContent() {
    // Shuffle master list
    jsonQuizContents.sort(() => 0.5 - Math.random());

    // Pick 7
    quizData = jsonQuizContents.slice(0, 7);

    // Reset state
    guestAnswer = [];
    current_quiz = 0;

    updateProgress();
    loadQuiz();
}

/**********************
 *  INIT (RUNS ONCE)
 **********************/
function initQuiz() {
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const submitBtn = document.getElementById("submitBtn");

    // ————— Navigation —————
    nextBtn.addEventListener("click", handleNext);
    prevBtn.addEventListener("click", handlePrev);
    submitBtn.addEventListener("click", handleSubmit);

    // ————— Choice selection (radio highlight) —————
    document.getElementById("choices").addEventListener("change", e => {
        if (e.target.matches('input[type="radio"]')) {
            document.querySelectorAll(".choice-row").forEach(r => r.classList.remove("active"));
            e.target.closest(".choice-row").classList.add("active");
        }
    });

    // ————— Restart buttons —————
    document.getElementById('quiz-again').addEventListener('click', restartQuiz);
    document.getElementById('closeResult').addEventListener('click', restartQuiz);
    document.getElementById('reload-btn').addEventListener('click', restartQuiz);

    // FIRST QUIZ LOAD HAPPENS AFTER FETCH
}

/**********************
 *  HELPERS
 **********************/
function updateProgress() {
    document.getElementById("progress").innerText = `${current_quiz + 1} / 7`;
}

function activateNext() {
    const btn = document.getElementById("nextBtn");
    btn.disabled = false;
    btn.style.opacity = "1";
}

function inActivateNext() {
    const btn = document.getElementById("nextBtn");
    btn.disabled = true;
    btn.style.opacity = "0.7";
}

function activatePrevious() {
    const btn = document.getElementById("prevBtn");
    btn.disabled = false;
    btn.style.opacity = "1";
}

function inActivatePrevious() {
    const btn = document.getElementById("prevBtn");
    btn.disabled = true;
    btn.style.opacity = "0.7";
}

function updateButtons() {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.style.display = (current_quiz === quizData.length - 1) ? "inline-block" : "none";

    if (current_quiz === 0) inActivatePrevious();
    else activatePrevious();

    if (current_quiz === quizData.length - 1) inActivateNext();
    else activateNext();
}

/**********************
 *  LOAD QUESTION
 **********************/
function loadQuiz() {
    const q = quizData[current_quiz];

    const questionEl = document.getElementById("question");
    const choicesEl = document.getElementById("choices");
    const resultEl = document.getElementById("result");

    questionEl.textContent = q.question;
    choicesEl.innerHTML = "";
    resultEl.textContent = "";

    q.choices.forEach((choice, index) => {
        const row = document.createElement("label");
        row.classList.add("choice-row");

        const isChecked =
            guestAnswer[current_quiz] &&
            guestAnswer[current_quiz].guest === index;

        row.innerHTML = `
            <input class="radio-choice" type="radio" name="choice" value="${index}" ${isChecked ? "checked" : ""}>
            <span>${choice}</span>
        `;

        if (isChecked) row.classList.add("active");

        choicesEl.appendChild(row);
    });

    updateButtons();
}

/**********************
 *  SAVE ANSWER
 **********************/
function saveAnswer() {
    const selected = document.querySelector("input[name='choice']:checked");
    if (!selected) return;

    const answer = parseInt(selected.value);

    guestAnswer[current_quiz] = {
        question: quizData[current_quiz].question,
        correct: quizData[current_quiz].answer,
        guest: answer
    };
}

/**********************
 *  NAVIGATION
 **********************/
function handleNext() {
    const selected = document.querySelector("input[name='choice']:checked");
    if (!selected) return;

    saveAnswer();

    if (current_quiz < quizData.length - 1) {
        current_quiz++;
        updateProgress();
        loadQuiz();
    }
}

function handlePrev() {
    saveAnswer();

    if (current_quiz > 0) {
        current_quiz--;
        updateProgress();
        loadQuiz();
    }
}

/**********************
 *  SUBMIT RESULT
 **********************/
function handleSubmit() {
    const selected = document.querySelector("input[name='choice']:checked");
    if (!selected) return;

    saveAnswer();

    let score = 0;
    guestAnswer.forEach(a => {
        if (a.correct === a.guest) score++;
    });

    document.getElementById("quiz-score").innerText = `${score} / ${quizData.length}`;

    document.getElementById("quizResModal").style.display = "block";

    showResult();
}

function showResult() {
    const resultBox = document.getElementById('quizContent');
    resultBox.innerHTML = "";

    quizData.forEach((q, qIdx) => {
        const qDiv = document.createElement("div");
        qDiv.classList.add("review-question");

        const qTitle = document.createElement("h3");
        qTitle.textContent = `${qIdx + 1}. ${q.question}`;
        qDiv.appendChild(qTitle);

        const userIndex = guestAnswer[qIdx]?.guest;
        const correctIndex = q.answer;

        q.choices.forEach((choice, idx) => {
            const choiceRow = document.createElement("div");
            choiceRow.classList.add("choice-row");
            choiceRow.style.display = "flex";
            choiceRow.style.justifyContent = "space-between";
            choiceRow.style.padding = "6px 10px";
            choiceRow.style.border = "1px solid #ccc";
            choiceRow.style.marginBottom = "5px";

            const text = document.createElement("span");
            text.textContent = choice;
            choiceRow.appendChild(text);

            const icon = document.createElement("span");

            if (idx === userIndex && idx === correctIndex) {
                choiceRow.style.borderColor = "#4CAF50";
                icon.textContent = "✔";
                icon.style.color = "green";
            } else if (idx === userIndex && idx !== correctIndex) {
                choiceRow.style.borderColor = "#E53935";
                icon.textContent = "❌";
                icon.style.color = "red";
            } else if (idx === correctIndex) {
                choiceRow.style.border = "2px solid #4CAF50";
                icon.textContent = "✔";
                icon.style.color = "green";
            }

            choiceRow.appendChild(icon);
            qDiv.appendChild(choiceRow);
        });

        resultBox.appendChild(qDiv);
    });
}

/**********************
 *  RESTART QUIZ
 **********************/
function restartQuiz() {
    document.getElementById('quizResModal').style.display = 'none';
    reloadQuizContent();
}

/**********************
 *  FETCH QUESTIONS
 **********************/
fetch('quiz.json')
    .then(res => res.json())
    .then(allQuestions => {
        jsonQuizContents = allQuestions;
        reloadQuizContent();
        initQuiz(); // ONLY RUNS ONCE
    });

/**********************
 *  EXTRA (Your existing card click)
 **********************/
document.querySelectorAll('.chapel-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('expanded');
        card.classList.toggle('active');
    });
});

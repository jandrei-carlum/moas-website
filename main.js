
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


// --------------------- QUIZ
let jsonQuizContents = null

function reloadQuizContent(){
 // Shuffle array
    jsonQuizContents.sort(() => 0.5 - Math.random());

    // Pick first 7 questions
    const quizData = jsonQuizContents.slice(0, 7);

    // Then initialize quiz
    initQuiz(quizData);
}

fetch('quiz.json')
  .then(res => res.json())
  .then(allQuestions => {

    jsonQuizContents = allQuestions

    reloadQuizContent()
   
});


function initQuiz(quizData) {
  let current_quiz = 0;
  const questionEl = document.getElementById("question");
  const choicesEl = document.getElementById("choices");
  const resultEl = document.getElementById("result");
  let nextButton = document.getElementById("nextBtn")
  let prevButton = document.getElementById("prevBtn")
  // reload quiz content
  let quizContainer = document.getElementById('quizResModal')
  let progress = document.getElementById('progress')
  
  progress.innerText = (current_quiz + 1) + "/7"

  let guestAnswer = [];

  function updateButtons() {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.style.display = (current_quiz === quizData.length - 1) ? "inline-block" : "none";
  }

document.getElementById('quiz-again').addEventListener('click', ()=>{

    quizContainer.style.display = 'none'

    activateNext()
    reloadQuizContent()

})

document.getElementById('closeResult').addEventListener('click', ()=>{

  quizContainer.style.display = 'none'
  activateNext()
  reloadQuizContent()

})

document.getElementById('reload-btn').addEventListener('click', ()=>{

   activateNext()
   activatePrevious()

   reloadQuizContent()
})

  inActivatePrevious()

  choicesEl.addEventListener("change", e => {
  if (e.target.matches('input[type="radio"]')) {
    document.querySelectorAll(".choice-row").forEach(r => r.classList.remove("active"));
    e.target.closest(".choice-row").classList.add("active");
  }

  });

function showResult(quizData, guestAnswer) {
  const questResult = document.getElementById('quizContent');
  questResult.innerHTML = ""; // clear previous results

  quizData.forEach((q, qIdx) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("review-question");

    const qTitle = document.createElement("h3");
    qTitle.textContent = `${qIdx + 1}. ${q.question}`;
    qDiv.appendChild(qTitle);

    q.choices.forEach((choice, idx) => {
      const choiceRow = document.createElement("div");
      choiceRow.classList.add("choice-row");
      choiceRow.style.display = "flex";
      choiceRow.style.justifyContent = "space-between"; // icon at the end
      choiceRow.style.alignItems = "center";
      choiceRow.style.padding = "6px 10px";
      choiceRow.style.borderRadius = "4px";
      choiceRow.style.border = "1px solid #ccc";
      choiceRow.style.marginBottom = "5px";

      const choiceText = document.createElement("span");
      choiceText.textContent = choice;
      choiceRow.appendChild(choiceText);

      const userIndex = guestAnswer[qIdx]?.guest;
      const correctIndex = q.answer;

      const icon = document.createElement("span"); // icon container
      icon.style.marginLeft = "10px";

      if (userIndex === idx && userIndex === correctIndex) {
        choiceRow.style.borderColor = "#4CAF50"; // green
      
        icon.textContent = "✔"; // pick any from above
        icon.style.color = "green"; // match color to meaning
      } else if (userIndex === idx && userIndex !== correctIndex) {
        choiceRow.style.borderColor = "#E53935"; // red
       
        icon.textContent = "❌";
      } else if (idx === correctIndex && userIndex !== correctIndex) {
        choiceRow.style.border = "2px solid #4CAF50"; // correct-answer
        icon.textContent = "✔"; // pick any from above
        icon.style.color = "green"; // match color to meaning
      }

      choiceRow.appendChild(icon);
      qDiv.appendChild(choiceRow);
    });
    questResult.appendChild(qDiv);
  });
}

function loadQuiz() {
  const q = quizData[current_quiz];
  questionEl.textContent = q.question;
  choicesEl.innerHTML = "";
  resultEl.textContent = "";

  q.choices.forEach((choice, index) => {
  const row = document.createElement("label");
  row.classList.add("choice-row");

  const isChecked = guestAnswer[current_quiz] && guestAnswer[current_quiz].guest === index;
  
  row.innerHTML = `
    <input class="radio-choice" type="radio" name="choice" value="${index}" ${isChecked ? "checked" : ""}>
    <span>${choice}</span>
  `;

  if (isChecked) row.classList.add("active");
  

  choicesEl.appendChild(row);
  });

  updateButtons();
}


// Save current answer
function saveAnswer(selected) {

  if(selected){
      const answer = parseInt(selected.value);

      guestAnswer[current_quiz] = {
        question: quizData[current_quiz].question,
        correct: quizData[current_quiz].answer,
        guest: answer
      };
  }

  
  
}

document.getElementById("submitBtn").addEventListener("click", () => {
 const selected = document.querySelector("input[name='choice']:checked");

 if(selected != null){
    saveAnswer(selected);

    let quizContainer = document.getElementById('quizResModal')
    let quizScore = document.getElementById('quiz-score')
    let score = 0

   guestAnswer.forEach((ga) => {
      if (ga.correct == ga.guest) {
        score++;
        console.log(ga.correct, guestAnswer.guest)
      }
    });

    console.log(score)

    quizScore.innerText = score + " / " + quizData.length

    quizContainer.style.display = 'block'

    showResult(quizData, guestAnswer)
 }
 

});

function activateNext(){
      nextButton.disabled = false
      nextButton.style.opacity = '1'
}

function inActivateNext(){
      nextButton.disabled = true
      nextButton.style.opacity = '0.7'
}

function activatePrevious(){
      prevButton.disabled = false
      prevButton.style.opacity = '1'
}

function inActivatePrevious(){
      prevButton.disabled = true
      prevButton.style.opacity = '0.7'
}


nextButton.addEventListener("click", () => {
  const selected = document.querySelector("input[name='choice']:checked");

  if(selected != null){
    saveAnswer(selected);
    if (current_quiz < quizData.length - 1) {
    current_quiz++;
    loadQuiz();
    progress.innerText = (current_quiz + 1) + "/7"
    if(current_quiz == 6){
      inActivateNext()
      activatePrevious()
    }
    else{
      activateNext()
      activatePrevious()
    }
    }
  }
  
});

prevButton.addEventListener("click", () => {
  const selected = document.querySelector("input[name='choice']:checked");

      saveAnswer(selected);
      if (current_quiz > 0) {
        current_quiz--;
        loadQuiz();
        progress.innerText = (current_quiz + 1) + "/7"
        if(current_quiz == 0){
          inActivatePrevious()
          activateNext()
        }
        else{
          activatePrevious()
          activateNext()
        }
      }
  
 
});

loadQuiz();


 
}

document.querySelectorAll('.chapel-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
});


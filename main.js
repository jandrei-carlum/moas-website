
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

    // Apply quick submit (local demo) -> replace with server or Google Form
    function submitApply(e){
      e.preventDefault();
       const data = {
        name: document.getElementById('quick_full_name').value.trim(),
        age: document.getElementById('quick_age').value,
        email: document.getElementById('quick_email').value.trim(),
      };
      console.log('form submitted', data)

      document.getElementById('applyMsg').textContent = 'Thanks, ' + (data.name||'applicant') + '. We received your quick application. We will contact you soon.';
      // TODO: Send to your backend or Google Form. See note below.

      //e.target.reset();
    }

    // Full apply modal
    function openApply(){ document.getElementById('applyModal').style.display = 'flex' }
    function closeApply(){ document.getElementById('applyModal').style.display = 'none' }


    // Contact (local demo)
    function submitContact(e){
      e.preventDefault();
      document.getElementById('cresp').textContent = 'Message sent. Thank you — we will reply soon.';
      e.target.reset();
    }

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



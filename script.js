/* ==========================================
   CONFIGURATIONS APPS SCRIPT
   ========================================== */
const GOOGLE_SHEET_API = 'https://script.google.com/macros/s/AKfycbzZdxlyU74YwGFajFqMQTsUElbCC_vr4KwQA5t8ShUqcfRbku3AYxoBLhZq3F6_ljc/exec';

/* ==========================================
   INITIALISATION AU CHARGEMENT DE LA PAGE
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  chargerEvenements();
});

/* ==========================================
   GESTION DU MENU BURGER
   ========================================== */
function initBurgerMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const fullscreenMenu = document.querySelector('.fullscreen-menu');
  const menuLinks = document.querySelectorAll('.fullscreen-menu a');

  if (burgerBtn && fullscreenMenu) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      burgerBtn.classList.toggle('open');
      fullscreenMenu.classList.toggle('active');
      document.body.style.overflow = fullscreenMenu.classList.contains('active') ? 'hidden' : '';
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ==========================================
   FONCTION UTILE : FORMATAGE EN YYYY-MM-DD
   ========================================== */
function formaterDateYYYYMMDD(rawDateStr) {
  if (!rawDateStr) return '';

  let str = rawDateStr.trim();

  // Si c'est un format ISO ou Date JS (ex: 2026-07-23T...)
  if (str.includes('T')) {
    str = str.split('T')[0];
  }

  // Si c'est sous forme JJ.MM.AAAA ou JJ/MM/AAAA
  let parts = [];
  if (str.includes('.')) {
    parts = str.split('.');
  } else if (str.includes('/')) {
    parts = str.split('/');
  } else if (str.includes('-')) {
    parts = str.split('-');
    // Si déjà au format AAAA-MM-JJ
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
  }

  // Convertit JJ, MM, AAAA -> AAAA-MM-JJ
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  return str;
}

/* ==========================================
   CHARGEMENT DES DATES (STYLE TABLEAU)
   ========================================== */
async function chargerEvenements() {
  const container = document.getElementById('dates-container');
  if (!container) return;

  try {
    const response = await fetch(GOOGLE_SHEET_API);
    const events = await response.json();

    if (!events || events.length === 0) {
      container.innerHTML = '<p class="no-events">AUCUN ÉVÉNEMENT PRÉVU POUR LE MOMENT.</p>';
      return;
    }

    const rowsHtml = events.map(event => {
      if (!event) return '';

      const rawDate = String(event.DATE || event.Date || '').trim();
      const place = String(event.PLACE || event.Ville || event.Place || '').trim();
      const location = String(event.LOCATION || event.Lieu || event.Location || '').trim();
      const time = String(event.EVENTTIME || event.Heure || event.EventTime || '').trim();

      if (!rawDate && !location) return '';

      const formattedDate = formaterDateYYYYMMDD(rawDate);

      return `
        <div class="date-row">
          <span class="col-date">${formattedDate}</span>
          <span class="col-ville">${place.toUpperCase()}</span>
          <span class="col-lieu">${location.toUpperCase()}</span>
          <span class="col-heure">${time ? time.toUpperCase() : ''}</span>
        </div>
      `;
    }).filter(html => html !== '').join('');

    if (!rowsHtml) {
      container.innerHTML = '<p class="no-events">AUCUN ÉVÉNEMENT PRÉVU POUR LE MOMENT.</p>';
      return;
    }

    container.innerHTML = `
      <div class="dates-table">
        <div class="table-header">
          <span>DATE</span>
          <span>VILLE</span>
          <span>LIEU</span>
          <span>HEURE</span>
        </div>
        ${rowsHtml}
      </div>
    `;

  } catch (error) {
    console.error('Erreur lors du chargement des dates :', error);
    container.innerHTML = '<p class="error-msg">IMPOSSIBLE DE CHARGER LES DATES POUR LE MOMENT.</p>';
  }
}

// Remplace par le numéro WhatsApp officiel du groupe (format international sans le +)
const WHATSAPP_PHONE = "33759593071"; 

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('whatsapp-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const prenom = document.getElementById('prenom').value.trim();
      const nom = document.getElementById('nom').value.trim();
      const titre = document.getElementById('titre').value.trim();
      const message = document.getElementById('message').value.trim();

      let text = `*NOUVEAU MESSAGE - JAMCLUB35*\n\n`;
      text += `*Nom :* ${nom} ${prenom}\n`;
      if (titre) text += `*Sujet :* ${titre}\n`;
      text += `*Message :*\n${message}`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
      
      // Ouvre WhatsApp dans un nouvel onglet
      window.open(whatsappUrl, '_blank');
    });
  }
});
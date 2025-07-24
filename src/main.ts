import './style.css'

// --- Randomization helpers and data (MUST be at the top) ---
const firstNamesMale = ["Liam", "Noah", "Oliver", "Elijah", "James", "William", "Benjamin", "Lucas", "Henry", "Alexander", "Adam", "Taika", "Isaac", "Tama"];
const firstNamesFemale = ["Olivia", "Emma", "Ava", "Charlotte", "Sophia", "Amelia", "Isabella", "Mia", "Evelyn", "Harper", "Amelia", "Emily", "Sophie", "Lily"];
const lastNames = ["Brown", "Smith", "Johnson", "Williams", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Martinez", "Baz"];
const places = ["Auckland, New Zealand", "London, UK", "New York, USA", "Sydney, Australia", "Toronto, Canada", "Cape Town, South Africa", "Tokyo, Japan", "Berlin, Germany", "Paris, France", "Rio de Janeiro, Brazil"];
const jobs = ["receptionist", "teacher", "engineer", "doctor", "artist", "chef", "nurse", "lawyer", "musician", "massage therapist", "developer", "scientist", "pilot", "writer"];
const petTypes = ["dog", "cat", "parrot", "rabbit", "hamster", "lizard", "turtle"];
const petNames = ["Draco", "Bella", "Max", "Charlie", "Luna", "Rocky", "Milo", "Tama", "Coco", "Ruby"];
const countries = [
  { name: "USA", legalWorkingAge: 16 },
  { name: "UK", legalWorkingAge: 16 },
  { name: "Canada", legalWorkingAge: 16 },
  { name: "Germany", legalWorkingAge: 15 },
  { name: "Japan", legalWorkingAge: 15 },
  { name: "Brazil", legalWorkingAge: 14 },
  { name: "Nigeria", legalWorkingAge: 15 },
  { name: "India", legalWorkingAge: 14 },
  { name: "Australia", legalWorkingAge: 15 },
  { name: "France", legalWorkingAge: 16 },
];
function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomCountry() {
  const c = countries[Math.floor(Math.random() * countries.length)];
  return { country: c.name, legalWorkingAge: c.legalWorkingAge };
}
function getRandomBirthdayAndZodiac() {
  const month = randomInt(1, 12);
  const day = randomInt(1, 28); // keep it simple
  const zodiac = getZodiac(month, day);
  return { month, day, zodiac };
}
function getZodiac(month: number, day: number): string {
  // Simple western zodiac
  const zodiacSigns = [
    { sign: "Capricorn", from: [1, 1], to: [1, 19] },
    { sign: "Aquarius", from: [1, 20], to: [2, 18] },
    { sign: "Pisces", from: [2, 19], to: [3, 20] },
    { sign: "Aries", from: [3, 21], to: [4, 19] },
    { sign: "Taurus", from: [4, 20], to: [5, 20] },
    { sign: "Gemini", from: [5, 21], to: [6, 20] },
    { sign: "Cancer", from: [6, 21], to: [7, 22] },
    { sign: "Leo", from: [7, 23], to: [8, 22] },
    { sign: "Virgo", from: [8, 23], to: [9, 22] },
    { sign: "Libra", from: [9, 23], to: [10, 22] },
    { sign: "Scorpio", from: [10, 23], to: [11, 21] },
    { sign: "Sagittarius", from: [11, 22], to: [12, 21] },
    { sign: "Capricorn", from: [12, 22], to: [12, 31] },
  ];
  for (const z of zodiacSigns) {
    const [fromM, fromD] = z.from;
    const [toM, toD] = z.to;
    if (
      (month === fromM && day >= fromD) ||
      (month === toM && day <= toD) ||
      (fromM > toM && ((month === fromM && day >= fromD) || (month === toM && day <= toD)))
    ) {
      return z.sign;
    }
  }
  return "Unknown";
}

// --- School name generator (must be above usage) ---
const schoolPrefixes = ["Greenwood", "Sunnydale", "Riverside", "Hillcrest", "Maplewood", "Oak Valley", "Silver Lake", "Cedar Grove", "Pinecrest", "Willowbrook"];
const schoolTypes = ["Primary School", "Elementary School", "Middle School", "High School", "Academy", "College"];
function randomSchoolName() {
  return `${randomFrom(schoolPrefixes)} ${randomFrom(schoolTypes)}`;
}

// Expand Character type
interface Parent {
  name: string;
  age: number;
  alive: boolean;
  job: string;
}
interface Friend {
  name: string;
  gender: string;
  ageMet: number;
  health: number;
  happiness: number;
  smarts: number;
  looks: number;
}
interface Character {
  name: string;
  age: number;
  health: number;
  happiness: number;
  smarts: number;
  looks: number;
  balance: number;
  country: string;
  legalWorkingAge: number;
  assets: Asset[];
  parents: Parent[];
  friends: Friend[];
  occupation: string | null;
  occupationType: 'none' | 'part-time' | 'full-time' | 'one-time';
  school: string | null;
}

// Asset type
interface Asset {
  name: string;
  acquiredBy: 'parent' | 'purchase';
  ageAcquired: number;
  price?: number;
}

// Initialize character state
let character: Character = {
  name: '',
  age: 0,
  health: 100,
  happiness: 100,
  smarts: 100,
  looks: 100,
  balance: 0, // Always $0 at birth
  country: '',
  legalWorkingAge: 0,
  assets: [],
  parents: [],
  friends: [],
  occupation: null,
  occupationType: 'none',
  school: null,
};

// Define types for events and choices
interface Choice {
  text: string;
  effect: Partial<Character>;
}

interface Event {
  description: string;
  choices: Choice[];
  minAge?: number;
  maxAge?: number;
}

// Add a notification message and game over state
let gameOver = false;
let lifeSummary: string[] = [];

// Persistent save/load helpers
function saveGame() {
  localStorage.setItem('lifeSimSave', JSON.stringify({ character, lifeSummary, gameOver }));
}
function loadGame() {
  const data = localStorage.getItem('lifeSimSave');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      character = parsed.character;
      // Fix for old saves: if age is 0 and balance is not 0, set balance to 0
      if (character.age === 0 && character.balance !== 0) character.balance = 0;
      lifeSummary = parsed.lifeSummary || [];
      gameOver = parsed.gameOver || false;
    } catch {}
  }
}

// Dark mode toggle logic
function setDarkMode(enabled: boolean) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', '1');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', '0');
  }
}
function getDarkMode() {
  return localStorage.getItem('darkMode') === '1';
}

// Expanded events array with more modules and emojis
const events: Event[] = [
  // Fame events
  {
    description: "🌟 A video of you goes viral online!",
    choices: [
      { text: "Embrace the fame", effect: { happiness: 7 } },
      { text: "Stay private", effect: { happiness: 2, smarts: 2 } },
    ],
    minAge: 12,
    maxAge: 40,
  },
  {
    description: "🎤 You are invited to a talent show.",
    choices: [
      { text: "Perform on stage", effect: { happiness: 5, looks: 2 } },
      { text: "Decline", effect: { happiness: -2 } },
    ],
    minAge: 8,
    maxAge: 30,
  },
  // Crime events
  {
    description: "🕵️‍♂️ Your friends dare you to shoplift.",
    choices: [
      { text: "Do it", effect: { smarts: -2, happiness: 2 } },
      { text: "Refuse", effect: { smarts: 2 } },
    ],
    minAge: 12,
    maxAge: 25,
  },
  {
    description: "🚓 You are caught jaywalking by the police.",
    choices: [
      { text: "Apologize", effect: { smarts: 2 } },
      { text: "Argue", effect: { happiness: -3 } },
    ],
    minAge: 10,
    maxAge: 60,
  },
  {
    description: "🏛️ You are accused of a crime you didn't commit.",
    choices: [
      { text: "Hire a lawyer", effect: { smarts: 3, happiness: -2 } },
      { text: "Accept the charge", effect: { happiness: -5 } },
    ],
    minAge: 18,
    maxAge: 60,
  },
  // Family events
  {
    description: "👶 You have a new baby sibling!",
    choices: [
      { text: "Help take care of them", effect: { happiness: 3, smarts: 1 } },
      { text: "Ignore them", effect: { happiness: -2 } },
    ],
    minAge: 2,
    maxAge: 12,
  },
  {
    description: "💍 You get married!",
    choices: [
      { text: "Celebrate with family", effect: { happiness: 7 } },
      { text: "Elope quietly", effect: { happiness: 3, smarts: 2 } },
    ],
    minAge: 20,
    maxAge: 60,
  },
  {
    description: "💔 You go through a divorce.",
    choices: [
      { text: "Focus on self-care", effect: { happiness: -2, health: 2 } },
      { text: "Dwell on the past", effect: { happiness: -5 } },
    ],
    minAge: 25,
    maxAge: 70,
  },
  {
    description: "👨‍👩‍👧‍👦 You have your first child!",
    choices: [
      { text: "Take responsibility", effect: { happiness: 5, smarts: 2 } },
      { text: "Struggle with change", effect: { happiness: -2, health: -2 } },
    ],
    minAge: 20,
    maxAge: 50,
  },
  // More jobs/relationships
  {
    description: "🏢 You start a new job at a big company.",
    choices: [
      { text: "Work hard", effect: { smarts: 3, happiness: 2 } },
      { text: "Coast by", effect: { happiness: -1 } },
    ],
    minAge: 22,
    maxAge: 65,
  },
  {
    description: "💼 You are offered a management position.",
    choices: [
      { text: "Accept", effect: { happiness: 4, smarts: 3 } },
      { text: "Decline", effect: { happiness: -2 } },
    ],
    minAge: 30,
    maxAge: 65,
  },
  // Existing and previous events...
  // Childhood events
  {
    description: "You learned to ride a bike!",
    choices: [
      { text: "Ride every day", effect: { health: 3, happiness: 2 } },
      { text: "Not interested", effect: { happiness: -1 } },
    ],
    minAge: 4,
    maxAge: 8,
  },
  {
    description: "You got invited to a birthday party.",
    choices: [
      { text: "Go and have fun", effect: { happiness: 4 } },
      { text: "Stay home", effect: { happiness: -2, smarts: 1 } },
    ],
    minAge: 5,
    maxAge: 12,
  },
  // Teen events
  {
    description: "You have a big exam coming up.",
    choices: [
      { text: "Study hard", effect: { smarts: 5, happiness: -2 } },
      { text: "Go out with friends", effect: { happiness: 3, smarts: -2 } },
    ],
    minAge: 13,
    maxAge: 18,
  },
  {
    description: "You developed a crush on a classmate.",
    choices: [
      { text: "Ask them out", effect: { happiness: 3 } },
      { text: "Keep it to yourself", effect: { happiness: -1, smarts: 1 } },
    ],
    minAge: 13,
    maxAge: 18,
  },
  // Young adult events
  {
    description: "You are offered a scholarship to university.",
    choices: [
      { text: "Accept", effect: { smarts: 5, happiness: 2 } },
      { text: "Decline", effect: { happiness: -2 } },
    ],
    minAge: 18,
    maxAge: 22,
  },
  {
    description: "You start your first job as a barista.",
    choices: [
      { text: "Work hard", effect: { happiness: 2, smarts: 2 } },
      { text: "Slack off", effect: { happiness: -1, smarts: -2 } },
    ],
    minAge: 18,
    maxAge: 25,
  },
  // Relationship events
  {
    description: "You meet someone special at a party.",
    choices: [
      { text: "Start dating", effect: { happiness: 5 } },
      { text: "Stay friends", effect: { happiness: 2 } },
    ],
    minAge: 16,
    maxAge: 35,
  },
  {
    description: "You have an argument with your partner.",
    choices: [
      { text: "Apologize", effect: { happiness: 2 } },
      { text: "Ignore it", effect: { happiness: -3 } },
    ],
    minAge: 18,
    maxAge: 60,
  },
  // Job events
  {
    description: "You get a promotion at work!",
    choices: [
      { text: "Celebrate", effect: { happiness: 4, smarts: 2 } },
      { text: "Stay focused", effect: { smarts: 3 } },
    ],
    minAge: 22,
    maxAge: 65,
  },
  {
    description: "You are offered a new job in another city.",
    choices: [
      { text: "Accept and move", effect: { happiness: 3, smarts: 2 } },
      { text: "Stay where you are", effect: { happiness: -1 } },
    ],
    minAge: 25,
    maxAge: 50,
  },
  // Health events
  {
    description: "You decide to start exercising regularly.",
    choices: [
      { text: "Stick with it", effect: { health: 7, happiness: 2 } },
      { text: "Give up", effect: { health: -2 } },
    ],
    minAge: 15,
    maxAge: 80,
  },
  {
    description: "You are feeling stressed at work.",
    choices: [
      { text: "Take a vacation", effect: { happiness: 5, health: 2 } },
      { text: "Push through", effect: { health: -3, smarts: 2 } },
    ],
    minAge: 25,
    maxAge: 65,
  },
  // Old age events
  {
    description: "You retire from your job.",
    choices: [
      { text: "Travel the world", effect: { happiness: 6, health: -2 } },
      { text: "Relax at home", effect: { health: 2 } },
    ],
    minAge: 65,
    maxAge: 100,
  },
  {
    description: "You become a grandparent!",
    choices: [
      { text: "Spend time with grandkids", effect: { happiness: 5 } },
      { text: "Focus on hobbies", effect: { happiness: 2, smarts: 2 } },
    ],
    minAge: 60,
    maxAge: 100,
  },
  // Existing events (from previous code)
  {
    description: "Your parents want to enroll you in piano lessons. What do you do?",
    choices: [
      { text: "Accept and practice diligently", effect: { smarts: 5, happiness: 2 } },
      { text: "Accept but slack off", effect: { smarts: 2, happiness: -1 } },
      { text: "Refuse", effect: { happiness: 3, smarts: -2 } },
    ],
    minAge: 4,
    maxAge: 12,
  },
  {
    description: "You made a new friend at school!",
    choices: [
      { text: "Hang out often", effect: { happiness: 5 } },
      { text: "Focus on studies instead", effect: { smarts: 3, happiness: -2 } },
    ],
    minAge: 6,
    maxAge: 18,
  },
  {
    description: "You caught a cold.",
    choices: [
      { text: "Rest and recover", effect: { health: 5, happiness: -1 } },
      { text: "Ignore it", effect: { health: -5, smarts: 1 } },
    ],
    minAge: 2,
  },
  {
    description: "You won a local art contest!",
    choices: [
      { text: "Celebrate!", effect: { happiness: 7 } },
      { text: "Stay humble", effect: { smarts: 2 } },
    ],
    minAge: 8,
    maxAge: 18,
  },
  {
    description: "You got into a fight at school.",
    choices: [
      { text: "Fight back", effect: { health: -10, happiness: 2 } },
      { text: "Walk away", effect: { happiness: -2, smarts: 2 } },
    ],
    minAge: 10,
    maxAge: 18,
  },
  {
    description: "You found a stray puppy.",
    choices: [
      { text: "Adopt it", effect: { happiness: 5, health: -2 } },
      { text: "Leave it", effect: { happiness: -2 } },
    ],
    minAge: 5,
    maxAge: 30,
  },
  {
    description: "You aced your exams!",
    choices: [
      { text: "Celebrate with friends", effect: { happiness: 4 } },
      { text: "Study even harder", effect: { smarts: 5, happiness: -1 } },
    ],
    minAge: 12,
    maxAge: 22,
  },
  {
    description: "You got your first job offer!",
    choices: [
      { text: "Accept it", effect: { happiness: 5, smarts: 2 } },
      { text: "Decline and wait", effect: { happiness: -2, smarts: 3 } },
    ],
    minAge: 18,
    maxAge: 30,
  },
];

// Track current event (null if none)
let currentEvent: Event | null = null;
let activeTab: string = 'main';

function getRandomEventForAge(age: number): Event | null {
  const possible = events.filter(e => (e.minAge === undefined || age >= e.minAge) && (e.maxAge === undefined || age <= e.maxAge));
  if (possible.length === 0) return null;
  return possible[Math.floor(Math.random() * possible.length)];
}

// Helper for status (simple logic for now)
function getStatus() {
  if (character.health > 80) return 'Healthy';
  if (character.health > 50) return 'Okay';
  if (character.health > 20) return 'Unwell';
  return 'Critical';
}

// Helper for balance (simple money system)

function renderTimeline() {
  // Show birth summary at the top
  let birthSummary = '';
  let restSummary: string[] = [];
  if (lifeSummary.length > 0) {
    birthSummary = lifeSummary[0];
    restSummary = lifeSummary.slice(1);
  }
  // Group restSummary by age
  const grouped: Record<string, string[]> = {};
  restSummary.forEach(entry => {
    const match = entry.match(/^(Age (\d+)).*→/);
    const age = match ? match[1] : '';
    if (!grouped[age]) grouped[age] = [];
    grouped[age].push(entry.replace(/^Age \d+ years: /, ''));
  });
  return `
    <div class="timeline-card">
      <div class="timeline-birth" style="background:#f5f7fa;padding:1em 1.2em;border-radius:10px;margin-bottom:1.2em;font-size:1.05em;box-shadow:0 1px 6px rgba(30,40,90,0.06);color:#333;">${birthSummary}</div>
      ${Object.entries(grouped).map(([age, events]) => `
        <div class="timeline-age">${age}</div>
        ${events.map(ev => `<div class="timeline-event">${ev}</div>`).join('')}
      `).join('')}
    </div>
  `;
}

function renderTabs(active = activeTab) {
  const tabs = [
    { key: 'main', label: 'Main' },
    { key: 'occupation', label: 'Occupation' },
    { key: 'assets', label: 'Assets' },
    { key: 'relationships', label: 'Relationships' },
    { key: 'activities', label: 'Activities' },
  ];
  return `
    <div class="tabs">
      ${tabs.map(tab => `<button class="tab-btn${active === tab.key ? ' active' : ''}" data-tab="${tab.key}">${tab.label}</button>`).join('')}
    </div>
    ${active === 'assets' ? renderAssetsTab() : ''}
    ${active === 'relationships' ? renderRelationshipsTab() : ''}
    ${active === 'occupation' ? renderOccupationTab() : ''}
  `;
}

// --- Activities System with Age Restrictions and Crime Outcomes ---
const activityCategories = [
  {
    key: 'school', label: 'School', activities: [
      { text: 'Study for exams', minAge: 6 },
      { text: 'Join a club', minAge: 6 },
      { text: 'Skip class', minAge: 8 },
      { text: 'Do homework', minAge: 6 },
      { text: 'Help a classmate', minAge: 6 },
    ]
  },
  {
    key: 'sports', label: 'Sports', activities: [
      { text: 'Play soccer', minAge: 5 },
      { text: 'Go swimming', minAge: 5 },
      { text: 'Join a team', minAge: 8 },
      { text: 'Go for a run', minAge: 8 },
      { text: 'Take a dance class', minAge: 6 },
    ]
  },
  {
    key: 'hobbies', label: 'Hobbies', activities: [
      { text: 'Paint a picture', minAge: 4 },
      { text: 'Play an instrument', minAge: 6 },
      { text: 'Read a book', minAge: 4 },
      { text: 'Write a story', minAge: 8 },
      { text: 'Build something', minAge: 6 },
    ]
  },
  {
    key: 'social', label: 'Social', activities: [
      { text: 'Hang out with friends', minAge: 5 },
      { text: 'Go to a party', minAge: 13 },
      { text: 'Volunteer', minAge: 10 },
      { text: 'Make a new friend', minAge: 5 },
      { text: 'Visit family', minAge: 2 },
    ]
  },
  {
    key: 'crime', label: 'Crime', activities: [
      { text: 'Steal', minAge: 12 },
      { text: 'Vandalize', minAge: 12 },
      { text: 'Prank someone', minAge: 10 },
      { text: 'Graffiti', minAge: 12 },
      { text: 'Shoplift', minAge: 12 },
    ]
  },
];
let selectedCategory: string | null = null;

function renderActivitiesTab() {
  if (!selectedCategory) {
    // Show categories and Surrender button
    return `<div style="display:flex;flex-wrap:wrap;gap:1em;justify-content:center;margin:2em 0;">
      ${activityCategories.map(cat => `<button class="activity-cat-btn" data-cat="${cat.key}">${cat.label}</button>`).join('')}
      <button id="surrender-btn" style="background:#e53935;color:#fff;font-weight:700;min-width:160px;">Surrender Life</button>
    </div>`;
  } else {
    // Show activities for selected category, filtered by age
    const cat = activityCategories.find(c => c.key === selectedCategory);
    if (!cat) return '';
    const availableActivities = cat.activities.filter(act => (character.age >= (act.minAge ?? 0)));
    if (availableActivities.length === 0) {
      return `<div style="margin:2em 0;text-align:center;">No activities available for your age.</div><div style="margin-bottom:1em;"><button id="back-to-cats">← Categories</button></div>`;
    }
    return `<div style="display:flex;flex-direction:column;align-items:center;margin:2em 0;">
      <div style="margin-bottom:1em;"><button id="back-to-cats">← Categories</button></div>
      <div style="display:flex;flex-direction:column;gap:0.7em;">
        ${availableActivities.map((act, idx) => `<button class="activity-btn" data-idx="${idx}">${act.text}</button>`).join('')}
      </div>
    </div>`;
  }
}

function renderDarkToggleFab() {
  const darkMode = getDarkMode();
  const darkIcon = darkMode ? '☀️' : '🌙';
  const darkLabel = darkMode ? 'Light Mode' : 'Dark Mode';
  // Only icon for FAB, but keep label for accessibility
  return `<button id="dark-toggle" class="dark-toggle-fab" title="Toggle dark mode" aria-label="${darkLabel}">${darkIcon}</button>`;
}

// Add modal CSS (inject into <head> if not present)
function ensureModalStyles() {
  if (document.getElementById('modal-styles')) return;
  const style = document.createElement('style');
  style.id = 'modal-styles';
  style.innerHTML = `
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center;
    }
    .modal-box {
      background: #fff; color: #222; border-radius: 12px; box-shadow: 0 4px 32px rgba(0,0,0,0.18);
      padding: 2em 1.5em; min-width: 320px; max-width: 90vw; max-height: 90vh; overflow-y: auto;
      position: relative;
    }
    .modal-box.dark-mode { background: #23272f; color: #eee; }
    .modal-close {
      position: absolute; top: 0.7em; right: 1em; background: none; border: none; font-size: 1.5em; color: #888; cursor: pointer;
    }
    .modal-choices button { margin: 0.5em 0; width: 100%; font-size: 1em; }
  `;
  document.head.appendChild(style);
}

function showModal(contentHtml: string) {
  ensureModalStyles();
  // Remove any existing modal
  document.querySelectorAll('.modal-overlay').forEach(e => e.remove());
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal-box${getDarkMode() ? ' dark-mode' : ''}">
    <button class="modal-close" aria-label="Close">&times;</button>
    <div class="modal-content">${contentHtml}</div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('.modal-close')?.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function hideModal() {
  document.querySelectorAll('.modal-overlay').forEach(e => e.remove());
}

function renderEventModal(event: Event) {
  showModal(`
    <div style="margin-bottom:1em;font-size:1.1em;font-weight:500;">${event.description}</div>
    <div class="modal-choices" style="display:flex;flex-direction:column;gap:0.7em;">
      ${event.choices.map((choice, idx) => `<button id="modal-choice-${idx}" type="button">${choice.text}</button>`).join('')}
    </div>
  `);
  event.choices.forEach((_, idx) => {
    document.getElementById(`modal-choice-${idx}`)?.addEventListener('click', () => {
      hideModal();
      choose(idx);
    });
  });
}

// Update renderCharacter to handle activity tab logic
function renderCharacter() {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;
  // Remove dark toggle from header
  if (gameOver) {
    app.innerHTML = `
      <div class="main-container">
        <div class="header">
          <span class="player">${character.name}</span>
          <span class="status">${getStatus()}</span>
          <span class="balance">$${(character.balance ?? 0).toLocaleString()}</span>
          <span class="age-label" style="margin-left:1.2em;font-weight:600;">Age: ${character.age}</span>
        </div>
        <h1>Game Over</h1>
        <div class="card">
          <p style="font-size:1.2em;margin-bottom:1.5em;">You died at age <strong>${character.age}</strong>.</p>
          <div style="margin-bottom:1em;">
            <strong>Final Stats:</strong><br>
            Health: ${character.health}, Happiness: ${character.happiness}, Smarts: ${character.smarts}, Looks: ${character.looks}
          </div>
          <div style="margin-bottom:1em;">
            <strong>Life Story:</strong>
            <ul style="text-align:left;max-height:120px;overflow:auto;padding-left:1.2em;">
              ${lifeSummary.map(e => `<li>${e}</li>`).join('')}
            </ul>
          </div>
          <button id="new-life-btn" type="button">Start New Life</button>
        </div>
        ${renderTabs()}
      </div>
      ${renderDarkToggleFab()}
    `;
    setTimeout(() => {
      document.getElementById('new-life-btn')?.addEventListener('click', () => {
        console.log('Start New Life button clicked');
        restartGame();
      });
      document.getElementById('dark-toggle')?.addEventListener('click', () => {
        setDarkMode(!getDarkMode());
        renderCharacter();
      });
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tab = (e.target as HTMLElement).getAttribute('data-tab');
          if (tab) {
            activeTab = tab;
            renderCharacter();
          }
        });
      });
    }, 0);
    return;
  }
  app.innerHTML = `
    <div class="main-container">
      <div class="header">
        <span class="player">${character.name}</span>
        <span class="status">${getStatus()}</span>
        <span class="balance">$${(character.balance ?? 0).toLocaleString()}</span>
        <span class="age-label" style="margin-left:1.2em;font-weight:600;">Age: ${character.age}</span>
      </div>
      ${character.school ? `<div style='margin:1em 0;'><b>School:</b> ${character.school}</div>` : ''}
      ${renderTimeline()}
      <div class="stats-section">
        <div class="stat">
          <span class="stat-label"><span class="stat-emoji">😊</span> Happiness</span>
          <div class="stat-bar"><div class="stat-bar-inner stat-happiness" style="width: ${character.happiness}%;"></div></div>
          <span class="stat-value">${character.happiness}%</span>
        </div>
        <div class="stat">
          <span class="stat-label"><span class="stat-emoji">❤️</span> Health</span>
          <div class="stat-bar"><div class="stat-bar-inner stat-health" style="width: ${character.health}%;"></div></div>
          <span class="stat-value">${character.health}%</span>
        </div>
        <div class="stat">
          <span class="stat-label"><span class="stat-emoji">🧠</span> Smarts</span>
          <div class="stat-bar"><div class="stat-bar-inner stat-smarts" style="width: ${character.smarts}%;"></div></div>
          <span class="stat-value">${character.smarts}%</span>
        </div>
        <div class="stat">
          <span class="stat-label"><span class="stat-emoji">🌟</span> Looks</span>
          <div class="stat-bar"><div class="stat-bar-inner stat-looks" style="width: ${character.looks}%;"></div></div>
          <span class="stat-value">${character.looks}%</span>
        </div>
      </div>
      <div class="age-btn-container">
        ${currentEvent || activeTab !== 'main' ? '' : '<button id="age-up" type="button">Age +</button>'}
      </div>
      ${activeTab === 'activities' ? renderActivitiesTab() : ''}
      ${renderTabs(activeTab)}
    </div>
    ${renderDarkToggleFab()}
  `;
  if (!currentEvent && !gameOver && activeTab === 'main') {
    document.getElementById('age-up')?.addEventListener('click', ageUp);
  }
  if (currentEvent) {
    renderEventModal(currentEvent);
  }
  if (activeTab === 'activities') {
    document.querySelectorAll('.activity-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = (e.target as HTMLElement).getAttribute('data-cat');
        if (cat) {
          selectedCategory = cat;
          renderCharacter();
        }
      });
    });
    document.getElementById('back-to-cats')?.addEventListener('click', () => {
      selectedCategory = null;
      renderCharacter();
    });
    const cat = activityCategories.find(c => c.key === selectedCategory);
    const availableActivities = cat ? cat.activities.filter(act => (character.age >= (act.minAge ?? 0))) : [];
    document.querySelectorAll('.activity-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        if (!cat) return;
        const activity = availableActivities[i];
        let logMsg = `Age ${character.age} years: Did activity: ${activity.text}`;
        // Special logic for crime activities
        if (cat.key === 'crime') {
          if (Math.random() < 0.4) { // 40% chance arrested
            character.happiness = Math.max(0, character.happiness - 10);
            character.health = Math.max(0, character.health - 5);
            if (character.balance >= 100) character.balance -= 100;
            logMsg = `Age ${character.age} years: Tried to ${activity.text.toLowerCase()} — You were ARRESTED! (-10 happiness, -5 health, -$100)`;
          } else {
            character.happiness = Math.min(100, character.happiness + 2);
            logMsg = `Age ${character.age} years: Tried to ${activity.text.toLowerCase()} — You ESCAPED! (+2 happiness)`;
          }
        }
        lifeSummary.push(logMsg);
        selectedCategory = null;
        saveGame();
        renderCharacter();
      });
    });
    document.getElementById('surrender-btn')?.addEventListener('click', () => {
      if (!gameOver) {
        lifeSummary.push(`You surrendered your life.`);
        gameOver = true;
        saveGame();
        renderCharacter();
      }
    });
  }
  if (activeTab === 'occupation') {
    document.querySelectorAll('.job-apply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const job = (btn as HTMLElement).getAttribute('data-job');
        if (job) applyForJob(job);
      });
    });
  }
  document.getElementById('dark-toggle')?.addEventListener('click', () => {
    setDarkMode(!getDarkMode());
    renderCharacter();
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = (e.target as HTMLElement).getAttribute('data-tab');
      if (tab) {
        activeTab = tab;
        renderCharacter();
      }
    });
  });
}

// Restore ageUp and choose functions
function ageUp() {
  if (gameOver) return;
  character.age += 1;
  character.health = Math.max(0, Math.min(100, character.health + (Math.floor(Math.random() * 11) - 5)));
  character.happiness = Math.max(0, Math.min(100, character.happiness + (Math.floor(Math.random() * 11) - 5)));
  character.smarts = Math.max(0, Math.min(100, character.smarts + (Math.floor(Math.random() * 11) - 5)));
  character.looks = Math.max(0, Math.min(100, character.looks + (Math.floor(Math.random() * 11) - 5)));
  ageParentsAndCheckDeath();
  checkAssignSchool();
  // Example: join a team at age 10
  if (character.age === 10) {
    const team = pickTeamByStats();
    lifeSummary.push(`At age 10: Joined the ${team}.`);
    saveGame();
  }
  // Example: make a new friend at age 8
  if (character.age === 8) {
    addFriend();
  }
  // Random death chance (simulate unpredictability)
  if (Math.random() < 0.01) { // 1% chance per year
    lifeSummary.push(`You died unexpectedly at age ${character.age}.`);
    gameOver = true;
    saveGame();
    renderCharacter();
    return;
  }
  // Pick a random event for this age
  currentEvent = getRandomEventForAge(character.age);
  saveGame();
  renderCharacter();
}

function choose(choiceIdx: number) {
  if (!currentEvent || gameOver) return;
  const effect = currentEvent.choices[choiceIdx].effect;
  // Apply effects
  character.health = Math.max(0, Math.min(100, character.health + (effect.health ?? 0)));
  character.happiness = Math.max(0, Math.min(100, character.happiness + (effect.happiness ?? 0)));
  character.smarts = Math.max(0, Math.min(100, character.smarts + (effect.smarts ?? 0)));
  character.looks = Math.max(0, Math.min(100, character.looks + (effect.looks ?? 0)));
  // Only narrate event and choice, no stat changes
  lifeSummary.push(`${currentEvent.description} → ${currentEvent.choices[choiceIdx].text}`);
  currentEvent = null;
  // Check for game over
  if (character.health <= 0) {
    gameOver = true;
    saveGame();
    renderCharacter();
    return;
  }
  // Random death chance after event
  if (Math.random() < 0.01) { // 1% chance per event
    lifeSummary.push(`You died unexpectedly at age ${character.age}.`);
    gameOver = true;
    saveGame();
    renderCharacter();
    return;
  }
  saveGame();
  renderCharacter();
}

function restartGame() {
  const { country, legalWorkingAge } = randomCountry();
  // Generate name
  const gender = Math.random() < 0.5 ? "male" : "female";
  const firstName = gender === "male" ? randomFrom(firstNamesMale) : randomFrom(firstNamesFemale);
  const lastName = randomFrom(lastNames);
  const fullName = `${firstName} ${lastName}`;
  character = {
    name: fullName,
    age: 0,
    health: randomInt(60, 100),
    happiness: randomInt(50, 100),
    smarts: randomInt(50, 100),
    looks: randomInt(30, 100),
    balance: 0,
    country,
    legalWorkingAge,
    assets: getInitialParentAssets(),
    parents: generateParents(lastName),
    friends: [],
    occupation: null,
    occupationType: 'none',
    school: null,
  };
  currentEvent = null;
  gameOver = false;
  lifeSummary = [generateBirthSummary(country, fullName, gender, lastName)];
  selectedCategory = null;
  activeTab = 'main';
  saveGame();
  renderCharacter();
}

// Update generateBirthSummary to accept name, gender, lastName
function generateBirthSummary(countryOverride?: string, fullNameOverride?: string, genderOverride?: string, lastNameOverride?: string) {
  const gender = genderOverride || (Math.random() < 0.5 ? "male" : "female");
  const firstName = gender === "male" ? randomFrom(firstNamesMale) : randomFrom(firstNamesFemale);
  const lastName = lastNameOverride || randomFrom(lastNames);
  const fullName = fullNameOverride || `${firstName} ${lastName}`;
  const birthplace = randomFrom(places);
  const { month, day, zodiac } = getRandomBirthdayAndZodiac();
  const birthdayStr = `${month}/${day}`;
  const country = countryOverride || (character.country || randomCountry().country);
  // Parents
  const fatherName = randomFrom(firstNamesMale) + " " + lastName;
  const motherName = randomFrom(firstNamesFemale) + " " + lastName;
  const fatherAge = randomInt(22, 40);
  const motherAge = randomInt(22, 45);
  const fatherJob = randomFrom(jobs);
  const motherJob = randomFrom(jobs);
  // Siblings
  const hasSibling = Math.random() < 0.5;
  let siblingStr = "";
  if (hasSibling) {
    const sibGender = Math.random() < 0.5 ? "brother" : "sister";
    const sibName = sibGender === "brother" ? randomFrom(firstNamesMale) : randomFrom(firstNamesFemale);
    siblingStr = `I have a ${sibGender} named ${sibName}.`;
  }
  // Pets
  const hasPet = Math.random() < 0.4;
  let petStr = "";
  if (hasPet) {
    const petType = randomFrom(petTypes);
    const petName = randomFrom(petNames);
    petStr = `We have a family ${petType} named ${petName}.`;
  }
  // Compose summary
  return `
    <strong>Birth Summary</strong><br>
    Name: <b>${fullName}</b> (${gender})<br>
    Country: <b>${country}</b><br>
    Born in: <b>${birthplace}</b><br>
    Birthday: <b>${birthdayStr}</b> &mdash; Zodiac: <b>${zodiac}</b><br>
    Father: ${fatherName}, ${fatherJob} (age ${fatherAge})<br>
    Mother: ${motherName}, ${motherJob} (age ${motherAge})<br>
    ${siblingStr}<br>
    ${petStr}
  `.replace(/\n+/g, '').trim();
}

// Render Assets tab
function renderAssetsTab() {
  if (!character.assets.length) {
    return `<div style="margin:2em 0;text-align:center;">No assets yet.</div>`;
  }
  const parentAssets = character.assets.filter(a => a.acquiredBy === 'parent');
  const purchasedAssets = character.assets.filter(a => a.acquiredBy === 'purchase');
  return `
    <div style="margin:2em 0;">
      <div style="margin-bottom:1.2em;"><strong>Assets from Parents</strong><ul>${parentAssets.map(a => `<li>${a.name} (age ${a.ageAcquired})</li>`).join('')}</ul></div>
      <div><strong>Purchased Assets</strong><ul>${purchasedAssets.map(a => `<li>${a.name} (age ${a.ageAcquired}, $${a.price})</li>`).join('')}</ul></div>
    </div>
  `;
}

// Age up parents and handle parent death
function ageParentsAndCheckDeath() {
  character.parents.forEach(parent => {
    if (parent.alive) {
      parent.age++;
      // 1% chance per year after age 60
      if (parent.age > 60 && Math.random() < 0.01 * (parent.age - 60)) {
        parent.alive = false;
        lifeSummary.push(`At age ${character.age}: Your parent ${parent.name} passed away.`);
      }
    }
  });
}

// Add friend
function addFriend() {
  const friend = generateFriendProfile();
  character.friends.push(friend);
  lifeSummary.push(`At age ${character.age}: Became friends with ${friend.name} (${friend.gender}).`);
  saveGame();
  showFriendProfile(friend);
  renderCharacter();
}

// Occupation/job logic
const jobsList = [
  { name: 'Barista', minAge: 16, type: 'part-time', pay: 200 },
  { name: 'Cashier', minAge: 14, type: 'part-time', pay: 150 },
  { name: 'Dog Walker', minAge: 10, type: 'one-time', pay: 20 },
  { name: 'Babysitter', minAge: 12, type: 'one-time', pay: 30 },
  { name: 'Intern', minAge: 16, type: 'part-time', pay: 100 },
  { name: 'Software Engineer', minAge: 18, type: 'full-time', pay: 1200 },
  { name: 'Teacher', minAge: 21, type: 'full-time', pay: 900 },
  { name: 'Retail Worker', minAge: 16, type: 'part-time', pay: 180 },
  { name: 'Freelance Artist', minAge: 14, type: 'one-time', pay: 50 },
];

function getAvailableJobs() {
  return jobsList.filter(j => character.age >= j.minAge && (character.occupationType === 'none' || j.type !== 'full-time'));
}

function applyForJob(jobName: string) {
  const job = jobsList.find(j => j.name === jobName);
  if (!job) return;
  // 60% chance to get part-time/one-time, 40% for full-time
  const hired = Math.random() < (job.type === 'full-time' ? 0.4 : 0.6);
  if (hired) {
    character.occupation = job.name;
    character.occupationType = job.type as any;
    character.balance += job.pay;
    lifeSummary.push(`At age ${character.age}: Hired as ${job.name} (+$${job.pay})`);
  } else {
    lifeSummary.push(`At age ${character.age}: Applied for ${job.name} but was rejected.`);
  }
  saveGame();
  renderCharacter();
}

// Render Relationships tab
function renderRelationshipsTab() {
  return `
    <div style="margin:2em 0;">
      <div style="margin-bottom:1.2em;"><strong>Parents</strong><ul>${character.parents.map(p => `<li>${p.name} (${p.job}), Age: ${p.age}, ${p.alive ? 'Alive' : 'Deceased'}</li>`).join('')}</ul></div>
      <div><strong>Friends</strong><ul>${character.friends.length ? character.friends.map(f => `<li>${f.name} (${f.gender}) (met at age ${f.ageMet})<br>Health: ${f.health}, Happiness: ${f.happiness}, Smarts: ${f.smarts}, Looks: ${f.looks}</li>`).join('') : '<li>No friends yet.</li>'}</ul></div>
    </div>
  `;
}

// Render Occupation tab
function renderOccupationTab() {
  const availableJobs = getAvailableJobs();
  return `
    <div style="margin:2em 0;">
      <div><strong>Current Occupation:</strong> ${character.occupation ? character.occupation : 'None'}</div>
      <div style="margin-top:1.2em;"><strong>Available Jobs</strong><ul>${availableJobs.map(j => `<li>${j.name} (type: ${j.type}, pay: $${j.pay}, min age: ${j.minAge}) <button class="job-apply-btn" data-job="${j.name}">Apply</button></li>`).join('')}</ul></div>
    </div>
  `;
}

// --- Helper functions (must be above usage) ---
function getInitialParentAssets(): Asset[] {
  return [
    { name: 'Baby Blanket', acquiredBy: 'parent', ageAcquired: 0 },
    { name: 'Stuffed Animal', acquiredBy: 'parent', ageAcquired: 0 },
  ];
}

function generateParents(lastName: string): Parent[] {
  return [
    {
      name: randomFrom(firstNamesMale) + ' ' + lastName,
      age: randomInt(22, 40),
      alive: true,
      job: randomFrom(jobs),
    },
    {
      name: randomFrom(firstNamesFemale) + ' ' + lastName,
      age: randomInt(22, 45),
      alive: true,
      job: randomFrom(jobs),
    },
  ];
}

function checkAssignSchool() {
  if (!character.school && character.age >= 5) {
    character.school = randomSchoolName();
    lifeSummary.push(`At age ${character.age}: Started attending ${character.school}.`);
    saveGame();
  }
}

const teams = [
  { name: 'Soccer Team', stat: 'health' },
  { name: 'Chess Club', stat: 'smarts' },
  { name: 'Debate Club', stat: 'smarts' },
  { name: 'Cheer Team', stat: 'looks' },
  { name: 'Art Club', stat: 'happiness' },
  { name: 'Science Club', stat: 'smarts' },
  { name: 'Swim Team', stat: 'health' },
];
function pickTeamByStats() {
  const statVals = [
    { stat: 'health', value: character.health },
    { stat: 'happiness', value: character.happiness },
    { stat: 'smarts', value: character.smarts },
    { stat: 'looks', value: character.looks },
  ];
  statVals.sort((a, b) => b.value - a.value);
  const bestStat = statVals[0].stat;
  const possibleTeams = teams.filter(t => t.stat === bestStat);
  return randomFrom(possibleTeams).name;
}

function generateFriendProfile(): Friend {
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const name = gender === 'male' ? randomFrom(firstNamesMale) : randomFrom(firstNamesFemale);
  return {
    name,
    gender,
    ageMet: character.age,
    health: randomInt(50, 100),
    happiness: randomInt(50, 100),
    smarts: randomInt(50, 100),
    looks: randomInt(30, 100),
  };
}

function showFriendProfile(friend: Friend) {
  showModal(`
    <div style="text-align:center;">
      <h3>New Friend!</h3>
      <div><b>Name:</b> ${friend.name} (${friend.gender})</div>
      <div><b>Met at age:</b> ${friend.ageMet}</div>
      <div style="margin:1em 0;">
        <div><b>Health:</b> ${friend.health}</div>
        <div><b>Happiness:</b> ${friend.happiness}</div>
        <div><b>Smarts:</b> ${friend.smarts}</div>
        <div><b>Looks:</b> ${friend.looks}</div>
      </div>
    </div>
  `);
}

// Load game on startup
loadGame();
// Initial render
renderCharacter();


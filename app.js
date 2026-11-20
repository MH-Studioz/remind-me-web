'use strict';

/* RemindMe — tasks, reminders and focus sprints in one calm place.
   Cream paper, Instrument Serif headlines, orange accent, four tabs
   (Today, Tasks, Focus, Stats) plus settings and sheets. */

const BASE_KEY = 'remindme.web.v4';
const SESSION_KEY = 'remindme.web.session';
const ACCOUNTS_KEY = 'remindme.web.accounts';
const DATA_PREFIX = 'remindme.web.data.';
const SYNC_CONFIG_KEY = 'remindme.web.sync.config';
const KEY = BASE_KEY;
const DAY = 86400000;
const PRIORITIES = [
  { n: 1, label: 'Urgent' },
  { n: 2, label: 'High' },
  { n: 3, label: 'Normal' },
  { n: 4, label: 'Low' },
];
const REPEATS = [
  ['none', 'Does not repeat'],
  ['daily', 'Every day'],
  ['weekdays', 'Every weekday'],
  ['weekly', 'Every week'],
  ['monthly', 'Every month'],
  ['custom', 'Custom interval'],
];
const PRESETS = {
  pomodoro: { label: 'Pomodoro', focus: 25, brk: 5 },
  deep: { label: 'Deep Work', focus: 50, brk: 10 },
  custom: { label: 'Custom', focus: 25, brk: 5 },
};
const DAY_INITIALS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_LINKS = () => [
  { label: 'YouTube', url: 'https://www.youtube.com' },
  { label: 'Classroom', url: 'https://classroom.google.com' },
];
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PEEK_MS = 3 * 60 * 1000;
const DAY_WORDS = {
  mon: 0, monday: 0, mo: 0,
  tue: 1, tues: 1, tuesday: 1, tu: 1,
  wed: 2, weds: 2, wednesday: 2, we: 2,
  thu: 3, thur: 3, thurs: 3, thursday: 3, th: 3,
  fri: 4, friday: 4, fr: 4,
  sat: 5, saturday: 5, sa: 5,
  sun: 6, sunday: 6, su: 6,
};

const ICONS = {
  today: '<circle cx="12" cy="12" r="4"/><path d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5"/>',
  tasks: '<path d="M4.2 6.6l1.5 1.5 2.6-2.7"/><path d="M4.2 12.3l1.5 1.5 2.6-2.7"/><path d="M4.2 18l1.5 1.5 2.6-2.7"/><path d="M11.8 7h8.2M11.8 12.7h8.2M11.8 18.4h8.2"/>',
  focus: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l2.8 2"/>',
  stats: '<path d="M4.6 19.4V12M12 19.4V5.4M19.4 19.4v-4.6"/>',
  gear: '<path d="M12.2 2.6h-.4a1.9 1.9 0 00-1.9 1.9v.2a1.9 1.9 0 01-1 1.6l-.4.3a1.9 1.9 0 01-1.9 0l-.2-.1a1.9 1.9 0 00-2.6.7l-.2.4a1.9 1.9 0 00.7 2.6l.2.1a1.9 1.9 0 011 1.6v.5a1.9 1.9 0 01-1 1.7l-.2.1a1.9 1.9 0 00-.7 2.6l.2.4a1.9 1.9 0 002.6.7l.2-.1a1.9 1.9 0 011.9 0l.4.3a1.9 1.9 0 011 1.6v.2a1.9 1.9 0 001.9 1.9h.4a1.9 1.9 0 001.9-1.9v-.2a1.9 1.9 0 011-1.6l.4-.3a1.9 1.9 0 011.9 0l.2.1a1.9 1.9 0 002.6-.7l.2-.4a1.9 1.9 0 00-.7-2.6l-.2-.1a1.9 1.9 0 01-1-1.7v-.5a1.9 1.9 0 011-1.6l.2-.1a1.9 1.9 0 00.7-2.6l-.2-.4a1.9 1.9 0 00-2.6-.7l-.2.1a1.9 1.9 0 01-1.9 0l-.4-.3a1.9 1.9 0 01-1-1.6v-.2a1.9 1.9 0 00-1.9-1.9z"/><circle cx="12" cy="12" r="2.9"/>',
  bell: '<path d="M6.6 9.6a5.4 5.4 0 0110.8 0c0 4 1.6 5.4 1.6 5.4H5s1.6-1.4 1.6-5.4z"/><path d="M10 18.2a2.2 2.2 0 004 0"/>',
  plus: '<path d="M12 5.4v13.2M5.4 12h13.2"/>',
  chevronRight: '<path d="M9.4 5.6l6.2 6.4-6.2 6.4"/>',
  chevronLeft: '<path d="M14.6 5.6L8.4 12l6.2 6.4"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.2"/><path d="M15.4 15.4L20 20"/>',
  close: '<path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6"/>',
  check: '<path d="M4.8 12.6l4.4 4.4 10-10.4"/>',
  trash: '<path d="M4.6 7h14.8M9.4 7V4.8h5.2V7M6.6 7l.9 12.2h9l.9-12.2"/>',
  reset: '<path d="M4.2 12a7.8 7.8 0 101.9-5.1"/><path d="M4.2 4.6v4.2h4.2"/>',
  skip: '<path d="M6.4 5.6l8.6 6.4-8.6 6.4z"/><path d="M17.6 5.4v13.2"/>',
  play: '<path d="M7.4 5.4l11.2 6.6-11.2 6.6z"/>',
  pause: '<path d="M8.6 5.4v13.2M15.4 5.4v13.2"/>',
  user: '<circle cx="12" cy="8.6" r="3.6"/><path d="M5.4 19.6c0-3.8 3-6 6.6-6s6.6 2.2 6.6 6"/>',
  shield: '<path d="M12 3.6l7 2.6v5.6c0 4.2-2.8 7-7 8.6-4.2-1.6-7-4.4-7-8.6V6.2z"/>',
  file: '<path d="M6.6 3.8h7l4 4v12.4h-11z"/><path d="M13.4 3.8v4.2h4.2"/>',
  mail: '<rect x="3.4" y="6" width="17.2" height="12" rx="2.6"/><path d="M4.4 7.6L12 13l7.6-5.4"/>',
  lock: '<rect x="5.4" y="10.6" width="13.2" height="9" rx="2.4"/><path d="M8.6 10.6V8.2a3.4 3.4 0 016.8 0v2.4"/>',
  eye: '<path d="M2.4 12S6 6.2 12 6.2 21.6 12 21.6 12 18 17.8 12 17.8 2.4 12 2.4 12z"/><circle cx="12" cy="12" r="2.9"/>',
  eyeOff: '<path d="M4 4l16 16"/><path d="M9.4 5.2A9.4 9.4 0 0112 5c6 0 9.6 7 9.6 7a17.3 17.3 0 01-3.4 4.1"/><path d="M6.3 7.3A16.4 16.4 0 002.4 12s3.6 7 9.6 7a9.6 9.6 0 003-.5"/><path d="M10.2 10.3a2.6 2.6 0 003.6 3.6"/>',
  arrowRight: '<path d="M5 12h13.4"/><path d="M13.6 6.8L19.8 12l-6.2 5.2"/>',
};

const app = document.getElementById('app');
const now = () => Date.now();
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 't' + Math.random().toString(36).slice(2));
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (name, size = 18) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;

/* ---------- dates ---------- */

const pad = (n) => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfDay = (ms) => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
const startOfWeek = (ms) => { const d = new Date(ms); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); d.setHours(0, 0, 0, 0); return d.getTime(); };
const longDate = (ms = now()) => new Date(ms).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const clockTime = (ms) => new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

function relativeDue(task, at = now()) {
  if (task.dueAt == null) return 'Anytime';
  const diff = task.dueAt - at;
  if (diff < 0) return 'Overdue';
  if (diff < 3600000) return Math.max(1, Math.round(diff / 60000)) + 'm left';
  if (diff < DAY) return Math.round(diff / 3600000) + 'h left';
  if (dayKey(new Date(task.dueAt)) === dayKey(new Date(at + DAY))) return 'Tomorrow ' + clockTime(task.dueAt);
  return new Date(task.dueAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + clockTime(task.dueAt);
}

/* ---------- state ---------- */

function emptyState() {
  return {
    session: null,
    theme: 'light',
    settings: {
      dailyGoal: 120,
      sprintGoal: 4,
      weekGoal: 4,
      quiet: { enabled: true, start: 22, end: 8 },
      planner: { enabled: true, hour: 7 },
      links: DEFAULT_LINKS(),
      timetable: [],
    },
    tasks: [],
    focus: { days: {}, sprints: {}, history: [] },
    timer: null,
  };
}

let profile = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    // Only local accounts exist now; discard anything an older build stored.
    if (!saved || (saved.mode !== 'guest' && saved.mode !== 'local')) return null;
    // A local account's key only lives in memory, so every new load starts locked.
    if (saved.mode === 'local') return { ...saved, locked: true };
    return saved;
  } catch (e) { return null; }
})();

const storeKey = () => (profile && profile.mode === 'guest' ? BASE_KEY + '.guest' : null);
const isSignedIn = () => !!(profile && profile.mode === 'local' && !profile.locked);

function loadStore() {
  const key = storeKey();
  if (!key) return null;
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

/* ---------- local accounts (encrypted with the user's password) ---------- */

const encoder = new TextEncoder();
const toB64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromB64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

const loadAccounts = () => {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); } catch { return []; }
};
const saveAccounts = (list) => localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));

async function deriveKey(password, salt) {
  const base = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 210000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    // Extractable so a recovery code can wrap this key and reopen it later.
    true,
    ['encrypt', 'decrypt'],
  );
}

async function writeLocal(id, key, payload, meta) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(payload)));
  const record = { iv: toB64(iv), data: toB64(cipher), savedAt: Date.now() };
  // The email and salt ride along in the clear (they already sit in the account
  // index) so a lost index can be rebuilt instead of stranding the account.
  if (meta) record.meta = meta;
  localStorage.setItem(DATA_PREFIX + id, JSON.stringify(record));
}

const accountMeta = (p) => (p && p.mode === 'local'
  ? { email: p.email, name: p.name, salt: p.salt || '', recovery: p.recovery || null }
  : null);

/* Stores the derived key with the session so reopening the app stays unlocked.
   "Lock now" and signing out are what remove it. */
async function withKey(record, key) {
  try {
    const raw = await crypto.subtle.exportKey('raw', key);
    return { ...record, key: toB64(raw) };
  } catch (e) {
    return { ...record, key: null };
  }
}

function blobForEmail(email) {
  const wanted = String(email || '').trim().toLowerCase();
  if (!wanted) return null;
  for (let i = 0; i < localStorage.length; i += 1) {
    const full = localStorage.key(i) || '';
    if (!full.startsWith(DATA_PREFIX)) continue;
    try {
      const record = JSON.parse(localStorage.getItem(full) || 'null');
      const meta = record && record.meta;
      if (meta && meta.salt && String(meta.email || '').toLowerCase() === wanted) {
        return { id: full.slice(DATA_PREFIX.length), meta };
      }
    } catch (e) { /* a damaged record is not a match */ }
  }
  return null;
}

/* Rebuilds an index entry from its encrypted data record, so an account is
   still found when only the index was lost. */
function recoverAccount(email) {
  const found = blobForEmail(email);
  if (!found) return null;
  const account = {
    id: found.id,
    email: found.meta.email,
    name: found.meta.name || String(email).split('@')[0],
    salt: found.meta.salt,
    recovery: found.meta.recovery || null,
  };
  const list = loadAccounts();
  if (!list.some((a) => a.id === account.id)) {
    list.push(account);
    saveAccounts(list);
  }
  return account;
}

async function readLocal(id, key) {
  const raw = localStorage.getItem(DATA_PREFIX + id);
  if (!raw) return emptyState();
  const blob = JSON.parse(raw);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(blob.iv) }, key, fromB64(blob.data));
  return JSON.parse(new TextDecoder().decode(plain));
}

function normalize(saved) {
  const base = emptyState();
  const s = saved || {};
  return {
    ...base,
    ...s,
    settings: {
      ...base.settings,
      ...(s.settings || {}),
      quiet: { ...base.settings.quiet, ...((s.settings || {}).quiet || {}) },
      planner: { ...base.settings.planner, ...((s.settings || {}).planner || {}) },
      links: Array.isArray((s.settings || {}).links)
        ? s.settings.links.map((l) => ({ label: String(l.label || ''), url: String(l.url || '') }))
        : base.settings.links,
      timetable: Array.isArray((s.settings || {}).timetable)
        ? s.settings.timetable.filter((e) => e && typeof e === 'object').map((e) => ({
          id: String(e.id || uid()),
          subject: String(e.subject || 'Class'),
          day: Math.min(6, Math.max(0, Number(e.day) || 0)),
          start: String(e.start || '09:00'),
          end: String(e.end || '10:00'),
        }))
        : base.settings.timetable,
    },
    focus: {
      days: { ...((s.focus || {}).days || {}) },
      sprints: { ...((s.focus || {}).sprints || {}) },
      history: Array.isArray((s.focus || {}).history) ? s.focus.history : [],
    },
    tasks: Array.isArray(s.tasks) ? s.tasks : [],
    timer: s.timer || null,
  };
}

let state = normalize(loadStore());

const route = () => (location.hash || '#/').replace(/^#/, '') || '/';
const ui = {
  query: '',
  priorityFilter: 0,
  showAll: false,
  selectMode: false,
  selected: new Set(),
  sheet: null,
  sheetFocused: false,
  draft: null,
  trend: 7,
  focusMode: 'general',
  focusTaskId: null,
  preset: 'pomodoro',
  authNote: '',
  authEmail: '',
  linksDraft: null,
  timetableText: '',
  recoveryCode: null,
  syncNote: '',
  syncCode: null,
  syncDraft: null,
  peekUntil: 0,
};

let cryptoKey = null;
let saveTimer = 0;

function save() {
  const tracked = syncState();
  if (tracked) setSyncState({ ...tracked, dirty: true });
  queuePush();
  if (profile && profile.mode === 'local') {
    if (!cryptoKey) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      writeLocal(profile.id, cryptoKey, state, accountMeta(profile)).catch((e) => console.warn('save failed', e));
    }, 140);
    return;
  }
  const key = storeKey();
  if (!key) return;
  try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) { console.warn('save failed', e); }
}

function setProfile(next) {
  profile = next;
  if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  else localStorage.removeItem(SESSION_KEY);
}

function go(path) { location.hash = '#' + path; }

/* ---------- task helpers ---------- */

const openTasks = () => state.tasks.filter((t) => !t.completed);
const dueToday = () => state.tasks.filter((t) => t.dueAt != null && dayKey(new Date(t.dueAt)) === dayKey() && !t.completed);
const doneToday = () => state.tasks.filter((t) => t.completed && t.completedAt != null && dayKey(new Date(t.completedAt)) === dayKey());

function sortedOpen() {
  return [...openTasks()].sort((a, b) => {
    const byDue = (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity);
    if (byDue !== 0) return byDue;
    return a.priority - b.priority;
  });
}

function nextOccurrence(task) {
  if (!task.dueAt || task.repeat === 'none') return null;
  const d = new Date(task.dueAt);
  if (task.repeat === 'daily') d.setDate(d.getDate() + 1);
  else if (task.repeat === 'weekdays') { do { d.setDate(d.getDate() + 1); } while (d.getDay() === 0 || d.getDay() === 6); }
  else if (task.repeat === 'weekly') d.setDate(d.getDate() + 7);
  else if (task.repeat === 'monthly') d.setMonth(d.getMonth() + 1);
  else d.setDate(d.getDate() + 1);
  return d.getTime();
}

function toggleTask(id) {
  const task = state.tasks.find((t) => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  task.completedAt = task.completed ? now() : null;

  if (task.completed && task.repeat && task.repeat !== 'none') {
    const next = nextOccurrence(task);
    if (next) {
      state.tasks.push({
        ...task,
        id: uid(),
        completed: false,
        completedAt: null,
        createdAt: now(),
        dueAt: next,
        subtasks: (task.subtasks || []).map((s) => ({ ...s, done: false })),
      });
    }
  }
  save();
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((t) => t.id !== id);
  save();
  render();
}

function clearHistory() {
  const finished = state.tasks.filter((t) => t.completed).length;
  const sprints = state.focus.history.length;
  if (!finished && !sprints) {
    toast('Nothing to clear yet');
    return;
  }
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const ok = confirm(`Clear ${plural(finished, 'finished task')} and ${plural(sprints, 'sprint')} from history?\n\nTasks you still have open are left alone.`);
  if (!ok) return;
  state.tasks = state.tasks.filter((t) => !t.completed);
  state.focus.history = [];
  ui.selected.clear();
  save();
  render();
  toast(`Cleared ${plural(finished, 'finished task')} and ${plural(sprints, 'sprint')}`);
}

function addTask(draft) {
  const title = (draft.title || '').trim();
  if (!title) return;
  let dueAt = null;
  if (draft.date) {
    const [y, m, d] = draft.date.split('-').map(Number);
    const [hh, mm] = (draft.time || '09:00').split(':').map(Number);
    dueAt = new Date(y, m - 1, d, hh, mm).getTime();
  }
  state.tasks.push({
    id: uid(),
    title,
    notes: (draft.notes || '').trim(),
    dueAt,
    priority: draft.priority || 3,
    repeat: draft.repeat || 'none',
    alert: draft.alert == null ? 0 : Number(draft.alert),
    subtasks: draft.subtasks || [],
    completed: false,
    completedAt: null,
    createdAt: now(),
  });
  save();
  ui.sheet = null;
  ui.draft = null;
  render();
  toast('Task added');
}

function blankDraft() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return {
    title: '',
    notes: '',
    date: dayKey(d),
    time: pad(d.getHours()) + ':' + pad(d.getMinutes()),
    priority: 3,
    repeat: 'none',
    alert: 0,
    subtasks: [],
    step: '',
  };
}

/* ---------- focus ---------- */

const focusMinutes = () => Math.round(((state.focus.days[dayKey()] || 0)));
const sprintsToday = () => state.focus.sprints[dayKey()] || 0;

function logSprint(minutes, completed) {
  const k = dayKey();
  state.focus.days[k] = (state.focus.days[k] || 0) + minutes;
  state.focus.sprints[k] = (state.focus.sprints[k] || 0) + 1;
  state.focus.history.unshift({
    id: uid(),
    minutes,
    completed,
    taskId: ui.focusTaskId,
    at: now(),
  });
  state.focus.history = state.focus.history.slice(0, 40);
  save();
}

function currentTimer() {
  if (!state.timer) {
    const preset = PRESETS[ui.preset];
    state.timer = {
      preset: ui.preset,
      phase: 'focus',
      focusMin: preset.focus,
      brkMin: preset.brk,
      running: false,
      endsAt: 0,
      remaining: preset.focus * 60,
      completed: 0,
    };
  }
  return state.timer;
}

function timerSeconds() {
  const t = currentTimer();
  if (!t.running) return t.remaining;
  return Math.max(0, Math.round((t.endsAt - now()) / 1000));
}

function startTimer() {
  const t = currentTimer();
  t.remaining = timerSeconds();
  t.endsAt = now() + t.remaining * 1000;
  t.running = true;
  save();
  render();
}

function pauseTimer() {
  const t = currentTimer();
  t.remaining = timerSeconds();
  t.running = false;
  save();
  render();
}

function resetTimer() {
  const t = currentTimer();
  t.running = false;
  t.remaining = (t.phase === 'focus' ? t.focusMin : t.brkMin) * 60;
  save();
  render();
}

function skipPhase() {
  const t = currentTimer();
  if (t.phase === 'focus') {
    logSprint(t.focusMin, false);
    t.phase = 'break';
    t.remaining = t.brkMin * 60;
  } else {
    t.phase = 'focus';
    t.remaining = t.focusMin * 60;
  }
  t.running = false;
  save();
  render();
}

function startQuickSprint(minutes) {
  const preset = minutes === 45 ? 'deep' : 'pomodoro';
  ui.preset = preset;
  state.timer = {
    preset,
    phase: 'focus',
    focusMin: minutes,
    brkMin: minutes >= 45 ? 10 : 5,
    running: true,
    endsAt: now() + minutes * 60000,
    remaining: minutes * 60,
    completed: 0,
  };
  save();
  go('/focus');
  render();
}

function choosePreset(key) {
  ui.preset = key;
  const preset = PRESETS[key];
  state.timer = {
    preset: key,
    phase: 'focus',
    focusMin: preset.focus,
    brkMin: preset.brk,
    running: false,
    endsAt: 0,
    remaining: preset.focus * 60,
    completed: 0,
  };
  save();
  render();
}

function tick() {
  if (peeking()) {
    const left = Math.max(0, Math.ceil((ui.peekUntil - Date.now()) / 1000));
    const chip = document.getElementById('peekClock');
    if (chip) chip.textContent = formatClock(left);
    if (!left) {
      ui.peekUntil = 0;
      toast('Peek over — back to the sprint');
      render();
      return;
    }
  }
  const t = state.timer;
  if (!t || !t.running) return;
  const left = timerSeconds();
  const clockEl = document.getElementById('clock');
  if (clockEl) clockEl.textContent = formatClock(left);
  const ring = document.getElementById('ringProgress');
  const total = (t.phase === 'focus' ? t.focusMin : t.brkMin) * 60;
  if (ring && total) {
    const circumference = 2 * Math.PI * 46;
    ring.style.strokeDashoffset = String(circumference * (left / total));
  }
  if (left <= 0) {
    if (t.phase === 'focus') {
      logSprint(t.focusMin, true);
      notify('Sprint complete', t.focusMin + ' minutes logged.');
      t.completed += 1;
      t.phase = 'break';
      t.remaining = t.brkMin * 60;
    } else {
      notify('Break over', 'Ready for another sprint?');
      t.phase = 'focus';
      t.remaining = t.focusMin * 60;
    }
    t.running = false;
    save();
    render();
  }
}

const formatClock = (secs) => `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;

/* ---------- notifications ---------- */

function notify(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try { new Notification(title, { body, icon: 'icons/icon-192.png' }); } catch (e) { console.warn(e); }
}

function checkDue() {
  const at = now();
  const hour = new Date().getHours();
  const quiet = state.settings.quiet;
  const muted = quiet.enabled && (quiet.start < quiet.end ? hour >= quiet.start && hour < quiet.end : hour >= quiet.start || hour < quiet.end);
  if (muted) return;

  const ready = state.tasks.filter((t) => !t.completed && t.dueAt != null && t.alert !== -1
    && t.dueAt - (Number(t.alert) || 0) * 60000 <= at && !t.notified);
  ready.forEach((t) => {
    const when = t.dueAt <= at ? 'Due ' + clockTime(t.dueAt) : 'At ' + clockTime(t.dueAt);
    notify(t.title, when + (t.priority === 1 ? ' · P1 urgent' : ''));
    t.notified = true;
  });
  if (ready.length) save();
}

/* ---------- charts ---------- */

function dial(percent) {
  const ticks = [];
  for (let i = 0; i < 72; i += 1) {
    const long = i % 6 === 0;
    ticks.push(`<line x1="50" y1="${long ? 5.5 : 7.5}" x2="50" y2="13.5" stroke="currentColor" stroke-width="${long ? 1.2 : 0.8}"
      stroke-linecap="round" opacity="${long ? 0.75 : 0.45}" transform="rotate(${i * 5} 50 50)"/>`);
  }
  const r = 40;
  const c = 2 * Math.PI * r;
  return `<svg viewBox="0 0 100 100">
    <g style="color: var(--muted-fg)">${ticks.join('')}</g>
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--primary)" stroke-width="2.4" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(1, percent)))}"
      transform="rotate(-90 50 50)" opacity="0.9"/>
  </svg>`;
}

function sparkline(values) {
  const max = Math.max(1, ...values);
  const hasData = values.some((v) => v > 0);
  return values.map((v, i) => {
    const idle = [62, 34, 46, 28, 58, 38, 50, 30][i % 8];
    const h = hasData ? 14 + (v / max) * 86 : idle;
    return `<i style="height:${h}%" class="${v > 0 ? 'on' : ''}"></i>`;
  }).join('');
}

function weekBars() {
  const start = startOfWeek(now());
  const days = [];
  for (let i = 0; i < 7; i += 1) {
    const key = dayKey(new Date(start + i * DAY));
    days.push({
      key,
      label: DAY_INITIALS[i],
      count: state.tasks.filter((t) => t.completed && t.completedAt && dayKey(new Date(t.completedAt)) === key).length,
    });
  }
  const goal = state.settings.weekGoal || 4;
  const max = Math.max(goal, ...days.map((d) => d.count), 1);
  return `
    <div class="week-plot">
      <div class="week-bars">
        ${days.map((d) => `<div class="col"><div class="bar" style="height:${Math.round((d.count / max) * 100)}%;${d.count ? '' : 'background:transparent'}"></div></div>`).join('')}
      </div>
      <div class="week-goal" style="bottom:${Math.round((goal / max) * 100)}%"><span>Goal ${goal}</span></div>
    </div>
    <div class="week-labels">${days.map((d) => `<span>${d.label}</span>`).join('')}</div>`;
}

/* ---------- shared bits ---------- */

function toast(message) {
  const el = document.createElement('div');
  el.textContent = message;
  el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:96px;background:var(--foreground);color:var(--background);padding:10px 16px;border-radius:999px;font-size:13px;z-index:80;opacity:0;transition:opacity .2s';
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; });
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 250); }, 1600);
}

function taskRow(task, at = now()) {
  const selected = ui.selected.has(task.id);
  const since = task.completedAt ? new Date(task.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';
  return `<div class="row">
    <button class="check ${task.completed || selected ? 'on' : ''}" data-act="${ui.selectMode ? 'select' : 'toggle'}" data-id="${task.id}"
      aria-label="${ui.selectMode ? 'Select' : task.completed ? 'Reopen' : 'Complete'} ${esc(task.title)}">
      ${task.completed || selected ? ic('check', 14) : ''}
    </button>
    <div class="body">
      <div class="t ${task.completed ? 'done' : ''}">${esc(task.title)}</div>
      <div class="meta">${task.completed ? 'Done ' + esc(since) : esc(relativeDue(task, at))}${task.subtasks && task.subtasks.length ? ' · ' + task.subtasks.filter((s) => s.done).length + '/' + task.subtasks.length + ' steps' : ''}${task.repeat && task.repeat !== 'none' ? ' · repeats' : ''}</div>
    </div>
    <span class="pill-priority p${task.priority}">P${task.priority}</span>
    <button class="icon-btn row-trash" style="width:30px;height:30px" data-act="delete" data-id="${task.id}" aria-label="Delete">${ic('trash', 13)}</button>
  </div>`;
}

/* A running focus sprint locks the other tabs until it is paused, finished or peeked. */
const sprintRunning = () => !!(state.timer && state.timer.running && state.timer.phase === 'focus');
const peeking = () => ui.peekUntil > Date.now();
const focusLocked = () => sprintRunning() && !peeking();

function tabbar(active) {
  const locked = focusLocked();
  const tabs = [
    ['today', 'Today', '/'],
    ['tasks', 'Tasks', '/tasks'],
    ['focus', 'Focus', '/focus'],
    ['stats', 'Stats', '/stats'],
  ];
  return `<nav class="tabbar${locked ? ' locked' : ''}">
    ${tabs.map(([icon, label, path]) => {
      const off = locked && active !== icon;
      return `<a class="tab ${active === icon ? 'on' : ''}" href="#${path}"${off ? ' aria-disabled="true" tabindex="-1" title="Pause the timer to switch tabs"' : ''}>${ic(icon, 18)}<span>${label}</span></a>`;
    }).join('')}
  </nav>`;
}

function fab() {
  return `<button class="fab" data-act="new-task" aria-label="Quick add task">${ic('plus', 22)}</button>`;
}

/* ---------- views ---------- */

function viewToday() {
  const at = now();
  const open = sortedOpen();
  const today = dueToday();
  const done = doneToday();
  const week = state.tasks.filter((t) => t.completed && t.completedAt && t.completedAt >= startOfWeek(at));
  const total = today.length + done.length;
  const pct = total ? Math.round((done.length / total) * 100) : 0;
  const minutes = focusMinutes();
  const goal = state.settings.dailyGoal;
  const sprints = sprintsToday();
  const weekAvg = (week.length / 7).toFixed(1);
  const recent = [...week].sort((a, b) => b.completedAt - a.completedAt).slice(0, 3);
  const headline = today.length === 0 ? 'Nothing due today' : `${today.length} task${today.length === 1 ? '' : 's'} due today`;
  const todayOpen = today.slice().sort((a, b) => a.priority - b.priority);

  const focusSeries = Array.from({ length: 44 }, (_, i) => (state.focus.days[dayKey(new Date(at - (43 - i) * DAY))] || 0) / 60);
  const sprintSeries = Array.from({ length: 44 }, (_, i) => state.focus.sprints[dayKey(new Date(at - (43 - i) * DAY))] || 0);

  return `<div class="screen">
    <div class="hero">
      <div class="topbar">
        <div>
          <div class="eyebrow date-eyebrow">${esc(longDate(at))}</div>
          <h1 class="display">${esc(headline)}</h1>
        </div>
        <div class="actions">
          <button class="icon-btn" data-act="settings" aria-label="Settings">${ic('gear', 18)}</button>
          <button class="icon-btn" data-act="reminders" aria-label="Reminders">${ic('bell', 18)}</button>
        </div>
      </div>
    </div>

    <article class="card timer-card" style="margin-top:16px">
      <span class="timer-icon">${ic('focus', 18)}</span>
      <span>
        <span class="title">Focus timer</span><br />
        <span class="sub">Start a sprint right here</span>
      </span>
      <span class="chips">
        <button class="chip" data-act="quick-sprint" data-id="25">25<span class="muted">m</span></button>
        <button class="chip" data-act="quick-sprint" data-id="45">45<span class="muted">m</span></button>
        <button class="chip chip-round" data-act="focus" aria-label="Open focus timer">${ic('chevronRight', 14)}</button>
      </span>
    </article>

    <article class="card due-card">
      <div class="due-row">
        <div>
          <div class="eyebrow tight">Due today</div>
          <div style="margin-top:10px"><span class="big-number">${today.length}</span><span class="unit">task${today.length === 1 ? '' : 's'}</span></div>
          <div class="mono muted" style="font-size:11.5px;margin-top:6px">${done.length} done · ${today.length} left</div>
        </div>
        <div class="dial" role="img" aria-label="${done.length} of ${total} tasks done today">
          ${dial(total ? done.length / total : 0)}
          <div class="pct">${pct}%</div>
        </div>
      </div>
    </article>

    <div class="pair">
      <article class="card">
        <div class="eyebrow tight">Focus</div>
        <div class="value">${minutes}<span class="unit">min</span></div>
        <div class="spark">${sparkline(focusSeries)}</div>
        <div class="mono muted" style="font-size:11px">${Math.max(0, goal - minutes)} min to goal</div>
      </article>
      <article class="card">
        <div class="eyebrow tight">Sprints</div>
        <div class="value">${sprints}<span class="unit">today</span></div>
        <div class="spark">${sparkline(sprintSeries)}</div>
        <div class="mono muted" style="font-size:11px">of ${state.settings.sprintGoal} sprint goal</div>
      </article>
    </div>

    ${todayOpen.length ? `<article class="card" style="margin-top:12px;padding:6px 16px">
      <div class="week-head" style="padding:14px 0 6px">
        <h2 class="heading-sm">Today's tasks</h2>
        <span class="mono muted" style="font-size:11px">${todayOpen.length} left</span>
      </div>
      ${todayOpen.map((t) => taskRow(t, at)).join('')}
    </article>` : ''}

    <article class="card" style="margin-top:12px">
      <div class="week-head">
        <h2 class="heading-sm">Done this week</h2>
        <span class="mono muted" style="font-size:11px">Avg ${weekAvg} / day</span>
      </div>
      <p class="muted" style="font-size:12.5px;margin:8px 0 0">${week.length ? week.length + ' completed since Monday' : 'Nothing completed yet this week'}</p>
      ${weekBars()}
    </article>

    <article class="card">
      <div class="week-head">
        <h2 class="heading-sm">Recently done</h2>
        <a class="btn" href="#/tasks" style="padding:6px 12px;font-size:12px;text-decoration:none">All tasks</a>
      </div>
      ${recent.length
        ? recent.map((t) => taskRow(t, at)).join('')
        : '<p class="muted" style="font-size:12.5px;margin:10px 0 0">Nothing ticked off yet — open a task and finish it to start the streak.</p>'}
    </article>

    <button class="btn dashed" data-act="new-task" style="margin-top:16px">${ic('plus', 15)} New task</button>
  </div>`;
}

function viewTasks() {
  const at = now();
  const term = ui.query.trim().toLowerCase();
  let list = ui.showAll ? [...state.tasks] : sortedOpen();
  if (ui.priorityFilter) list = list.filter((t) => t.priority === ui.priorityFilter);
  if (term) list = list.filter((t) => (t.title + ' ' + (t.notes || '')).toLowerCase().includes(term));

  const chips = [
    [0, 'All'],
    [1, 'P1 · Urgent'],
    [2, 'P2 · High'],
    [3, 'P3 · Normal'],
    [4, 'P4 · Low'],
  ];

  return `<div class="screen">
    <div class="eyebrow">${openTasks().length} open · ${state.tasks.length} total</div>
    <div class="tasks-top">
      <h1 class="display">Tasks</h1>
      <div style="display:flex;gap:8px">
        <button class="btn" data-act="select-mode">${ui.selectMode ? 'Done' : 'Select'}</button>
        <button class="btn dark" data-act="new-task">${ic('plus', 15)} New</button>
      </div>
    </div>

    <div class="search">
      ${ic('search', 16)}
      <input id="search" type="search" placeholder="Search tasks and notes" value="${esc(ui.query)}" />
    </div>

    <div class="chips-row">
      <button class="chip chip-dot" data-act="toggle-all">${ui.showAll ? 'Showing all' : 'Showing open'}</button>
      ${chips.map(([n, label]) => `<button class="chip ${ui.priorityFilter === n ? 'on' : ''}" data-act="filter" data-id="${n}">${label}</button>`).join('')}
    </div>

    ${ui.selectMode && ui.selected.size
      ? `<div class="card" style="margin-top:14px;display:flex;align-items:center;gap:12px;padding:12px 16px">
           <span class="mono" style="font-size:12px">${ui.selected.size} selected</span>
           <button class="btn dark" data-act="delete-selected" style="margin-left:auto;padding:8px 14px;font-size:12px">${ic('trash', 14)} Delete</button>
         </div>`
      : ''}

    ${list.length === 0
      ? `<div class="empty-state">
           <h2 class="serif-title" style="font-size:26px">${term || ui.priorityFilter ? 'Nothing matches' : 'A clean slate'}</h2>
           <p>${term || ui.priorityFilter ? 'Try a different search or priority.' : 'Add a task with a due time, a priority and the reminder rhythm you want.'}</p>
           <button class="btn dark" data-act="new-task">${ic('plus', 15)} Add a task</button>
         </div>`
      : `<div class="card" style="margin-top:16px;padding:6px 16px">${list.map((t) => taskRow(t, at)).join('')}</div>`}
  </div>`;
}

function viewFocus() {
  const t = currentTimer();
  const total = (t.phase === 'focus' ? t.focusMin : t.brkMin) * 60;
  const left = timerSeconds();
  const circumference = 2 * Math.PI * 46;
  const offset = total ? circumference * (left / total) : circumference;
  const task = state.tasks.find((x) => x.id === ui.focusTaskId);
  const history = state.focus.history.slice(0, 5);

  return `<div class="screen">
    <div class="eyebrow">${focusMinutes()} min · ${sprintsToday()} sprints today</div>
    <h1 class="display">Focus</h1>

    <article class="card" style="margin-top:16px">
      <div class="segmented">
        <button class="${ui.focusMode === 'general' ? 'on' : ''}" data-act="focus-mode" data-id="general">General focus</button>
        <button class="${ui.focusMode === 'task' ? 'on' : ''}" data-act="focus-mode" data-id="task" ${openTasks().length ? '' : 'disabled'}>Specific task</button>
      </div>
      <p class="mono muted" style="font-size:11px;text-align:center;margin:12px 0 0">
        ${ui.focusMode === 'task' && task ? esc(task.title) : 'Untethered sprint — no task attached'}
      </p>

      <div class="dial-big">
        <svg viewBox="0 0 100 100">
          ${Array.from({ length: 60 }, (_, i) => {
            const long = i % 5 === 0;
            return `<line x1="50" y1="${long ? 4.4 : 6.2}" x2="50" y2="8.6" stroke="var(--border)" stroke-width="${long ? 0.9 : 0.6}" stroke-linecap="round" transform="rotate(${i * 6} 50 50)"/>`;
          }).join('')}
          <circle cx="50" cy="50" r="46" fill="none" stroke="var(--border)" stroke-width="0.8" opacity="0.5"/>
          <circle id="ringProgress" cx="50" cy="50" r="46" fill="none" stroke="var(--primary)" stroke-width="1.1"
            stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" transform="rotate(-90 50 50)" opacity="0.85"/>
        </svg>
        <div class="inner">
          <span class="eyebrow tight">${t.phase === 'focus' ? 'Focus sprint' : 'Break'}</span>
          <span class="clock" id="clock">${formatClock(left)}</span>
        </div>
      </div>

      <div class="timer-controls">
        <button class="icon-btn" data-act="reset" aria-label="Reset timer">${ic('reset', 16)}</button>
        <button class="btn dark" style="padding:13px 26px" data-act="toggle-timer">
          ${t.running ? ic('pause', 16) + ' Pause' : ic('play', 16) + ' Start'}
        </button>
        <button class="icon-btn" data-act="skip" aria-label="Skip to next phase">${ic('skip', 16)}</button>
      </div>

      ${sprintRunning() ? (peeking()
        ? `<div class="peek-bar">
             <span class="mono" id="peekClock">${formatClock(Math.max(0, Math.ceil((ui.peekUntil - Date.now()) / 1000)))}</span>
             <span class="grow">Tabs unlocked — sprint still running</span>
             <button class="btn" style="padding:6px 12px;font-size:12px" data-act="end-peek">Back to focus</button>
           </div>`
        : `<p class="mono muted" style="font-size:11px;text-align:center;margin:12px 0 0">Tabs are locked while this sprint runs — pause, or peek for 3 minutes.</p>
           <button class="btn block" style="margin-top:10px" data-act="peek">${ic('play', 13)} Peek at other tabs (3 min)</button>`) : ''}

      <div class="presets">
        ${Object.entries(PRESETS).map(([key, p]) => `<button class="preset ${ui.preset === key ? 'on' : ''}" data-act="preset" data-id="${key}">
          ${p.label}<span class="sub">${p.focus} / ${p.brk}</span>
        </button>`).join('')}
      </div>

      <p class="mono muted" style="font-size:11px;text-align:center;margin:14px 0 0">
        Sprint ${(t.completed || 0) + 1} · ${t.completed || 0} completed this sitting
      </p>
    </article>

    <article class="card">
      <div class="week-head">
        <h2 class="heading-sm">Quick links</h2>
        <button class="btn" style="padding:6px 12px;font-size:12px" data-act="edit-links">Edit</button>
      </div>
      ${state.settings.links.length ? `<div class="link-grid">
        ${state.settings.links.map((l) => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label || l.url)}</a>`).join('')}
      </div>` : '<p class="muted" style="font-size:12.5px;margin:10px 0 0">No links yet — add your school sites and they open in a new tab.</p>'}
      <p class="hint">${focusLocked() ? 'Opens in a new browser tab, so the sprint keeps counting — only RemindMe\'s own tabs stay locked.' : 'Opens in a new browser tab and stays available during a sprint.'}</p>
    </article>

    <article class="card">
      <div class="week-head">
        <h2 class="heading-sm">Sprint history</h2>
        <span class="mono muted" style="font-size:11px">${state.focus.history.length} logged</span>
      </div>
      ${history.length
        ? history.map((h) => `<div class="row">
            <div class="body">
              <div class="t">${h.minutes} minute sprint${h.completed ? '' : ' (ended early)'}</div>
              <div class="meta">${new Date(h.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · ${clockTime(h.at)}${h.taskId ? ' · ' + esc((state.tasks.find((x) => x.id === h.taskId) || {}).title || 'task') : ''}</div>
            </div>
          </div>`).join('')
        : '<p class="muted" style="font-size:12.5px;margin:10px 0 0">Finish a sprint and it lands here, tied to the task you were working on.</p>'}
    </article>
  </div>`;
}

function viewStats() {
  const at = now();
  const weekStart = startOfWeek(at);
  const days = Array.from({ length: 7 }, (_, i) => {
    const key = dayKey(new Date(weekStart + i * DAY));
    return {
      key,
      label: DAY_INITIALS[i],
      done: state.tasks.filter((t) => t.completed && t.completedAt && dayKey(new Date(t.completedAt)) === key).length,
      minutes: state.focus.days[key] || 0,
    };
  });
  const weekDone = days.reduce((s, d) => s + d.done, 0);
  const best = days.reduce((a, b) => (b.done > a.done ? b : a), days[0]);
  const perDay = (weekDone / 7).toFixed(1);

  const totalFocusMin = Object.values(state.focus.days).reduce((s, v) => s + v, 0);
  const totalSprints = Object.values(state.focus.sprints).reduce((s, v) => s + v, 0);

  let streak = 0;
  for (let i = 0; i < 60; i += 1) {
    const key = dayKey(new Date(at - i * DAY));
    const active = state.tasks.some((t) => t.completed && t.completedAt && dayKey(new Date(t.completedAt)) === key);
    if (active) streak += 1;
    else if (i > 0) break;
  }

  const range = ui.trend;
  const buckets = Array.from({ length: range }, (_, i) => {
    const key = dayKey(new Date(at - (range - 1 - i) * DAY));
    return {
      key,
      done: state.tasks.filter((t) => t.completed && t.completedAt && dayKey(new Date(t.completedAt)) === key).length,
      minutes: Math.round((state.focus.days[key] || 0) / 60),
    };
  });
  const rangeStart = new Date(at - (range - 1) * DAY).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const rangeEnd = new Date(at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const maxDone = Math.max(1, ...buckets.map((b) => b.done));
  const maxMin = Math.max(1, ...buckets.map((b) => b.minutes));

  const byPriority = PRIORITIES.map((p) => ({ ...p, count: openTasks().filter((t) => t.priority === p.n).length }));

  return `<div class="screen">
    <div class="eyebrow">This week · ${weekDone} tasks done</div>
    <h1 class="display">Stats</h1>

    <article class="card stat-card" style="margin-top:16px">
      <div class="top">
        <span class="eyebrow tight">Tasks this week</span>
        <span class="dots">${Array.from({ length: 9 }, (_, i) => `<i class="${i % 3 === 0 ? '' : 'dim'}"></i>`).join('')}</span>
      </div>
      <div class="stat-body">
        <div class="stat-value">${weekDone}</div>
        <div class="stat-meta">
          <div><span>Best day</span><strong>${weekDone ? best.label : '—'}</strong></div>
          <div><span>Per day</span><strong>${perDay}</strong></div>
        </div>
      </div>
    </article>

    <article class="card stat-card">
      <div class="top">
        <span class="eyebrow tight">Total focus</span>
        <span class="dots">${Array.from({ length: 9 }, (_, i) => `<i class="${i % 3 === 1 ? '' : 'dim'}"></i>`).join('')}</span>
      </div>
      <div class="stat-body">
        <div class="stat-value">${(totalFocusMin / 60).toFixed(1)}<small>hrs</small></div>
        <div class="stat-meta">
          <div><span>Sprints</span><strong>${totalSprints}</strong></div>
          <div><span>Streak</span><strong>${streak}d</strong></div>
        </div>
      </div>
    </article>

    <article class="card stat-card">
      <div class="top">
        <span class="eyebrow tight">Daily streak</span>
        <span class="dots">${Array.from({ length: 9 }, (_, i) => `<i class="${i % 3 === 2 ? '' : 'dim'}"></i>`).join('')}</span>
      </div>
      <div class="stat-body">
        <div class="stat-value">${streak}<small>days</small></div>
        <div class="stat-meta">
          <div><span>Today</span><strong>${days[Math.min(6, new Date(at).getDay() === 0 ? 6 : new Date(at).getDay() - 1)].done ? 'Yes' : 'Not yet'}</strong></div>
          <div><span>Active days</span><strong>${days.filter((d) => d.done > 0).length}</strong></div>
        </div>
      </div>
    </article>

    <div class="trend-head">
      <span class="eyebrow tight">Trend</span>
      <div class="seg-small">
        <button class="${ui.trend === 7 ? 'on' : ''}" data-act="trend" data-id="7">7d</button>
        <button class="${ui.trend === 30 ? 'on' : ''}" data-act="trend" data-id="30">30d</button>
      </div>
    </div>

    <article class="card">
      <div class="week-head">
        <h2 class="heading-sm">Completions</h2>
        <span class="mono muted" style="font-size:10.5px">per day</span>
      </div>
      ${weekDone === 0 && buckets.every((b) => b.done === 0)
        ? '<p class="chart-empty">Nothing logged in this range yet</p>'
        : `<div class="chart">${buckets.map((b) => `<i style="height:${Math.round((b.done / maxDone) * 100)}%"></i>`).join('')}</div>`}
      <div class="week-head mono muted" style="font-size:10px;margin-top:8px"><span>${rangeStart}</span><span>${rangeEnd}</span></div>
    </article>

    <article class="card">
      <div class="week-head">
        <h2 class="heading-sm">Focus minutes</h2>
        <span class="mono muted" style="font-size:10.5px">per day</span>
      </div>
      ${totalFocusMin === 0
        ? '<p class="chart-empty">Nothing logged in this range yet</p>'
        : `<div class="chart">${buckets.map((b) => `<i style="height:${Math.round((b.minutes / maxMin) * 100)}%"></i>`).join('')}</div>`}
      <div class="week-head mono muted" style="font-size:10px;margin-top:8px"><span>${rangeStart}</span><span>${rangeEnd}</span></div>
    </article>

    <article class="card">
      <div class="week-head">
        <h2 class="heading-sm">Open by priority</h2>
        <span class="mono muted" style="font-size:11px">${openTasks().length} open</span>
      </div>
      ${openTasks().length === 0
        ? '<p class="muted" style="font-size:12.5px;margin:10px 0 0">Everything is done — nothing open right now.</p>'
        : byPriority.map((p) => `<div class="row">
            <span class="pill-priority p${p.n}">P${p.n}</span>
            <div class="body"><div class="t">${p.label}</div></div>
            <span class="mono muted" style="font-size:12px">${p.count}</span>
          </div>`).join('')}
    </article>
  </div>`;
}

function sheetSyncSetup() {
  const cfg = syncConfig();
  const draft = ui.syncDraft || { url: cfg ? cfg.url : '', anon: '' };
  return `<div class="overlay" data-act="sheet-backdrop">
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <div class="eyebrow tight">Sync server</div>
          <h2 class="serif-title" style="font-size:26px;margin-top:4px">Connect Supabase</h2>
        </div>
        <button class="sheet-close" data-act="close-sheet" aria-label="Close">${ic('close', 16)}</button>
      </div>
      <p class="muted" style="font-size:12.5px;margin:10px 0 0">Make a free Supabase project, run <code>supabase/schema.sql</code> in its SQL editor, then paste the project URL and the anon public key here. Both stay on this device.</p>
      <label class="label-sm" for="syncUrl" style="margin-top:14px">Project URL</label>
      <input id="syncUrl" placeholder="https://abcdefgh.supabase.co" autocomplete="off" spellcheck="false" value="${esc(draft.url || '')}" />
      <label class="label-sm" for="syncAnon" style="margin-top:12px">Anon public key</label>
      <input id="syncAnon" placeholder="eyJhbGciOi..." autocomplete="off" spellcheck="false" value="${esc(draft.anon || '')}" />
      ${ui.syncNote ? `<p class="hint" style="color:var(--primary)">${esc(ui.syncNote)}</p>` : ''}
      <button class="btn primary block" style="margin-top:14px" data-act="sync-config-save">Save server</button>
    </div>
  </div>`;
}

function sheetSyncCode() {
  return `<div class="overlay" data-act="sheet-backdrop">
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <div class="eyebrow tight">Cross-device sync</div>
          <h2 class="serif-title" style="font-size:26px;margin-top:4px">Your sync code</h2>
        </div>
        <button class="sheet-close" data-act="close-sheet" aria-label="Close">${ic('close', 16)}</button>
      </div>
      <p class="muted" style="font-size:12.5px;margin:10px 0 0">Open RemindMe on the other device, sign in there, then go to Settings → Sync across devices → Use a sync code and enter this.</p>
      <div class="recovery-code">${esc(ui.syncCode || '')}</div>
      <button class="btn block" data-act="copy-sync">${ic('file', 14)} Copy code</button>
      <p class="hint">The code is the only thing that can decrypt the synced copy, so keep it private and out of screenshots.</p>
      <button class="btn primary block" style="margin-top:8px" data-act="close-sheet">Done</button>
    </div>
  </div>`;
}

function sheetSyncJoin() {
  return `<div class="overlay" data-act="sheet-backdrop">
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <div class="eyebrow tight">Cross-device sync</div>
          <h2 class="serif-title" style="font-size:26px;margin-top:4px">Use a sync code</h2>
        </div>
        <button class="sheet-close" data-act="close-sheet" aria-label="Close">${ic('close', 16)}</button>
      </div>
      <label class="label-sm" for="syncJoinCode" style="margin-top:14px">Sync code</label>
      <input id="syncJoinCode" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX" autocomplete="off" spellcheck="false" autocapitalize="characters" />
      <p class="hint">This replaces the tasks on this device with the copy saved under that code.</p>
      ${ui.syncNote ? `<p class="hint" style="color:var(--primary)">${esc(ui.syncNote)}</p>` : ''}
      <button class="btn primary block" style="margin-top:14px" data-act="sync-join">Pull tasks in</button>
    </div>
  </div>`;
}

function syncCard() {
  if (!isSignedIn()) {
    return '<p class="muted" style="font-size:12.5px;margin:8px 0 0">Sync needs an account. Guest tasks never leave this device.</p>';
  }
  const cfg = syncConfig();
  const tracked = syncState();
  const note = ui.syncNote ? `<p class="hint" style="color:var(--primary)">${esc(ui.syncNote)}</p>` : '';

  if (!cfg) {
    return `<p class="muted" style="font-size:12.5px;margin:8px 0 12px">Keep tasks in step with your other devices through your own Supabase project. The server only ever stores ciphertext.</p>
      <div style="display:grid;gap:8px"><button class="btn" data-act="sync-open-setup">${ic('lock', 15)} Add sync server</button></div>
      ${note}`;
  }

  if (!tracked) {
    return `<p class="muted" style="font-size:12.5px;margin:8px 0 12px">Turn sync on here, then open the same account on another device and pull it in with a sync code.</p>
      <div style="display:grid;gap:8px">
        <button class="btn dark" data-act="sync-enable">${ic('arrowRight', 15)} Turn on sync</button>
        <button class="btn" data-act="sync-open-join">Use a sync code</button>
      </div>
      ${note}`;
  }

  const when = tracked.lastAt
    ? new Date(tracked.lastAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : 'not yet';
  const conflict = tracked.conflict
    ? `<div style="display:grid;gap:8px;margin-top:10px">
        <p class="hint" style="color:var(--primary)">Another device saved newer tasks (revision ${Number(tracked.conflict) || 0}). Pick which copy to keep.</p>
        <button class="btn" data-act="sync-pull">${ic('arrowRight', 15)} Use the newer copy</button>
        <button class="btn" data-act="sync-push">${ic('chevronRight', 15)} Keep this device</button>
      </div>`
    : '';

  return `<div style="display:flex;align-items:center;gap:12px;margin-top:10px">
      <span class="timer-icon">${ic('shield', 18)}</span>
      <div>
        <div style="font-size:15px">On · revision ${Number(tracked.revision) || 0}${tracked.dirty ? ' · waiting to upload' : ''}</div>
        <div class="muted" style="font-size:12.5px">Last sync ${esc(when)}</div>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
      <button class="btn" data-act="sync-now">Sync now</button>
      <button class="btn" data-act="sync-show-code">Sync code</button>
      <button class="btn" data-act="sync-off">Turn off</button>
    </div>
    ${conflict}${note}`;
}

function viewSettings() {
  const tiles = [
    ['light', 'Light', 'Warm paper', '#F9F6F1', '#FFFFFF'],
    ['dark', 'Dark', 'Soft charcoal', '#151417', '#221F26'],
    ['oled', 'OLED Black', 'True black', '#000000', '#0B0B0D'],
  ];
  return `<div class="screen">
    <button class="back" data-act="back">${ic('chevronLeft', 14)} Today</button>
    <h1 class="display">Settings</h1>

    <article class="card" style="margin-top:16px">
      <div class="eyebrow tight">Appearance</div>
      <p class="muted" style="font-size:13px;margin:8px 0 12px">Light, dark or true-black OLED for late nights.</p>
      <div class="theme-grid">
        ${tiles.map(([key, name, hint, bg, card]) => `<button class="theme-tile ${state.theme === key ? 'on' : ''}" data-act="theme" data-id="${key}">
          <span class="tile-inner">
            <span class="theme-preview" style="background:${bg};border:1px solid rgba(128,128,128,.18)">
              <span class="mini-card" style="background:${card}">
                <span class="line" style="width:72%"></span>
                <span class="line" style="width:52%"></span>
                <span class="line accent" style="width:34%"></span>
              </span>
            </span>
            <span class="name">${name}</span>
            <span class="hint">${hint}</span>
          </span>
        </button>`).join('')}
      </div>
    </article>

    <article class="card">
      <div class="eyebrow tight">Account</div>
      ${isSignedIn() ? `
        <div style="display:flex;align-items:center;gap:12px;margin-top:12px">
          <span class="timer-icon">${ic('user', 18)}</span>
          <div>
            <div style="font-size:15px">${esc(profile.name || profile.email || 'Your account')}</div>
            <div class="muted" style="font-size:12.5px">${esc(profile.email || '')}</div>
          </div>
        </div>
        <p class="muted" style="font-size:12.5px;margin:12px 0 14px">Local account — tasks are encrypted with your password and stay on this device. You stay unlocked here until you lock or sign out.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${profile.mode === 'local' ? '<button class="btn" data-act="lock">Lock now</button>' : ''}
          ${profile.mode === 'local' ? '<button class="btn" data-act="make-recovery">Recovery code</button>' : ''}
          <button class="btn" data-act="sign-out">Sign out</button>
        </div>
      ` : `
        <div style="display:flex;align-items:center;gap:12px;margin-top:12px">
          <span class="timer-icon">${ic('user', 18)}</span>
          <div>
            <div style="font-size:15px">Guest mode</div>
            <div class="muted" style="font-size:12.5px">Data stays on this device</div>
          </div>
        </div>
        <p class="muted" style="font-size:12.5px;margin:12px 0 14px">Create an email account and your tasks are encrypted with your password on this device.</p>
        <div style="display:grid;gap:8px">
          <button class="btn dark" style="width:100%;justify-content:center;padding:12px" data-act="go-signup">${ic('user', 15)} Create an account</button>
          <button class="btn" style="width:100%;justify-content:center;padding:12px" data-act="go-login">Log in</button>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
          <button class="btn" data-act="sign-out">Exit guest</button>
        </div>
      `}
    </article>

    <article class="card">
      <div class="eyebrow tight">Sync across devices</div>
      ${syncCard()}
    </article>

    <article class="card">
      <a class="link-row" href="#/privacy">${ic('shield', 16)}<span class="grow">Privacy Policy</span>${ic('chevronRight', 14)}</a>
      <a class="link-row" href="#/terms">${ic('file', 16)}<span class="grow">Terms of Service</span>${ic('chevronRight', 14)}</a>
    </article>

    <article class="card">
      <div class="eyebrow tight">Planner</div>
      ${state.settings.timetable.length ? `<p class="muted" style="font-size:12.5px;margin:8px 0 10px">${state.settings.timetable.length} weekly session${state.settings.timetable.length === 1 ? '' : 's'} on file.</p>
        ${state.settings.timetable.slice(0, 8).map((e) => `<div class="row">
          <span class="pill-priority p3" style="min-width:44px">${DAY_NAMES[e.day]}</span>
          <div class="body"><div class="t">${esc(e.subject)}</div><div class="meta">${esc(e.start)}–${esc(e.end)}</div></div>
        </div>`).join('')}
        ${state.settings.timetable.length > 8 ? `<p class="hint">+ ${state.settings.timetable.length - 8} more</p>` : ''}`
        : '<p class="muted" style="font-size:12.5px;margin:8px 0 10px">Paste your class timetable and RemindMe fills the week with the right tasks.</p>'}
      <div style="display:grid;gap:8px;margin-top:12px">
        <button class="btn" data-act="open-timetable">${ic('file', 15)} ${state.settings.timetable.length ? 'Replace timetable' : 'Import timetable'}</button>
        <button class="btn dark" data-act="plan-week">${ic('plus', 15)} Plan next 7 days</button>
        ${state.settings.timetable.length ? '<button class="btn" data-act="clear-timetable">Clear timetable</button>' : ''}
      </div>
      <p class="hint">Lines like “Mon 09:00-10:00 Biology”, a CSV with subject and day, or a calendar .ics file.</p>
    </article>

    <article class="card">
      <div class="eyebrow tight">Data</div>
      <p class="muted" style="font-size:12.5px;margin:8px 0 12px">Download a backup, import tasks from a JSON backup or a CSV, clear your history, or clear this device.</p>
      <div style="display:grid;gap:8px">
        <button class="btn" data-act="export">${ic('file', 15)} Download backup</button>
        <label class="btn" style="justify-content:center;cursor:pointer">${ic('plus', 15)} Import JSON or CSV
          <input id="importFile" type="file" accept=".json,.csv,text/csv,application/json" hidden />
        </label>
        <button class="btn" data-act="clear-history">${ic('reset', 15)} Clear history</button>
        <button class="btn" style="color:var(--destructive);border-color:var(--destructive)" data-act="wipe">${ic('trash', 15)} Delete local data</button>
      </div>
      <p class="hint">Clear history removes tasks you already finished and the sprint log. Tasks you still have open are left alone.</p>
      <p class="hint">CSV columns: title, date, time, priority, notes. A header row is optional.</p>
    </article>

    <p class="mono muted" style="font-size:10.5px;text-align:center;margin-top:20px">RemindMe · v1.1.5 · made for focus</p>
  </div>`;
}

function viewLogin() {
  const locked = profile && profile.mode === 'local' && profile.locked;

  if (locked) {
    const account = loadAccounts().find((a) => a.id === profile.id) || profile;
    return `<div class="login">
      <div class="login-inner">
        <div class="brand-mark">${ic('lock', 24)}</div>
        <h1>Welcome back</h1>
        <p class="sub">Unlock ${esc(account.email || profile.email || 'your account')}</p>
        <div class="card">
          <label class="label-sm" for="authPassword">Password</label>
          <div class="pw-field">
            <input id="authPassword" type="password" placeholder="••••••••" autocomplete="current-password" />
            <button type="button" class="pw-toggle" data-act="toggle-password" data-for="authPassword" aria-label="Show password" aria-pressed="false" title="Show password">${ic('eye', 16)}</button>
          </div>
          ${ui.authNote ? `<p class="hint" style="color:var(--primary)">${esc(ui.authNote)}</p>` : ''}
          <button class="btn primary block" style="margin-top:14px" data-act="auth-unlock">Unlock</button>
          <div class="divider">OR</div>
          <button class="btn block" data-act="auth-switch">Use another account</button>
          <p class="muted" style="font-size:11.5px;text-align:center;margin:12px 0 0">Your tasks are encrypted with this password on this device. A recovery code is the only way back in if you forget it.</p>
        </div>
      </div>
    </div>`;
  }

  return `<div class="login">
    <div class="login-inner">
      <div class="brand-mark">${ic('focus', 26)}</div>
      <h1>Welcome back</h1>
      <p class="sub">Log in to your account</p>

      <div class="card">
        <label class="label-sm" for="authEmail">Email</label>
        <input id="authEmail" type="email" placeholder="you@example.com" autocomplete="email" value="${esc(ui.authEmail || '')}" />

        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:12px">
          <label class="label-sm" for="authPassword" style="margin:0">Password</label>
          <a class="link" href="#/recover" style="font-size:12px">Forgot password?</a>
        </div>
        <div class="pw-field">
          <input id="authPassword" type="password" placeholder="••••••••" autocomplete="current-password" />
          <button type="button" class="pw-toggle" data-act="toggle-password" data-for="authPassword" aria-label="Show password" aria-pressed="false" title="Show password">${ic('eye', 16)}</button>
        </div>
        ${ui.authNote ? `<p class="hint" style="color:var(--primary)">${esc(ui.authNote)}</p>` : ''}

        <button class="btn primary block" style="margin-top:14px" data-act="auth-signin">Log in</button>

        <div class="divider">OR</div>

        <button class="btn block" data-act="guest">Continue as guest</button>
        <p class="muted" style="font-size:11.5px;text-align:center;margin:10px 0 0">No account needed — guest tasks stay on this device.</p>
      </div>

      <p class="muted" style="text-align:center;font-size:13px;margin-top:18px">
        Don't have an account?
        <a class="link" href="#/signup" style="font-size:13px">Create one</a>
      </p>
    </div>
  </div>`;
}

function viewSignup() {
  return `<div class="login">
    <div class="login-inner">
      <a class="back" href="#/login" style="margin-bottom:18px">${ic('chevronLeft', 14)} Back to log in</a>
      <div class="brand-mark">${ic('lock', 26)}</div>
      <h1>Create account</h1>
      <p class="sub">Encrypted with your password, kept on this device</p>

      <div class="card">
        <label class="label-sm" for="authName">Name (optional)</label>
        <input id="authName" type="text" placeholder="Your name" autocomplete="name" />

        <label class="label-sm" for="authEmail" style="margin-top:12px">Email</label>
        <input id="authEmail" type="email" placeholder="you@example.com" autocomplete="email" value="${esc(ui.authEmail || '')}" />

        <label class="label-sm" for="authPassword" style="margin-top:12px">Password</label>
        <div class="pw-field">
          <input id="authPassword" type="password" placeholder="At least 8 characters" autocomplete="new-password" />
          <button type="button" class="pw-toggle" data-act="toggle-password" data-for="authPassword" aria-label="Show password" aria-pressed="false" title="Show password">${ic('eye', 16)}</button>
        </div>

        <label class="label-sm" for="authConfirm" style="margin-top:12px">Repeat password</label>
        <div class="pw-field">
          <input id="authConfirm" type="password" placeholder="Repeat password" autocomplete="new-password" />
          <button type="button" class="pw-toggle" data-act="toggle-password" data-for="authConfirm" aria-label="Show password" aria-pressed="false" title="Show password">${ic('eye', 16)}</button>
        </div>

        <label class="check-row" style="margin-top:14px">
          <input type="checkbox" id="authBring" checked />
          <span>Bring my guest tasks into this account</span>
        </label>
        ${ui.authNote ? `<p class="hint" style="color:var(--primary)">${esc(ui.authNote)}</p>` : ''}

        <button class="btn primary block" style="margin-top:14px" data-act="auth-create">Create account</button>

        <p class="muted" style="font-size:11.5px;text-align:center;margin:12px 0 0">Your tasks are encrypted with this password on this device. A recovery code is the only way back in if you forget it.</p>
      </div>

      <p class="muted" style="text-align:center;font-size:13px;margin-top:18px">
        Already have an account?
        <a class="link" href="#/login" style="font-size:13px">Log in</a>
      </p>
    </div>
  </div>`;
}

/* Reveals or hides a password field in place, so what was typed stays put. */
function togglePassword(button) {
  const input = document.getElementById(button.dataset.for || '');
  if (!input) return;
  const reveal = input.type === 'password';
  input.type = reveal ? 'text' : 'password';
  button.setAttribute('aria-pressed', reveal ? 'true' : 'false');
  button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
  button.title = reveal ? 'Hide password' : 'Show password';
  button.innerHTML = ic(reveal ? 'eyeOff' : 'eye', 16);
  input.focus();
  const end = input.value.length;
  try { input.setSelectionRange(end, end); } catch (e) { /* field is not selectable */ }
}

function viewDoc(kind) {
  const privacy = kind === 'privacy';
  return `<div class="screen">
    <button class="back" data-act="back">${ic('chevronLeft', 14)} Settings</button>
    <h1 class="display small" style="margin-top:8px">${privacy ? 'Privacy Policy' : 'Terms of Service'}</h1>
    <article class="card" style="margin-top:16px">
      ${privacy
        ? `<p class="muted" style="font-size:13.5px">RemindMe stores your tasks, sprints and settings in this browser only. There is no account, no analytics, no advertising and no server of ours receiving your data.</p>
           <p class="muted" style="font-size:13.5px">Reminders are generated on your device while the app is open. Clearing site data or using “Delete local data” removes everything permanently.</p>`
        : `<p class="muted" style="font-size:13.5px">Use RemindMe for your own tasks. The app is provided as-is, without warranty, and you are responsible for the data you store locally.</p>
           <p class="muted" style="font-size:13.5px">Because everything is stored on your device, deleting site data cannot be undone by us.</p>`}
    </article>
  </div>`;
}

/* ---------- sheets ---------- */

function sheetNewTask() {
  const d = ui.draft || (ui.draft = blankDraft());
  return `<div class="overlay" data-act="sheet-backdrop">
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <div class="eyebrow tight">New task</div>
          <h2 id="sheetTitle" class="serif-title" style="font-size:30px;margin-top:4px">What needs doing?</h2>
        </div>
        <button class="sheet-close" data-act="close-sheet" aria-label="Close">${ic('close', 16)}</button>
      </div>

      <div class="field">
        <input id="draftTitle" placeholder="Task name" value="${esc(d.title)}" autocomplete="off" />
      </div>
      <div class="field">
        <textarea id="draftNotes" placeholder="Notes, description or context">${esc(d.notes)}</textarea>
      </div>

      <div class="field field-row">
        <div>
          <span class="field-label">Due date</span>
          <input id="draftDate" type="date" value="${esc(d.date)}" />
        </div>
        <div>
          <span class="field-label">Time</span>
          <input id="draftTime" type="time" value="${esc(d.time)}" />
        </div>
      </div>

      <div class="field">
        <span class="field-label">Priority</span>
        <div class="priority-grid">
          ${PRIORITIES.map((p) => `<button class="priority-opt ${d.priority === p.n ? 'on' : ''}" data-act="draft-priority" data-id="${p.n}">
            P${p.n}<span class="sub">${p.label}</span>
          </button>`).join('')}
        </div>
      </div>

      <div class="field">
        <span class="field-label">Reminder</span>
        <select id="draftRepeat">
          ${REPEATS.map(([value, label]) => `<option value="${value}" ${d.repeat === value ? 'selected' : ''}>${label}</option>`).join('')}
        </select>
        <p class="hint">Completing a repeating task schedules the next one automatically.</p>
      </div>

      <div class="field">
        <span class="field-label">Alert</span>
        <select id="draftAlert">
          ${[[0, 'At due time'], [10, '10 minutes before'], [30, '30 minutes before'], [60, '1 hour before'], [-1, 'No alert']]
            .map(([value, label]) => `<option value="${value}" ${Number(d.alert) === value ? 'selected' : ''}>${label}</option>`).join('')}
        </select>
      </div>

      <div class="field">
        <span class="field-label">Sub-steps</span>
        <div class="step-add">
          <input id="draftStep" placeholder="Add a step" value="${esc(d.step)}" />
          <button data-act="add-step" aria-label="Add step">${ic('plus', 16)}</button>
        </div>
        ${d.subtasks.length ? `<div class="steps">${d.subtasks.map((s, i) => `<div class="step">
          <span style="flex:1">${esc(s.title)}</span>
          <button data-act="remove-step" data-id="${i}" aria-label="Remove step">${ic('close', 14)}</button>
        </div>`).join('')}</div>` : ''}
      </div>

      <button class="btn primary block" style="margin-top:18px" data-act="save-task" ${d.title.trim() ? '' : 'disabled'}>Add task</button>
    </div>
  </div>`;
}

function sheetReminders() {
  const q = state.settings.quiet;
  const p = state.settings.planner;
  const hours = Array.from({ length: 24 }, (_, h) => `<option value="${h}" ${h === q.start ? 'selected' : ''}>${pad(h)}:00</option>`).join('');
  const hoursEnd = Array.from({ length: 24 }, (_, h) => `<option value="${h}" ${h === q.end ? 'selected' : ''}>${pad(h)}:00</option>`).join('');
  const plannerHours = Array.from({ length: 24 }, (_, h) => `<option value="${h}" ${h === p.hour ? 'selected' : ''}>${pad(h)}:00</option>`).join('');

  return `<div class="overlay" data-act="sheet-backdrop">
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <div class="eyebrow tight">Reminders</div>
          <h2 class="serif-title" style="font-size:26px;margin-top:4px">When should it nudge you?</h2>
        </div>
        <button class="sheet-close" data-act="close-sheet" aria-label="Close">${ic('close', 16)}</button>
      </div>

      <div class="field">
        <div class="row" style="border:0;padding:8px 0">
          <div class="body">
            <div class="t">Quiet hours</div>
            <div class="meta">${q.enabled ? 'Muted overnight' : 'Reminders can fire any time'}</div>
          </div>
          <button class="chip ${q.enabled ? 'on' : ''}" data-act="quiet-toggle">${q.enabled ? 'On' : 'Off'}</button>
        </div>
      </div>

      <div class="field field-row">
        <div><span class="field-label">From</span><select data-act="quiet-start">${hours}</select></div>
        <div><span class="field-label">Until</span><select data-act="quiet-end">${hoursEnd}</select></div>
      </div>

      <div class="field">
        <div class="row" style="border:0;padding:8px 0">
          <div class="body">
            <div class="t">Morning plan</div>
            <div class="meta">One note with what is due today</div>
          </div>
          <button class="chip ${p.enabled ? 'on' : ''}" data-act="planner-toggle">${p.enabled ? 'On' : 'Off'}</button>
        </div>
      </div>
      <div class="field"><span class="field-label">Plan hour</span><select data-act="planner-hour">${plannerHours}</select></div>

      <div class="field">
        <button class="btn block" data-act="enable-notifications">${notifPermission() === 'granted' ? 'Notifications on' : notifPermission() === 'denied' ? 'Notifications blocked by the browser' : 'Allow notifications'}</button>
        <button class="btn block" style="margin-top:8px" data-act="test-notification">Send a test</button>
        <p class="hint">Alerts fire while RemindMe is open, or installed and running in the background. Wake-ups while fully closed need a push server.</p>
      </div>
    </div>
  </div>`;
}

/* ---------- timetable + planner ---------- */

function parseTimeToken(token) {
  const match = String(token || '').trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const suffix = (match[3] || '').toLowerCase();
  if (suffix === 'pm' && hours < 12) hours += 12;
  if (suffix === 'am' && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

const clockFromMinutes = (mins) => pad(Math.floor(mins / 60) % 24) + ':' + pad(mins % 60);

function parseIcsTimetable(text) {
  const out = [];
  const blocks = String(text).match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/gi) || [];
  blocks.forEach((block) => {
    const summary = (/SUMMARY[^:]*:(.+)/i.exec(block) || [])[1];
    const startRaw = (/DTSTART[^:]*:(\d{8}T\d{4})/i.exec(block) || [])[1];
    const endRaw = (/DTEND[^:]*:(\d{8}T\d{4})/i.exec(block) || [])[1];
    if (!summary || !startRaw) return;
    const sh = Number(startRaw.slice(9, 11));
    const sm = Number(startRaw.slice(11, 13));
    const eh = endRaw ? Number(endRaw.slice(9, 11)) : sh + 1;
    const em = endRaw ? Number(endRaw.slice(11, 13)) : sm;
    const byday = (/BYDAY=([A-Z,]+)/i.exec(block) || [])[1];
    let days;
    if (byday) {
      days = byday.split(',').map((code) => DAY_WORDS[code.trim().toLowerCase()]).filter((value) => value != null);
    } else {
      const date = new Date(Number(startRaw.slice(0, 4)), Number(startRaw.slice(4, 6)) - 1, Number(startRaw.slice(6, 8)));
      days = [(date.getDay() + 6) % 7];
    }
    days.forEach((day) => out.push({
      id: uid(),
      subject: summary.trim().replace(/\\,/g, ',').slice(0, 60),
      day,
      start: clockFromMinutes(sh * 60 + sm),
      end: clockFromMinutes(eh * 60 + em),
    }));
  });
  return out;
}

/* Finds the clock times on a timetable line. A time has to carry a colon or
   an am/pm suffix — a bare number never counts, so a class number can never
   become a start or end time ("Physics 2" next to "14:00" is just a name). */
function timetableTimes(flat) {
  const times = [];
  const re = /\b(\d{1,2}(?::\d{2})?)\s*(am|pm)?\b/gi;
  let match = re.exec(flat);
  while (match) {
    if (match[0].includes(':') || /(am|pm)$/i.test(match[0])) {
      const minutes = parseTimeToken(match[0]);
      if (minutes != null) times.push({ index: match.index, text: match[0], minutes });
    }
    match = re.exec(flat);
  }
  return times;
}

function parseTimetable(text) {
  const raw = String(text || '').replace(/\r/g, '');
  if (/BEGIN:VEVENT/i.test(raw)) return { entries: parseIcsTimetable(raw), skipped: 0 };

  const entries = [];
  let skipped = 0;
  raw.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const flat = trimmed.replace(/[,\t;|]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!/\d/.test(flat)) return; // header row or a label
    const dayWord = /\b(mon(?:day)?|tues?(?:day)?|wed(?:nesday|s)?|thu(?:rs?(?:day)?)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)\b/i.exec(flat);
    const times = timetableTimes(flat);
    const day = dayWord ? DAY_WORDS[dayWord[1].toLowerCase()] : null;
    if (day == null || times.length < 2) { skipped += 1; return; }
    const start = Math.min(times[0].minutes, times[1].minutes);
    const end = Math.max(times[0].minutes, times[1].minutes);
    if (end - start < 5) { skipped += 1; return; }
    // Strip only the day word and the times, so digits that belong to the
    // subject survive.
    const spans = times.map((token) => [token.index, token.index + token.text.length]);
    if (dayWord) spans.push([dayWord.index, dayWord.index + dayWord[0].length]);
    let subject = flat;
    spans.sort((a, b) => b[0] - a[0]).forEach(([from, to]) => {
      subject = subject.slice(0, from) + ' ' + subject.slice(to);
    });
    subject = subject.replace(/[-–—]+/g, ' ').replace(/\s+/g, ' ').trim();
    entries.push({ id: uid(), subject: (subject || 'Class').slice(0, 60), day, start: clockFromMinutes(start), end: clockFromMinutes(end) });
  });
  return { entries, skipped };
}

function saveTimetable() {
  const text = ui.timetableText || '';
  const { entries, skipped } = parseTimetable(text);
  if (!entries.length) {
    toast(skipped ? 'No sessions found — check the format' : 'Paste a timetable first');
    return;
  }
  state.settings.timetable = entries;
  ui.timetableText = '';
  ui.sheet = null;
  save();
  render();
  toast(`Saved ${entries.length} session${entries.length === 1 ? '' : 's'}${skipped ? ', skipped ' + skipped + ' line' + (skipped === 1 ? '' : 's') : ''}`);
}

function planWeek() {
  const table = state.settings.timetable;
  if (!table.length) {
    toast('Import a timetable first');
    return;
  }
  const today = new Date();
  let added = 0;
  let skipped = 0;
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const weekday = (date.getDay() + 6) % 7;
    table.filter((entry) => entry.day === weekday).forEach((entry) => {
      const [hours, minutes] = entry.start.split(':').map(Number);
      const dueAt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours || 0, minutes || 0).getTime();
      if (dueAt < Date.now() - 60000) return;
      const clash = state.tasks.find((t) => t.title === entry.subject && t.dueAt && dayKey(new Date(t.dueAt)) === dayKey(date));
      if (clash) { skipped += 1; return; }
      state.tasks.push({
        id: uid(),
        title: entry.subject,
        notes: `Class ${entry.start}–${entry.end}`,
        dueAt,
        priority: 3,
        repeat: 'weekly',
        alert: 10,
        subtasks: [],
        completed: false,
        completedAt: null,
        createdAt: now(),
      });
      added += 1;
    });
  }
  save();
  render();
  toast(`Planned ${added} class${added === 1 ? '' : 'es'}${skipped ? ', ' + skipped + ' already there' : ''}`);
}

function sheetTimetable() {
  return `<div class="overlay" data-act="sheet-backdrop">
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <div class="eyebrow tight">Planner</div>
          <h2 class="serif-title" style="font-size:26px;margin-top:4px">Import timetable</h2>
        </div>
        <button class="sheet-close" data-act="close-sheet" aria-label="Close">${ic('close', 16)}</button>
      </div>
      <p class="muted" style="font-size:12.5px;margin:10px 0 14px">Paste your week — one class per line — or pick a calendar file. Each session becomes a task when you plan the week.</p>
      <div class="field">
        <textarea id="timetableText" placeholder="Mon 09:00-10:00 Biology&#10;Tue 10:30-11:30 Algebra&#10;Wed 13:00-14:00 History">${esc(ui.timetableText || '')}</textarea>
      </div>
      <label class="btn block" style="justify-content:center;cursor:pointer">${ic('plus', 14)} Choose a .ics or .csv
        <input id="timetableFile" type="file" accept=".ics,.csv,text/calendar,text/csv,text/plain" hidden />
      </label>
      <button class="btn primary block" style="margin-top:8px" data-act="save-timetable">Save timetable</button>
    </div>
  </div>`;
}

/* ---------- account recovery ---------- */

const RECOVERY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  let out = '';
  for (let i = 0; i < bytes.length; i += 1) {
    out += RECOVERY_ALPHABET[bytes[i] % RECOVERY_ALPHABET.length];
    if ((i + 1) % 4 === 0 && i < bytes.length - 1) out += '-';
  }
  return out;
}

async function wrapKey(code, key) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrap = await deriveKey(code, salt);
  const raw = await crypto.subtle.exportKey('raw', key);
  const wrapped = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, wrap, raw);
  return { salt: toB64(salt), iv: toB64(iv), wrapped: toB64(wrapped) };
}

async function unwrapKey(code, record) {
  const wrap = await deriveKey(code, fromB64(record.salt));
  const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(record.iv) }, wrap, fromB64(record.wrapped));
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
}

function sheetRecovery() {
  return `<div class="overlay" data-act="sheet-backdrop">
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <div class="eyebrow tight">Account recovery</div>
          <h2 class="serif-title" style="font-size:26px;margin-top:4px">Save this code</h2>
        </div>
        <button class="sheet-close" data-act="close-sheet" aria-label="Close">${ic('close', 16)}</button>
      </div>
      <p class="muted" style="font-size:12.5px;margin:10px 0 0">It is shown once and it is the only way back into your tasks if you forget your password. Write it down or drop it in your password manager.</p>
      <div class="recovery-code">${esc(ui.recoveryCode || '')}</div>
      <button class="btn block" data-act="copy-recovery">${ic('file', 14)} Copy code</button>
      <button class="btn primary block" style="margin-top:8px" data-act="close-sheet">I saved it</button>
    </div>
  </div>`;
}

function copyRecoveryCode() {
  const code = ui.recoveryCode || '';
  if (!code) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => toast('Recovery code copied')).catch(() => toast('Copy failed — write it down'));
  } else {
    toast('Copy failed — write it down');
  }
}

async function makeRecoveryCode() {
  if (!(profile && profile.mode === 'local' && cryptoKey)) return;
  const accounts = loadAccounts();
  const account = accounts.find((a) => a.id === profile.id);
  if (!account) return;
  const code = randomCode();
  account.recovery = await wrapKey(code, cryptoKey);
  saveAccounts(accounts);
  ui.recoveryCode = code;
  ui.sheet = 'recovery';
  render();
}

function viewRecover() {
  return `<div class="login">
    <div class="login-inner">
      <a class="back" href="#/login" style="margin-bottom:18px">${ic('chevronLeft', 14)} Back to log in</a>
      <div class="brand-mark">${ic('shield', 24)}</div>
      <h1>Recovery</h1>
      <p class="sub">Reset the password with your recovery code</p>

      <div class="card">
        <label class="label-sm" for="authEmail">Email</label>
        <input id="authEmail" type="email" placeholder="you@example.com" autocomplete="email" />

        <label class="label-sm" for="recoverCode" style="margin-top:12px">Recovery code</label>
        <input id="recoverCode" type="text" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX" autocomplete="one-time-code" spellcheck="false" autocapitalize="characters" />

        <label class="label-sm" for="authPassword" style="margin-top:12px">New password</label>
        <div class="pw-field">
          <input id="authPassword" type="password" placeholder="At least 8 characters" autocomplete="new-password" />
          <button type="button" class="pw-toggle" data-act="toggle-password" data-for="authPassword" aria-label="Show password" aria-pressed="false" title="Show password">${ic('eye', 16)}</button>
        </div>

        <label class="label-sm" for="authConfirm" style="margin-top:12px">Repeat new password</label>
        <div class="pw-field">
          <input id="authConfirm" type="password" placeholder="Repeat password" autocomplete="new-password" />
          <button type="button" class="pw-toggle" data-act="toggle-password" data-for="authConfirm" aria-label="Show password" aria-pressed="false" title="Show password">${ic('eye', 16)}</button>
        </div>

        ${ui.authNote ? `<p class="hint" style="color:var(--primary)">${esc(ui.authNote)}</p>` : ''}

        <button class="btn primary block" style="margin-top:14px" data-act="auth-recover">Reset password and open</button>
        <p class="muted" style="font-size:11.5px;text-align:center;margin:12px 0 0">You get a fresh recovery code when the reset finishes.</p>
      </div>
    </div>
  </div>`;
}

async function authRecover() {
  const email = ((document.getElementById('authEmail') || {}).value || '').trim().toLowerCase();
  const typed = ((document.getElementById('recoverCode') || {}).value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const code = typed.replace(/(.{4})(?=.)/g, '$1-');
  const password = (document.getElementById('authPassword') || {}).value || '';
  const confirm = (document.getElementById('authConfirm') || {}).value || '';
  const fail = (message) => { ui.authNote = message; render(); };

  if (!email) return fail('Enter the email on the account.');
  if (code.length < 8) return fail('Enter the recovery code you saved.');
  if (password.length < 8) return fail('Use at least 8 characters.');
  if (password !== confirm) return fail('Those passwords do not match.');

  let accounts = loadAccounts();
  let account = accounts.find((a) => a.email === email);

  if (!account) {
    // Same wiped-index case as log in: rebuild the entry from its encrypted
    // record, which also carries the wrapped recovery key.
    const rebuilt = recoverAccount(email);
    if (rebuilt) {
      accounts = loadAccounts();
      account = accounts.find((a) => a.id === rebuilt.id) || rebuilt;
    }
  }

  if (!account) return fail('No account with that email on this device.');
  if (!account.recovery) return fail('That account has no recovery code saved.');

  try {
    const key = await unwrapKey(code, account.recovery);
    const payload = await readLocal(account.id, key);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const nextKey = await deriveKey(password, salt);
    const nextCode = randomCode();
    account.salt = toB64(salt);
    account.recovery = await wrapKey(nextCode, nextKey);
    saveAccounts(accounts);
    const meta = { email: account.email, name: account.name, salt: account.salt, recovery: account.recovery };
    await writeLocal(account.id, nextKey, payload, meta);
    cryptoKey = nextKey;
    setProfile(await withKey({ mode: 'local', id: account.id, email: account.email, name: account.name, salt: account.salt, recovery: account.recovery }, nextKey));
    state = normalize(payload);
    ui.authNote = '';
    ui.authEmail = '';
    ui.recoveryCode = nextCode;
    ui.sheet = 'recovery';
    if (location.hash !== '#/') history.replaceState(null, '', '#/');
    render();
    toast('Password reset — save your new recovery code');
    afterAuthSync();
  } catch (e) {
    fail('That recovery code did not work.');
  }
}

function sheetLinks() {
  if (!ui.linksDraft) ui.linksDraft = state.settings.links.map((l) => ({ ...l }));
  const rows = ui.linksDraft.map((l, i) => `<div class="field">
    <div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center">
      <input id="linkLabel${i}" placeholder="Name, e.g. Algebra class" value="${esc(l.label)}" autocomplete="off" />
      <button class="icon-btn" data-act="link-remove" data-id="${i}" aria-label="Remove link">${ic('trash', 14)}</button>
    </div>
    <input id="linkUrl${i}" placeholder="classroom.google.com" value="${esc(l.url)}" autocomplete="off" style="margin-top:8px" />
  </div>`).join('');

  return `<div class="overlay" data-act="sheet-backdrop">
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <div class="eyebrow tight">Quick links</div>
          <h2 class="serif-title" style="font-size:26px;margin-top:4px">Your school sites</h2>
        </div>
        <button class="sheet-close" data-act="close-sheet" aria-label="Close">${ic('close', 16)}</button>
      </div>

      <p class="muted" style="font-size:12.5px;margin:10px 0 14px">These sit on the focus screen and open in a new browser tab, so you can read an assignment or watch a video without leaving the sprint.</p>
      ${rows || '<p class="muted" style="font-size:13px">No links yet.</p>'}
      <button class="btn block" data-act="link-add">${ic('plus', 14)} Add a link</button>
      <button class="btn primary block" style="margin-top:8px" data-act="save-links">Save links</button>
    </div>
  </div>`;
}

function captureCaret() {
  const el = document.activeElement;
  if (!el || !/^link(Label|Url)\d+$/.test(el.id || '')) return null;
  return { id: el.id, start: el.selectionStart, end: el.selectionEnd };
}

function caretAfterRemove(caret, removed) {
  const row = Number(caret.id.replace(/\D/g, ''));
  const field = caret.id.startsWith('linkLabel') ? 'linkLabel' : 'linkUrl';
  if (row < removed) return caret;
  if (row > removed) return { id: field + (row - 1), start: caret.start, end: caret.end };
  // The row under the cursor went away; the next one slid up, so put the cursor at its end.
  return ui.linksDraft[removed] ? { id: field + removed, start: null, end: null } : null;
}

function restoreCaret(caret) {
  if (!caret) return;
  const el = document.getElementById(caret.id);
  if (!el) return;
  el.focus({ preventScroll: true });
  try {
    const end = Math.min(caret.end == null ? el.value.length : caret.end, el.value.length);
    const start = caret.start == null ? el.value.length : Math.min(caret.start, end);
    el.setSelectionRange(start, end);
  } catch (e) {
    // Some inputs refuse selection ranges; focus alone is enough there.
  }
}

function saveLinks() {
  const seen = new Set();
  const links = [];
  (ui.linksDraft || []).forEach((raw) => {
    let url = String(raw.url || '').trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url.replace(/^\/+/, '');
    let host = '';
    try { host = new URL(url).hostname; } catch (e) { return; }
    if (!host || !host.includes('.')) return;
    if (seen.has(url)) return;
    seen.add(url);
    const label = String(raw.label || '').trim() || host.replace(/^www\./, '');
    links.push({ label: label.slice(0, 40), url });
  });
  state.settings.links = links.slice(0, 6);
  ui.linksDraft = null;
  ui.sheet = null;
  save();
  render();
  toast(links.length ? 'Links saved' : 'Quick links cleared');
}

async function authCreate() {
  const email = (document.getElementById('authEmail') || {}).value || '';
  const name = (document.getElementById('authName') || {}).value || '';
  const password = (document.getElementById('authPassword') || {}).value || '';
  const confirm = (document.getElementById('authConfirm') || {}).value || '';
  const bring = document.getElementById('authBring') ? document.getElementById('authBring').checked : true;
  const normalised = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalised)) { ui.authNote = 'Enter a valid email address.'; render(); return; }
  if (password.length < 8) { ui.authNote = 'Use at least 8 characters.'; render(); return; }
  if (password !== confirm) { ui.authNote = 'Those passwords do not match.'; render(); return; }

  const accounts = loadAccounts();
  if (accounts.some((a) => a.email === normalised)) {
    ui.authEmail = normalised;
    ui.authNote = 'That email already has an account here — log in instead.';
    go('/login');
    render();
    return;
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const id = uid();
  const displayName = name.trim() || normalised.split('@')[0];
  const recoveryCode = randomCode();
  const recovery = await wrapKey(recoveryCode, key);
  accounts.push({ id, email: normalised, name: displayName, salt: toB64(salt), recovery, createdAt: now() });
  saveAccounts(accounts);

  // Guest data may live in storage even when the in-memory state was emptied
  // by signing out, so read it back before handing it to the new account.
  let guestData = null;
  try { guestData = JSON.parse(localStorage.getItem(BASE_KEY + '.guest') || 'null'); } catch (e) { guestData = null; }
  const source = bring ? normalize(guestData && guestData.tasks && guestData.tasks.length ? guestData : state) : emptyState();
  const payload = source;
  const meta = { email: normalised, name: displayName, salt: toB64(salt), recovery };
  await writeLocal(id, key, payload, meta);

  cryptoKey = key;
  setProfile(await withKey({ mode: 'local', id, email: normalised, name: displayName, salt: meta.salt, recovery }, key));
  state = normalize(payload);
  ui.authNote = '';
  ui.authEmail = '';
  ui.recoveryCode = recoveryCode;
  ui.sheet = 'recovery';
  // replaceState keeps the hashchange handler from closing the code sheet.
  if (location.hash !== '#/') history.replaceState(null, '', '#/');
  render();
  toast(bring ? 'Account created — guest tasks moved in' : 'Account created');
  afterAuthSync();
}

async function authSignIn() {
  const email = ((document.getElementById('authEmail') || {}).value || '').trim().toLowerCase();
  const password = (document.getElementById('authPassword') || {}).value || '';
  const account = loadAccounts().find((a) => a.email === email) || recoverAccount(email);

  if (!account) {
    ui.authEmail = email;
    ui.authNote = 'No account with that email on this device — create one first.';
    go('/signup');
    render();
    return;
  }

  try {
    const key = await deriveKey(password, fromB64(account.salt));
    const payload = await readLocal(account.id, key);
    cryptoKey = key;
    setProfile(await withKey({ mode: 'local', id: account.id, email: account.email, name: account.name, salt: account.salt, recovery: account.recovery || null }, key));
    state = normalize(payload);
    ui.authNote = '';
    go('/');
    render();
    toast('Welcome back, ' + account.name);
    afterAuthSync();
  } catch (e) {
    ui.authNote = 'Wrong password — try again.';
    ui.authEmail = email;
    render();
  }
}

async function authUnlock() {
  const password = (document.getElementById('authPassword') || {}).value || '';
  const account = loadAccounts().find((a) => a.id === (profile && profile.id))
    || recoverAccount(profile && profile.email);
  if (!account) { switchAccount(); return; }

  try {
    const key = await deriveKey(password, fromB64(account.salt));
    const payload = await readLocal(account.id, key);
    cryptoKey = key;
    setProfile(await withKey({ mode: 'local', id: account.id, email: account.email, name: account.name, salt: account.salt, recovery: account.recovery || null }, key));
    state = normalize(payload);
    ui.authNote = '';
    go('/');
    render();
    toast('Unlocked');
    afterAuthSync();
  } catch (e) {
    ui.authNote = 'Wrong password — try again.';
    render();
  }
}

async function lockNow() {
  if (profile && profile.mode === 'local' && cryptoKey) {
    clearTimeout(saveTimer);
    try { await writeLocal(profile.id, cryptoKey, state, accountMeta(profile)); } catch (e) { console.warn('lock save failed', e); }
  }
  cryptoKey = null;
  // Dropping the stored key is what actually locks the account.
  setProfile({ ...profile, locked: true, key: null });
  go('/login');
  render();
}

function switchAccount() {
  cryptoKey = null;
  setProfile(null);
  state = normalize(null);
  ui.authNote = '';
  ui.authEmail = '';
  go('/login');
  render();
}

/* Reopening the app picks the key back up, so a signed-in device stays in
   until "Lock now" or signing out. */
async function resumeSession() {
  if (!profile || profile.mode !== 'local' || !profile.key) return;
  try {
    const key = await crypto.subtle.importKey('raw', fromB64(profile.key), { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const payload = await readLocal(profile.id, key);
    cryptoKey = key;
    profile = { ...profile, locked: false };
    state = normalize(payload);
    if (route() === '/login' || route() === '/signup' || route() === '/recover') {
      history.replaceState(null, '', '#/');
    }
    render();
    afterAuthSync();
  } catch (e) {
    console.warn('resume failed', e);
    profile = { ...profile, locked: true, key: null };
    setProfile(profile);
  }
}

function applyProfile(next) {
  setProfile(next);
  const stored = loadStore();
  state = normalize(stored);
  if (!stored) save();
  go('/');
  render();
}

function signOut() {
  if (profile && profile.mode === 'local' && cryptoKey) {
    clearTimeout(saveTimer);
    writeLocal(profile.id, cryptoKey, state, accountMeta(profile)).catch((e) => console.warn('final save failed', e));
  }
  cryptoKey = null;
  setProfile(null);
  state = normalize(null);
  ui.authEmail = '';
  go('/login');
  render();
}

/* ---------- cross-device sync ---------- */

/* One sealed row per sync code. The row id is SHA-256 of the code and the
   payload is AES-GCM under a PBKDF2 key from the same code, so the database
   only ever holds ciphertext. Nothing here runs for guests. */

const SYNC_TABLE = 'remindme_sync';
const SYNC_SALT = 'remindme-sync-v1';

function syncConfig() {
  try {
    const cfg = JSON.parse(localStorage.getItem(SYNC_CONFIG_KEY) || 'null');
    if (!cfg || !cfg.url || !cfg.anon) return null;
    return { url: String(cfg.url).replace(/\/+$/, ''), anon: String(cfg.anon) };
  } catch (e) { return null; }
}

function saveSyncConfig(url, anon) {
  const clean = String(url || '').trim().replace(/\/+$/, '');
  const key = String(anon || '').trim();
  if (!/^https?:\/\/[^\s/]+/.test(clean)) return 'Enter the project URL, for example https://abcdefgh.supabase.co';
  if (key.length < 20) return 'Paste the anon public key from Project settings → API.';
  localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify({ url: clean, anon: key }));
  return '';
}

const syncKeyFor = (id) => 'remindme.web.sync.' + id;

function syncState() {
  if (!(profile && profile.mode === 'local' && profile.id)) return null;
  try { return JSON.parse(localStorage.getItem(syncKeyFor(profile.id)) || 'null'); } catch (e) { return null; }
}

function setSyncState(next) {
  if (!(profile && profile.mode === 'local' && profile.id)) return;
  if (!next) localStorage.removeItem(syncKeyFor(profile.id));
  else localStorage.setItem(syncKeyFor(profile.id), JSON.stringify(next));
}

const syncOn = () => !!(syncConfig() && syncState());

const tidyCode = (code) => String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const prettyCode = (code) => tidyCode(code).replace(/(.{4})(?=.)/g, '$1-');

async function syncIdentity(code) {
  const clean = tidyCode(code);
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode('remindme-sync-id|' + clean));
  const id = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
  const key = await deriveKey(prettyCode(clean), encoder.encode(SYNC_SALT));
  return { id, key };
}

async function syncRequest(cfg, query, options = {}) {
  const res = await fetch(cfg.url + '/rest/v1/' + SYNC_TABLE + query, {
    method: options.method || 'GET',
    headers: {
      apikey: cfg.anon,
      Authorization: 'Bearer ' + cfg.anon,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error('sync ' + res.status + ' ' + text.slice(0, 160));
  return text ? JSON.parse(text) : [];
}

const syncPayload = (s) => ({ theme: s.theme, settings: s.settings, tasks: s.tasks, focus: s.focus });

async function sealSync(key, payload) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(payload)));
  return { iv: toB64(iv), payload: toB64(cipher) };
}

async function openSync(key, row) {
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(row.iv) }, key, fromB64(row.payload));
  return JSON.parse(new TextDecoder().decode(plain));
}

let syncing = false;
let pushTimer = 0;

/* Edits mark the row dirty and push a moment later, so a burst of taps is one
   upload instead of ten. */
function queuePush() {
  if (!syncOn() || syncing) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushSync().catch((e) => {
      console.warn('sync push failed', e);
      ui.syncNote = 'Could not reach the sync server — tasks are safe here, retrying on your next change.';
      if (route() === '/settings') render();
    });
  }, 1600);
}

async function pushSync(options = {}) {
  const cfg = syncConfig();
  const tracked = syncState();
  if (!cfg || !tracked || !isSignedIn() || syncing) return 'off';
  const { key } = await syncIdentity(tracked.code);
  const sealed = await sealSync(key, syncPayload(state));
  const stamp = new Date().toISOString();
  const rows = await syncRequest(cfg, `?id=eq.${tracked.id}&select=revision`);
  const row = rows && rows[0];

  if (!row) {
    await syncRequest(cfg, '?on_conflict=id', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: [{ id: tracked.id, iv: sealed.iv, payload: sealed.payload, revision: 1, updated_at: stamp }],
    });
    setSyncState({ ...tracked, revision: 1, dirty: false, conflict: null, lastAt: now() });
    return 'pushed';
  }

  const remote = Number(row.revision) || 1;
  if (remote !== (Number(tracked.revision) || 0) && !options.force) {
    setSyncState({ ...tracked, dirty: true, conflict: remote });
    ui.syncNote = 'Another device saved newer tasks.';
    if (route() === '/settings') render();
    else toast('Sync paused — another device has newer tasks');
    return 'conflict';
  }

  const next = remote + 1;
  const updated = await syncRequest(cfg, `?id=eq.${tracked.id}&revision=eq.${remote}`, {
    method: 'PATCH',
    body: { iv: sealed.iv, payload: sealed.payload, revision: next, updated_at: stamp },
  });
  if (!updated || !updated.length) {
    setSyncState({ ...tracked, dirty: true, conflict: remote + 1 });
    ui.syncNote = 'Another device saved newer tasks.';
    if (route() === '/settings') render();
    return 'conflict';
  }
  setSyncState({ ...tracked, revision: next, dirty: false, conflict: null, lastAt: now() });
  return 'pushed';
}

async function pullSync(options = {}) {
  const cfg = syncConfig();
  const tracked = syncState();
  if (!cfg || !tracked || !isSignedIn()) return 'off';
  const { key } = await syncIdentity(tracked.code);
  const rows = await syncRequest(cfg, `?id=eq.${tracked.id}&select=id,iv,payload,revision`);
  const row = rows && rows[0];
  if (!row) return 'empty';

  const remote = Number(row.revision) || 1;
  if (remote <= (Number(tracked.revision) || 0)) return 'current';

  // Local edits that never reached the server are never thrown away silently.
  if (tracked.dirty && !options.force) {
    setSyncState({ ...tracked, conflict: remote });
    ui.syncNote = 'Another device saved newer tasks.';
    if (route() === '/settings') render();
    return 'conflict';
  }

  const payload = await openSync(key, row);
  syncing = true;
  try {
    state = normalize(payload);
    if (cryptoKey) await writeLocal(profile.id, cryptoKey, state, accountMeta(profile));
  } finally {
    syncing = false;
  }
  setSyncState({ ...tracked, revision: remote, dirty: false, conflict: null, lastAt: now() });
  ui.syncNote = '';
  render();
  if (!options.silent) toast('Pulled the newer copy');
  return 'pulled';
}

function afterAuthSync() {
  if (!syncOn()) return;
  pullSync({ silent: true }).catch((e) => console.warn('sync pull failed', e));
}

async function enableSync() {
  if (!isSignedIn()) { toast('Create an account first — guest data is never uploaded'); return; }
  if (!syncConfig()) { ui.syncNote = ''; ui.sheet = 'sync-setup'; render(); return; }
  const existing = syncState();
  if (existing) { ui.syncCode = existing.code; ui.sheet = 'sync-code'; render(); return; }
  try {
    const code = randomCode();
    const { id, key } = await syncIdentity(code);
    const sealed = await sealSync(key, syncPayload(state));
    await syncRequest(syncConfig(), '?on_conflict=id', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: [{ id, iv: sealed.iv, payload: sealed.payload, revision: 1, updated_at: new Date().toISOString() }],
    });
    setSyncState({ code: prettyCode(code), id, revision: 1, dirty: false, conflict: null, lastAt: now() });
    ui.syncCode = prettyCode(code);
    ui.syncNote = '';
    ui.sheet = 'sync-code';
    render();
    toast('Sync is on');
  } catch (e) {
    console.warn('sync enable failed', e);
    ui.syncNote = 'That server did not accept the request. Check the URL, the key, and that schema.sql has been run.';
    render();
  }
}

async function joinSync() {
  const code = prettyCode((document.getElementById('syncJoinCode') || {}).value || '');
  if (!syncConfig()) { ui.sheet = 'sync-setup'; render(); return; }
  if (tidyCode(code).length < 12) { ui.syncNote = 'That sync code looks too short.'; render(); return; }
  try {
    const { id, key } = await syncIdentity(code);
    const rows = await syncRequest(syncConfig(), `?id=eq.${id}&select=id,iv,payload,revision`);
    const row = rows && rows[0];
    if (!row) { ui.syncNote = 'No tasks are saved under that code yet.'; render(); return; }
    const payload = await openSync(key, row);
    setSyncState({ code, id, revision: Number(row.revision) || 1, dirty: false, conflict: null, lastAt: now() });
    syncing = true;
    try {
      state = normalize(payload);
      if (cryptoKey) await writeLocal(profile.id, cryptoKey, state, accountMeta(profile));
    } finally {
      syncing = false;
    }
    ui.syncNote = '';
    ui.sheet = null;
    go('/');
    render();
    toast('Tasks pulled from your other device');
  } catch (e) {
    console.warn('sync join failed', e);
    ui.syncNote = 'That code did not open the saved tasks. Check every group.';
    render();
  }
}

async function syncNow() {
  if (!syncOn()) return;
  ui.syncNote = '';
  try {
    const result = await pullSync({ silent: true });
    if (result === 'conflict') { ui.syncNote = 'Another device saved newer tasks.'; render(); return; }
    if (result === 'pulled') { toast('Pulled the newer copy'); return; }
    await pushSync({ force: true });
    render();
    toast('Synced');
  } catch (e) {
    console.warn('sync now failed', e);
    ui.syncNote = 'Could not reach the sync server.';
    render();
  }
}

function saveSyncForm() {
  const url = (document.getElementById('syncUrl') || {}).value || '';
  const anon = (document.getElementById('syncAnon') || {}).value || '';
  const problem = saveSyncConfig(url, anon);
  if (problem) { ui.syncDraft = { url, anon }; ui.syncNote = problem; render(); return; }
  ui.syncDraft = null;
  ui.syncNote = '';
  ui.sheet = null;
  render();
  toast('Sync server saved');
}

function disableSync() {
  if (!syncState()) return;
  if (!confirm('Stop syncing on this device? The saved copy stays on the server and you can rejoin with the same code.')) return;
  setSyncState(null);
  ui.syncNote = '';
  render();
  toast('Sync off on this device');
}

function copySyncCode() {
  const code = ui.syncCode || '';
  if (!code) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => toast('Sync code copied')).catch(() => toast('Copy failed — write it down'));
  } else {
    toast('Copy failed — write it down');
  }
}

/* ---------- notifications ---------- */

const notifPermission = () => ('Notification' in window ? Notification.permission : 'unsupported');

async function notify(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg && reg.showNotification) {
      await reg.showNotification(title, {
        body,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        tag: 'remindme-' + Date.now(),
        data: { url: './' },
      });
      return;
    }
  } catch (e) { console.warn('service worker notification failed', e); }
  try { new Notification(title, { body, icon: 'icons/icon-192.png' }); } catch (e) { console.warn('notification failed', e); }
}

async function enableNotifications() {
  if (!('Notification' in window)) { toast('This browser has no notifications'); return; }
  const result = await Notification.requestPermission();
  render();
  toast(result === 'granted' ? 'Notifications are on' : 'Notifications were not granted');
}

async function testNotification() {
  if (notifPermission() !== 'granted') { await enableNotifications(); return; }
  await notify('RemindMe is ready', 'This is what a reminder looks like.');
  toast('Test notification sent');
}

/* ---------- import & export ---------- */

function mergeTasks(list) {
  let added = 0;
  let skipped = 0;
  const seen = new Set(state.tasks.map((t) => (t.title || '').trim().toLowerCase() + '|' + (t.dueAt || 0)));
  list.forEach((raw) => {
    const title = String(raw.title || '').trim();
    if (!title) return;
    const dueAt = raw.dueAt == null || raw.dueAt === '' ? null : Number(raw.dueAt);
    const key = title.toLowerCase() + '|' + (dueAt || 0);
    if (seen.has(key)) { skipped += 1; return; }
    seen.add(key);
    state.tasks.push({
      id: uid(),
      title,
      notes: raw.notes || '',
      dueAt: Number.isFinite(dueAt) ? dueAt : null,
      priority: Math.min(4, Math.max(1, Number(raw.priority) || 3)),
      repeat: raw.repeat || 'none',
      alert: raw.alert == null ? 0 : Number(raw.alert),
      subtasks: Array.isArray(raw.subtasks) ? raw.subtasks : [],
      completed: !!raw.completed,
      completedAt: raw.completedAt || null,
      createdAt: raw.createdAt || now(),
    });
    added += 1;
  });
  return { added, skipped };
}

function exportBackup() {
  const payload = {
    app: 'RemindMe',
    version: 4,
    exportedAt: new Date().toISOString(),
    account: profile && profile.email ? profile.email : 'guest',
    tasks: state.tasks,
    focus: state.focus,
    settings: state.settings,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'remindme-backup-' + dayKey() + '.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 4000);
  toast('Backup downloaded');
}

function parseCsv(text) {
  return String(text).replace(/\r/g, '').split('\n').filter((line) => line.trim()).map((line) => {
    const cells = [];
    let cell = '';
    let quoted = false;
    for (const ch of line) {
      if (ch === '"') { quoted = !quoted; continue; }
      if (ch === ',' && !quoted) { cells.push(cell); cell = ''; continue; }
      cell += ch;
    }
    cells.push(cell);
    return cells;
  });
}

function parsePriority(value) {
  const s = String(value || '').trim().toLowerCase();
  if (/^p[1-4]$/.test(s)) return Number(s[1]);
  if (/^[1-4]$/.test(s)) return Number(s);
  if (s.startsWith('urg')) return 1;
  if (s.startsWith('high')) return 2;
  if (s.startsWith('med') || s.startsWith('norm')) return 3;
  if (s.startsWith('low')) return 4;
  return 3;
}

function parseDue(dateValue, timeValue) {
  const ds = String(dateValue || '').trim();
  if (!ds) return null;
  let y;
  let m;
  let d;
  if (/^\d{4}-\d{2}-\d{2}/.test(ds)) [y, m, d] = ds.slice(0, 10).split('-').map(Number);
  else if (/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(ds)) { const p = ds.split(/[/-]/).map(Number); d = p[0]; m = p[1]; y = p[2]; }
  else {
    const parsed = new Date(ds);
    if (Number.isNaN(parsed.getTime())) return null;
    y = parsed.getFullYear(); m = parsed.getMonth() + 1; d = parsed.getDate();
  }
  const match = String(timeValue || '').trim().match(/^(\d{1,2}):(\d{2})/);
  return new Date(y, m - 1, d, match ? Number(match[1]) : 9, match ? Number(match[2]) : 0).getTime();
}

function importCsv(text) {
  const rows = parseCsv(text);
  if (!rows.length) return 'Nothing to import';
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (names) => head.findIndex((h) => names.includes(h));
  const hasHeader = head.some((h) => ['title', 'task', 'name', 'due', 'date', 'priority'].includes(h));
  const titleCol = idx(['title', 'task', 'name']);
  const dueCol = idx(['due', 'date', 'due date']);
  const timeCol = idx(['time', 'due time']);
  const priorityCol = idx(['priority', 'p']);
  const notesCol = idx(['notes', 'note', 'description']);
  const body = hasHeader ? rows.slice(1) : rows;
  const list = body.map((row) => (hasHeader && titleCol >= 0
    ? {
      title: row[titleCol],
      dueAt: parseDue(dueCol >= 0 ? row[dueCol] : '', timeCol >= 0 ? row[timeCol] : ''),
      priority: parsePriority(priorityCol >= 0 ? row[priorityCol] : ''),
      notes: notesCol >= 0 ? row[notesCol] : '',
    }
    : { title: row[0], notes: row[1] || '', dueAt: null })).filter((t) => t.title && t.title.trim());

  const { added, skipped } = mergeTasks(list);
  save();
  render();
  return `Imported ${added} task${added === 1 ? '' : 's'}${skipped ? ', skipped ' + skipped + ' duplicate' + (skipped === 1 ? '' : 's') : ''}`;
}

function importJson(text) {
  const payload = JSON.parse(text);
  const list = Array.isArray(payload) ? payload : payload.tasks;
  if (!Array.isArray(list)) return 'No tasks found in that file';
  const { added, skipped } = mergeTasks(list.map((t) => ({ ...t, dueAt: t.dueAt != null ? t.dueAt : parseDue(t.due, t.time) })));

  if (payload && payload.focus) {
    Object.entries(payload.focus.days || {}).forEach(([key, value]) => { state.focus.days[key] = Math.max(state.focus.days[key] || 0, Number(value) || 0); });
    Object.entries(payload.focus.sprints || {}).forEach(([key, value]) => { state.focus.sprints[key] = Math.max(state.focus.sprints[key] || 0, Number(value) || 0); });
  }
  if (payload && payload.settings) {
    state.settings = {
      ...state.settings,
      ...payload.settings,
      quiet: { ...state.settings.quiet, ...(payload.settings.quiet || {}) },
      planner: { ...state.settings.planner, ...(payload.settings.planner || {}) },
    };
  }
  save();
  render();
  return `Imported ${added} task${added === 1 ? '' : 's'}${skipped ? ', skipped ' + skipped + ' duplicate' + (skipped === 1 ? '' : 's') : ''}`;
}

function importFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const text = String(reader.result || '');
    try {
      const isJson = /\.json$/i.test(file.name) || text.trim().startsWith('{') || text.trim().startsWith('[');
      const message = isJson ? importJson(text) : importCsv(text);
      toast(message);
    } catch (e) {
      console.warn('import failed', e);
      toast('That file could not be imported');
    }
  };
  reader.readAsText(file);
}

/* ---------- render ---------- */

function sheetsHtml() {
  if (ui.sheet === 'new') return sheetNewTask();
  if (ui.sheet === 'reminders') return sheetReminders();
  if (ui.sheet === 'links') return sheetLinks();
  if (ui.sheet === 'timetable') return sheetTimetable();
  if (ui.sheet === 'recovery') return sheetRecovery();
  if (ui.sheet === 'sync-setup') return sheetSyncSetup();
  if (ui.sheet === 'sync-code') return sheetSyncCode();
  if (ui.sheet === 'sync-join') return sheetSyncJoin();
  return '';
}

function render() {
  document.documentElement.dataset.theme = state.theme;
  try { localStorage.setItem('remindme.web.theme', state.theme); } catch (e) { /* ignore */ }

  let path = route();
  let html = '';

  // A running sprint snaps every route back to the timer.
  if (focusLocked() && path !== '/focus') {
    path = '/focus';
    if (location.hash !== '#/focus') history.replaceState(null, '', '#/focus');
  }

  if (!profile || profile.locked) {
    // Gate everything behind the welcome screen, like the reference build.
    html = !profile && path === '/signup' ? viewSignup() : !profile && path === '/recover' ? viewRecover() : viewLogin();
    app.innerHTML = `<div class="shell">${html}${sheetsHtml()}</div>`;
    return;
  }

  // The auth screens are for signed-out visitors; a signed-in account goes home.
  if ((path === '/login' || path === '/signup' || path === '/recover') && isSignedIn()) {
    path = '/';
    if (location.hash !== '#/') history.replaceState(null, '', '#/');
  }
  if (path === '/login' || path === '/signup' || path === '/recover') {
    html = path === '/signup' ? viewSignup() : path === '/recover' ? viewRecover() : viewLogin();
    app.innerHTML = `<div class="shell">${html}${sheetsHtml()}</div>`;
    return;
  }

  let active = 'today';
  if (path === '/tasks') { html = viewTasks(); active = 'tasks'; }
  else if (path === '/focus') { html = viewFocus(); active = 'focus'; }
  else if (path === '/stats') { html = viewStats(); active = 'stats'; }
  else if (path === '/settings') { html = viewSettings(); active = 'none'; }
  else if (path === '/privacy' || path === '/terms') { html = viewDoc(path.slice(1)); active = 'none'; }
  else html = viewToday();

  app.innerHTML = `<div class="shell">${html}${active === 'none' ? '' : tabbar(active)}${fab()}${sheetsHtml()}</div>`;

  if (ui.sheet === 'new' && !ui.sheetFocused) {
    const title = document.getElementById('draftTitle');
    if (title) { title.focus(); ui.sheetFocused = true; }
  }
  // Home-screen badge: how many tasks are still due today.
  if (navigator.setAppBadge && profile) {
    const left = dueToday().length;
    const badge = left ? navigator.setAppBadge(left) : navigator.clearAppBadge && navigator.clearAppBadge();
    if (badge && badge.catch) badge.catch(() => {});
  }
}

/* ---------- events ---------- */

app.addEventListener('click', (event) => {
  const el = event.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  const id = el.dataset.id;

  if (act === 'sheet-backdrop' && event.target === el) { ui.sheet = null; ui.linksDraft = null; render(); return; }

  switch (act) {
    case 'settings': go('/settings'); break;
    case 'back': go('/'); break;
    case 'reminders': ui.sheet = 'reminders'; render(); break;
    case 'new-task': ui.sheet = 'new'; ui.sheetFocused = false; ui.draft = blankDraft(); render(); break;
    case 'close-sheet': ui.sheet = null; ui.sheetFocused = false; ui.draft = null; ui.linksDraft = null; render(); break;
    case 'focus': go('/focus'); break;
    case 'quick-sprint':
      startQuickSprint(Number(id));
      break;
    case 'toggle': toggleTask(id); break;
    case 'delete': deleteTask(id); break;
    case 'select': {
      if (ui.selected.has(id)) ui.selected.delete(id); else ui.selected.add(id);
      render();
      break;
    }
    case 'select-mode': ui.selectMode = !ui.selectMode; ui.selected.clear(); render(); break;
    case 'delete-selected': {
      state.tasks = state.tasks.filter((t) => !ui.selected.has(t.id));
      ui.selected.clear();
      ui.selectMode = false;
      save();
      render();
      break;
    }
    case 'toggle-all': ui.showAll = !ui.showAll; render(); break;
    case 'filter': ui.priorityFilter = Number(id); render(); break;
    case 'theme': state.theme = id; save(); render(); break;
    case 'trend': ui.trend = Number(id); render(); break;
    case 'focus-mode': ui.focusMode = id; render(); break;
    case 'preset': choosePreset(id); break;
    case 'toggle-timer': { const t = currentTimer(); if (t.running) pauseTimer(); else startTimer(); break; }
    case 'reset': resetTimer(); break;
    case 'skip': skipPhase(); break;
    case 'sign-out': signOut(); break;
    case 'guest': applyProfile({ mode: 'guest' }); break;
    case 'go-signup': ui.authNote = ''; go('/signup'); break;
    case 'go-login': ui.authNote = ''; go('/login'); break;
    case 'login': authSignIn(); break;
    case 'auth-signin': authSignIn(); break;
    case 'auth-create': authCreate(); break;
    case 'toggle-password': togglePassword(el); break;
    case 'auth-unlock': authUnlock(); break;
    case 'auth-switch': switchAccount(); break;
    case 'auth-recover': authRecover(); break;
    case 'make-recovery': makeRecoveryCode(); break;
    case 'sync-open-setup': ui.syncNote = ''; ui.syncDraft = null; ui.sheet = 'sync-setup'; render(); break;
    case 'sync-open-join': ui.syncNote = ''; ui.sheet = 'sync-join'; render(); break;
    case 'sync-config-save': saveSyncForm(); break;
    case 'sync-enable': enableSync(); break;
    case 'sync-join': joinSync(); break;
    case 'sync-now': syncNow(); break;
    case 'sync-pull': pullSync({ force: true }).catch((e) => { console.warn('sync pull failed', e); ui.syncNote = 'Could not reach the sync server.'; render(); }); break;
    case 'sync-push': pushSync({ force: true }).then((r) => { if (r === 'pushed') { ui.syncNote = ''; render(); toast('This device is the copy now'); } }).catch((e) => { console.warn('sync push failed', e); ui.syncNote = 'Could not reach the sync server.'; render(); }); break;
    case 'sync-show-code': ui.syncCode = (syncState() || {}).code || ''; ui.sheet = 'sync-code'; render(); break;
    case 'sync-off': disableSync(); break;
    case 'copy-sync': copySyncCode(); break;
    case 'copy-recovery': copyRecoveryCode(); break;
    case 'peek': ui.peekUntil = Date.now() + PEEK_MS; render(); toast('3 minutes — tabs unlock, the sprint keeps running'); break;
    case 'end-peek': ui.peekUntil = 0; render(); break;
    case 'open-timetable': ui.sheet = 'timetable'; ui.timetableText = ''; render(); break;
    case 'save-timetable': saveTimetable(); break;
    case 'plan-week': planWeek(); break;
    case 'clear-timetable': state.settings.timetable = []; save(); render(); toast('Timetable cleared'); break;
    case 'lock': lockNow(); break;
    case 'edit-links': ui.linksDraft = state.settings.links.map((l) => ({ ...l })); ui.sheet = 'links'; render(); break;
    case 'link-add': {
      const caret = captureCaret();
      ui.linksDraft.push({ label: '', url: '' });
      render();
      restoreCaret(caret || { id: 'linkLabel' + (ui.linksDraft.length - 1), start: 0, end: 0 });
      break;
    }
    case 'link-remove': {
      const removed = Number(id);
      const caret = captureCaret();
      if (!ui.linksDraft[removed]) break;
      ui.linksDraft.splice(removed, 1);
      render();
      const kept = caret ? caretAfterRemove(caret, removed) : null;
      restoreCaret(kept || { id: 'linkLabel' + Math.max(0, Math.min(removed, ui.linksDraft.length - 1)), start: 0, end: 0 });
      break;
    }
    case 'save-links': saveLinks(); break;
    case 'test-notification': testNotification(); break;
    case 'export': exportBackup(); break;
    case 'draft-priority': ui.draft.priority = Number(id); render(); break;
    case 'add-step': addStep(); break;
    case 'remove-step': ui.draft.subtasks.splice(Number(id), 1); render(); break;
    case 'save-task': addTask(ui.draft); break;
    case 'quiet-toggle': state.settings.quiet.enabled = !state.settings.quiet.enabled; save(); render(); break;
    case 'planner-toggle': state.settings.planner.enabled = !state.settings.planner.enabled; save(); render(); break;
    case 'enable-notifications': enableNotifications(); break;
    case 'clear-history': clearHistory(); break;
    case 'wipe':
      if (confirm('Delete every task, sprint and setting on this device? If sync is on, that empty state is uploaded too.')) {
        state = emptyState();
        save();
        render();
        toast('Local data cleared');
      }
      break;
    default: break;
  }
  if (act !== 'sheet-backdrop') event.stopPropagation();
});

function addStep() {
  const input = document.getElementById('draftStep');
  const value = (input ? input.value : '').trim();
  if (!value) return;
  ui.draft.subtasks.push({ id: uid(), title: value, done: false });
  ui.draft.step = '';
  render();
}

app.addEventListener('input', (event) => {
  const target = event.target;
  if (target.id === 'timetableText') { ui.timetableText = target.value; return; }
  if (ui.linksDraft && (target.id.startsWith('linkLabel') || target.id.startsWith('linkUrl'))) {
    const index = Number(target.id.replace(/\D/g, ''));
    const field = target.id.startsWith('linkLabel') ? 'label' : 'url';
    if (ui.linksDraft[index]) ui.linksDraft[index][field] = target.value;
    return;
  }
  if (target.id === 'search') {
    ui.query = target.value;
    const caret = target.selectionStart;
    const list = document.querySelector('.screen');
    if (!list) return render();
    // Re-render only the results by rebuilding the view and keeping the field.
    const input = target;
    input.value = ui.query;
    render();
    const again = document.getElementById('search');
    if (again) { again.focus(); again.setSelectionRange(caret, caret); }
    return;
  }
  if (!ui.draft) return;
  if (target.id === 'draftTitle') { ui.draft.title = target.value; const btn = document.querySelector('[data-act="save-task"]'); if (btn) btn.disabled = !target.value.trim(); }
  if (target.id === 'draftNotes') ui.draft.notes = target.value;
  if (target.id === 'draftDate') ui.draft.date = target.value;
  if (target.id === 'draftTime') ui.draft.time = target.value;
  if (target.id === 'draftStep') ui.draft.step = target.value;
});

app.addEventListener('change', (event) => {
  const el = event.target;
  const act = el.dataset.act;
  if (el.id === 'draftRepeat' && ui.draft) { ui.draft.repeat = el.value; return; }
  if (el.id === 'draftAlert' && ui.draft) { ui.draft.alert = Number(el.value); return; }
  if (el.id === 'importFile') { importFile(el.files && el.files[0]); el.value = ''; return; }
  if (el.id === 'timetableFile' && el.files && el.files[0]) {
    const file = el.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      ui.timetableText = String(reader.result || '');
      render();
      toast('Loaded — press Save timetable');
    };
    reader.readAsText(file);
    el.value = '';
    return;
  }
  if (act === 'quiet-start') { state.settings.quiet.start = Number(el.value); save(); render(); }
  if (act === 'quiet-end') { state.settings.quiet.end = Number(el.value); save(); render(); }
  if (act === 'planner-hour') { state.settings.planner.hour = Number(el.value); save(); render(); }
});

/* ---------- boot ---------- */

window.addEventListener('hashchange', () => {
  ui.sheet = null;
  ui.draft = null;
  ui.linksDraft = null;
  ui.timetableText = '';
  if (focusLocked() && route() !== '/focus') toast('Tabs are locked while a sprint runs — pause to leave');
  render();
});

function handleEntryParams() {
  const params = new URLSearchParams(location.search);
  if (!params.toString()) return;
  const shared = [params.get('title'), params.get('text'), params.get('url')].filter(Boolean).join(' — ').trim();
  const action = params.get('action');
  history.replaceState(null, '', location.pathname + location.hash);
  if (action === 'sprint') { go('/focus'); return; }
  if (action === 'new' || shared) {
    ui.draft = blankDraft();
    if (shared) {
      ui.draft.title = shared.slice(0, 120);
      ui.draft.notes = shared.length > 120 ? shared : '';
    }
    ui.sheet = 'new';
  }
}

handleEntryParams();
render();
resumeSession();
setInterval(tick, 1000);
setInterval(checkDue, 30000);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('sw failed', e));
  });
}

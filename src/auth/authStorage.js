const SESSION_KEY = "liftly.session";
const USERS_KEY = "liftly.users";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function getSession() {
  const raw = window.localStorage.getItem(SESSION_KEY);
  return raw ? safeParse(raw, null) : null;
}

export function setSession(session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getUsers() {
  const raw = window.localStorage.getItem(USERS_KEY);
  return raw ? safeParse(raw, []) : [];
}

export function setUsers(users) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}



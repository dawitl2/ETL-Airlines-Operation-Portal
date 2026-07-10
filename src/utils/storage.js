const PREFIX = 'etl.portal.'

export function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(`${PREFIX}${key}`)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
}

export function removeStorage(key) {
  window.localStorage.removeItem(`${PREFIX}${key}`)
}

export function resetPortalStorage() {
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => window.localStorage.removeItem(key))
}

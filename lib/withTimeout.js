// Reject a hanging request instead of waiting forever.
//
// Firestore's web SDK waits ~10s before giving up and flipping to offline mode
// ("Could not reach Cloud Firestore backend"). On a server-rendered page that
// blocks the whole response, so the user stares at a frozen tab and then gets a
// misleading "nothing here" empty state. Failing fast lets callers show a real
// "connection problem — retry" state quickly.
export function withTimeout(promise, ms = 7000, label = "Request") {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

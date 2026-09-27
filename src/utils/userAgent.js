// Mimic current real clients so indexers accept the requests. Keep these in
// step with the latest Prowlarr (search) / SABnzbd (download) releases.
// - Prowlarr (Servarr) sends "{App}/{fullVersion} ({osName} {osVersion})".
// - SABnzbd sends "SABnzbd/{version}" (no OS suffix).
const DEFAULT_SEARCH_UA = 'Prowlarr/2.6.5.5623 (ubuntu 24.04)';
const DEFAULT_DOWNLOAD_UA = 'SABnzbd/5.1.3';

/**
 * Sanitize a raw User-Agent string coming from an environment variable.
 *
 * HTTP header values must be Latin1; Node's http layer throws
 * ERR_INVALID_CHAR on control characters (including CR/LF), and many
 * servers reject non-ASCII. We strip control characters and anything
 * outside printable ASCII (0x20–0x7E), then trim.
 *
 * Returns '' when the input is empty after sanitization, so callers can
 * fall back to the built-in default.
 */
function sanitizeUserAgent(raw) {
  const s = String(raw == null ? '' : raw).trim();
  if (!s) return '';
  return s.replace(/[^\x20-\x7E]+/g, '').trim();
}

// Internal resolvers — pure, side-effect free, so the logging function below
// can call them without triggering recursion.
function resolveSearchUserAgent() {
  const custom = sanitizeUserAgent(process.env.USER_AGENT_SEARCH);
  return custom || DEFAULT_SEARCH_UA;
}

function resolveDownloadUserAgent() {
  const custom = sanitizeUserAgent(process.env.USER_AGENT_DOWNLOAD);
  return custom || DEFAULT_DOWNLOAD_UA;
}

// Log the effective User-Agents exactly once per process, on the first call
// to either getter. This is the earliest point where env vars are guaranteed
// to be populated (see the project's runtime-env boot pattern), so the log
// reflects what will actually be sent on the wire. Helps operators verify
// that a WebUI override was picked up — or debug a Cloudflare/WAF rejection.
let _uaLoggedOnce = false;
function logActiveUserAgentsOnce() {
  if (_uaLoggedOnce) return;
  _uaLoggedOnce = true;
  try {
    const search = resolveSearchUserAgent();
    const download = resolveDownloadUserAgent();
    const searchSource = search === DEFAULT_SEARCH_UA ? 'built-in default' : 'override';
    const downloadSource = download === DEFAULT_DOWNLOAD_UA ? 'built-in default' : 'override';
    console.log(`[UA] Search User-Agent   (${searchSource}): ${search}`);
    console.log(`[UA] Download User-Agent (${downloadSource}): ${download}`);
  } catch (_) {
    // Never let logging break a request
  }
}

/**
 * Gibt den User-Agent für Suchanfragen zurück.
 * Ist die Umgebungsvariable USER_AGENT_SEARCH gesetzt und nicht leer, wird
 * dieser Wert verwendet. Andernfalls greift der Standard aus dieser Datei.
 */
function getDefaultSearchUserAgent() {
  logActiveUserAgentsOnce();
  return resolveSearchUserAgent();
}

/**
 * Gibt den User-Agent für Download-Anfragen (NZB-Fetch) zurück.
 * Ist die Umgebungsvariable USER_AGENT_DOWNLOAD gesetzt und nicht leer, wird
 * dieser Wert verwendet. Andernfalls greift der Standard aus dieser Datei.
 */
function getDefaultDownloadUserAgent() {
  logActiveUserAgentsOnce();
  return resolveDownloadUserAgent();
}

// Backward-compatible alias — returns the download UA. Existing callers that
// download NZB payloads continue to work unchanged.
// @deprecated Use getDefaultDownloadUserAgent() instead. Will be removed in a
// future release.
function getRandomUserAgent() {
  return getDefaultDownloadUserAgent();
}

module.exports = {
  getRandomUserAgent,
  getDefaultSearchUserAgent,
  getDefaultDownloadUserAgent,
  DEFAULT_SEARCH_UA,
  DEFAULT_DOWNLOAD_UA,
  sanitizeUserAgent,
};
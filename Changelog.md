# Changelog

All notable changes in this fork are documented here.

This fork keeps the upstream `1.8.4` baseline and uses `1.8.4-ua.2` to distinguish fork-specific changes.

## [1.8.4-ua.2] - 2026-09-27

### Added

- Added GitHub Container Registry publishing via `.github/workflows/docker-publish.yml`.
- Added global `USER_AGENT_SEARCH` and `USER_AGENT_DOWNLOAD` fields to the admin dashboard.
- Added per-indexer Search and Download User-Agent overrides.
- Added printable-ASCII validation for User-Agent values.
- Added Direct Newznab lookup by slug, display name, configured name, numeric ID, and ordinal.

### Changed

- Updated the built-in search User-Agent to `Prowlarr/2.6.5.5623 (ubuntu 24.04)`.
- Updated the built-in download User-Agent to `SABnzbd/5.1.3`.
- Documented User-Agent precedence: per-indexer override, global override, then built-in default.
- Sanitized custom User-Agent values before using them as HTTP headers.
- Added consistent `User-Agent`, `Accept`, and `Accept-Encoding` headers to Newznab capability checks, searches, and tests.
- Improved per-indexer User-Agent fallback behavior in NZBDav uploads and triage downloads.
- Extended proxy and User-Agent lookup to numeric indexer IDs and ordinals.
- Updated Docker documentation and fork branding to:
  `ghcr.io/netfiller-droid/usenetstreamerua:latest`.
- Updated package and runtime version metadata to `1.8.4-ua.2`.

### Fixed

- Prevented malformed User-Agent values from causing Node HTTP header errors.
- Added save/test validation so invalid User-Agent values are rejected before requests are sent.
- Removed stale duplicate admin initialization code.
- Fixed a malformed preset status character in the admin UI.

### Compatibility

- Axios remains pinned to `1.17.0`.
- Blank User-Agent overrides continue to use the built-in defaults.
- Existing configurations require no migration.

### Files changed during this release window

- `.github/workflows/docker-publish.yml`
- `README.md`
- `admin/app.js`
- `admin/index.html`
- `package.json`
- `server.js`
- `src/config/constants.js`
- `src/services/newznab.js`
- `src/services/nzbdav.js`
- `src/services/triage/runner.js`
- `src/utils/userAgent.js`
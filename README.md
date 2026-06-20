# PERDE Frontend

React + Vite frontend for Perde.az with public pages and admin panel.

## Key updates in this package

- Admin login recovery form added: admin name, email, phone, reset channel, reset code and new password.
- Admin settings page updated: admin name, email, phone and latest reset code are managed from the panel.
- Campaign/advertisement lead form phone validation was corrected to accept Azerbaijani formats such as `0505224433`, `050 522 44 33`, `994505224433` and `+994505224433`.
- Vite build warning noise from known third-party annotations and large chunks was reduced through production build config.

## Build

```bash
npm install
npm run build
```

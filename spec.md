# No Plastics Pledge

## Current State
- Motoko backend stores pledges with: certificateId, name, email, timestamp
- Backend exposes: takePledge, getTotalPledges, getRecentCertificates (name only, no email)
- Frontend shows a hero, pledge form, certificate generator with PDF download
- Pledger names are NOT shown publicly on the page
- No admin access or internal record visibility

## Requested Changes (Diff)

### Add
- Backend: `getAdminPledges(password: Text)` query that returns full pledge records (name, email, certificateId, timestamp) only if the correct password matches a hardcoded admin password hash
- Frontend: Admin panel page at `/admin` route (or toggled via a hidden nav link in the footer)
- Admin panel: Password entry screen; on success shows a table of all pledgers with columns: Certificate #, Name, Email, Date/Time
- Admin panel: Logout button to return to password screen

### Modify
- App.tsx: Add routing or state-based navigation to show AdminPanel component
- Footer: Add a discreet "Admin" link at the bottom

### Remove
- Nothing removed from existing features

## Implementation Plan
1. Add `getAdminPledges(password: Text)` to backend returning full Pledge records gated by password check
2. Update backend.d.ts to include the new method and Pledge type
3. Create AdminPanel.tsx component with:
   - Password gate (input + submit)
   - On success: table showing all pledgers (cert#, name, email, date)
   - Logout button
4. Add discreet "Admin" link in Footer that navigates to admin panel
5. Wire admin panel into App.tsx via state-based view switching
6. Validate and deploy

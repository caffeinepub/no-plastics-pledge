# No Single-Use Plastics Pledge

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A public pledge page where visitors can fill in their name and email, then submit a pledge to not use single-use plastics.
- Backend storage of pledge records (name, email, timestamp, unique certificate ID).
- Automated PDF certificate generation in the browser that is "signed" by the site owner, includes the pledger's name, the pledge date, a unique certificate number, and the pledge text.
- A download button to save the generated certificate as a PDF file.
- A public counter showing the total number of people who have taken the pledge.
- An optional public pledge wall showing recent pledgers (name only, no email).

### Modify
- None.

### Remove
- None.

## Implementation Plan
1. Backend (Motoko):
   - `submitPledge(name: Text, email: Text): async Result<PledgeRecord, Text>` -- stores pledge, returns record with unique ID and timestamp.
   - `getPledgeCount(): async Nat` -- returns total number of pledges.
   - `getRecentPledges(limit: Nat): async [PledgeInfo]` -- returns recent pledger names and dates (no emails).
   - Prevent duplicate submissions by the same email.

2. Frontend:
   - Landing/hero section with mission statement about single-use plastics.
   - Pledge form: full name + email fields, pledge text displayed (read-only), submit button.
   - On success: show certificate preview and download-as-PDF button (using jsPDF or html2canvas + jsPDF in the browser).
   - Certificate design: includes pledger name, date, unique certificate number, pledge statement, and owner's signature (text/stylized).
   - Live pledge counter on the page.
   - Recent pledgers wall (first name + last initial).

# No Plastics Pledge

## Current State
The app has a Motoko backend with a `pledgesMap` (in-memory Map) and a `counter` variable tracking pledge records and certificate numbers. The live canister has 12 pledge records persisted from previous use. The frontend shows the pledge count and an admin panel.

## Requested Changes (Diff)

### Add
- `adminResetPledges(password: Text)` backend function that clears all pledge records and resets the certificate counter to 0.

### Modify
- Backend: add the reset function so the admin can wipe all records and restart numbering from 1.

### Remove
- Nothing removed from the UI.

## Implementation Plan
1. Regenerate backend with `adminResetPledges` function added.
2. Call `adminResetPledges` from the frontend on app init (once, automatically) to clear the 12 existing records and reset counter to 0.

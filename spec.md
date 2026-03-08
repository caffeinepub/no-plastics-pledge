# No Plastics Pledge

## Current State
- Full-stack pledge website with Motoko backend and React frontend
- Certificate component renders a styled certificate at 794px wide with unconstrained height
- Signature uses "Crimson Pro italic" at 38px
- PDF download uses html2canvas + jsPDF but dimensions are computed dynamically from offsetHeight, which can cause mismatches
- Certificate ID is generated as "CERT-{timestamp}" -- not sequential
- Backend `takePledge` returns `Certificate` with `id` field set to the timestamp-based string

## Requested Changes (Diff)

### Add
- Sequential certificate counter in backend (var pledgeCounter: Nat = 0) that increments on each pledge
- Certificate number returned as the sequential number (1, 2, 3...) in the `id` field
- Dancing Script (Google Font) loaded in index.html for handwriting-style signature

### Modify
- Certificate aspect ratio: fix width=794px, height=567px (7:5 ratio, 794 * 5/7 ≈ 567)
- Certificate inner content layout: compress spacing/font sizes to fit cleanly in 567px height
- Signature font: change from "Crimson Pro italic" to "Dancing Script" (script/handwriting font)
- Signature font size: reduce from 38px to ~28px
- PDF download: use fixed dimensions (794 x 567) for both html2canvas and jsPDF, remove dynamic offsetHeight computation
- Certificate number display: show as plain integer (e.g. "1", "2") not the old timestamp string
- Backend `generateCertificateId` replaced with sequential counter logic

### Remove
- Dynamic height calculation in PDF download (`certRef.current.offsetHeight`)
- Timestamp-based certificate ID generation

## Implementation Plan
1. Update `main.mo`: add `var pledgeCounter: Nat = 0`, increment on each pledge, return counter value as the certificate id (as Text)
2. Update `Certificate.tsx`:
   - Set certificate div height to 567px explicitly
   - Update html2canvas call: `width: 794, height: 567`
   - Update jsPDF format: `[794, 567]`
   - Change signature fontFamily to `"Dancing Script, cursive"`
   - Reduce signature fontSize to 28px
   - Adjust internal spacing to fit content within fixed height
3. Load Dancing Script font in `index.html` via Google Fonts link

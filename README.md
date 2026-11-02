# FLOadmit website

**Live website:** https://ovoarnav.github.io/floadmit-website/

**Source repository:** https://github.com/ovoarnav/floadmit-website

A standalone static marketing website and browser-local pilot planner, ready for GitHub Pages. There is no build step or package installation.

The site presents FLOadmit’s three core functions:

1. Take in referral documents and assess medical fit.
2. Calculate insurance and reimbursement estimates from supplied inputs and configured rates.
3. Generate 24-hour and 72-hour care-plan drafts for clinical review.

It also explains the hospital discharge-report use case and planned deployment safeguards. This public website does not accept patient documents or perform clinical processing. The pilot planner creates a general workflow brief in the visitor’s browser; it has no submission backend.

## Files

- `index.html` — website content and dialogs.
- `styles.css` — responsive layout and visual design.
- `app.js` — navigation, dialogs, and the local pilot planner.
- `config.js` — optional public contact and website settings.
- `assets/logo.svg` — brand mark and favicon.
- `.nojekyll` — serve the static files directly on GitHub Pages.

## Preview locally

From this directory, run `python3 -m http.server 8000`, then open the local server in a browser. No patient data is needed or supported.

## Configure

Edit `config.js` as needed:

- `contactEmail`: optional real contact address. Leaving it empty hides email actions.
- `bookingUrl`: optional HTTPS booking address. Leaving it empty hides the booking action.
- `productionUrl`: the actual published website URL, once known. This supplies canonical and Open Graph URL metadata.
- `founderName`: the name displayed in the footer.

These settings are public. Never add secrets or credentials.

## Publish with GitHub Pages

1. Commit these files at the repository root and push the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set the source to **Deploy from a branch**, select **main**, and select **/ (root)**. Save.
4. Wait for the Pages deployment to complete, then use the published URL shown by GitHub.
5. Set `productionUrl` in `config.js` to that confirmed URL and commit the change.

Keep the custom-domain setting empty until the owner has bought a domain. Once that domain is available, configure it through GitHub Pages and the domain provider, then update `productionUrl` to the confirmed HTTPS address.

This repository is only the public website. Hospital document processing, Epic connectivity, and deployment-specific privacy and security controls are separate implementation work.

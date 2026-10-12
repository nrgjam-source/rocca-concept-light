# ROCCA PRIVATE

Light is now an independent B2C site. Do not synchronize its homepage with Dark.

## Campaign
Edit assets/js/private-config.js: active, endsAt (Moscow timezone), headline, description, terms, cta. The campaign hides automatically after endsAt. The only installed offer is photolayout plus sink installation with a countertop order through 31 October 2026. Confirm commercial applicability with the team before advertising. No percentage discounts or pricing are installed.

## Form
/api/form-status enables online sending only when both RESEND_API_KEY and ROCCA_FORM_FROM exist. Add a restricted sending key in Vercel project rocca-concept-light and a verified sender/domain in Resend. Never put credentials in GitHub. Destination is fixed to hello@roccastone.ru.

Until configured, the visible form prepares a mailto draft and explicitly states that it is not sent; the file picker is disabled. Files must be added to the email. No success event is emitted for drafts.

Online mode supports PDF/DWG/DXF/JPG/PNG, 5 files, total 3 MiB; files are passed as email attachments, never stored publicly. Configure provider quotas and platform rate limits before broad paid traffic. Honeypot, same-origin check, body limits, input validation and provider idempotency are included. No customer payload is logged.

## Analytics
Standard dataLayer events: hero_quote, header_quote, sticky_quote, category_quote, promotion_quote, material_quote, form_open, form_submit, form_submit_attempt, email_draft_prepared, phone_click, email_click, projects_view, form_error, lead_success. No personal field values are added. lead_success only follows provider acceptance. Connect an analytics provider separately, respecting consent requirements.

## Reviews and future entry URLs
Add only confirmed reviews to private-config.js reviews, with author, text, verified:true and source. Empty reviews are hidden publicly. landings contains reusable product presets for future /stoleshnicy, /lestnicy, /kaminy, /podokonniki; pages are not yet created and no links lead to them.

Hero shows the kitchen-island panel of the already approved solutions-collage.webp, using a CSS viewport preserving pixel proportions. It is labeled as a visualization. Replace with a real wide kitchen photo when supplied. Other concepts are labeled; actual work and before/after use existing verified case photographs.

# ROCCA Light — integration

Light is an independent full-cycle brand concept for private clients and, secondarily, architects/designers. Do not synchronize its content with Dark. Legacy private-* file names and the ROCCA_PRIVATE config namespace remain internal implementation details.

## Campaign
Edit assets/js/private-config.js: active, endsAt (Moscow timezone), title, headline, description (bonus), terms and cta. The campaign hides automatically after endsAt and appears only in its standalone homepage section, never in the hero. The installed offer is photolayout plus sink installation with a countertop order through 31 October 2026. No percentage discounts or pricing are installed.

## Form
/api/form-status enables online sending only when both RESEND_API_KEY and ROCCA_FORM_FROM exist. Add a restricted sending key in Vercel project rocca-concept-light and a verified sender/domain in Resend. Never put credentials in GitHub. Destination is fixed to hello@roccastone.ru.

Until configured, the visible form prepares a mailto draft and explicitly states that it is not sent; the file picker is disabled. Files must be added to the email. No success event is emitted for drafts.

Online mode supports PDF/DWG/DXF/JPG/PNG, 5 files, total 3 MiB; files are passed as email attachments, never stored publicly. Configure provider quotas and platform rate limits before broad paid traffic. Honeypot, same-origin check, body limits, input validation and provider idempotency are included. No customer payload is logged.

## Analytics
Standard dataLayer events: hero_quote, header_quote, sticky_quote, category_quote, promotion_quote, material_quote, form_open, form_submit, form_submit_attempt, email_draft_prepared, phone_click, email_click, projects_view, form_error, lead_success. No personal field values are added. lead_success only follows provider acceptance. Connect an analytics provider separately, respecting consent requirements.

## Reviews and future entry URLs
The homepage contains no review section. The existing optional data configuration accepts only confirmed reviews with author, text, verified:true and source. landings and content/site-structure.json contain reusable product presets for future /stoleshnicy, /lestnicy, /kaminy, /podokonniki and /vannye; pages are not yet created and no public links lead to them.

Hero retains the approved hero2 kitchen-island image: hero-private-island-{550,1100,1672}.webp, responsive srcset, eager loading and high fetch priority. It is labeled as a visualization. Other conceptual imagery is distinguished from actual work; projects and before/after use existing verified case photographs. Photo replacement is a separate next stage.

## Routes
New /materials explains material selection without a stock catalogue. /professionals contains the detailed technical process removed from the homepage. /contacts reuses the same quotation form and verified sales, technical and management phone numbers.

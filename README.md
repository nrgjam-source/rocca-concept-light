# ROCCA PRIVATE

Independent light website for private clients. Production: https://rocca-concept-light.vercel.app/

Dark ROCCA (nrgjam-source/rocca-concept / rocca-concept-standalone) remains a separate B2B and architectural site. Never synchronize Private homepage content back to Dark.

Static HTML/CSS/JS with existing Inter fonts, image assets and IntersectionObserver reveals. Existing /projects, /production and /journal remain. All routes stay noindex.

## Content and configuration

- assets/js/private-config.js: campaign text, Moscow expiry date, verified reviews and future product landing presets.
- assets/css/private.css: Private layout and responsive product presentation.
- assets/js/private.js: campaign rendering, standard dataLayer hooks and quotation form.
- api/form-status.js, api/lead.js: optional configured email delivery.
- content/private-integration.md: configuration and form behavior.

Form sending is disabled until RESEND_API_KEY and ROCCA_FORM_FROM are configured in this Vercel project with a verified sender. The current fallback prepares a mailto draft and does not claim to send it or upload files.

No fabricated reviews, prices or percentage discounts. Hero and conceptual product panels are marked as visualizations; real cases use the existing project archive.

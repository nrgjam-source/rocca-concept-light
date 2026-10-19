# ROCCA — Light concept

Independent light website for full-cycle interior and architectural stone solutions. Production: https://rocca-concept-light.vercel.app/

Dark ROCCA (nrgjam-source/rocca-concept / rocca-concept-standalone) is a separate project. Do not synchronize this concept back to Dark.

Static HTML/CSS/JS with existing Inter fonts, image assets and IntersectionObserver reveals. Active routes: /, /projects, /production, /materials, /professionals, /journal and /contacts. All routes stay noindex.

The homepage has nine chapters: image-led hero, editorial product grid, four real projects, materials, four full-cycle stages, own production, three client audiences, replaceable campaign, and contact form. Production is the only graphite section. Existing photography is retained pending a separate photo review. The approved R and ROCCA SVG artwork and header/footer markup are unchanged. Internal pages retain their previous layout.

## Content and configuration

- assets/js/private-config.js: campaign text, Moscow expiry date, verified reviews and future product landing presets.
- assets/css/private.css: Private layout and responsive product presentation.
- assets/css/concept.css: retained shared light-theme styling.
- assets/css/editorial.css: homepage-only composition and responsive editorial grids.
- assets/js/private.js: campaign rendering, standard dataLayer hooks and quotation form.
- api/form-status.js, api/lead.js: optional configured email delivery.
- content/private-integration.md: configuration and form behavior.
- content/site-structure.json: active routes and planned product landing presets.

Form sending is disabled until RESEND_API_KEY and ROCCA_FORM_FROM are configured in this Vercel project with a verified sender. The current fallback prepares a mailto draft and does not claim to send it or upload files. On the homepage the file picker is shown only when online delivery is actually configured.

No fabricated reviews, prices or percentage discounts. Hero and conceptual product panels are marked as visualizations; real cases use the existing project archive.

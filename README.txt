UniRent cleaned static site — v6

Open index.html locally.

v6 code cleanup changes:
- Shared navigation/footer are now rendered from js/unirent.js, so links and footer copy are edited in one place.
- Previous CSS override layers were consolidated into css/unirent.css.
- Inline page CSS was extracted into css/pages/[page].css.
- Inline page JavaScript was extracted into js/pages/[page].js.
- Cross-page behavior is centralized in js/unirent.js: mobile menu, image fallbacks, reveal animation, reservation URL prefill, floating CTA and contact-form feedback.
- Legacy root files unirent-fixes.css/js, unirent-v2.css/js, unirent-v3.css, unirent-v4.css and unirent-v5.css/js were removed from the active page references.

Pages:
- index.html
- uslovi-najma.html
- vozni-park.html
- rezervacija-vozila.html
- cenovnik.html
- blog.html
- kontakt.html

Assets remain in /assets. Replace temporary car/blog imagery there when final assets are ready.


V7 VISUAL STEP 1
- Added css/unirent-visual-v7.css as the first step of the visual polish.
- Focus areas: stronger brand identity, glass navigation, richer hero atmosphere, unified CTA/buttons, more premium cards/forms, and refined pricing table styling.
- Existing v6 structure stays unchanged; this is an override layer loaded after page CSS for easy review/revert.

v8 visual pass:
- Added css/unirent-visual-v8.css as the Step 2 vehicle/fleet redesign layer.
- Vehicle cards now use clearer class badges, spec chips, stronger price blocks and two actions: Rezerviši + Cenovnik.
- Homepage, Vozni park and Rezervacija vehicle cards now share the same visual language.


V9 visual pass:
- Redesigned cenovnik/pricing page.
- Added pricing overview cards, sticky vehicle/group/action columns on desktop, mobile pricing cards, clearer group chips, result count, and stronger reservation CTA styling.


v10 update: redesigned reservation page as a clearer booking flow with steps, selected vehicle summary, improved detail panel, and contact step UI.


V11 update:
- Redesigned uslovi-najma.html for better scanability.
- Added top requirement cards, brief summary strip, sticky section navigation, and native accessible accordion panels.
- Added css/unirent-visual-v11.css and js/pages/uslovi-najma.js.

v12 update:
- Added Blog + Kontakt visual polish layer: css/unirent-visual-v12.css
- Redesigned blog page with featured article, sidebar, category filters, richer article cards and FAQ styling.
- Redesigned contact page with quick contact cards, contact info placeholders, map-style visual, premium form and response process cards.
- Added js/pages/blog.js and js/pages/kontakt.js for small UI enhancements.


V13 update:
- Final homepage hero and booking pass added via css/unirent-visual-v13.css.
- Homepage now has a clearer visible value proposition, stronger CTA pair, premium booking card, route/context strip, and 3-step reservation explainer.


V14 final micro-polish / QA pass:
- Added css/unirent-visual-v14.css for final responsive spacing, focus states, CTA consistency, mobile menu polish and small-screen performance tweaks.
- Added js/unirent-v14.js for scroll state, mobile menu cleanup on resize and non-critical image lazy loading.
- Added meta descriptions to all HTML pages.
- Updated footer year to 2026 and removed remaining hidden placeholder copy.
- Rechecked internal references after packaging.


V15 QA cleanup:
- fixed duplicated vehicle cards on Vozni park
- aligned vehicle groups/prices/fuels across homepage, fleet and reservation
- added a real <main> wrapper to homepage
- removed contradictory unlimited/all-inclusive copy
- replaced identical temporary car/blog images with unique placeholder assets

Asset structure used by v20:
- assets/cars/fleet/ — individual vehicle photos used in cards and reservation lists.
- assets/cars/hero/ — hero/feature car images for homepage, reservation, terms and fleet hero sections.
Legacy image paths are kept in the package, but the HTML/JS now points to the organized canonical folders above.


v25 update:
- Added rezervacija-podaci.html as the continuation page after a selected vehicle.
- Vehicle reserve/select links now pass vehicle, group, price, date/time data into the continuation flow.
- Added js/pages/rezervacija-podaci.js and css/unirent-visual-v25.css.

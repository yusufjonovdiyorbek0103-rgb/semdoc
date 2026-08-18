This is a VISUAL REDESIGN ONLY. Do not change any functionality, data, routing, component structure, state logic, or interactions. Every screen, every button, every mock record stays exactly as it is. You are replacing the visual layer of the existing SEMDOC application, nothing else.

The current design reads as empty rather than minimal, because decoration was removed without structure put in its place. Fix that with tonal depth, typographic authority, and ledger-like structure — NOT with color, gradients, or ornament. This remains a serious government tool.

REPLACE THE COLOR TOKENS:

Surfaces — the key fix is real tonal separation between canvas and cards:
--canvas #E8EBEF        page background, noticeably darker than cards
--surface #FFFFFF       cards, tables, panels
--surface-2 #F4F6F8     nested blocks, table headers, excerpt blocks
--hairline #D3D9E0      standard 1px border
--hairline-strong #B4BDC8  section rules and table header underlines

Navy family — the structural anchor:
--navy-900 #0A1B2E      sidebar background, top bar
--navy-800 #10283F
--navy-700 #16395A      primary buttons
--navy-600 #1F4B77      hover
--navy-100 #DCE4EE      selected row tint

Ink:
--ink #0B0F14, --ink-2 #4A5563, --ink-3 #7C8796, --ink-inv #FFFFFF

Brass — the seal accent. This is the ONLY warm color in the product and it carries one meaning: verified provenance. Use it exclusively on source citations, the "manba tasdiqlangan" mark, and the active-tab underline. Never on buttons, never on charts, never decoratively.
--brass #8A6A28, --brass-soft #C9A961, --brass-bg #F7F2E6

Status: --ok #14603F, --warn #7A5410, --danger #8C2222
Relevance density (navy hue only, unchanged in meaning):
--rel-95 #0A1B2E, --rel-80 #16395A, --rel-60 #3D6893, --rel-40 #7architecture — replace this line with #7A97B8, --rel-20 #B6C5D5

TYPOGRAPHY — add a display voice:
Load Source Serif 4 (400, 600) and use it in TWO roles now:
1. Page titles (H1) and card titles at 20px and above — Source Serif 4 600, letter-spacing -0.02em. This is the new display voice.
2. Document body text and quoted excerpts — Source Serif 4 400, as before.
Inter stays for all UI chrome: nav, labels, buttons, form fields, table cells, body UI text.
IBM Plex Mono stays for numbers, IDs, dates, metrics — always with tabular figures (font-variant-numeric: tabular-nums).

New type scale — widen the contrast:
Micro label 10px / Caption 11px / Small 12px / Body 13px / Body-lg 14px / Doc text 15px / Card title 20px / H1 34px / Metric 40px
Line-height 1.5 for UI, 1.7 for document text.

MICRO LABELS — this is what gives the interface institutional texture. Every section, card, and column group gets one: 10px, uppercase, letter-spacing 0.10em, weight 600, color var(--ink-3). Use them liberally — they are the connective tissue of the design.

SIDEBAR — rebuild as a dark rail:
Background var(--navy-900), width 248px, no border.
Wordmark "SEMDOC" in Source Serif 4 600, 20px, white, letter-spacing 0.02em. Below it "Semantik tahlil tizimi" in Inter 400, 11px, white 55%.
Nav items 38px tall, Inter 500 13px, color white 72%. Icons 16px at white 50%.
Hover: background white 6%.
Active: background white 10%, text pure white, icons white, and a 3px var(--brass-soft) bar on the left edge — the only place brass appears in the sidebar.
Section labels: 10px uppercase, letter-spacing 0.10em, white 35%, with 20px top margin.
Count badges: white 12% background, 3px radius, 10px mono, white 80%.
Sidebar footer above a 1px white-10% rule: label "INDEKSLANGAN HUJJATLAR" in 10px white 40%, value "12 428" in IBM Plex Mono 20px white.

TOP BAR — 52px, background var(--navy-900), 1px bottom border white 8%. Since the wordmark now lives in the sidebar, the top bar holds: on the left, the current screen name in Inter 500 13px white 80%; on the right the "Yopiq kontur" badge (1px white-20% border, transparent fill, 10px uppercase letter-spacing 0.08em) and the user block as before.

CONTENT AREA — add a margin rail, which is the structural signature of this redesign:
Main content sits on var(--canvas) with 28px padding. Inside it, reserve a 56px left gutter column. This gutter holds marginalia in IBM Plex Mono 10px var(--ink-3), right-aligned against a 1px var(--hairline) vertical rule that runs the full content height: section numbers (01, 02, 03), result indices, page markers. Content begins 20px to the right of that rule. This borrows directly from how official document registers are laid out, and it is what makes the page feel composed rather than floated.

PAGE HEADER pattern — replace the old one:
Micro label eyebrow, then H1 in Source Serif 4 600 34px var(--ink) with -0.02em tracking, then one line of Inter 13px var(--ink-2), max-width 60ch. Then a rule that is 2px var(--hairline-strong) for the first 64px and 1px var(--hairline) for the remaining width — a small detail that reads as intentional.

CARDS — now that canvas is darker, cards can stay flat and still read as objects:
Background var(--surface), 1px var(--hairline), 4px radius, NO shadow. Card header: micro label, 1px hairline rule below it, 16px padding. Keep radius at 4px everywhere — do not increase it.

TABLES — ruled register style:
Header row: var(--surface-2) background, 10px uppercase letter-spacing 0.08em var(--ink-2), 2px var(--hairline-strong) bottom border.
Body rows 44px, 1px var(--hairline) between rows, no zebra striping. Numeric columns right-aligned in IBM Plex Mono. Row hover: var(--surface-2).

BUTTONS: primary var(--navy-700), white text, 36px, 4px radius, Inter 500 13px, hover var(--navy-600). Secondary: transparent, 1px var(--hairline-strong), var(--ink). Text buttons: var(--navy-600), no underline until hover.

INPUTS: 36px, 1px var(--hairline), 4px radius, white. Focus: 1px var(--navy-600) border plus a 2px var(--navy-100) outer ring.

MOTION — exactly one orchestrated moment, nothing else:
When a list of results or table rows renders, items fade in and rise 6px with a 40ms stagger between them, 160ms duration. Any relevance bar animates its fill from 0 to its value over 400ms with ease-out. No other animation anywhere. Respect prefers-reduced-motion by disabling both.

Apply all of this globally now. Do not restyle individual screens in this step and do not alter any logic.
# KIND[ CPH ]DESIGN – website

Website for Kind Design CPH, et designfællesskab i København.
Bygget i [Astro](https://astro.build) med data fra [Supabase](https://supabase.com) og deployet på Netlify.

- Live: https://kinddesign-team9.netlify.app/
- Design (Figma): prototype, designsystem og komponenter i KIND-filen

## Kom i gang

Kræver Node.js 18 eller nyere.

```sh
npm install      # installér afhængigheder
npm run dev      # start lokal server på http://localhost:4321
npm run build    # byg det statiske site til ./dist
npm run preview  # se det byggede site lokalt
```

## Mappestruktur

```text
public/
  fonts/              Geist Regular og Medium (.woff2) + licens (OFL.txt)
  images/             Design-fotos (hero, community, about …) i WebP
src/
  css/global.css      Design tokens (farver, skrift, afstande), reset og fælles klasser
  layouts/Layout.astro  Skabelon for alle sider: <head>, Header, <slot />, Footer
  lib/supabase.js     Supabase-endpoint, nøgle, billedsti og små hjælpefunktioner
  components/         Genbrugelige komponenter (se nedenfor)
  pages/              Én fil = én side (Astros filbaserede routing)
    index.astro           Forside
    about.astro           About
    join-us.astro         Join us / First time
    events/index.astro    Liste over kommende events
    events/[id].astro     Én side pr. event (getStaticPaths)
    past-events/index.astro  Tidligere events
```

## Komponenter

| Komponent | Props | Bruges til |
| --- | --- | --- |
| `Logo` | `words`, `light`, `href` | Det dynamiske logo. Ordene i parentesen skifter med en opløsnings-effekt, 3 runder, og stopper på det første ord. `"smile"` viser smilet. |
| `Header` | – | Logo, menu i parenteser og mobilmenu (`[ MENU ]`) |
| `Footer` | – | Links, motto og stort logo |
| `Tag` | `format`, `date` | `[ FORMAT ]` + dato. Vælger farve ud fra formatet. |
| `EventRow` | `date`, `format`, `title`, `subtitle`, `image`, `href`, `linkText` | Række i eventlisten. Hover (desktop): formatfarve bag rækken, sort/hvid foto og sløring af de andre rækker. |
| `EventCard` | `href`, `image`, `alt`, `format`, `date`, `title` | Kort med foto, tag og titel (Latest events) |

## Design tokens

Alle værdier kommer fra Figma og ligger som CSS-variabler i `src/css/global.css`.
Brug variablerne i stedet for faste værdier.

| Token | Værdi | Brug |
| --- | --- | --- |
| `--ink` | `#2C1B17` | Tekst, linjer, mørke flader |
| `--off-white` | `#FAFAFA` | Baggrund |
| `--surface` | `#F2F0EC` | Paneler, header, footer |
| `--talk` | `#BDD9FF` | Format: Talk |
| `--meetup` | `#F5BDA9` | Format: Meetup |
| `--skill` | `#CDDFD5` | Format: Skill sharing |
| `--social` | `#FFE5B4` | Format: Social |
| `--font-weight-regular` / `--font-weight-medium` | `400` / `500` | Geist Regular / Medium |
| `--ease-soft` / `--ease-out` | cubic-bezier | Lukke-/åbne-bevægelser |

Regler fra designsystemet: ingen afrundede hjørner (de gentager den firkantede parentes),
ingen grå tekst, og farve bruges kun til at vise eventets format.

## CSS: mobile first

Grundreglerne er mobilversionen. Desktop tilføjes med `@media (min-width: 769px)`.
Hver komponent har sin egen `<style>`, som Astro automatisk scoper til komponenten.

## Data fra Supabase

Sitet er statisk: data hentes, når siden bygges, ikke i besøgendes browser.

**Tabeller**

| Tabel | Vigtige kolonner | Relation |
| --- | --- | --- |
| `Events` | `title`, `dato`, `time`, `format`, `venue`, `price`, `language`, `description`, `image`, `signup_label`, `signup_url`, `agenda` (jsonb), `recap_title`, `recap_text`, `gallery` (jsonb), `photo_credit`, `partner_id`, `partner_role` | `partner_id` → `partners.id` |
| `Speakers` | `event_id`, `name`, `portrait`, `talk_title`, `talk_subtitle`, `bio`, `sort_order` | `event_id` → `Events.id` |
| `partners` | `name`, `logo`, `website` | |
| `faq` | `question`, `answer`, `sort_order` | |

- **Adgang:** Row Level Security er slået til med en policy, der kun tillader læsning.
  Nøglen i `src/lib/supabase.js` er den offentlige *publishable key* og kan ikke ændre data.
- **Billeder:** Event-fotos ligger i Storage-bucketen `events`. I tabellen står kun filnavnet,
  fx `rina-takikawa.webp`. `imgurl + event.image` giver den fulde adresse.
- **Kommende eller tidligere:** afgøres af `dato` (før i dag = tidligere). Tom dato vises som "Date TBA".

**Sådan hentes data**

```js
import { url, options } from "../lib/supabase.js";
const events = await fetch(url + "Events?select=*&order=dato.asc", options).then((res) => res.json());
```

**Detaljesider:** `src/pages/events/[id].astro` bruger `getStaticPaths()` til at lave én statisk side
pr. række i `Events`. Kommende events vises som event-panel, tidligere som recap med talere og galleri.

**Nyt indhold:** Ret i Supabase (Table Editor), og udløs derefter et nyt deploy i Netlify
(Deploys → Trigger deploy), så ændringen kommer med.

## Arbejdsgang med Git

1. Hent nyeste `main`: `git checkout main && git pull origin main`
2. Lav en branch pr. opgave: `git checkout -b navn-opgave`
3. Commit små, beskrivende ændringer
4. Push og lav en pull request til `main`
5. Netlify bygger automatisk, når `main` opdateres

## Krav fra opgaven

- `<meta name="robots" content="noindex,nofollow">` i `Layout.astro`
- Layout med `<slot />`, Header og Footer som komponenter
- Komponenter med props
- Liste- og detaljevisning med `getStaticPaths()` og data fra Supabase
- Responsivt (mobile first)
- Git med branches, deploy via Netlify

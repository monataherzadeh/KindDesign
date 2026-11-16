// =
// Supabase – endpoint, nøgle og billedsti ét sted.
// Project URL + /rest/v1/  (tabelnavnet sættes på i hver fetch)
export const url = "https://aiezbnoebquacwnwlteb.supabase.co/rest/v1/";

export const options = {
  method: "GET",
  headers: {
    apikey: "sb_publishable_Msk2D7J6cGMYXGL0kPahFw_TspKmuaE",
  },
};

// Sti til billeder i Storage (bucket "events")
export const imgurl = "https://aiezbnoebquacwnwlteb.supabase.co/storage/v1/object/public/events/";

// ---------- Små hjælpere ----------

// "2026-12-04" → "Fri 04.12".  Ingen dato → "Date TBA"
export function dateLabel(dato) {
  if (!dato) return "Date TBA";
  const d = new Date(dato);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${weekday} ${day}.${month}`;
}

// Er eventet overstået? (sammenlignet med dagen, siden bygges)
const today = new Date().toISOString().slice(0, 10);
export function isPast(event) {
  return Boolean(event.dato) && event.dato < today;
}

// "18:30–20:00 + mingling" → "18:30" (kun starttidspunktet, til lister)
export function shortTime(time) {
  return time ? time.split("–")[0].trim() : null;
}

// Link til et event: egen side, hvis der er indhold – ellers Instagram
export function eventLink(event) {
  return event.description || isPast(event) ? `/events/${event.id}` : "https://www.instagram.com/kinddesign.cph/";
}

// Formatets farve (som tags og kort i Figma)
export const formatColors = {
  Talk: "var(--talk)",
  Meetup: "var(--meetup)",
  "Skill sharing": "var(--skill)",
  Social: "var(--social)",
};

// app/utils/formatDuration.js

export function formatDurationText(duration, L, locale = "de") {
  if (!duration) return "";

  // Google liefert meist: "1 hour 22 mins" oder "22 mins"
  let hours = 0, mins = 0;

  // Zahl & Einheit rausfiltern
  const hourMatch = duration.match(/(\d+)\s*h(?:ou)?r/);
  const minMatch  = duration.match(/(\d+)\s*m(?:in)?/);

  if (hourMatch) hours = parseInt(hourMatch[1]);
  if (minMatch)  mins = parseInt(minMatch[1]);

  // Plural-Logik über die Übersetzungen
  const plural = (n, single, plural) => n === 1 ? single : plural;

  // Arabisch: Zahlen arabisch rendern
  const num = n => locale === "ar"
    ? n.toLocaleString("ar-EG")
    : n;

  let parts = [];
  if (hours > 0) parts.push(`${num(hours)} ${plural(hours, L.hourSingular, L.hourPlural)}`);
  if (mins > 0)  parts.push(`${num(mins)} ${plural(mins, L.minuteSingular, L.minutePlural)}`);

  if (parts.length === 0) return duration;

  // Trennzeichen je Sprache
  const joiner = locale === "ar" ? "، " : ", ";
  return parts.join(joiner);
}

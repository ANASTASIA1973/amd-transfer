"use client";

export default function LanguageSwitcher({ locale, setLocale }) {
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      aria-label="Sprache auswählen"
      className="
        border border-gray-300
        rounded-md
        text-sm
        px-3 py-2
        bg-white
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-[#C09743]
        transition
        appearance-none
      "
    >
      <option value="de">DE</option>
      <option value="en">EN</option>
      <option value="ar">AR</option>
    </select>
  );
}

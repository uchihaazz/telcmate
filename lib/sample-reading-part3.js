// Sample Reading Teil 3 exercise
export const sampleReadingPart3 = {
  id: "reading-part3-2",
  type: "reading",
  part: "part3",
  title: "Reading Exercise - Teil 3",
  description: "Match each title with the appropriate text. Some titles do not match any text (mark these with 'X').",
  timeLimit: 15, // minutes

  // Titles to match
  titles: [
    "Umweltfreundliche Transportmittel",
    "Digitale Bildung in Deutschland",
    "Neue Wege zur Energiegewinnung",
    "Kulturelle Vielfalt in Europa",
    "Gesunde Ernährung im Alltag",
    "Moderne Arbeitsplatzgestaltung",
  ],

  // Texts to match with titles
  texts: [
    {
      content:
        "In den letzten Jahren hat sich die Art und Weise, wie wir arbeiten, grundlegend verändert. Flexible Arbeitszeiten, Home-Office und ergonomische Möbel sind nur einige der Aspekte, die moderne Unternehmen berücksichtigen, um die Produktivität und das Wohlbefinden ihrer Mitarbeiter zu fördern.",
    },
    {
      content:
        "Die Nutzung von Fahrrädern, öffentlichen Verkehrsmitteln und Carsharing-Diensten nimmt in deutschen Großstädten stetig zu. Diese Entwicklung trägt nicht nur zur Reduzierung der Umweltbelastung bei, sondern fördert auch einen gesünderen Lebensstil.",
    },
    {
      content:
        "Obst, Gemüse und Vollkornprodukte sollten die Basis unserer täglichen Ernährung bilden. Eine ausgewogene Ernährung stärkt das Immunsystem, gibt Energie und kann vor zahlreichen Krankheiten schützen.",
    },
    {
      content:
        "Solarenergie, Windkraft und Wasserkraft sind erneuerbare Energiequellen, die immer wichtiger werden. Deutschland investiert stark in diese Technologien, um die Abhängigkeit von fossilen Brennstoffen zu reduzieren und die Klimaziele zu erreichen.",
    },
  ],

  // Correct matches (title index to text index or "X" for no match)
  correctMatches: [
    "text-0", // Title 0 matches Text 0
    "X", // Title 1 has no matching text
    "text-3", // Title 2 matches Text 3
    "X", // Title 3 has no matching text
    "text-2", // Title 4 matches Text 2
    "text-1", // Title 5 matches Text 1
  ],
}

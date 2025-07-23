/**
 * Utility script to help migrate Wikipedia URLs to word entries.
 * This contains the mapping from the old getWikipediaLinkForWord function
 * that can be used to populate wikipediaUrl fields in word entries.
 *
 * Usage: Run this to get the correct Wikipedia URLs for your words.
 */

// Special cases mapping from the old function
const WIKIPEDIA_SPECIAL_CASES: Record<string, string> = {
  // Tech terms that might need disambiguation
  EMAIL: "Email",
  VIRUS: "Computer_virus",
  CACHE: "Cache_(computing)",
  STACK: "Stack_(abstract_data_type)",
  CODES: "Computer_programming",
  FILES: "Computer_file",
  PINGS: "Ping_(networking_utility)",
  DEBUG: "Debugging",
  BYTES: "Byte",
  CLOUD: "Cloud_computing",
  LINUX: "Linux",
  TESLA: "Tesla,_Inc.",

  // Science terms that might need disambiguation
  ATOMS: "Atom",
  CELLS: "Cell_(biology)",
  GENES: "Gene",
  STARS: "Star",
  POLAR: "Polar_(disambiguation)",
  DATUM: "Data",
  MICRO: "Micro-",
  ASTRO: "Astronomy",
  FLORA: "Flora",
  OXIDE: "Oxide",
  HYDRO: "Hydrogen",
  GAMMA: "Gamma_ray",
  ORBIT: "Orbit",
  QUARK: "Quark",

  // Video game terms
  MARIO: "Mario_(character)",
  SONIC: "Sonic_the_Hedgehog_(character)",
  ZELDA: "Princess_Zelda",
  RUPEE: "Rupee_(The_Legend_of_Zelda)",
  PIXEL: "Pixel",
  COMBO: "Combo_(video_games)",
  LEVEL: "Level_(video_games)",
  BOSSY: "Boss_(video_games)",

  // Anime and manga terms
  MANGA: "Manga",
  OTAKU: "Otaku",
  MECHA: "Mecha",
  NINJA: "Ninja",
  SAMUR: "Samurai",
  YOKAI: "Yokai",
  CHIBI: "Chibi_(slang)",
  KAWAI: "Kawaii",
  GENKI: "Genki",
  SAKUR: "Cherry_blossom",
  JUTSU: "Ninjutsu",
  SENPU: "Whirlwind",
  HELLS: "Hell",
  SHONN: "Shonen_manga",

  // Fantasy and sci-fi terms
  MAGIC: "Magic_(supernatural)",
  ELVES: "Elf",
  DWARF: "Dwarf_(mythology)",
  SPOCK: "Spock",
  FORCE: "The_Force",
  QUEST: "Quest",
  CYBER: "Cyber-",

  // Literature terms
  NOVEL: "Novel",
  POETS: "Poetry",
  STORY: "Story",
  PROSE: "Prose",
  FABLE: "Fable",
  VERSE: "Verse_(poetry)",
  EDGAR: "Edgar_Allan_Poe",
  HOMER: "Homer",

  // Movie terms
  PIXAR: "Pixar",
  ACTOR: "Actor",
  SCENE: "Scene_(filmmaking)",
  SCORE: "Film_score",
  THEME: "Theme_(narrative)",
  GENRE: "Film_genre",
  CAMEO: "Cameo_appearance",
  SHORT: "Short_film",

  // Tabletop and board games
  CHESS: "Chess",
  DICEY: "Dice",
  TOKEN: "Game_token",
  HEXES: "Hexagon",
  DECKS: "Playing_card",
  CHECK: "Check_(chess)",
  SPELL: "Magic_spell",
  CARDS: "Playing_card",
  BOARD: "Board_game",

  // Superheroes
  JOKER: "Joker_(character)",
  ROBIN: "Robin_(character)",
  BLADE: "Blade_(character)",
  FLASH: "Flash_(DC_Comics_character)",
  BEAST: "Beast_(comics)",
  SPAWN: "Spawn_(character)",
  VENOM: "Venom_(character)",
  LOGAN: "Wolverine_(character)",
};

/**
 * Generate a Wikipedia URL for a given word
 */
export const generateWikipediaUrl = (word: string): string => {
  const searchTerm = WIKIPEDIA_SPECIAL_CASES[word] || word;
  const formattedTerm = searchTerm.replace(/\s+/g, "_");
  return `https://en.wikipedia.org/wiki/${formattedTerm}`;
};

/**
 * Helper to get Wikipedia URLs for multiple words
 */
export const getWikipediaUrls = (words: string[]): Record<string, string> => {
  return words.reduce((acc, word) => {
    acc[word] = generateWikipediaUrl(word);
    return acc;
  }, {} as Record<string, string>);
};

// Example usage:
// console.log(generateWikipediaUrl("ATOMS")); // https://en.wikipedia.org/wiki/Atom
// console.log(getWikipediaUrls(["PIXAR", "ZELDA", "CHESS"]));

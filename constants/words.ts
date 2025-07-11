const WORDS = {
  common: [
    "SLATE",
    "TRACE",
    "ROAST",
    "STARE",
    "CARET",
    "CRANE",
    "SLANT",
    "STALE",
    "STOLE",
    "SNARE",
    "IRATE",
    "AROSE",
    "TRAIN",
    "TASER",
    "RAISE",
    "TRADE",
    "ORATE",
    "SLICE",
    "LANCE",
    "STORE",
    "TARES",
    "LEANT",
    "ALTER",
    "CRONE",
    "CLOSE",
    "ARIEL",
    "ARISE",
    "AISLE",
    "SCALE",
    "ALONE",
    "TEARS",
    "SITAR",
    "SNORE",
    "CANST",
    "TAILS",
    "TRIAL",
    "CASTE",
    "PLANE",
    "RESAT",
    "TONER",
    "TRANS",
    "TALES",
    "SCARE",
    "ALERT",
    "CATER",
    "DEALT",
    "EARNT",
    "RINSE",
    "RATES",
    "LEARN",
    "SIREN",
    "TRIES",
    "REALS",
    "STAIR",
    "SALON",
    "CLONE",
    "NITRE",
    "LATER",
    "COAST",
    "CANOE",
    "CAIRN",
    "SNORT",
    "TENOR",
    "CAROL",
    "LITRE",
    "SONAR",
    "PARSE",
    "GRATE",
    "SARIN",
    "TRODE",
    "CARES",
    "ATONE",
    "TRIPE",
    "SAUTE",
    "CLADE",
    "SCANT",
    "DRONE",
    "TALON",
    "TRUCE",
    "SORTA",
    "SLOAN",
    "CRUET",
    "TRIED",
    "STONE",
    "SPARE",
    "TIRES",
    "CREST",
    "TROPE",
    "NACRE",
    "CLINT",
    "TILES",
    "SATIN",
    "SINCE",
    "LEANS",
    "PEARL",
    "SOLAR",
    "SHARE",
    "SHALE",
    "TROIS",
    "REACT",
    "MISTY",
    "PLAIN",
    "HOIST",
    "PLATE",
    "NOISE",
  ],

  movies: [
    "PIXAR",
    "ACTOR",
    "SCENE",
    "SCORE",
    "THEME",
    "GENRE",
    "CAMEO",
    "SHORT",
  ],

  literature: [
    "NOVEL",
    "POETS",
    "STORY",
    "PROSE",
    "FABLE",
    "VERSE",
    "EDGAR",
    "HOMER",
  ],

  fantasyAndSciFi: [
    "MAGIC",
    "QUEST",
    "ELVES",
    "SPOCK",
    "CYBER",
    "DWARF",
    "FORCE",
  ],

  science: [
    "ATOMS",
    "QUARK",
    "CELLS",
    "GENES",
    "ORBIT",
    "GAMMA",
    "HYDRO",
    "OXIDE",
    "FLORA",
    "ASTRO",
    "MICRO",
    "STARS",
    "POLAR",
    "DATUM",
  ],

  videoGames: [
    "MARIO",
    "SONIC",
    "RUPEE",
    "BOSSY",
    "LEVEL",
    "PIXEL",
    "ZELDA",
    "COMBO",
  ],

  animeAndManga: [
    "MANGA",
    "OTAKU",
    "SENPU",
    "MECHA",
    "HELLS",
    "JUTSU",
    "KAWAI",
    "CHIBI",
    "GENKI",
    "SAKUR",
    "NINJA",
    "SAMUR",
    "SHONN",
    "YOKAI",
  ],

  tabletopAndBoardGames: [
    "DICEY",
    "CHESS",
    "TOKEN",
    "HEXES",
    "DECKS",
    "CHECK",
    "SPELL",
    "CARDS",
    "BOARD",
  ],

  techAndInternetCulture: [
    "LINUX",
    "BYTES",
    "CODER",
    "CLOUD",
    "TESLA",
    "CACHE",
    "PINGS",
    "DEBUG",
    "STACK",
    "CODES",
    "FILES",
    "VIRUS",
    "EMAIL",
  ],

  superheroes: [
    "JOKER",
    "ROBIN",
    "BLADE",
    "FLASH",
    "BEAST",
    "SPAWN",
    "VENOM",
    "LOGAN",
  ],
} as const;

// Hints for specific words
const HINTS: Record<string, string> = {
  // Science
  ATOMS: "Even Heisenberg couldn't pin this one down exactly.",
  QUARK: "A fundamental particle that's always strange.",
  CELLS: "The building blocks of life, not your phone.",
  GENES: "What makes you, you - it's in your DNA.",
  ORBIT: "Going in circles around something bigger.",
  GAMMA: "The most energetic form of electromagnetic radiation.",
  HYDRO: "The H in H2O - hydrogen's time to shine.",
  OXIDE: "When oxygen bonds with another element.",
  FLORA: "All the plants in a particular area.",
  ASTRO: "Relating to stars and space exploration.",
  MICRO: "Tiny, microscopic, or very small scale.",
  STARS: "Twinkle, twinkle, little... wait, that's not right.",
  POLAR: "Opposite ends, like North and South poles.",
  DATUM: "A single piece of information or data point.",

  // Movies
  PIXAR: "Animation magic that brings toys to life.",
  ACTOR: "Someone who pretends to be someone else for a living.",
  SCENE: "A part of a movie or play with its own setting.",
  SCORE: "The background music that sets the mood.",
  THEME: "The main idea or message of a story.",
  GENRE: "A category of artistic composition.",
  MOVIE: "Motion pictures that tell stories on screen.",
  CAMEO: "A brief appearance by a famous person.",
  SHORT: "A film that's not quite feature length.",

  // Literature
  NOVEL: "A long fictional story in book form.",
  POETS: "Writers who craft verses and rhymes.",
  STORY: "A narrative that entertains or teaches.",
  PROSE: "Written language in its ordinary form.",
  FABLE: "A short story with a moral lesson.",
  VERSE: "Poetry or metrical writing.",
  EDGAR: "Allan Poe, master of mystery and horror.",
  HOMER: "Ancient Greek poet of the Odyssey.",

  // Fantasy and Sci-Fi
  MAGIC: "Abracadabra! The art of the impossible.",
  QUEST: "A journey to find something important.",
  ELVES: "Pointy-eared magical beings from folklore.",
  SPOCK: "Live long and prosper with this logical choice.",
  CYBER: "Relating to computers and digital technology.",
  DWARF: "Short, stout beings who love mining and crafting.",
  FORCE: "May this be with you, young padawan.",

  // Video Games
  MARIO: "It's-a me! This plumber's always jumping.",
  SONIC: "Gotta go fast! The blue hedgehog's speed.",
  RUPEE: "The currency of Hyrule's green gems.",
  BOSSY: "Like a difficult boss fight in a game.",
  LEVEL: "A stage or area in a video game.",
  PIXEL: "The tiny squares that make up digital images.",
  ZELDA: "The princess, not the hero - though both are legendary.",
  COMBO: "A sequence of moves that work together.",

  // Anime and Manga
  MANGA: "Japanese comic books and graphic novels.",
  OTAKU: "A person with obsessive interests, especially anime.",
  SENPU: "A whirlwind or tornado in Japanese.",
  MECHA: "Giant robots piloted by humans.",
  HELLS: "Multiple underworlds or demonic realms.",
  JUTSU: "Ninja techniques and special abilities.",
  KAWAI: "Cute and adorable in Japanese culture.",
  CHIBI: "Small, cute versions of characters.",
  GENKI: "Energetic and full of life in Japanese.",
  SAKUR: "Cherry blossoms, a symbol of spring.",
  NINJA: "Stealthy warriors with special skills.",
  SAMUR: "Honorable Japanese warriors with swords.",
  SHONN: "A genre of anime aimed at young boys.",
  YOKAI: "Supernatural creatures from Japanese folklore.",

  // Tabletop and Board Games
  DICEY: "Risky or uncertain, like rolling dice.",
  CHESS: "The game of kings, queens, and strategic thinking.",
  TOKEN: "A small piece representing something in a game.",
  HEXES: "Six-sided spaces on a game board.",
  DECKS: "Collections of cards for playing games.",
  CHECK: "A threat to capture the king in chess.",
  SPELL: "Magical words that create effects.",
  CARDS: "Rectangular pieces used in many games.",
  BOARD: "The surface where games are played.",

  // Tech and Internet Culture
  LINUX: "Free as in freedom, not as in beer.",
  BYTES: "Units of digital information storage.",
  CODER: "Someone who writes computer programs.",
  CLOUD: "Remote servers accessed over the internet.",
  TESLA: "Electric cars and innovative technology.",
  CACHE: "Temporary storage for faster access.",
  PINGS: "Network messages to check connectivity.",
  DEBUG: "The art of removing bugs, not adding features.",
  STACK: "A data structure that works like a pile.",
  CODES: "Instructions that tell computers what to do.",
  FILES: "Collections of data stored on computers.",
  VIRUS: "Malicious software that spreads like disease.",
  EMAIL: "Electronic mail - faster than snail mail!",

  // Superheroes
  JOKER: "Why so serious? This clown prince of crime.",
  ROBIN: "Batman's young sidekick and partner.",
  BLADE: "A vampire hunter with a sharp edge.",
  FLASH: "The fastest man alive, or so he claims.",
  BEAST: "A mutant with blue fur and super strength.",
  SPAWN: "A hellspawn with supernatural powers.",
  VENOM: "A symbiote that bonds with its host.",
  LOGAN: "Wolverine's real name, the best there is at what he does.",
} as const;

const SUMMARIES: Record<string, string> = {
  // Science
  ATOMS:
    "Atoms are the basic units of matter, forming everything from stars to human cells. Each atom consists of a nucleus surrounded by electrons, and their behavior underpins all of chemistry and physics.",
  QUARK:
    "Quarks are elementary particles and fundamental constituents of matter, combining to form protons and neutrons inside atomic nuclei.",
  CELLS:
    "Cells are the smallest structural and functional units of living organisms, often called the building blocks of life.",
  GENES:
    "Genes are segments of DNA that carry hereditary information, determining traits and guiding biological development.",
  ORBIT:
    "An orbit is the curved path of an object around a star, planet, or moon, governed by gravity.",
  GAMMA:
    "Gamma rays are the highest-energy form of electromagnetic radiation, often produced by radioactive atoms and in cosmic events.",
  HYDRO:
    "Hydro refers to water or hydrogen, commonly used in scientific contexts like hydropower or hydrogen fuel.",
  OXIDE:
    "An oxide is a chemical compound that contains at least one oxygen atom and one other element, often formed by oxidation.",
  FLORA:
    "Flora refers to the plant life occurring in a particular region or time, typically the naturally occurring native plants.",
  ASTRO:
    "Astro is a prefix relating to stars, celestial objects, or outer space, as in astronomy or astronaut.",
  MICRO:
    "Micro means extremely small, often used as a prefix in science to denote something on a microscopic scale.",
  STARS:
    "Stars are massive, luminous spheres of plasma held together by gravity, serving as the fundamental building blocks of galaxies.",
  POLAR:
    "Polar describes regions near the Earth's poles or molecules with distinct positive and negative ends.",
  DATUM:
    "A datum is a single piece of information or a reference point for measurements and calculations.",

  // Movies
  PIXAR:
    "Pixar is a renowned animation studio known for its groundbreaking computer-animated films like Toy Story and Finding Nemo.",
  ACTOR:
    "An actor is a person who portrays characters in film, television, theater, or other performing arts.",
  SCENE:
    "A scene is a subdivision of a play, film, or other dramatic work, representing a specific location and time.",
  SCORE:
    "A score is the original music composed specifically for a film, television show, or other production.",
  THEME:
    "A theme is the central topic, subject, or message within a story, film, or piece of music.",
  GENRE:
    "A genre is a category of artistic composition characterized by similarities in form, style, or subject matter.",
  MOVIE:
    "A movie is a motion picture, a form of visual storytelling shown in theaters or on screens.",
  CAMEO:
    "A cameo is a brief appearance or voice part of a well-known person in a work of the performing arts.",
  SHORT:
    "A short is a film that is shorter in length than a feature film, often used to tell concise stories or showcase talent.",

  // Literature
  NOVEL:
    "A novel is a long, fictional narrative that explores characters and plots in depth, typically published as a book.",
  POETS:
    "Poets are writers who express ideas, emotions, and stories through the art of poetry.",
  STORY:
    "A story is a narrative, either true or fictional, designed to entertain, inform, or convey a message.",
  PROSE:
    "Prose is written or spoken language in its ordinary form, without metrical structure, as distinguished from poetry.",
  FABLE:
    "A fable is a short story, typically with animals as characters, conveying a moral lesson.",
  VERSE:
    "Verse refers to writing arranged with a metrical rhythm, typically having rhyme, used in poetry.",
  EDGAR:
    "Edgar Allan Poe was an American writer known for his macabre and mysterious poems and short stories.",
  HOMER:
    "Homer was an ancient Greek poet, traditionally said to be the author of the epic poems the Iliad and the Odyssey.",

  // Fantasy and Sci-Fi
  MAGIC:
    "Magic is the use of supernatural powers or abilities, often featured in fantasy literature and folklore.",
  QUEST:
    "A quest is a journey or pursuit undertaken to achieve a specific goal, often found in adventure and fantasy stories.",
  ELVES:
    "Elves are mythical, often immortal beings with magical powers, featured in folklore and fantasy literature.",
  SPOCK:
    "Spock is a fictional character from Star Trek, known for his logical mind and Vulcan heritage.",
  CYBER:
    "Cyber relates to computers, information technology, and virtual reality, as in cybersecurity or cyberspace.",
  DWARF:
    "A dwarf is a small, stout humanoid creature from mythology and fantasy, often skilled in mining and metalwork.",
  FORCE:
    "The Force is a mystical energy field in the Star Wars universe, granting users special powers and abilities.",

  // Video Games
  MARIO:
    "Mario is a famous video game character created by Nintendo, known for his adventures in the Mushroom Kingdom.",
  SONIC:
    "Sonic the Hedgehog is a video game character known for his incredible speed and blue color, created by Sega.",
  RUPEE:
    "A rupee is the currency used in the Legend of Zelda video game series, represented by colorful gems.",
  BOSSY:
    "Bossy refers to something resembling a boss in video games, often challenging and authoritative.",
  LEVEL:
    "A level is a distinct stage or area in a video game, each with its own challenges and objectives.",
  PIXEL:
    "A pixel is the smallest unit of a digital image or display, forming the building blocks of graphics.",
  ZELDA:
    "Zelda is the princess in the Legend of Zelda series, a central figure in the game's lore and adventures.",
  COMBO:
    "A combo is a sequence of moves or actions performed in quick succession, often yielding greater rewards in games.",

  // Anime and Manga
  MANGA:
    "Manga are Japanese comic books or graphic novels, often serialized and read by people of all ages.",
  OTAKU:
    "Otaku is a Japanese term for people with obsessive interests, particularly in anime and manga.",
  SENPU:
    "Senpu means whirlwind or tornado in Japanese, sometimes used in anime and manga contexts.",
  MECHA:
    "Mecha refers to giant robots or machines, often piloted by humans in anime and science fiction.",
  HELLS:
    "Hells refers to multiple underworlds or infernal realms, common in various mythologies and anime.",
  JUTSU:
    "Jutsu are special techniques or skills used by characters, especially ninjas, in anime and manga.",
  KAWAI:
    "Kawai is derived from 'kawaii,' meaning cute or adorable in Japanese culture.",
  CHIBI:
    "Chibi is a style of drawing characters in a small, cute, and exaggerated way, popular in anime and manga.",
  GENKI:
    "Genki means energetic, lively, or full of spirit in Japanese, often describing cheerful characters.",
  SAKUR:
    "Sakur is derived from 'sakura,' the Japanese word for cherry blossoms, a symbol of spring and renewal.",
  NINJA:
    "Ninja were covert agents in feudal Japan, skilled in espionage, stealth, and martial arts, now popular in pop culture.",
  SAMUR:
    "Samur is short for 'samurai,' the noble warrior class of feudal Japan, known for their code of honor and swordsmanship.",
  SHONN:
    "Shonn is a variant of 'shonen,' a genre of anime and manga aimed at young boys, featuring action and adventure.",
  YOKAI:
    "Yokai are supernatural creatures and spirits from Japanese folklore, ranging from mischievous to malevolent.",

  // Tabletop and Board Games
  DICEY:
    "Dicey describes situations involving risk or uncertainty, much like rolling dice in a game.",
  CHESS:
    "Chess is a classic strategy board game played on an 8x8 grid, involving kings, queens, and tactical moves.",
  TOKEN:
    "A token is a small object used to represent a player, item, or status in board and tabletop games.",
  HEXES:
    "Hexes are six-sided spaces or tiles commonly used in board games for movement and positioning.",
  DECKS:
    "Decks are collections of playing cards used in various games, each with its own rules and strategies.",
  CHECK:
    "Check is a chess term indicating the king is under direct threat of capture and must be protected.",
  SPELL:
    "A spell is a magical incantation or effect, often used in fantasy games and stories.",
  CARDS:
    "Cards are rectangular pieces of paper or plastic used in games for play, chance, or strategy.",
  BOARD:
    "A board is the flat surface on which board games are played, often marked with spaces or designs.",

  // Tech and Internet Culture
  LINUX:
    "Linux is an open-source operating system kernel, widely used for servers, desktops, and embedded systems.",
  BYTES:
    "A byte is a unit of digital information consisting of eight bits, fundamental to computer storage and processing.",
  CODER:
    "A coder is someone who writes computer programs, also known as a programmer or developer.",
  CLOUD:
    "The cloud refers to remote servers accessed via the internet, used for data storage and computing.",
  TESLA:
    "Tesla is a company known for electric vehicles and clean energy, named after inventor Nikola Tesla.",
  CACHE:
    "A cache is a hardware or software component that stores data for quick access, improving performance.",
  PINGS:
    "Pings are network signals sent to test connectivity between devices, measuring response time.",
  DEBUG:
    "Debugging is the process of identifying and removing errors or bugs from computer programs.",
  STACK:
    "A stack is a data structure that operates on a last-in, first-out (LIFO) principle, used in programming and computing.",
  CODES:
    "Codes are sets of instructions or symbols used to represent information, especially in computing.",
  FILES:
    "Files are collections of data or information stored on a computer, organized for easy access and management.",
  VIRUS:
    "A computer virus is a malicious program that replicates itself and spreads to other computers, often causing harm.",
  EMAIL:
    "Email is a method of exchanging digital messages over the internet, widely used for communication.",

  // Superheroes
  JOKER:
    "The Joker is a notorious supervillain and Batman's arch-nemesis, known for his chaotic schemes and clown persona.",
  ROBIN:
    "Robin is the superhero alias of several characters, most notably Batman's young sidekick and partner in crime-fighting.",
  BLADE:
    "Blade is a Marvel Comics character, a half-vampire vampire hunter known for his combat skills and weaponry.",
  FLASH:
    "The Flash is a superhero with super speed, able to move, think, and react at lightning-fast velocities.",
  BEAST:
    "Beast is a mutant superhero from the X-Men, known for his blue fur, strength, and intellect.",
  SPAWN:
    "Spawn is a comic book character, a former assassin resurrected with supernatural powers after making a deal with the devil.",
  VENOM:
    "Venom is a Marvel Comics character, an alien symbiote that bonds with hosts to grant them enhanced abilities.",
  LOGAN:
    "Logan is the real name of Wolverine, a Marvel Comics mutant with regenerative powers and adamantium claws.",
};

type Word = (typeof WORDS)[keyof typeof WORDS][number];
type WordCategory = keyof typeof WORDS;

export { WORDS, HINTS, SUMMARIES, Word, WordCategory };

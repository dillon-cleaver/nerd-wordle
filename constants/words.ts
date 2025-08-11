import { WordEntry, WordId } from "@/types/word";

/**
 * Central source of truth for all playable words.
 * TODO: migrate the remaining entries from the old WORDS/HINTS/SUMMARIES constants.
 */

// TODO: Add 150 more common words --->
const WORD_DATA: WordEntry[] = [
  {
    id: "ABOUT",
    category: "common",
  },
  {
    id: "ABOVE",
    category: "common",
  },
  {
    id: "ACTOR",
    category: "common",
  },
  {
    id: "ADMIT",
    category: "common",
  },
  {
    id: "ADOPT",
    category: "common",
  },
  {
    id: "AFTER",
    category: "common",
  },
  {
    id: "AGENT",
    category: "common",
  },
  {
    id: "AGREE",
    category: "common",
  },
  {
    id: "AHEAD",
    category: "common",
  },
  {
    id: "AISLE",
    category: "common",
  },
  {
    id: "ALARM",
    category: "common",
  },
  {
    id: "ALERT",
    category: "common",
  },
  {
    id: "ALIEN",
    category: "common",
  },
  {
    id: "ALIVE",
    category: "common",
  },
  {
    id: "ALLOW",
    category: "common",
  },
  {
    id: "ALONE",
    category: "common",
  },
  {
    id: "ALTER",
    category: "common",
  },
  {
    id: "AMONG",
    category: "common",
  },
  {
    id: "ANGER",
    category: "common",
  },
  {
    id: "ANGRY",
    category: "common",
  },
  {
    id: "ANKLE",
    category: "common",
  },
  {
    id: "APPLY",
    category: "common",
  },
  {
    id: "ARGUE",
    category: "common",
  },
  {
    id: "ARIEL",
    category: "common",
  },
  {
    id: "ARISE",
    category: "common",
  },
  {
    id: "AROSE",
    category: "common",
  },
  {
    id: "ARRAY",
    category: "common",
  },
  {
    id: "ARROW",
    category: "common",
  },
  {
    id: "ASIDE",
    category: "common",
  },
  {
    id: "ATONE",
    category: "common",
  },
  {
    id: "AUDIO",
    category: "common",
  },
  {
    id: "AVOID",
    category: "common",
  },
  {
    id: "AWAKE",
    category: "common",
  },
  {
    id: "BADGE",
    category: "common",
  },
  {
    id: "BEACH",
    category: "common",
  },
  {
    id: "BEARD",
    category: "common",
  },
  {
    id: "BEGIN",
    category: "common",
  },
  {
    id: "BEING",
    category: "common",
  },
  {
    id: "BELLY",
    category: "common",
  },
  {
    id: "BELOW",
    category: "common",
  },
  {
    id: "BENCH",
    category: "common",
  },
  {
    id: "BIRTH",
    category: "common",
  },
  {
    id: "BLACK",
    category: "common",
  },
  {
    id: "BLAME",
    category: "common",
  },
  {
    id: "BLANK",
    category: "common",
  },
  {
    id: "BLAST",
    category: "common",
  },
  {
    id: "BLAZE",
    category: "common",
  },
  {
    id: "BLEED",
    category: "common",
  },
  {
    id: "BLESS",
    category: "common",
  },
  {
    id: "BLIND",
    category: "common",
  },
  {
    id: "BLOCK",
    category: "common",
  },
  {
    id: "BLOOD",
    category: "common",
  },
  {
    id: "BLOOM",
    category: "common",
  },
  {
    id: "BOAST",
    category: "common",
  },
  {
    id: "BOUND",
    category: "common",
  },
  {
    id: "BRAVE",
    category: "common",
  },
  {
    id: "BREAD",
    category: "common",
  },
  {
    id: "BREAK",
    category: "common",
  },
  {
    id: "BREED",
    category: "common",
  },
  {
    id: "BRICK",
    category: "common",
  },
  {
    id: "BRIEF",
    category: "common",
  },
  {
    id: "BRING",
    category: "common",
  },
  {
    id: "BROAD",
    category: "common",
  },
  {
    id: "BROKE",
    category: "common",
  },
  {
    id: "BROWN",
    category: "common",
  },
  {
    id: "BUILD",
    category: "common",
  },
  {
    id: "BUILT",
    category: "common",
  },
  {
    id: "BURST",
    category: "common",
  },
  {
    id: "BUYER",
    category: "common",
  },
  {
    id: "CABIN",
    category: "common",
  },
  {
    id: "CABLE",
    category: "common",
  },
  {
    id: "CAIRN",
    category: "common",
  },
  {
    id: "CANOE",
    category: "common",
  },
  {
    id: "CANST",
    category: "common",
  },
  {
    id: "CARES",
    category: "common",
  },
  {
    id: "CARET",
    category: "common",
  },
  {
    id: "CARRY",
    category: "common",
  },
  {
    id: "CARVE",
    category: "common",
  },
  {
    id: "CASTE",
    category: "common",
  },
  {
    id: "CATCH",
    category: "common",
  },
  {
    id: "CATER",
    category: "common",
  },
  {
    id: "CAUSE",
    category: "common",
  },
  {
    id: "CHAIN",
    category: "common",
  },
  {
    id: "CHAIR",
    category: "common",
  },
  {
    id: "CHAOS",
    category: "common",
  },
  {
    id: "CHARM",
    category: "common",
  },
  {
    id: "CHART",
    category: "common",
  },
  {
    id: "CHASE",
    category: "common",
  },
  {
    id: "CHEAP",
    category: "common",
  },
  {
    id: "CHEEK",
    category: "common",
  },
  {
    id: "CHEST",
    category: "common",
  },
  {
    id: "CHILD",
    category: "common",
  },
  {
    id: "CHINA",
    category: "common",
  },
  {
    id: "CHOSE",
    category: "common",
  },
  {
    id: "CLADE",
    category: "common",
  },
  {
    id: "CLAIM",
    category: "common",
  },
  {
    id: "CLASS",
    category: "common",
  },
  {
    id: "CLEAN",
    category: "common",
  },
  {
    id: "CLEAR",
    category: "common",
  },
  {
    id: "CLIMB",
    category: "common",
  },
  {
    id: "CLINT",
    category: "common",
  },
  {
    id: "CLOCK",
    category: "common",
  },
  {
    id: "CLOSE",
    category: "common",
  },
  {
    id: "COACH",
    category: "common",
  },
  {
    id: "COAST",
    category: "common",
  },
  {
    id: "COULD",
    category: "common",
  },
  {
    id: "COUNT",
    category: "common",
  },
  {
    id: "COURT",
    category: "common",
  },
  {
    id: "COVER",
    category: "common",
  },
  {
    id: "CRACK",
    category: "common",
  },
  {
    id: "CRAFT",
    category: "common",
  },
  {
    id: "CRANE",
    category: "common",
  },
  {
    id: "CRATE",
    category: "common",
  },
  {
    id: "CRAZY",
    category: "common",
  },
  {
    id: "CREAM",
    category: "common",
  },
  {
    id: "CREST",
    category: "common",
  },
  {
    id: "CRIME",
    category: "common",
  },
  {
    id: "CRONE",
    category: "common",
  },
  {
    id: "CROSS",
    category: "common",
  },
  {
    id: "CROWD",
    category: "common",
  },
  {
    id: "CROWN",
    category: "common",
  },
  {
    id: "CRUET",
    category: "common",
  },
  {
    id: "CRUSH",
    category: "common",
  },
  {
    id: "CURSE",
    category: "common",
  },
  {
    id: "CURVE",
    category: "common",
  },
  {
    id: "DAILY",
    category: "common",
  },
  {
    id: "DANCE",
    category: "common",
  },
  {
    id: "DEALT",
    category: "common",
  },
  {
    id: "DEATH",
    category: "common",
  },
  {
    id: "DELAY",
    category: "common",
  },
  {
    id: "DEPTH",
    category: "common",
  },
  {
    id: "DEVIL",
    category: "common",
  },
  {
    id: "DIRTY",
    category: "common",
  },
  {
    id: "DIZZY",
    category: "common",
  },
  {
    id: "DOUBT",
    category: "common",
  },
  {
    id: "DOUGH",
    category: "common",
  },
  {
    id: "DRAFT",
    category: "common",
  },
  {
    id: "DRAMA",
    category: "common",
  },
  {
    id: "DREAM",
    category: "common",
  },
  {
    id: "DRESS",
    category: "common",
  },
  {
    id: "DRIED",
    category: "common",
  },
  {
    id: "DRILL",
    category: "common",
  },
  {
    id: "DRINK",
    category: "common",
  },
  {
    id: "DRIVE",
    category: "common",
  },
  {
    id: "DRONE",
    category: "common",
  },
  {
    id: "DROVE",
    category: "common",
  },
  {
    id: "DRUNK",
    category: "common",
  },
  {
    id: "DUSTY",
    category: "common",
  },
  {
    id: "EAGER",
    category: "common",
  },
  {
    id: "EARLY",
    category: "common",
  },
  {
    id: "EARNT",
    category: "common",
  },
  {
    id: "EARTH",
    category: "common",
  },
  {
    id: "EIGHT",
    category: "common",
  },
  {
    id: "ELECT",
    category: "common",
  },
  {
    id: "EMPTY",
    category: "common",
  },
  {
    id: "ENEMY",
    category: "common",
  },
  {
    id: "ENJOY",
    category: "common",
  },
  {
    id: "ENTER",
    category: "common",
  },
  {
    id: "ENTRY",
    category: "common",
  },
  {
    id: "EQUAL",
    category: "common",
  },
  {
    id: "ERROR",
    category: "common",
  },
  {
    id: "EVENT",
    category: "common",
  },
  {
    id: "EVERY",
    category: "common",
  },
  {
    id: "EXACT",
    category: "common",
  },
  {
    id: "EXIST",
    category: "common",
  },
  {
    id: "FAITH",
    category: "common",
  },
  {
    id: "FALSE",
    category: "common",
  },
  {
    id: "FAULT",
    category: "common",
  },
  {
    id: "FENCE",
    category: "common",
  },
  {
    id: "FEVER",
    category: "common",
  },
  {
    id: "FIELD",
    category: "common",
  },
  {
    id: "FIFTY",
    category: "common",
  },
  {
    id: "FIGHT",
    category: "common",
  },
  {
    id: "FINAL",
    category: "common",
  },
  {
    id: "FIRST",
    category: "common",
  },
  {
    id: "FIXED",
    category: "common",
  },
  {
    id: "FLAME",
    category: "common",
  },
  {
    id: "FLESH",
    category: "common",
  },
  {
    id: "FLOOR",
    category: "common",
  },
  {
    id: "FLOUR",
    category: "common",
  },
  {
    id: "FLUID",
    category: "common",
  },
  {
    id: "FOCUS",
    category: "common",
  },
  {
    id: "FORTH",
    category: "common",
  },
  {
    id: "FORTY",
    category: "common",
  },
  {
    id: "FOUND",
    category: "common",
  },
  {
    id: "FRAME",
    category: "common",
  },
  {
    id: "FRANK",
    category: "common",
  },
  {
    id: "FRESH",
    category: "common",
  },
  {
    id: "FRONT",
    category: "common",
  },
  {
    id: "FRUIT",
    category: "common",
  },
  {
    id: "FULLY",
    category: "common",
  },
  {
    id: "FUNNY",
    category: "common",
  },
  {
    id: "GIANT",
    category: "common",
  },
  {
    id: "GIVEN",
    category: "common",
  },
  {
    id: "GLASS",
    category: "common",
  },
  {
    id: "GLOBE",
    category: "common",
  },
  {
    id: "GLORY",
    category: "common",
  },
  {
    id: "GRACE",
    category: "common",
  },
  {
    id: "GRADE",
    category: "common",
  },
  {
    id: "GRAND",
    category: "common",
  },
  {
    id: "GRAPE",
    category: "common",
  },
  {
    id: "GRASS",
    category: "common",
  },
  {
    id: "GRATE",
    category: "common",
  },
  {
    id: "GRAVE",
    category: "common",
  },
  {
    id: "GREAT",
    category: "common",
  },
  {
    id: "GREED",
    category: "common",
  },
  {
    id: "GREEN",
    category: "common",
  },
  {
    id: "GREET",
    category: "common",
  },
  {
    id: "GRIEF",
    category: "common",
  },
  {
    id: "GROSS",
    category: "common",
  },
  {
    id: "GROUP",
    category: "common",
  },
  {
    id: "GROWN",
    category: "common",
  },
  {
    id: "GUARD",
    category: "common",
  },
  {
    id: "GUESS",
    category: "common",
  },
  {
    id: "GUEST",
    category: "common",
  },
  {
    id: "GUIDE",
    category: "common",
  },
  {
    id: "GUILD",
    category: "common",
  },
  {
    id: "HABIT",
    category: "common",
  },
  {
    id: "HAPPY",
    category: "common",
  },
  {
    id: "HARSH",
    category: "common",
  },
  {
    id: "HASTE",
    category: "common",
  },
  {
    id: "HEAVY",
    category: "common",
  },
  {
    id: "HOIST",
    category: "common",
  },
  {
    id: "HORSE",
    category: "common",
  },
  {
    id: "HOTEL",
    category: "common",
  },
  {
    id: "HOUSE",
    category: "common",
  },
  {
    id: "HUMAN",
    category: "common",
  },
  {
    id: "HURRY",
    category: "common",
  },
  {
    id: "IDEAL",
    category: "common",
  },
  {
    id: "IMAGE",
    category: "common",
  },
  {
    id: "INDEX",
    category: "common",
  },
  {
    id: "INNER",
    category: "common",
  },
  {
    id: "INPUT",
    category: "common",
  },
  {
    id: "IRATE",
    category: "common",
  },
  {
    id: "ISSUE",
    category: "common",
  },
  {
    id: "JEWEL",
    category: "common",
  },
  {
    id: "JOINT",
    category: "common",
  },
  {
    id: "JUDGE",
    category: "common",
  },
  {
    id: "JUICE",
    category: "common",
  },
  {
    id: "KNIFE",
    category: "common",
  },
  {
    id: "KNOWN",
    category: "common",
  },
  {
    id: "LABEL",
    category: "common",
  },
  {
    id: "LANCE",
    category: "common",
  },
  {
    id: "LARGE",
    category: "common",
  },
  {
    id: "LATER",
    category: "common",
  },
  {
    id: "LAUGH",
    category: "common",
  },
  {
    id: "LAYER",
    category: "common",
  },
  {
    id: "LEANS",
    category: "common",
  },
  {
    id: "LEANT",
    category: "common",
  },
  {
    id: "LEARN",
    category: "common",
  },
  {
    id: "LEASE",
    category: "common",
  },
  {
    id: "LEAST",
    category: "common",
  },
  {
    id: "LEAVE",
    category: "common",
  },
  {
    id: "LEGAL",
    category: "common",
  },
  {
    id: "LIMIT",
    category: "common",
  },
  {
    id: "LITRE",
    category: "common",
  },
  {
    id: "LIVER",
    category: "common",
  },
  {
    id: "LOCAL",
    category: "common",
  },
  {
    id: "LOOSE",
    category: "common",
  },
  {
    id: "LOWER",
    category: "common",
  },
  {
    id: "LUCKY",
    category: "common",
  },
  {
    id: "LUNCH",
    category: "common",
  },
  {
    id: "MAJOR",
    category: "common",
  },
  {
    id: "MARRY",
    category: "common",
  },
  {
    id: "MATCH",
    category: "common",
  },
  {
    id: "MAYBE",
    category: "common",
  },
  {
    id: "MAYOR",
    category: "common",
  },
  {
    id: "MEDAL",
    category: "common",
  },
  {
    id: "MEDIA",
    category: "common",
  },
  {
    id: "MERCY",
    category: "common",
  },
  {
    id: "METAL",
    category: "common",
  },
  {
    id: "METER",
    category: "common",
  },
  {
    id: "MIGHT",
    category: "common",
  },
  {
    id: "MINOR",
    category: "common",
  },
  {
    id: "MINUS",
    category: "common",
  },
  {
    id: "MISTY",
    category: "common",
  },
  {
    id: "MODEL",
    category: "common",
  },
  {
    id: "MONEY",
    category: "common",
  },
  {
    id: "MONTH",
    category: "common",
  },
  {
    id: "MORAL",
    category: "common",
  },
  {
    id: "MOTOR",
    category: "common",
  },
  {
    id: "MOUNT",
    category: "common",
  },
  {
    id: "MOUSE",
    category: "common",
  },
  {
    id: "MOUTH",
    category: "common",
  },
  {
    id: "MOVED",
    category: "common",
  },
  {
    id: "MOVIE",
    category: "common",
  },
  {
    id: "MUSIC",
    category: "common",
  },
  {
    id: "NACRE",
    category: "common",
  },
  {
    id: "NAKED",
    category: "common",
  },
  {
    id: "NAMED",
    category: "common",
  },
  {
    id: "NEEDS",
    category: "common",
  },
  {
    id: "NEVER",
    category: "common",
  },
  {
    id: "NEWLY",
    category: "common",
  },
  {
    id: "NIGHT",
    category: "common",
  },
  {
    id: "NINTH",
    category: "common",
  },
  {
    id: "NITRE",
    category: "common",
  },
  {
    id: "NOBLE",
    category: "common",
  },
  {
    id: "NOISE",
    category: "common",
  },
  {
    id: "NORTH",
    category: "common",
  },
  {
    id: "NURSE",
    category: "common",
  },
  {
    id: "OCEAN",
    category: "common",
  },
  {
    id: "OFFER",
    category: "common",
  },
  {
    id: "OFTEN",
    category: "common",
  },
  {
    id: "OLDER",
    category: "common",
  },
  {
    id: "OLIVE",
    category: "common",
  },
  {
    id: "ONION",
    category: "common",
  },
  {
    id: "OPERA",
    category: "common",
  },
  {
    id: "ORATE",
    category: "common",
  },
  {
    id: "ORDER",
    category: "common",
  },
  {
    id: "ORGAN",
    category: "common",
  },
  {
    id: "OTHER",
    category: "common",
  },
  {
    id: "OUGHT",
    category: "common",
  },
  {
    id: "OUNCE",
    category: "common",
  },
  {
    id: "OUTER",
    category: "common",
  },
  {
    id: "OWNER",
    category: "common",
  },
  {
    id: "PAINT",
    category: "common",
  },
  {
    id: "PANEL",
    category: "common",
  },
  {
    id: "PAPER",
    category: "common",
  },
  {
    id: "PARSE",
    category: "common",
  },
  {
    id: "PARTY",
    category: "common",
  },
  {
    id: "PASTA",
    category: "common",
  },
  {
    id: "PATCH",
    category: "common",
  },
  {
    id: "PEACE",
    category: "common",
  },
  {
    id: "PEARL",
    category: "common",
  },
  {
    id: "PHASE",
    category: "common",
  },
  {
    id: "PHONE",
    category: "common",
  },
  {
    id: "PHOTO",
    category: "common",
  },
  {
    id: "PIANO",
    category: "common",
  },
  {
    id: "PILOT",
    category: "common",
  },
  {
    id: "PITCH",
    category: "common",
  },
  {
    id: "PLACE",
    category: "common",
  },
  {
    id: "PLAIN",
    category: "common",
  },
  {
    id: "PLANE",
    category: "common",
  },
  {
    id: "PLANT",
    category: "common",
  },
  {
    id: "PLATE",
    category: "common",
  },
  {
    id: "PLAZA",
    category: "common",
  },
  {
    id: "POINT",
    category: "common",
  },
  {
    id: "POLAR",
    category: "common",
  },
  {
    id: "POUND",
    category: "common",
  },
  {
    id: "POWER",
    category: "common",
  },
  {
    id: "PRESS",
    category: "common",
  },
  {
    id: "PRICE",
    category: "common",
  },
  {
    id: "PRIDE",
    category: "common",
  },
  {
    id: "PRIME",
    category: "common",
  },
  {
    id: "PRINT",
    category: "common",
  },
  {
    id: "PRIOR",
    category: "common",
  },
  {
    id: "PROOF",
    category: "common",
  },
  {
    id: "PROUD",
    category: "common",
  },
  {
    id: "PROVE",
    category: "common",
  },
  {
    id: "PURSE",
    category: "common",
  },
  {
    id: "QUEEN",
    category: "common",
  },
  {
    id: "QUICK",
    category: "common",
  },
  {
    id: "QUIET",
    category: "common",
  },
  {
    id: "QUITE",
    category: "common",
  },
  {
    id: "QUOTA",
    category: "common",
  },
  {
    id: "QUOTE",
    category: "common",
  },
  {
    id: "RADIO",
    category: "common",
  },
  {
    id: "RAISE",
    category: "common",
  },
  {
    id: "RAPID",
    category: "common",
  },
  {
    id: "RATES",
    category: "common",
  },
  {
    id: "REACH",
    category: "common",
  },
  {
    id: "REACT",
    category: "common",
  },
  {
    id: "READY",
    category: "common",
  },
  {
    id: "REALS",
    category: "common",
  },
  {
    id: "REBEL",
    category: "common",
  },
  {
    id: "REFER",
    category: "common",
  },
  {
    id: "RELAX",
    category: "common",
  },
  {
    id: "REPLY",
    category: "common",
  },
  {
    id: "RESAT",
    category: "common",
  },
  {
    id: "RIGHT",
    category: "common",
  },
  {
    id: "RINSE",
    category: "common",
  },
  {
    id: "RIVER",
    category: "common",
  },
  {
    id: "ROAST",
    category: "common",
  },
  {
    id: "ROGER",
    category: "common",
  },
  {
    id: "ROUGH",
    category: "common",
  },
  {
    id: "ROUND",
    category: "common",
  },
  {
    id: "ROYAL",
    category: "common",
  },
  {
    id: "RUGBY",
    category: "common",
  },
  {
    id: "RULER",
    category: "common",
  },
  {
    id: "RURAL",
    category: "common",
  },
  {
    id: "SADLY",
    category: "common",
  },
  {
    id: "SAINT",
    category: "common",
  },
  {
    id: "SALAD",
    category: "common",
  },
  {
    id: "SALON",
    category: "common",
  },
  {
    id: "SANDY",
    category: "common",
  },
  {
    id: "SARIN",
    category: "common",
  },
  {
    id: "SATIN",
    category: "common",
  },
  {
    id: "SAUCE",
    category: "common",
  },
  {
    id: "SAUTE",
    category: "common",
  },
  {
    id: "SCALE",
    category: "common",
  },
  {
    id: "SCANT",
    category: "common",
  },
  {
    id: "SCARE",
    category: "common",
  },
  {
    id: "SCOPE",
    category: "common",
  },
  {
    id: "SENSE",
    category: "common",
  },
  {
    id: "SERVE",
    category: "common",
  },
  {
    id: "SEVEN",
    category: "common",
  },
  {
    id: "SHADE",
    category: "common",
  },
  {
    id: "SHAKE",
    category: "common",
  },
  {
    id: "SHALE",
    category: "common",
  },
  {
    id: "SHALL",
    category: "common",
  },
  {
    id: "SHAME",
    category: "common",
  },
  {
    id: "SHAPE",
    category: "common",
  },
  {
    id: "SHARE",
    category: "common",
  },
  {
    id: "SHARP",
    category: "common",
  },
  {
    id: "SHEET",
    category: "common",
  },
  {
    id: "SHELL",
    category: "common",
  },
  {
    id: "SHINE",
    category: "common",
  },
  {
    id: "SHIRT",
    category: "common",
  },
  {
    id: "SHOCK",
    category: "common",
  },
  {
    id: "SHOOT",
    category: "common",
  },
  {
    id: "SHOUT",
    category: "common",
  },
  {
    id: "SHOWN",
    category: "common",
  },
  {
    id: "SIGHT",
    category: "common",
  },
  {
    id: "SILLY",
    category: "common",
  },
  {
    id: "SINCE",
    category: "common",
  },
  {
    id: "SIREN",
    category: "common",
  },
  {
    id: "SITAR",
    category: "common",
  },
  {
    id: "SIXTH",
    category: "common",
  },
  {
    id: "SIXTY",
    category: "common",
  },
  {
    id: "SKILL",
    category: "common",
  },
  {
    id: "SLANT",
    category: "common",
  },
  {
    id: "SLATE",
    category: "common",
  },
  {
    id: "SLAVE",
    category: "common",
  },
  {
    id: "SLEEP",
    category: "common",
  },
  {
    id: "SLICE",
    category: "common",
  },
  {
    id: "SLIDE",
    category: "common",
  },
  {
    id: "SLOAN",
    category: "common",
  },
  {
    id: "SMALL",
    category: "common",
  },
  {
    id: "SMART",
    category: "common",
  },
  {
    id: "SMILE",
    category: "common",
  },
  {
    id: "SMOKE",
    category: "common",
  },
  {
    id: "SNAKE",
    category: "common",
  },
  {
    id: "SNARE",
    category: "common",
  },
  {
    id: "SNORE",
    category: "common",
  },
  {
    id: "SNORT",
    category: "common",
  },
  {
    id: "SOLAR",
    category: "common",
  },
  {
    id: "SOLID",
    category: "common",
  },
  {
    id: "SOLVE",
    category: "common",
  },
  {
    id: "SONAR",
    category: "common",
  },
  {
    id: "SORRY",
    category: "common",
  },
  {
    id: "SORTA",
    category: "common",
  },
  {
    id: "SOUND",
    category: "common",
  },
  {
    id: "SOUTH",
    category: "common",
  },
  {
    id: "SPARE",
    category: "common",
  },
  {
    id: "SPEAK",
    category: "common",
  },
  {
    id: "SPEED",
    category: "common",
  },
  {
    id: "SPEND",
    category: "common",
  },
  {
    id: "SPLIT",
    category: "common",
  },
  {
    id: "SPOKE",
    category: "common",
  },
  {
    id: "SPORT",
    category: "common",
  },
  {
    id: "SQUAD",
    category: "common",
  },
  {
    id: "STAFF",
    category: "common",
  },
  {
    id: "STAGE",
    category: "common",
  },
  {
    id: "STAIN",
    category: "common",
  },
  {
    id: "STAIR",
    category: "common",
  },
  {
    id: "STAKE",
    category: "common",
  },
  {
    id: "STALE",
    category: "common",
  },
  {
    id: "STAND",
    category: "common",
  },
  {
    id: "STARE",
    category: "common",
  },
  {
    id: "START",
    category: "common",
  },
  {
    id: "STATE",
    category: "common",
  },
  {
    id: "STEAL",
    category: "common",
  },
  {
    id: "STEEL",
    category: "common",
  },
  {
    id: "STICK",
    category: "common",
  },
  {
    id: "STILL",
    category: "common",
  },
  {
    id: "STOCK",
    category: "common",
  },
  {
    id: "STOLE",
    category: "common",
  },
  {
    id: "STONE",
    category: "common",
  },
  {
    id: "STOOD",
    category: "common",
  },
  {
    id: "STORE",
    category: "common",
  },
  {
    id: "STORM",
    category: "common",
  },
  {
    id: "STORY",
    category: "common",
  },
  {
    id: "STRIP",
    category: "common",
  },
  {
    id: "STUCK",
    category: "common",
  },
  {
    id: "STUDY",
    category: "common",
  },
  {
    id: "STUFF",
    category: "common",
  },
  {
    id: "STYLE",
    category: "common",
  },
  {
    id: "SUGAR",
    category: "common",
  },
  {
    id: "SUITE",
    category: "common",
  },
  {
    id: "SUNNY",
    category: "common",
  },
  {
    id: "SUPER",
    category: "common",
  },
  {
    id: "SWEET",
    category: "common",
  },
  {
    id: "SWIFT",
    category: "common",
  },
  {
    id: "TABLE",
    category: "common",
  },
  {
    id: "TAILS",
    category: "common",
  },
  {
    id: "TAKEN",
    category: "common",
  },
  {
    id: "TALES",
    category: "common",
  },
  {
    id: "TALON",
    category: "common",
  },
  {
    id: "TARES",
    category: "common",
  },
  {
    id: "TASER",
    category: "common",
  },
  {
    id: "TASTE",
    category: "common",
  },
  {
    id: "TEACH",
    category: "common",
  },
  {
    id: "TEARS",
    category: "common",
  },
  {
    id: "TEETH",
    category: "common",
  },
  {
    id: "TEMPO",
    category: "common",
  },
  {
    id: "TENOR",
    category: "common",
  },
  {
    id: "TERMS",
    category: "common",
  },
  {
    id: "THANK",
    category: "common",
  },
  {
    id: "THEIR",
    category: "common",
  },
  {
    id: "THERE",
    category: "common",
  },
  {
    id: "THESE",
    category: "common",
  },
  {
    id: "THICK",
    category: "common",
  },
  {
    id: "THINK",
    category: "common",
  },
  {
    id: "THIRD",
    category: "common",
  },
  {
    id: "THOSE",
    category: "common",
  },
  {
    id: "THREE",
    category: "common",
  },
  {
    id: "THREW",
    category: "common",
  },
  {
    id: "THROW",
    category: "common",
  },
  {
    id: "THUMB",
    category: "common",
  },
  {
    id: "TIGER",
    category: "common",
  },
  {
    id: "TIGHT",
    category: "common",
  },
  {
    id: "TILES",
    category: "common",
  },
  {
    id: "TIMER",
    category: "common",
  },
  {
    id: "TIRES",
    category: "common",
  },
  {
    id: "TITLE",
    category: "common",
  },
  {
    id: "TODAY",
    category: "common",
  },
  {
    id: "TONER",
    category: "common",
  },
  {
    id: "TOTAL",
    category: "common",
  },
  {
    id: "TOUCH",
    category: "common",
  },
  {
    id: "TOUGH",
    category: "common",
  },
  {
    id: "TOWER",
    category: "common",
  },
  {
    id: "TRACE",
    category: "common",
  },
  {
    id: "TRACK",
    category: "common",
  },
  {
    id: "TRADE",
    category: "common",
  },
  {
    id: "TRAIL",
    category: "common",
  },
  {
    id: "TRAIN",
    category: "common",
  },
  {
    id: "TRANS",
    category: "common",
  },
  {
    id: "TRASH",
    category: "common",
  },
  {
    id: "TREAT",
    category: "common",
  },
  {
    id: "TREND",
    category: "common",
  },
  {
    id: "TRIAL",
    category: "common",
  },
  {
    id: "TRICK",
    category: "common",
  },
  {
    id: "TRIED",
    category: "common",
  },
  {
    id: "TRIES",
    category: "common",
  },
  {
    id: "TRIPE",
    category: "common",
  },
  {
    id: "TRODE",
    category: "common",
  },
  {
    id: "TROIS",
    category: "common",
  },
  {
    id: "TROPE",
    category: "common",
  },
  {
    id: "TRUCE",
    category: "common",
  },
  {
    id: "TRUCK",
    category: "common",
  },
  {
    id: "TRULY",
    category: "common",
  },
  {
    id: "TRUST",
    category: "common",
  },
  {
    id: "TRUTH",
    category: "common",
  },
  {
    id: "UNCLE",
    category: "common",
  },
  {
    id: "UNDER",
    category: "common",
  },
  {
    id: "UNION",
    category: "common",
  },
  {
    id: "UNITE",
    category: "common",
  },
  {
    id: "UNITY",
    category: "common",
  },
  {
    id: "UNTIL",
    category: "common",
  },
  {
    id: "UPPER",
    category: "common",
  },
  {
    id: "URBAN",
    category: "common",
  },
  {
    id: "USAGE",
    category: "common",
  },
  {
    id: "USUAL",
    category: "common",
  },
  {
    id: "VALUE",
    category: "common",
  },
  {
    id: "VIDEO",
    category: "common",
  },
  {
    id: "VISIT",
    category: "common",
  },
  {
    id: "VITAL",
    category: "common",
  },
  {
    id: "VOICE",
    category: "common",
  },
  {
    id: "WASTE",
    category: "common",
  },
  {
    id: "WATCH",
    category: "common",
  },
  {
    id: "WATER",
    category: "common",
  },
  {
    id: "WHEEL",
    category: "common",
  },
  {
    id: "WHERE",
    category: "common",
  },
  {
    id: "WHICH",
    category: "common",
  },
  {
    id: "WHILE",
    category: "common",
  },
  {
    id: "WHITE",
    category: "common",
  },
  {
    id: "WHOLE",
    category: "common",
  },
  {
    id: "WHOSE",
    category: "common",
  },
  {
    id: "WIDTH",
    category: "common",
  },
  {
    id: "WOMAN",
    category: "common",
  },
  {
    id: "WOMEN",
    category: "common",
  },
  {
    id: "WORLD",
    category: "common",
  },
  {
    id: "WORRY",
    category: "common",
  },
  {
    id: "WORSE",
    category: "common",
  },
  {
    id: "WORST",
    category: "common",
  },
  {
    id: "WORTH",
    category: "common",
  },
  {
    id: "WOULD",
    category: "common",
  },
  {
    id: "WRITE",
    category: "common",
  },
  {
    id: "WRONG",
    category: "common",
  },
  {
    id: "WROTE",
    category: "common",
  },
  {
    id: "YIELD",
    category: "common",
  },
  {
    id: "YOUNG",
    category: "common",
  },
  {
    id: "YOUTH",
    category: "common",
  },
  {
    id: "PIXAR",
    category: "movies",
    edition: 1,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Pixar",
  },
  {
    id: "SCORE",
    category: "movies",
    edition: 10,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Film_score",
  },
  {
    id: "CAMEO",
    category: "movies",
    edition: 19,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Cameo_appearance",
  },
  {
    id: "SHORT",
    category: "movies",
    edition: 28,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Short_film",
  },
  {
    id: "OSCAR",
    category: "movies",
    edition: 37,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Academy_Awards",
  },
  {
    id: "NOLAN",
    category: "movies",
    edition: 46,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Christopher_Nolan",
  },
  {
    id: "SCENE",
    category: "movies",
    edition: 55,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Scene_(filmmaking)",
  },
  {
    id: "EXTRA",
    category: "movies",
    edition: 64,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Extra_(acting)",
  },
  {
    id: "LUMET",
    category: "movies",
    edition: 73,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Sidney_Lumet",
  },
  {
    id: "GRANT",
    category: "movies",
    edition: 82,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Cary_Grant",
  },
  {
    id: "LEONE",
    category: "movies",
    edition: 91,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Sergio_Leone",
  },
  {
    id: "RAIMI",
    category: "movies",
    edition: 100,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Sam_Raimi",
  },
  {
    id: "THEME",
    category: "movies",
    edition: 109,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Leitmotif",
  },
  {
    id: "FARGO",
    category: "movies",
    edition: 118,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Fargo_(film)",
  },
  {
    id: "KAFKA",
    category: "literature",
    edition: 2,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Franz_Kafka",
  },
  {
    id: "ZADIE",
    category: "literature",
    edition: 11,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Zadie_Smith",
  },
  {
    id: "RILKE",
    category: "literature",
    edition: 20,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Rainer_Maria_Rilke",
  },
  {
    id: "FABLE",
    category: "literature",
    edition: 29,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Fable",
  },
  {
    id: "WELLS",
    category: "literature",
    edition: 38,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/H._G._Wells",
  },
  {
    id: "HOMER",
    category: "literature",
    edition: 47,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Homer",
  },
  {
    id: "WOOLF",
    category: "literature",
    edition: 56,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Virginia_Woolf",
  },
  {
    id: "PROSE",
    category: "literature",
    edition: 65,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Prose",
  },
  {
    id: "PLATH",
    category: "literature",
    edition: 74,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Sylvia_Plath",
  },
  {
    id: "NOVEL",
    category: "literature",
    edition: 83,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Novel",
  },
  {
    id: "EDGAR",
    category: "literature",
    edition: 92,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Edgar_Allan_Poe",
  },
  {
    id: "DANTE",
    category: "literature",
    edition: 101,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Dante_Alighieri",
  },
  {
    id: "CANON",
    category: "literature",
    edition: 110,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Literary_canon",
  },
  {
    id: "CAMUS",
    category: "literature",
    edition: 119,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Albert_Camus",
  },
  {
    id: "BASIC",
    category: "techAndInternetCulture",
    edition: 3,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/BASIC",
  },
  {
    id: "LOGIC",
    category: "techAndInternetCulture",
    edition: 12,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Logic_gate",
  },
  {
    id: "TROLL",
    category: "techAndInternetCulture",
    edition: 21,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Internet_troll",
  },
  {
    id: "TOKEN",
    category: "techAndInternetCulture",
    edition: 30,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Token_(computing)",
  },
  {
    id: "EMOJI",
    category: "techAndInternetCulture",
    edition: 39,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Emoji",
  },
  {
    id: "VIRUS",
    category: "techAndInternetCulture",
    edition: 48,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Computer_virus",
  },
  {
    id: "CACHE",
    category: "techAndInternetCulture",
    edition: 57,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Cache_(computing)",
  },
  {
    id: "QUERY",
    category: "techAndInternetCulture",
    edition: 66,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Query_(computing)",
  },
  {
    id: "CLICK",
    category: "techAndInternetCulture",
    edition: 75,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Click_(computing)",
  },
  {
    id: "VIRAL",
    category: "techAndInternetCulture",
    edition: 84,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Viral_phenomenon",
  },
  {
    id: "STACK",
    category: "techAndInternetCulture",
    edition: 93,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)",
  },
  {
    id: "PIXEL",
    category: "techAndInternetCulture",
    edition: 102,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Pixel",
  },
  {
    id: "TWEET",
    category: "techAndInternetCulture",
    edition: 112,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Tweet",
  },
  {
    id: "EMAIL",
    category: "techAndInternetCulture",
    edition: 121,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Email",
  },
  {
    id: "QUARK",
    category: "science",
    edition: 4,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Quark",
  },
  {
    id: "FLORA",
    category: "science",
    edition: 13,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Flora",
  },
  {
    id: "ORBIT",
    category: "science",
    edition: 22,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Orbit",
  },
  {
    id: "GAMMA",
    category: "science",
    edition: 31,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Gamma_ray",
  },
  {
    id: "FAUNA",
    category: "science",
    edition: 40,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Fauna",
  },
  {
    id: "OXIDE",
    category: "science",
    edition: 49,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Oxide",
  },
  {
    id: "LUMEN",
    category: "science",
    edition: 58,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Lumen_(unit)",
  },
  {
    id: "LASER",
    category: "science",
    edition: 67,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Laser",
  },
  {
    id: "VENUS",
    category: "science",
    edition: 76,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Venus",
  },
  {
    id: "RADAR",
    category: "science",
    edition: 85,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Radar",
  },
  {
    id: "ROBOT",
    category: "science",
    edition: 94,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Robot",
  },
  {
    id: "BRAIN",
    category: "science",
    edition: 103,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Brain",
  },
  {
    id: "HEART",
    category: "science",
    edition: 111,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Heart",
  },
  {
    id: "CLONE",
    category: "science",
    edition: 120,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Cloning",
  },
  {
    id: "ZELDA",
    category: "videoGames",
    edition: 5,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/The_Legend_of_Zelda",
  },
  {
    id: "DRAKE",
    category: "videoGames",
    edition: 14,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Nathan_Drake_(Uncharted)",
  },
  {
    id: "FORZA",
    category: "videoGames",
    edition: 23,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Forza_(series)",
  },
  {
    id: "SONIC",
    category: "videoGames",
    edition: 32,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Sonic_the_Hedgehog",
  },
  {
    id: "LEVEL",
    category: "videoGames",
    edition: 41,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Level_(video_gaming)",
  },
  {
    id: "MARIO",
    category: "videoGames",
    edition: 50,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Mario",
  },
  {
    id: "CRASH",
    category: "videoGames",
    edition: 59,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Crash_Bandicoot",
  },
  {
    id: "CLOUD",
    category: "videoGames",
    edition: 68,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Cloud_Strife",
  },
  {
    id: "HADES",
    category: "videoGames",
    edition: 77,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Hades_(video_game)",
  },
  {
    id: "STEAM",
    category: "videoGames",
    edition: 86,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Steam_(service)",
  },
  {
    id: "NAMCO",
    category: "videoGames",
    edition: 95,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Namco",
  },
  {
    id: "HIDEO",
    category: "videoGames",
    edition: 104,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Hideo_Kojima",
  },
  {
    id: "SWITCH",
    category: "videoGames",
    edition: 113,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Nintendo_Switch",
  },
  {
    id: "MEIER",
    category: "videoGames",
    edition: 122,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Sid_Meier",
  },
  {
    id: "ARWEN",
    category: "fantasyAndSciFi",
    edition: 6,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Arwen",
  },
  {
    id: "DRACO",
    category: "fantasyAndSciFi",
    edition: 15,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Draco_Malfoy",
  },
  {
    id: "VADER",
    category: "fantasyAndSciFi",
    edition: 24,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Darth_Vader",
  },
  {
    id: "FRODO",
    category: "fantasyAndSciFi",
    edition: 33,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Frodo_Baggins",
  },
  {
    id: "LEELA",
    category: "fantasyAndSciFi",
    edition: 42,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Leela_(Futurama)",
  },
  {
    id: "CHANI",
    category: "fantasyAndSciFi",
    edition: 51,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Chani",
  },
  {
    id: "GIMLI",
    category: "fantasyAndSciFi",
    edition: 60,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Gimli_(Middle-earth)",
  },
  {
    id: "SMAUG",
    category: "fantasyAndSciFi",
    edition: 69,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Smaug",
  },
  {
    id: "FORCE",
    category: "fantasyAndSciFi",
    edition: 78,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/The_Force",
  },
  {
    id: "SPOCK",
    category: "fantasyAndSciFi",
    edition: 87,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Spock",
  },
  {
    id: "DROID",
    category: "fantasyAndSciFi",
    edition: 96,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Droid",
  },
  {
    id: "DWARF",
    category: "fantasyAndSciFi",
    edition: 105,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Dwarf_(folklore)",
  },
  {
    id: "SIGIL",
    category: "fantasyAndSciFi",
    edition: 114,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Sigil_(magic)",
  },
  {
    id: "MORIA",
    category: "fantasyAndSciFi",
    edition: 123,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Moria,_Middle-earth",
  },
  {
    id: "JOKER",
    category: "superheroes",
    edition: 7,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Joker_(character)",
  },
  {
    id: "CAROL",
    category: "superheroes",
    edition: 16,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Carol_Danvers",
  },
  {
    id: "BLADE",
    category: "superheroes",
    edition: 25,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Blade_(character)",
  },
  {
    id: "STARK",
    category: "superheroes",
    edition: 34,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Tony_Stark",
  },
  {
    id: "VENOM",
    category: "superheroes",
    edition: 43,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Venom_(character)",
  },
  {
    id: "LOGAN",
    category: "superheroes",
    edition: 52,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Wolverine_(character)",
  },
  {
    id: "RAVEN",
    category: "superheroes",
    edition: 61,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Raven_(DC_Comics)",
  },
  {
    id: "THING",
    category: "superheroes",
    edition: 70,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Thing_(character)",
  },
  {
    id: "FLASH",
    category: "superheroes",
    edition: 79,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Flash_(character)",
  },
  {
    id: "HAVOK",
    category: "superheroes",
    edition: 88,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Havok_(comics)",
  },
  {
    id: "MILES",
    category: "superheroes",
    edition: 97,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Miles_Morales",
  },
  {
    id: "BRUCE",
    category: "superheroes",
    edition: 106,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bruce_Wayne",
  },
  {
    id: "DONNA",
    category: "superheroes",
    edition: 115,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Donna_Troy",
  },
  {
    id: "BEAST",
    category: "superheroes",
    edition: 124,
    summary: "",
    hints: [],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Beast_(character)",
  },
  {
    id: "ROGUE",
    category: "tabletopAndBoardGames",
    edition: 8,
    summary:
      "A stealth‑focused D&D class known for Sneak Attack, skills, and subterfuge.",
    hints: [
      "Skilled with Thieves’ Cant and expertise rather than heavy armor",
      "Its signature damage feature triggers when an ally is adjacent",
    ],
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/Character_classes_in_Dungeons_%26_Dragons#Rogue",
  },
  {
    id: "PSION",
    category: "tabletopAndBoardGames",
    edition: 17,
    summary:
      "A psionic character class in some D&D editions, wielding mental disciplines and power points.",
    hints: [
      "Manifests abilities via disciplines instead of spell schools",
      "Often associated with crystal foci and the Far Realm",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Psion_(Dungeons_%26_Dragons)",
  },
  {
    id: "DRUID",
    category: "tabletopAndBoardGames",
    edition: 26,
    summary:
      "A D&D spellcaster tied to nature, known for Wild Shape and circle traditions.",
    hints: [
      "Can prepare spells from the entire list after each long rest",
      "Transforms into beasts while retaining class features",
    ],
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/Character_classes_in_Dungeons_%26_Dragons#Druid",
  },
  {
    id: "CATAN",
    category: "tabletopAndBoardGames",
    edition: 35,
    summary:
      "A seminal Eurogame about trading and building on a modular hex map.",
    hints: [
      "Wool, ore, brick — trade ratios shape your tempo",
      "The robber freezes production on a tile until displaced",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Catan",
  },
  {
    id: "CHESS",
    category: "tabletopAndBoardGames",
    edition: 44,
    summary:
      "A classic two‑player strategy game on an 8×8 board with asymmetric piece movement.",
    hints: [
      "One special king move requires untouched pieces and a clear path",
      "A pawn may capture en passant under precise timing",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Chess",
  },
  {
    id: "CHECK",
    category: "tabletopAndBoardGames",
    edition: 53,
    summary:
      "In chess, a direct attack on the king that must be addressed immediately.",
    hints: [
      "Avoidable by capture, interposition, or king movement only",
      "Declare this before mate ends the game",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Check_(chess)",
  },
  {
    id: "MAGIC",
    category: "tabletopAndBoardGames",
    edition: 62,
    summary:
      "Magic: The Gathering — a trading card game built on a five‑color resource system.",
    hints: [
      "Lands enter tapped or untapped to fuel spells",
      "The color pie divides philosophies like blue control and red burn",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Magic:_The_Gathering",
  },
  {
    id: "QUEST",
    category: "tabletopAndBoardGames",
    edition: 71,
    summary:
      "A core RPG objective structure — narrative goals that drive adventures.",
    hints: [
      "Often formalized in modules with hooks, milestones, and rewards",
      "May be tracked alongside side objectives and downtime tasks",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Role-playing_game",
  },
  {
    id: "BLUFF",
    category: "tabletopAndBoardGames",
    edition: 80,
    summary:
      "A hidden‑information/deduction tactic central to games like poker and Liar’s Dice.",
    hints: [
      "Success hinges on probabilistic claims and table image",
      "Often countered by forced reveals or challenge mechanics",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bluffing",
  },
  {
    id: "PIECE",
    category: "tabletopAndBoardGames",
    edition: 89,
    summary: "A movable unit used to represent players or powers on a board.",
    hints: [
      "Its shape may encode movement or ownership",
      "In abstracts, material advantage is measured in these units",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Game_piece",
  },
  {
    id: "SPACE",
    category: "tabletopAndBoardGames",
    edition: 98,
    summary:
      "A discrete position on a board that constrains movement and placement.",
    hints: [
      "Landing here can trigger card draws, penalties, or bonuses",
      "Grids and hexes partition these locations",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Board_game",
  },
  {
    id: "BOARD",
    category: "tabletopAndBoardGames",
    edition: 107,
    summary: "The surface or layout on which a tabletop game is played.",
    hints: [
      "May be modular, folding, or tile‑based for replayability",
      "Its topology defines adjacency and movement costs",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Board_game",
  },
  {
    id: "ROUTE",
    category: "tabletopAndBoardGames",
    edition: 116,
    summary:
      "Ticket to Ride’s central mechanic — claiming connections between cities to score.",
    hints: [
      "Set collection enables longer claims for higher points",
      "Hidden objectives reward completing specific paths",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Ticket_to_Ride_(board_game)",
  },
  {
    id: "MIMIC",
    category: "tabletopAndBoardGames",
    edition: 125,
    summary:
      "A classic D&D monster that disguises itself as a chest or door to ambush adventurers.",
    hints: [
      "Often adhesive — making escape checks necessary",
      "Perception tests fail when you treat treasure like a trap",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Mimic_(Dungeons_%26_Dragons)",
  },
  {
    id: "MANGA",
    category: "animeAndManga",
    edition: 9,
    summary:
      "Japanese comics and graphic novels, often adapted into anime and read right to left.",
    hints: [
      "Printed format often adapted into animated series",
      "Typically read from right to left in its country of origin",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Manga",
  },
  {
    id: "ANIME",
    category: "animeAndManga",
    edition: 18,
    summary: "Japanese animated works, covering diverse genres and art styles.",
    hints: [
      "May adapt manga, light novels, or be entirely original",
      "Character designs often feature exaggerated expressions and large eyes",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Anime",
  },
  {
    id: "LIGHT",
    category: "animeAndManga",
    edition: 27,
    summary:
      "Light Yagami, protagonist of Death Note, who gains a supernatural notebook of deadly power.",
    hints: [
      "Thinks of himself as a god of a new world",
      "Outwitted in a high-stakes cat-and-mouse game with a detective known only as L",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Light_Yagami",
  },
  {
    id: "RYUKO",
    category: "animeAndManga",
    edition: 36,
    summary: "Ryuko Matoi, scissor blade-wielding heroine of Kill la Kill.",
    hints: [
      "Seeks the truth behind her father's murder",
      "Wears a sentient sailor uniform named Senketsu",
    ],
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/List_of_Kill_la_Kill_characters#Ry%C5%ABko_Matoi",
  },
  {
    id: "SPIKE",
    category: "animeAndManga",
    edition: 45,
    summary:
      "Spike Spiegel, the laid-back bounty hunter protagonist of Cowboy Bebop.",
    hints: [
      "Former member of the Red Dragon Crime Syndicate",
      "Haunted by a past love and a deadly rival",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Spike_Spiegel",
  },
  {
    id: "ASTRO",
    category: "animeAndManga",
    edition: 54,
    summary: "Astro Boy, a classic robot hero created by Osamu Tezuka.",
    hints: [
      "A robot with emotions who fights for justice",
      "Known as Tetsuwan Atom in Japan",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Astro_Boy",
  },
  {
    id: "ALITA",
    category: "animeAndManga",
    edition: 63,
    summary:
      "Cyborg heroine of Battle Angel Alita, set in a post-apocalyptic world.",
    hints: [
      "Discovered in a scrapyard by cybernetics doctor Ido",
      "Excels in the martial art Panzer Kunst",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Battle_Angel_Alita",
  },
  {
    id: "LUPIN",
    category: "animeAndManga",
    edition: 72,
    summary:
      "Lupin III, gentleman thief from the long-running manga and anime series.",
    hints: [
      "Grandson of a famous fictional French burglar",
      "Often pursued by Inspector Zenigata",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Lupin_III",
  },
  {
    id: "USAGI",
    category: "animeAndManga",
    edition: 81,
    summary: "Usagi Tsukino, magical girl heroine of Sailor Moon.",
    hints: [
      "Transforms into a guardian of love and justice",
      "Carries a brooch and wields a Moon Tiara",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Sailor_Moon_(character)",
  },
  {
    id: "RENJI",
    category: "animeAndManga",
    edition: 90,
    summary: "Renji Abarai, lieutenant in Bleach’s Soul Society.",
    hints: [
      "Wields a zanpakuto named Zabimaru",
      "Known for his striking red hair and tattoos",
    ],
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/List_of_Bleach_characters#Renji_Abarai",
  },
  {
    id: "SANJI",
    category: "animeAndManga",
    edition: 99,
    summary: "Sanji, cook of the Straw Hat Pirates in One Piece.",
    hints: [
      "Fights primarily using powerful kicks",
      "Dreams of finding the All Blue",
    ],
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/List_of_One_Piece_characters#Sanji",
  },
  {
    id: "CELTY",
    category: "animeAndManga",
    edition: 108,
    summary: "Celty Sturluson, headless dullahan from Durarara!!.",
    hints: [
      "Rides a black motorcycle in Ikebukuro",
      "Searching for her missing head",
    ],
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/List_of_Durarara!!_characters#Celty_Sturluson",
  },
  {
    id: "HIKAR",
    category: "animeAndManga",
    edition: 117,
    summary: "Hikaru Shindo, protagonist of Hikaru no Go.",
    hints: [
      "Haunted by the spirit of an ancient Go master",
      "Learns strategy through the board game Go",
    ],
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/List_of_Hikaru_no_Go_characters#Hikaru_Shindo",
  },
  {
    id: "SAIYA",
    category: "animeAndManga",
    edition: 126,
    summary: "Saiyan, warrior race from the Dragon Ball series.",
    hints: [
      "Known for spiky hair and incredible power boosts",
      "Transformations often change hair color to gold",
    ],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Saiyan",
  },
];

export const getWordEntry = (id: WordId): WordEntry => {
  const entry = WORD_DATA.find((word) => word.id === id);
  if (!entry) {
    throw new Error(`Word not found: ${id}`);
  }
  return entry;
};

export { WORD_DATA };

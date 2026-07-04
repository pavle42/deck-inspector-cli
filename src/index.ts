import { readFileSync } from "fs";
import { Command } from "commander";

let file: string;
const path = "cards.json";

try {
  file = readFileSync(path, "utf8");
} catch (err) {
  if (err instanceof Error && "code" in err && err.code === "ENOENT") {
    console.error(`Deck file not found: ${path}`);
  } else {
    console.error(`Could not read ${path}: ${String(err)}`);
  }
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = JSON.parse(file);
} catch {
  console.error(`${path} is not valid JSON.`);
  process.exit(1);
}

if (!Array.isArray(parsed)) {
  console.error(`${path} must contain an array of cards.`);
  process.exit(1);
}

if (!parsed.every(isCard)) {
  console.error(`${path} has invalid card data.`);
  process.exit(1);
}

const cards: Card[] = parsed;
const program = new Command();

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

type Card = {
    id: string,
    name: string,
    club: string,
    rarity: Rarity,
    packTier: number,
    value: number,
    rollWeight: number
}

function isCard(value: unknown): value is Card {
    if (typeof value !== "object" || value === null) return false;

    const card = value as Record<string, unknown>;

    return (
        typeof card.id === "string" &&
        typeof card.name === "string" &&
        typeof card.club === "string" &&
        isRarity(card.rarity) &&
        typeof card.packTier === "number" &&
        typeof card.value === "number" &&
        typeof card.rollWeight === "number"
    );
}

function isRarity(value: unknown): boolean {
    if (
        value === "common" ||
        value === "uncommon" ||
        value === "rare" ||
        value === "epic" ||
        value === "legendary"
    )
        return true
    else
        return false;
}

program
    .name("deck-inspector-cli")
    .description("A CLI tool that inspects a card deck's data")
    .version("1.0.0");

program
    .command("list")
    .description("List cards")
    .option("-c, --common", "Shows all common cards")
    .option("-u, --uncommon", "Shows all uncommon cards")
    .option("-r, --rare", "Shows all rare cards")
    .option("-e, --epic", "Shows all epic cards")
    .option("-l, --legendary", "Shows all legendary cards")
    .action((options) => {
        let returnCards: Card[] = [];
        
        if (options.common) {
            addCardsForRarity("common");
        }

        if (options.uncommon) {
            addCardsForRarity("uncommon");
        }

        if (options.rare) {
            addCardsForRarity("rare");
        }

        if (options.epic) {
            addCardsForRarity("epic");
        }

        if (options.legendary) {
            addCardsForRarity("legendary");
        }

        function addCardsForRarity(rarity: Rarity): void {
            for (let card of cards)
                if (card.rarity === rarity) returnCards.push(card);
        }

        if (returnCards.length > 0)
            console.log(returnCards);
        else
            console.log(cards);
    });

program.parse();
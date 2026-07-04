import { readFileSync } from "fs";

const cardsFile = readFileSync("cards.json", "utf8");
const cards = JSON.parse(cardsFile);
const cli_arguments = process.argv.slice(2);

for (const a of cli_arguments) {
    console.log(a);
}

console.log(cards);
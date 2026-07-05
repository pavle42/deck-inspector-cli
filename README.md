# deck-inspector-cli

A small command-line tool for inspecting a trading-card deck stored in JSON. Point it at a deck file and list cards by rarity or look one up by id.

Built as a TypeScript learning project: strict mode, zero `any`, and a fully validated data boundary (the deck file is parsed as `unknown` and type-guarded into `Card[]` before anything trusts it).

```
$ npx tsx src/index.ts find deepwater_10
{
  id: 'deepwater_10',
  name: 'Leo Pessi',
  club: 'Deepwater FC',
  rarity: 'legendary',
  packTier: 2,
  value: 5000,
  rollWeight: 1
}
```

## Requirements

- [Node.js](https://nodejs.org/) 18+ (uses `npx tsx` to run TypeScript directly — no build step needed).

## Setup

```bash
git clone <your-repo-url>
cd deck-inspector-cli
npm install
```

> Run all commands from the project root — the tool reads `cards.json` relative to your current directory.

## Usage

```bash
npx tsx src/index.ts <command> [options]
```

Or build once and run the compiled output:

```bash
npx tsc
node dist/index.js <command> [options]
```

### Commands

| Command | Description | Example |
|---------|-------------|---------|
| `list` | List cards, optionally filtered by rarity | `npx tsx src/index.ts list --rare` |
| `find <id>` | Print the card with the given id | `npx tsx src/index.ts find deepwater_10` |
| `--help` | Show help for the tool or a command | `npx tsx src/index.ts list --help` |
| `--version` | Print the version | `npx tsx src/index.ts --version` |

### `list` rarity filters

Pass one or more flags to filter; combine them to include multiple rarities. With no flags, every card is listed.

| Flag | Rarity |
|------|--------|
| `-c`, `--common` | common |
| `-u`, `--uncommon` | uncommon |
| `-r`, `--rare` | rare |
| `-e`, `--epic` | epic |
| `-l`, `--legendary` | legendary |

```bash
npx tsx src/index.ts list --rare --epic   # rare AND epic cards
npx tsx src/index.ts list                 # all cards
```

## The data file

The deck lives in `cards.json` — an array of card objects:

```json
{
  "id": "deepwater_10",
  "name": "Leo Pessi",
  "club": "Deepwater FC",
  "rarity": "legendary",
  "packTier": 2,
  "value": 5000,
  "rollWeight": 1
}
```

`rarity` must be one of: `common`, `uncommon`, `rare`, `epic`, `legendary`. The sample deck contains 33 cards across three clubs (Deepwater FC, Emberfield United, Frostvale Athletic).

## Error handling

The tool validates its input at startup and exits with a non-zero code and a clear message (never a raw stack trace) when something is wrong:

| Situation | Result |
|-----------|--------|
| `cards.json` is missing | `Deck file not found: cards.json` |
| `cards.json` isn't valid JSON | `cards.json is not valid JSON.` |
| The file isn't an array of valid cards | `cards.json has invalid card data.` |
| Unknown command | commander prints an error and usage |
| `find` called without an id | commander reports the missing required argument |

## Why it exists

A deliberately small project to practice writing real TypeScript end to end: modeling data with a string-literal union (`Rarity`), guarding an untrusted JSON boundary with a type predicate (`isCard`), and handling every failure path cleanly.

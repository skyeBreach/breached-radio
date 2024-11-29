import { $ } from "bun";
import chalk from 'chalk';
import Package from "../package.json";

/*--------------------------------------------------------------------------------------------------------------------*/
// Args and Flag Parsing

// Define an object to store the passed in flags
const flags = {
    bSilent: false,
    bDryRun: false,
}

// Join args so they can be passed to bun
const args = Bun.argv.slice(2).join(" ");

// Iterate through passed in args to properly set the flags
for (const arg of Bun.argv.slice(2)){
    if (arg === '--silent') flags.bSilent = true;
    if (arg === '--dry-run') flags.bDryRun = true;
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Helper Functions

// Helper function for console.log
const log = (out: string) => !flags.bSilent && console.log(out);
const header = chalk.cyanBright.bold;

/*--------------------------------------------------------------------------------------------------------------------*/
// Bun Initialization

log(header("Registering this package with bun: "));
await $`bun link ${args}`

log(header("\nRegistering this package's scripts with bun: "))
await $`bun link ${Package.name} ${args}`

/*--------------------------------------------------------------------------------------------------------------------*/

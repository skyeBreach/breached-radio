// TODO: Fill out your copyright notice and run the 'copyright-update' script

import { $ } from "bun";
import chalk from 'chalk';
import Package from "../package.json";
import { unlinkSync } from "node:fs";
import { breachedZod, MetaFile } from "./utils/zod";

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
const error = chalk.redBright.bold;

/*--------------------------------------------------------------------------------------------------------------------*/
// Create and Update Package Meta Data

// Lazily load the configuration files to use with this setup script
const metaFile = Bun.file(".config/meta.json");
const packageFile = Bun.file("package.json");

// Check if package.json exists, if it not then throw error
const bFoundPackageFile = await packageFile.exists();
if (!bFoundPackageFile) {
    throw new Error("Setup: Package file (.config/meta.json) does not exist.")
}

// Validate and Parse the package.json file for the properties we require
const parsedPackageFile = breachedZod.schemas.packageFile.parse(await packageFile.json());

// Remove the previous meta file to avoid any issues
if(await metaFile.exists()) unlinkSync(".config/meta.json");

// Pull parsed and updated meta file
const parsedMetaFile = {
    ...parsedPackageFile,
    label: parsedPackageFile.name.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" "),
} as MetaFile;

// Write the new metadata file, based off the other configs
Bun.write(".config/meta.json", JSON.stringify(parsedMetaFile));

/*--------------------------------------------------------------------------------------------------------------------*/
// Bun Initialization

log(header("Registering this package with bun: "));
await $`bun link ${args}`;

log(header("\nRegistering this package's scripts with bun: "));
await $`bun link ${Package.name} ${args}`;

/*--------------------------------------------------------------------------------------------------------------------*/

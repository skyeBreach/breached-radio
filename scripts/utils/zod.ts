// TODO: Fill out your copyright notice and run the 'copyright-update' script

import z from "zod";
import { valid as ValidateSemver} from "semver";

/*--------------------------------------------------------------------------------------------------------------------*/
// String Casing

// TODO: Comment
/**
 * 
 */
export const regexKebabCase = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/

// TODO: Comment
/**
 * 
 */
export const KebabCase = z.custom<string>((string) => {
    return typeof string === "string" ? regexKebabCase.test(string) : false;
});

// TODO: Comment
/**
 * 
 */
export type KebabCase = z.infer<typeof KebabCase>;

/*--------------------------------------------------------------------------------------------------------------------*/
// Semver Validation

/**
 * Custom schema definition for validating a semver string based off of node's semver package
 */
export const Semver = z.custom<string>((version) => {
    return typeof version === "string" ? ValidateSemver(version) : false;
}, "Provided Semver string is not formatted correctly!");
  
// TODO: Comment
/**
 * 
 */
export type Semver = z.infer<typeof Semver>;

/*--------------------------------------------------------------------------------------------------------------------*/
// Package Config File Schemas

// TODO: Comment
/**
 * 
 */
export const PackageFile = z.object({
    name: KebabCase,
    version: Semver,
    description: z.string(),
    homepage: z.string().url().default(""),
})

// TODO: Comment
/**
 * 
 */
export type PackageFile = z.infer<typeof PackageFile>;

// TODO: Comment
/**
 * 
 */
export const MetaFile = z.object({
    name: KebabCase,
    label: z.string().optional(),
    version: Semver,
    description: z.string().optional(),
    homepage: z.string().url().optional(),
})

// TODO: Comment
/**
 * 
 */
export type MetaFile = z.infer<typeof MetaFile>;

/*--------------------------------------------------------------------------------------------------------------------*/
// TODO: Separator Text
// 

// TODO: Comment
/**
 * 
 */
export const breachedZod = {
    ...z,
    semver: Semver,
    schemas: {
        packageFile: PackageFile,
        metaFile: MetaFile,
    },
    string: {
        case: {
            kebab: KebabCase,
        },
    },
} 

// TODO: Comment
/**
 * 
 */
export type breachedZod = typeof z & {
    semver: Semver
    schemas: {
        packageFile: PackageFile,
        metaFile: MetaFile,
    },
    string: {
        case: {
            kebab: KebabCase
        }
    },
}

/*--------------------------------------------------------------------------------------------------------------------*/
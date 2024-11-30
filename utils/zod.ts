import z from "zod";
import { valid as ValidateSemver} from "semver";

// TODO TSDoc comments

/*--------------------------------------------------------------------------------------------------------------------*/
// String Casing

export const regexKebabCase = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/

export const KebabCase = z.custom<string>((string) => {
    return typeof string === "string" ? regexKebabCase.test(string) : false;
});

export type KebabCase = z.infer<typeof KebabCase>;

/*--------------------------------------------------------------------------------------------------------------------*/
// Semver Validation

/**
 * Custom schema definition for validating a semver string based off of node's semver package
 */
export const Semver = z.custom<string>((version) => {
    return typeof version === "string" ? ValidateSemver(version) : false;
}, "Provided Semver string is not formatted correctly!");
  

export type Semver = z.infer<typeof Semver>;

/*--------------------------------------------------------------------------------------------------------------------*/
// Package Config File Schemas

export const PackageFile = z.object({
    name: KebabCase,
    version: Semver,
    description: z.string(),
    homepage: z.string().url().default(""),
})

export type PackageFile = z.infer<typeof PackageFile>;

export const MetaFile = z.object({
    name: KebabCase,
    label: z.string().optional(),
    version: Semver,
    description: z.string().optional(),
    homepage: z.string().url().optional(),
})

export type MetaFile = z.infer<typeof MetaFile>;

/*--------------------------------------------------------------------------------------------------------------------*/
// 

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
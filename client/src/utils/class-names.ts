/* eslint-disable @typescript-eslint/no-use-before-define -- Hoisted function declarations */
import { isAbsent, isPresent } from './value';

export type Classes = string | (string | null | undefined)[] | null | undefined;

export interface ClassNames {
    class: Classes;
    record?: ClassRecords;
}

type ClassRecords = Record<string, boolean>;

/**
 * Returns a string of classnames.
 * Pass in string or array as ClassName.
 *
 * @param classes - An array or string containing the desired classname.
 */
export function classNames(classes: Classes | ClassNames): string;

/**
 * Returns a string of classnames.
 * Pass in classname(s) as string or array and record.
 *
 * @param classes - String or array of classname(s).
 * @param record - Record to be evaluated.
 */
export function classNames(classes: Classes, record: ClassRecords): string;

/**
 * Returns a new classname string that is a combination of a string or array of strings and the string from a Record.
 * If a value within the Record is evaluated to be true, the key will be added to the returned string.
 *
 * @param argument1 - Classname string or array of classnames.
 * @param argument2 - Record to be evaluated by it's value(s).
 */
export function classNames(argument1: Classes | ClassNames, argument2?: ClassRecords): string {
    if (typeof argument1 === 'string') {
        return stringClassName(argument1, argument2);
    }
    if (Array.isArray(argument1)) {
        return arrayClassName(argument1, argument2);
    }
    if (isAbsent(argument1) && argument2 !== undefined) {
        return classNamesFromClasses(argument2);
    }
    if (isAbsent(argument1)) {
        return '';
    }
    return recordHandler(argument1);
}

function stringClassName(argument1: string, argument2?: ClassRecords): string {
    return [argument1, classNamesFromClasses(argument2)].filter((s) => s !== '').join(' ');
}

function arrayClassName(argument1: (string | null | undefined)[], argument2?: ClassRecords): string {
    return [...argument1, classNamesFromClasses(argument2)]
        .filter(isPresent)
        .filter((s) => s !== '')
        .join(' ');
}
export function recordHandler(argument1: ClassNames): string {
    if (argument1.record !== undefined) {
        return classNames(argument1.class ?? '', argument1.record);
    }
    if (isAbsent(argument1.class)) {
        return '';
    }
    if (typeof argument1.class === 'string') {
        return stringClassName(argument1.class);
    }
    return arrayClassName(argument1.class);
}

function classNamesFromClasses(record?: Record<string, boolean>): string {
    if (record === undefined) {
        return '';
    }
    return Object.entries(record)
        .filter(([_key, value]) => value)
        .map(([key]) => key)
        .join(' ');
}
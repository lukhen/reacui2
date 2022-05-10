import * as O from "fp-ts/lib/Option";
import { ___ } from "./templates"
import * as TBCS from "./tbcs"
import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";

/**
   Input entered by the user.

**/

export interface UserInput<A> {
    readonly input: string;
    readonly value: TBCS.TBCS<A>
}

// examples
const UI1: UserInput<Date> = { input: "", value: TBCS.none } // empty user input, ex: default value
const UI2: UserInput<Date> = { input: "2020-3-", value: TBCS.none } // unfinished user input
const UI3: UserInput<Date> = {
    input: "2020-3-xxx", value: TBCS.error(Error("Invalid input"))
}
const UI4: UserInput<Date> = {
    input: "2020-3-21", value: TBCS.stuff(new Date(2020, 2, 21))
}

export function fn_for_UserInput3<X>(ui: UserInput<unknown>): X {
    return ___<X>(
        ui.input,
        TBCS.fn_for_TBCS(ui.value)
    )
}


// Produce error some(message) if ui is parsed and invalid.
// Otherwise produce none 
export function errorMsg(ui: UserInput<unknown>): O.Option<string> {

    function fn_for_TBCS<A>(tbcs: TBCS.TBCS<A>): O.Option<string> {
        return TBCS.fold({
            whenNone: () => O.none,
            whenError: (e: Error) => O.some(e.message),
            whenStuff: (a: A) => O.none
        })(tbcs)
    }

    return fn_for_TBCS(ui.value)
}


/**
   Produce an error message if ui.value is none, otherwise produce none.
**/
export function notSetError(ui: UserInput<any>): O.Option<string> {
    return TBCS.fold(
        {
            whenNone: () => O.some("input not set"),
            whenError: (e) => O.none,
            whenStuff: (s) => O.none
        }
    )(ui.value);
}

/**
   Given an array of UserInputs<A>, filter all Stuffs<A> and produce an array of A
**/

export function justStuff<A>(uis: Array<UserInput<A>>): Array<A> {
    return A.reduce([], (as: Array<A>, ui: UserInput<A>) => TBCS.isStuff(ui.value) ?
        A.append(ui.value.value)(as) :
        as)(uis);
}

/**
   Given an array of UserInputs, produce an array of A's only if all UserInput values are stuffs.
   Otherwise produce none.
**/

export function allStuff<A>(arr: Array<UserInput<A>>): O.Option<Array<A>> {
    return pipe(
        justStuff(arr),
        (stuffs) => areAll(stuffs) ? O.some(stuffs) : O.none
    );

    function areAll(stuffs: A[]) {
        return stuffs.length == arr.length;
    }
}

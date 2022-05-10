import * as IO from "fp-ts/lib/IO"
import * as E from "fp-ts/lib/Either"
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray"

type None = { _tag: "none" }
// REFACTOR: Error in the name is bothering me, maybe something else... 
type InputErrors = { _tag: "inputerrors", value: NonEmptyArray<string> }
type CheckedInput<A> = { _tag: "checkedinput", value: A }
type AsyncError = { _tag: "asyncerror", value: Error }
type Stuff<A> = { _tag: "stuff", value: A }
export const none: None = { _tag: "none" }

/**
   Produce a TBCA from A 
**/
export function stuff<A>(a: A): TBCA<any, A> {
    return { _tag: "stuff", value: a }
}

/**
   Produce a TBCA from Error 
**/
export function asyncError(err: Error): TBCA<any, any> {
    return { _tag: "asyncerror", value: err }
}


/**
   Produce a TBCA from a list of string
**/
export function inputErrors(los: NonEmptyArray<string>): TBCA<any, any> {
    return {
        _tag: "inputerrors",
        value: los
    }
}

export function checkedInput<B>(ci: B): TBCA<B, any> {
    return {
        _tag: "checkedinput",
        value: ci
    }
}


// CheckedInput and 
/**
   interp. TBCA (To Be Computed Asynchronously) is something to be fetched from api or any other 
           asynchronous computation based on some input from the user
           - None means the stuff hasn't started to be computed yet.
           - InputErrors means that the user input has been checked and it's invalid
             The stuff can't be further computated.
           - CheckedInput means the stuff still hasn't been computed but it's ready,
             the input from the user has been checked and it's valid, the value contains the checked input
           - AsyncError means that something went wrong and the stuff cannot be computed (fetched)
             Error value tells why.
           - Stuff<A> is the computed stuff of type A
    REFACTOR: change the name of the type to AsyncStuff ??
**/
export type TBCA<B, A> = None | InputErrors | CheckedInput<B> | AsyncError | Stuff<A>

/**
   Fold function for FetchStuff.
   It's a functional switch.
**/
export function fold<B, A, X>(
    handlers: {
        whenNone: () => X,
        whenInputErrors: (los: NonEmptyArray<string>) => X,
        whenCheckedInput: (chi: B) => X,
        whenAsyncError: (e: Error) => X,
        whenStuff: (s: A) => X
    }): (f: TBCA<B, A>) => X {
    return f =>
        isNone(f) ? handlers.whenNone() :
            isInputErrors(f) ? handlers.whenInputErrors(f.value) :
                isCheckedInput(f) ? handlers.whenCheckedInput(f.value) :
                    isAsyncError(f) ? handlers.whenAsyncError(f.value) :
                        handlers.whenStuff(f.value)

}

// type predicates
export function isNone(f: TBCA<any, any>): f is None {
    return (f as None)._tag == "none"
}

export function isAsyncError(f: TBCA<any, any>): f is AsyncError {
    return (f as AsyncError)._tag == "asyncerror"
}

export function isStuff<A>(f: TBCA<any, A>): f is Stuff<A> {
    return (f as Stuff<A>)._tag == "stuff"
}

export function isCheckedInput<B>(f: TBCA<B, any>): f is CheckedInput<B> {
    return (f as CheckedInput<B>)._tag == "checkedinput"
}

export function isInputErrors(f: TBCA<any, any>): f is InputErrors {
    return (f as InputErrors)._tag == "inputerrors"
}

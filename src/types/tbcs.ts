import { ___ } from "../utils"

type None = { _tag: "none" }
// REFACTOR: Error type here seems an overkill, simple ErrorMessage would be enough
type Err = { _tag: "error", value: Error }
export type Stuff<A> = { _tag: "stuff", value: A }
export const none: None = { _tag: "none" }

/**
   Produce a TBCS from A 
**/
export function stuff<A>(a: A): TBCS<A> {
    return { _tag: "stuff", value: a }
}

/**
   Produce a TBCS from Error 
   REFACTOR: change name to invalid, argument to message: string
**/
export function error(err: Error): TBCS<any> {
    return { _tag: "error", value: err }
}


/**
   interp. TBCS (To Be Compute Synchronously) is something from any synchronous computation
           in its entire lifecycle.
           - None means the stuff hasn't started to be computed yet.
           - REFACTOR: change names, Err means that something went wrong and the stuff cannot be computed
             Error value tells why.
           - Stuff<A> is the computed stuff of type A
    
**/
export type TBCS<A> = None | Err | Stuff<A>


/**
   Fold function for TBCS
   It's a functional switch.
**/
export function fold<A, X>(
    handlers: {
        whenNone: () => X,
        whenError: (e: Error) => X, // REFACTOR: change name
        whenStuff: (s: A) => X
    }): (f: TBCS<A>) => X {
    return f =>
        isNone(f) ? handlers.whenNone() :
            isError(f) ? handlers.whenError(f.value) :
                handlers.whenStuff(f.value)

}

export function fn_for_TBCS<A, X>(tbcs: TBCS<A>): X {
    return fold({
        whenNone: () => ___<X>(),
        whenError: (e: Error) => ___<X>(e),
        whenStuff: (a: A) => ___<X>(a)
    })(tbcs)
}

// type predicates
export function isNone<A>(f: TBCS<A>): f is None {
    return (f as None)._tag == "none"
}

// REFACTOR: change name
export function isError<A>(f: TBCS<A>): f is Err {
    return (f as Err)._tag == "error"
}

export function isStuff<A>(f: TBCS<A>): f is Stuff<A> {
    return (f as Stuff<A>)._tag == "stuff"
}

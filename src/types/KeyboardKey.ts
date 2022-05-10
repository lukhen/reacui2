import { pipe } from "fp-ts/lib/function";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";

/**
  KeyboardKey is one of:
   - "enter",
   - "space",
   - "a",
   - "b"
   - ... (large enumeration)

interp.: keyboard key pressed by the user.

function fn_for_KeyboardKey<A>(kk: KeyboardKey): A {
    return cond<A>(
        [
            [kk === "enter", ___<A>()],
            [kk === "space", ___<A>()],
            ...
        ],
        ___<A>()
    )
}
**/
export type KeyboardKey = string;

/**
   Produce the first  case value for which key satisfies its predicate.
   If all cases' predicates fail produce 'other'.

   It is type safe, functional equivalent of switch statement for keyboard key.
**/
export function fold<X>(
    cases: NonEmptyArray<[predicate: (key: KeyboardKey) => boolean, value: X]>,
    other: X): (key: KeyboardKey) => X {
    return key => pipe(
        cases.filter(x => x[0](key))[0],
        h => h == undefined ? other : h[1]
    )
}

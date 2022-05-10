import { pipe } from "fp-ts/lib/function"
import * as tbcs from "./types/tbcs"
import { UserInput, allStuff, justStuff } from "./types/userinput"
import * as O from "fp-ts/lib/Option"

const U1: UserInput<number> = { input: "", value: tbcs.none }
const U2: UserInput<number> = { input: "", value: tbcs.error(Error("dupa")) }
const U3: UserInput<number> = { input: "", value: tbcs.stuff(3) }
const U4: UserInput<number> = { input: "", value: tbcs.stuff(2) }

describe("justStuff", () => {
    test("should produce empty array", pipe(
        justStuff([U1, U2]),
        x => () => { expect(x).toEqual([]) }
    ))

    test("should produce [3]", pipe(
        justStuff([U2, U3]),
        x => () => { expect(x).toEqual([3]) }
    ))

    test("should produce [3]", pipe(
        justStuff([U3]),
        x => () => { expect(x).toEqual([3]) }
    ))
    test("should produce [3, 2]", pipe(
        justStuff([U3, U4]),
        x => () => { expect(x).toEqual([3, 2]) }
    ))

})

describe("allStuff", () => {
    test("should produce none", pipe(
        allStuff([U1, U2]),
        x => () => { expect(x).toEqual(O.none) }
    ))

    test("should produce none", pipe(
        allStuff([U2, U3]),
        x => () => { expect(x).toEqual(O.none) }
    ))

    test("should produce some([3])", pipe(
        allStuff([U3]),
        x => () => { expect(x).toEqual(O.some([3])) }
    ))
    test("should produce some([3, 2])", pipe(
        allStuff([U3, U4]),
        x => () => { expect(x).toEqual(O.some([3, 2])) }
    ))

})

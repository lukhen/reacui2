import { parseYearInput } from "./reducer"
import * as Tbcs from "../types/tbcs"
import { pipe } from "fp-ts/lib/function"
import * as E from "fp-ts/lib/Either"
describe("parseYearInput", () => {
    test("empty string", pipe(
        "",
        parseYearInput,
        t => () => {
            expect(t).toEqual(E.left(Error("Fill year input")))
        }
    ))

    test("invalid string", pipe(
        "2002xxx",
        parseYearInput,
        t => () => {
            expect(t).toEqual(E.left(Error("Invalid year string")))
        }
    ))
    test("valid string", pipe(
        "2002",
        parseYearInput,
        t => () => {
            expect(t).toEqual(E.right(2002))
        }
    ))

})

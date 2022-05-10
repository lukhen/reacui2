import { pipe } from "fp-ts/lib/function"
import { parseDate } from "../functions"
import * as E from "fp-ts/lib/Either"

describe("parseDate", () => {
    test("should produce left(Error) for an empty string", pipe(
        parseDate(""),
        d => () => { expect(d).toEqual(E.left(Error("Invalid string format"))) }
    ))

    test("should produce left(Error) for an invalid string", pipe(
        parseDate("invalid date string"),
        d => () => { expect(d).toEqual(E.left(Error("Invalid string format"))) }
    ))

    test("should produce right(Date) for a valid date string", pipe(
        parseDate("2021-4-1"),
        d => () => { expect(d).toEqual(E.right(new Date(Date.UTC(2021, 3, 1)))) }
    ))

    test("should produce left(Error) for a valid date with locale", pipe(
        parseDate("2021-4-1 UTC"),
        d => () => {
            expect(d).toEqual(E.left(Error("Invalid string format")))
        }
    ))

    test("should produce left(Error) for a valid string but invalid date", pipe(
        parseDate("9999-29124312-992134123"),
        d => () => {
            expect(d).toEqual(E.left(Error("Invalid date")))
        }
    ))
})

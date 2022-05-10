import { dateInputsToDates } from "./reducer"
import * as tbcs from "../types/tbcs"
import { UserInput } from "../types/userinput"
import * as E from "fp-ts/lib/Either"

const EMPTY: UserInput<Date> = {
    input: "",
    value: tbcs.none
}

const END: UserInput<Date> = {
    input: "irrelevant",
    value: tbcs.stuff(new Date(2, 2, 2000))
}

const START: UserInput<Date> = {
    input: "irrelevant",
    value: tbcs.stuff(new Date(1, 1, 2000))
}

const INVALID: UserInput<Date> = {
    input: "invalid date input",
    value: tbcs.error(Error("Input invalid"))
}

// CODESMELL: checking hardcoded error messages looks terrible, seems violating SRP
describe("dateInputsToDates function", () => {
    test("should return Left if dateFrom input is empty", () => {
        const x = dateInputsToDates({
            dateFrom: EMPTY,
            dateTo: END
        })
        expect(E.isLeft(x)).toBeTruthy()
        if (E.isLeft(x))
            expect(x.left).toContain("input not set")
    })

    test("should return Left if dateTo input is empty", () => {
        const x = dateInputsToDates({
            dateFrom: START,
            dateTo: EMPTY
        })
        expect(E.isLeft(x)).toBeTruthy()
        if (E.isLeft(x))
            expect(x.left).toContain("input not set")
    })

    test("should return Left if dateFrom input is invalid", () => {
        const x = dateInputsToDates({
            dateFrom: INVALID,
            dateTo: END
        })
        expect(E.isLeft(x)).toBeTruthy()
        if (E.isLeft(x))
            expect(x.left).toContain("Input invalid")
    })


    test("should return Left if dateTo input is invalid", () => {
        const x = dateInputsToDates({
            dateFrom: START,
            dateTo: INVALID
        })
        expect(E.isLeft(x)).toBeTruthy()
        if (E.isLeft(x))
            expect(x.left).toContain("Input invalid")
    })

    test("should return Left if dateTo is older than dateFrom", () => {
        const x = dateInputsToDates({
            dateFrom: END,
            dateTo: START
        })
        expect(E.isLeft(x)).toBeTruthy()
        if (E.isLeft(x))
            expect(x.left).toContain("Start date should be older than end date.")
    })

    test("should return Right", () => {
        const x = dateInputsToDates({
            dateFrom: START,
            dateTo: END
        })
        expect(E.isRight(x)).toBeTruthy()
        if (E.isRight(x))
            expect(x.right).toEqual({
                dateFrom: (START.value as tbcs.Stuff<Date>).value,
                dateTo: (END.value as tbcs.Stuff<Date>).value
            })
    })
})

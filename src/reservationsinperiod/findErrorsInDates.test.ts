import { findErrorsInDates } from "./reducer"
import * as tbcs from "../types/tbcs"

describe("findErrorsInDates function", () => {
    test("should find an error if dateFrom is none", () => {
        expect(findErrorsInDates({
            dateFrom: { input: "", value: tbcs.none },
            dateTo: { input: "bad date input", value: tbcs.error(Error("Bad input")) }
        })).toContain("input not set")
    })

    test("should find an error if dateTo is none", () => {
        expect(findErrorsInDates({
            dateFrom: { input: "bad date input", value: tbcs.error(Error("Bad input")) },
            dateTo: { input: "", value: tbcs.none }
        })).toContain("input not set")
    })

    test("should find an error if dateFrom input is invalid", () => {
        expect(findErrorsInDates({
            dateFrom: { input: "invalid date input", value: tbcs.error(Error("Input invalid")) },
            dateTo: { input: "", value: tbcs.none }
        })).toContain("Input invalid")
    })

    test("should find an error if dateTo input is invalid", () => {
        expect(findErrorsInDates({
            dateTo: { input: "invalid date input", value: tbcs.error(Error("Input invalid")) },
            dateFrom: { input: "", value: tbcs.none }
        })).toContain("Input invalid")
    })

    test("should find an error if dateTo is older than dateFrom", () => {
        expect(findErrorsInDates({
            dateFrom: { input: "21-4-2021", value: tbcs.stuff(new Date(Date.parse("2021-4-21"))) },
            dateTo: { input: "23-4-2021", value: tbcs.stuff(new Date(Date.parse("2021-4-21"))) }
        })).toContain("Start date should be older than end date.")
    })
})

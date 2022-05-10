import { UserInput, errorMsg } from "../types/userinput"
import * as TBCS from "./tbcs"
import * as O from "fp-ts/lib/Option"

describe("errorMsg_3", () => {
    test("Valid input, parsed, no error", () => {
        const ui: UserInput<number> = {
            input: "1",
            value: TBCS.stuff(1)
        }
        expect(errorMsg(ui)).toEqual(O.none)
    })
    test("Invalid input, parsed", () => {
        const ui: UserInput<number> = {
            input: "1x",
            value: TBCS.error(Error("Invalid input"))
        }
        expect(errorMsg(ui)).toEqual(O.some("Invalid input"))
    })

    test("Invalid input, not yet parsed", () => {
        const ui: UserInput<number> = {
            input: "1x",
            value: TBCS.none
        }
        expect(errorMsg(ui)).toEqual(O.none)
    })

    test("Valid input, not yet parsed", () => {
        const ui: UserInput<number> = {
            input: "1",
            value: TBCS.none
        }
        expect(errorMsg(ui)).toEqual(O.none)
    })
})

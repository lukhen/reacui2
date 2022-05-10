import { checkInputs } from "./reducer"
import * as Tbcs from "../types/tbcs"
import { pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/lib/Option"
import { errorMsg, notSetError, UserInput } from "../types/userinput"
import { allSomes } from "../functions"

describe("checkInputs", () => {

    const EMPTY: UserInput<any> = {
        input: "",
        value: Tbcs.none
    }

    const INVALID: UserInput<any> = {
        input: "",
        value: Tbcs.error(Error("invalid input"))
    }


    test("empty year input", pipe(
        {
            year: EMPTY
        },
        checkInputs,
        e => O.fold(
            () => () => { expect("This code should not be executed").toEqual("") },
            ([errors, error]: Array<any>) => () => { expect(errors).toContain(error) }
        )(allSomes([O.getLeft(e), notSetError(EMPTY)]))
    ))

    test("invalid year input", pipe(
        {
            year: INVALID
        },
        checkInputs,
        e => O.fold(
            () => () => { expect("This code should not be executed").toEqual("") },
            ([errors, error]: Array<any>) => () => { expect(errors).toContain(error) }
        )(allSomes([O.getLeft(e), errorMsg(INVALID)])))
    )
})

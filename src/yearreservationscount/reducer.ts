import { Reducer } from "redux"
import { YearReservationsCount2 } from "./YearReservationsCountComponent"
import * as actions from "./actions"
import * as Tbcs from "../types/tbcs"
import * as Tbca from "../types/tbca"
import { pipe } from "fp-ts/lib/function"
import * as E from "fp-ts/lib/Either"
import { UserInput, errorMsg, notSetError, allStuff } from "../types/userinput"
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray"
import { isEmpty } from "fp-ts/lib/Array"
import { appendSome } from "../functions"

export const yearReservationsCountReducer: Reducer<YearReservationsCount2, actions.ReservationsCountAction> =
    (state = {
        userInputs: {
            year: { input: "", value: Tbcs.none }
        },
        asyncStuffs: {
            reservationsCount: Tbca.none
        }

    }, action) => {
        return pipe(
            action,
            actions.fold({
                whenNewYearInput: a => {
                    return {
                        ...state,
                        userInputs: {
                            year: { input: a.yearInput, value: state.userInputs.year.value }
                        }
                    }
                },
                whenParseYearInput: a => {
                    return {
                        ...state,
                        userInputs: {
                            year: {
                                input: "", value: pipe(
                                    state.userInputs.year.input,
                                    parseYearInput,
                                    E.fold(
                                        e => Tbcs.error(e),
                                        s => Tbcs.stuff(s)
                                    )
                                )
                            }
                        }
                    }
                },
                whenCheckInputs: a => {
                    return {
                        ...state,
                        asyncStuffs: {
                            reservationsCount: pipe(
                                state.userInputs,
                                checkInputs,
                                E.fold(
                                    e => Tbca.inputErrors(e),
                                    chi => Tbca.checkedInput(chi)
                                )
                            )
                        }
                    }
                },
                whenNewAsyncError: a => {
                    return {
                        ...state,
                        asyncStuffs: {
                            reservationsCount: Tbca.asyncError(a.error)
                        }
                    }
                },
                whenNewReservationsCountAction: a => {
                    return {
                        ...state,
                        asyncStuffs: {
                            reservationsCount: Tbca.stuff(a.reservationsCount)
                        }
                    }
                },
                otherwise: state
            })
        )
    }


/**
   Produce either a number or an Error from a string.
**/
export function parseYearInput(yi: string): E.Either<Error, number> {

    return pipe(
        yi,
        inp => inp == "" ? E.left(Error("Fill year input")) : pipe(
            +yi,
            y => isNaN(y) ? E.left(Error("Invalid year string")) : E.right(y)
        ))
}

/**
   Produce B from user inputs unless they are incorrect, then produce list of error messages.
**/
export function checkInputs(inputs: { year: UserInput<number> }): E.Either<NonEmptyArray<string>, number> {
    return pipe(
        findErrorsInInputs(inputs),
        errors => isEmpty(errors) ? E.right((inputs.year.value as Tbcs.Stuff<number>).value) :
            E.left(errors as NonEmptyArray<string>)
    )
}

/**
   Produce a list of error messages.
**/
export function findErrorsInInputs(inputs: {
    year: UserInput<number>,
}): Array<string> {
    return pipe(
        [],
        appendSome(notSetError(inputs.year)),
        appendSome(errorMsg(inputs.year))
    )
}

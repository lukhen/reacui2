import { pipe } from "fp-ts/lib/function"
import { yearReservationsCountReducer as reducer, parseYearInput, checkInputs } from "./reducer"
import * as actions from "./actions"
import * as Tbcs from "../types/tbcs"
import * as Tbca from "../types/tbca"
import { UserInput } from "../types/userinput"
import * as E from "fp-ts/lib/Either"

describe("yearReservationsCountReducer", () => {
    test("on NewYearInput action", pipe(
        {
            state: {
                userInputs: {
                    year: { input: "", value: Tbcs.none }
                },
                asyncStuffs: {
                    reservationsCount: Tbca.none
                }

            },
            action: actions.newYearInput("2020")
        },
        ({ state, action }) => () => {
            expect(reducer(state, action)).toEqual({
                userInputs: {
                    year: { input: "2020", value: Tbcs.none }
                },
                asyncStuffs: {
                    reservationsCount: Tbcs.none
                }
            })
        }
    ))

    test("on ParseYearInput action", pipe(
        {
            state: {
                userInputs: {
                    year: { input: "", value: Tbcs.none }
                },
                asyncStuffs: {
                    reservationsCount: Tbca.none
                }

            },
            action: actions.parseYearInput()
        },
        ({ state, action }) => () => {
            expect(reducer(state, action)).toEqual({
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
            })
        }
    ))

    test("on CheckInputs action", pipe(
        {
            state: {
                userInputs: {
                    year: { input: "", value: Tbcs.none }
                },
                asyncStuffs: {
                    reservationsCount: Tbca.none
                }

            },
            action: actions.checkInputs()
        },
        ({ state, action }) => () => {
            expect(reducer(state, action)).toEqual({
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
            })
        }
    ))

    test("on AsyncError action", pipe(
        {
            state: {
                userInputs: {
                    year: { input: "", value: Tbcs.none }
                },
                asyncStuffs: {
                    reservationsCount: Tbca.none
                }

            },
            action: actions.newAsyncError(Error("some server error"))
        },
        ({ state, action }) => () => {
            expect(reducer(state, action)).toEqual({
                ...state,
                asyncStuffs: {
                    reservationsCount: Tbca.asyncError(Error("some server error"))
                }
            })
        }
    ))


    test("on NewReservationsCount action", pipe(
        {
            state: {
                userInputs: {
                    year: { input: "", value: Tbcs.none }
                },
                asyncStuffs: {
                    reservationsCount: Tbca.none
                }

            },
            action: actions.newReservationsCount(100)
        },
        ({ state, action }) => () => {
            expect(reducer(state, action)).toEqual({
                ...state,
                asyncStuffs: {
                    reservationsCount: Tbca.stuff(100)
                }
            })
        }
    ))
})

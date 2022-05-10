import React from "react"
import Enzyme, { shallow } from 'enzyme'
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import { YearReservationsCountComponent } from "./YearReservationsCountComponent"
import * as Tbcs from "../types/tbcs"
import * as Tbca from "../types/tbca"
import { YearReservationsCount2 } from "./YearReservationsCountComponent"
import { pipe } from "fp-ts/lib/function"
import * as io from "fp-ts/lib/IO"
import { InvalidInputComponent } from "../reservationsinperiod/InvalidInputComponent"
import { FetchingComponent } from "../reservationsinperiod/FetchingComponent"
import { flushPromises } from "../functions"
import * as TE from "fp-ts/lib/TaskEither"
import * as actions from "./actions"

Enzyme.configure({ adapter: new Adapter() })


describe("Displaying reservations count", () => {
    test("not fetched yet", pipe(
        () => shallow(
            <YearReservationsCountComponent
                state={{
                    userInputs: {
                        year: {
                            input: "2000",
                            value: Tbcs.none
                        }
                    },
                    asyncStuffs: {
                        reservationsCount: Tbca.none
                    }
                }}
                fetchReservationsCount={jest.fn()}
                getDispatch={jest.fn()}
            />),
        io.chain((wrapper) => () => {
            expect(wrapper.find("#reservations-count").length).toEqual(0)
        })
    ))

    test("invalid input", pipe(
        () => shallow(
            <YearReservationsCountComponent
                state={{
                    userInputs: {
                        year: {
                            input: "2000",
                            value: Tbcs.none
                        }
                    },
                    asyncStuffs: {
                        reservationsCount: Tbca.inputErrors(["error1", "error2"])
                    }
                }}
                fetchReservationsCount={jest.fn()}
                getDispatch={jest.fn()}
            />),
        io.chain((wrapper) => () => {
            expect(wrapper.find(InvalidInputComponent).length).toEqual(1)
        })
    ))

    test("checked input, fetch successful", async () => {
        const dispatchMock = jest.fn()
        const dispatchFactory = (action: actions.ReservationsCountAction) => () => { dispatchMock(action) }

        const wrapper = shallow(
            <YearReservationsCountComponent
                state={{
                    userInputs: {
                        year: {
                            input: "2000",
                            value: Tbcs.none
                        }
                    },
                    asyncStuffs: {
                        reservationsCount: Tbca.checkedInput(2020)
                    }
                }}
                fetchReservationsCount={(year: number) => TE.right(100)}
                getDispatch={dispatchFactory}
            />)
        expect(wrapper.find(FetchingComponent).length).toEqual(1)
        await flushPromises()
        expect(dispatchMock).toBeCalledWith(actions.newReservationsCount(100))
    })

    test("checked input, fetch failed", async () => {
        const dispatchMock = jest.fn()
        const dispatchFactory = (action: actions.ReservationsCountAction) => () => { dispatchMock(action) }

        const wrapper = shallow(
            <YearReservationsCountComponent
                state={{
                    userInputs: {
                        year: {
                            input: "2000",
                            value: Tbcs.none
                        }
                    },
                    asyncStuffs: {
                        reservationsCount: Tbca.checkedInput(2020)
                    }
                }}
                fetchReservationsCount={(year: number) => TE.left(Error("Server error"))}
                getDispatch={dispatchFactory}
            />)
        expect(wrapper.find(FetchingComponent).length).toEqual(1)
        await flushPromises()
        expect(dispatchMock).toBeCalledWith(actions.newAsyncError(Error("Server error")))
    })

    test("fetched, and server error", pipe(
        () => shallow(
            <YearReservationsCountComponent
                state={{
                    userInputs: {
                        year: {
                            input: "2000",
                            value: Tbcs.stuff(2000)
                        }
                    },
                    asyncStuffs: {
                        reservationsCount: Tbca.asyncError(Error("some server error"))
                    }
                }}
                fetchReservationsCount={jest.fn()}
                getDispatch={jest.fn()}
            />),
        io.chain((wrapper) => () => {
            expect(wrapper.find("#async-error-message").text()).toEqual("some server error")
        })
    ))

    test("fetched reservations count", pipe(
        () => shallow(
            <YearReservationsCountComponent
                state={{
                    userInputs: {
                        year: {
                            input: "2000",
                            value: Tbcs.stuff(2000)
                        }
                    },
                    asyncStuffs: {
                        reservationsCount: Tbca.stuff(100)
                    }
                }}
                fetchReservationsCount={jest.fn()}
                getDispatch={jest.fn()}
            />),
        io.chain((wrapper) => () => {
            expect(wrapper.find("#reservations-count").text()).toEqual("100")
        })
    ))

})

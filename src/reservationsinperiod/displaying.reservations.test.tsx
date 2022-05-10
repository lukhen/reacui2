import React from "react"
import { pipe } from "fp-ts/lib/function"
import Enzyme, { shallow } from 'enzyme'
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import { ReservationsInPeriod2Component } from "./ReservationsInPeriod2Component"
import { ReservationsComponent } from "./ReservationsComponent"
import { UserInput } from "../types/userinput"
import * as io from "fp-ts/lib/IO"
import * as tbca from "../types/tbca"
import { Reservation } from "../types/reservation"
import { FetchingComponent } from "./FetchingComponent"
import * as TBCS from "../types/tbcs"
import { InvalidInputComponent } from "./InvalidInputComponent"
import * as TE from "fp-ts/lib/TaskEither"
import * as E from "fp-ts/lib/Either"
Enzyme.configure({ adapter: new Adapter() })

const DEFAULTDATEINPUT: UserInput<Date> = { input: "", value: TBCS.none }

describe("Displaying reservations", () => {
    test("not fetched yet", pipe(
        () => shallow(
            <ReservationsInPeriod2Component
                state={{
                    fromUser: {
                        dateFrom: DEFAULTDATEINPUT,
                        dateTo: DEFAULTDATEINPUT
                    },
                    asnc: {
                        reservations: tbca.none
                    }
                }}
                getDispatch={jest.fn()}
                fetchReservations={jest.fn()}
            />),
        io.chain((wrapper) => () => {
            expect(wrapper.find(ReservationsComponent).length).toEqual(0)
        })

    ))

    test("invalid input", pipe(
        () => shallow(
            <ReservationsInPeriod2Component
                state={{
                    fromUser: {
                        dateFrom: DEFAULTDATEINPUT,
                        dateTo: DEFAULTDATEINPUT
                    },
                    asnc: {
                        reservations: tbca.inputErrors(["some input is invalid"])
                    }
                }}
                getDispatch={jest.fn()}
                fetchReservations={jest.fn()}
            />),
        io.chain((wrapper) => () => {
            expect(wrapper.find(InvalidInputComponent).length).toEqual(1)
            expect(wrapper.find(InvalidInputComponent).props().errorMessages).toEqual(["some input is invalid"])

        })

    ))

    test("valid input, but not fetched yet", pipe(
        () => shallow(
            <ReservationsInPeriod2Component
                state={{
                    fromUser: {
                        dateFrom: DEFAULTDATEINPUT,
                        dateTo: DEFAULTDATEINPUT
                    },
                    asnc: {
                        reservations: tbca.checkedInput({
                            dateFrom: new Date(1, 1, 2021),
                            dateTo: new Date(2, 2, 2021)
                        })
                    }
                }}
                getDispatch={(...args: any) => () => { }}
                fetchReservations={(...args: any) => TE.right([])}
            />),
        io.chain((wrapper) => () => {
            expect(wrapper.find(FetchingComponent).length).toEqual(1)
            expect(wrapper.find(InvalidInputComponent).length).toEqual(0)
            expect(wrapper.find(ReservationsComponent).length).toEqual(0)

        })

    ))

    test("fetched empty array", pipe(
        () => shallow(
            <ReservationsInPeriod2Component
                state={{
                    fromUser: {
                        dateFrom: DEFAULTDATEINPUT,
                        dateTo: DEFAULTDATEINPUT
                    },
                    asnc: {
                        reservations: tbca.stuff([])
                    }
                }}
                getDispatch={jest.fn()}
                fetchReservations={jest.fn()}
            />),
        io.chain((wrapper) => () => {
            expect(wrapper.find(ReservationsComponent).length).toEqual(1)
        })
    ))


    const R1: Reservation = {
        dateFrom: new Date(2021, 3, 3),
        dateTo: new Date(2021, 3, 10),
        guest: "Bruce Wayne",
        room: "1"
    }
    test("fetched not-empty array", pipe(
        () => shallow(
            <ReservationsInPeriod2Component
                state={{
                    fromUser: {
                        dateFrom: DEFAULTDATEINPUT,
                        dateTo: DEFAULTDATEINPUT
                    },
                    asnc: {
                        reservations: tbca.stuff([R1])
                    }
                }}
                getDispatch={jest.fn()}
                fetchReservations={jest.fn()}
            />),
        io.chain((wrapper) => () => {
            expect(wrapper.find(ReservationsComponent).length).toEqual(1)
            expect(wrapper.find(ReservationsComponent).props().reservations).toEqual([R1])
        })
    ))

    test("error", pipe(
        () => shallow(
            <ReservationsInPeriod2Component
                state={{
                    fromUser: {
                        dateFrom: DEFAULTDATEINPUT,
                        dateTo: DEFAULTDATEINPUT
                    },
                    asnc: {
                        reservations: tbca.asyncError(Error("Something went wrong"))
                    }
                }}
                getDispatch={jest.fn()}
                fetchReservations={jest.fn()}
            />),
        io.chain((wrapper) => () => {
            expect(wrapper.find("#reservations-error").text()).toEqual("Something went wrong")
        })
    ))
})

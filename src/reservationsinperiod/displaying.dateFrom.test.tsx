import React from "react"
import { pipe } from "fp-ts/lib/function"
import Enzyme, { shallow } from 'enzyme'
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import * as io from "fp-ts/lib/IO"
import { UserInput, errorMsg } from "../types/userinput"
import { ReservationsInPeriod2Component } from "./ReservationsInPeriod2Component"
import * as tbca from "../types/tbca"
import * as TBCS from "../types/tbcs"

Enzyme.configure({ adapter: new Adapter() })

const INVALIDDATEFROM: UserInput<Date> = {
    input: "invalid date",
    value: TBCS.error(Error("Wrong input"))
}

const DATEFROMBEFOREPARSING: UserInput<Date> = {
    input: "any valid input",
    value: TBCS.none
}

const VALIDDATEFROM: UserInput<Date> = {
    input: "2021-3-20",
    value: TBCS.stuff(new Date(Date.parse("2021-3-20")))
}


const DEFAULTDATEINPUT: UserInput<Date> = { input: "", value: TBCS.none }


describe("Displaying inputs", () => {
    test("Any dateFrom input before parsing", pipe(
        () => shallow(
            <ReservationsInPeriod2Component
                state={{
                    fromUser: {
                        dateFrom: DATEFROMBEFOREPARSING,
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
            expect(wrapper.find("#date-from-input").props().value).toEqual("any valid input")
            expect(wrapper.find("#date-from-error").length).toEqual(0)
        })
    ))

    test("dateFrom input after being parsed", pipe(
        () => shallow(
            <ReservationsInPeriod2Component
                state={{
                    fromUser: {
                        dateFrom: VALIDDATEFROM,
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
            expect(wrapper.find("#date-from-input").props().value).toEqual("2021-3-20")
            expect(wrapper.find("#date-from-error").length).toEqual(0)
        })
    ))

    test("invalid dateFrom input after being parsed", pipe(
        () => shallow(
            <ReservationsInPeriod2Component
                state={{
                    fromUser: {
                        dateFrom: INVALIDDATEFROM,
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
            expect(wrapper.find("#date-from-input").props().value).toEqual(INVALIDDATEFROM.input)
            expect(wrapper.find("#date-from-error").length).toEqual(1)
        })
    ))
})



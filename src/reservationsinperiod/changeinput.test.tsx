import React from "react"
import { pipe } from "fp-ts/lib/function"
import Enzyme, { shallow } from 'enzyme'
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import { chain as ioChain } from "fp-ts/lib/IO"
import { io } from "fp-ts/lib/IO"
import { withEffectful } from "../functions"
import { ReservationsInPeriod2Component } from "./ReservationsInPeriod2Component"
import { UserInput } from "../types/userinput"
import * as TBCS from "../types/tbcs"
import * as tbca from "../types/tbca"
import * as actions from "./actions"

Enzyme.configure({ adapter: new Adapter() })


describe("Entering input into date-from-input", () => {

    type TestData = [Enzyme.ShallowWrapper, jest.FunctionLike]
    const dispatchMock = jest.fn()
    const dispatchFactory = (action: any) => () => { dispatchMock(action) }
    const DEFAULTDATEINPUT: UserInput<Date> = { input: "", value: TBCS.none }

    const wrapper = shallow(<
        ReservationsInPeriod2Component
        state={{
            fromUser: {
                dateFrom: DEFAULTDATEINPUT,
                dateTo: DEFAULTDATEINPUT
            },
            asnc: {
                reservations: tbca.none
            }
        }}
        getDispatch={dispatchFactory}
        fetchReservations={jest.fn()}
    />)

    const testData: TestData = [wrapper,
        dispatchMock
    ]

    test("should dispatch an action", pipe(
        io.of(testData),
        withEffectful(([wrapper, _]) => () => { wrapper.find("#date-from-input").simulate("change", { target: { value: "112233" } }) }),
        ioChain(([_, mock]) => () => {
            expect(mock).toBeCalledWith(actions.newDateFrom("112233"))
        })
    )
    )
})

describe("Entering input into date-to-input", () => {

    type TestData = [Enzyme.ShallowWrapper, jest.FunctionLike]
    const dispatchMock = jest.fn()
    const dispatchFactory = (action: any) => () => { dispatchMock(action) }
    const DEFAULTDATEINPUT: UserInput<Date> = { input: "", value: TBCS.none }

    const wrapper = shallow(<
        ReservationsInPeriod2Component
        state={{
            fromUser: {
                dateFrom: DEFAULTDATEINPUT,
                dateTo: DEFAULTDATEINPUT
            },
            asnc: {
                reservations: tbca.none
            }
        }}
        getDispatch={dispatchFactory}
        fetchReservations={jest.fn()}
    />)

    const testData: TestData = [wrapper,
        dispatchMock
    ]

    test("should dispatch an action", pipe(
        io.of(testData),
        withEffectful(([wrapper, _]) => () => { wrapper.find("#date-to-input").simulate("change", { target: { value: "112233" } }) }),
        ioChain(([_, mock]) => () => {
            expect(mock).toBeCalledWith(actions.newDateTo("112233"))
        })
    )
    )
})


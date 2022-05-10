import React from "react"
import { pipe } from "fp-ts/lib/function"
import Enzyme, { shallow } from 'enzyme'
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import { chain as ioChain } from "fp-ts/lib/IO"
import { io } from "fp-ts/lib/IO"
import { flushPromises, withEffectful } from "../functions"
import { ReservationsInPeriod2Component } from "./ReservationsInPeriod2Component"
import { UserInput } from "../types/userinput"
import * as TBCS from "../types/tbcs"
import * as FS from "../types/tbca"
import * as actions from "./actions"
import * as TE from "fp-ts/lib/TaskEither"

Enzyme.configure({ adapter: new Adapter() })



describe("Clicking fetch button", () => {

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
                reservations: FS.none
            }
        }}
        getDispatch={dispatchFactory}
        fetchReservations={({ dateFrom, dateTo }) => TE.right([])}
    />)

    const testData: TestData = [wrapper,
        dispatchMock
    ]

    test("should dispatch 2 parse actions", pipe(
        io.of(testData),
        withEffectful(([wrapper, _]) => () => { wrapper.find("#fetch-button").simulate("click") }),
        ioChain(([_, mock]) => () => {
            expect(mock).toBeCalledWith(actions.parseDateFrom())
            expect(mock).toBeCalledWith(actions.parseDateTo())
            expect(mock).toBeCalledWith(actions.checkInputs())
        })
    )
    )

    // REFACTOR: this test looks it doesn't belong here, it passes even without "click"
    test("should dispatch NewReservations action", async () => {
        const mock = jest.fn()
        const dispatchFactory = (action: any) => () => { mock(action) }
        const wrapper = shallow(<
            ReservationsInPeriod2Component
            state={{
                fromUser: {
                    dateFrom: DEFAULTDATEINPUT,
                    dateTo: DEFAULTDATEINPUT
                },
                asnc: {
                    reservations: FS.checkedInput({ dateFrom: new Date(1, 1, 2021), dateTo: new Date(2, 2, 2021) })
                }
            }}
            getDispatch={dispatchFactory}
            fetchReservations={({ dateFrom, dateTo }) => TE.right([])}
        />)
        wrapper.find("#fetch-button").simulate("click")
        await flushPromises()
        expect(mock).toBeCalledWith(actions.newReservations([]))
    }
    )

    test("should NOT dispatch NewReservations action", async () => {
        const mock = jest.fn()
        const dispatchFactory = (action: any) => () => { mock(action) }
        const wrapper = shallow(<
            ReservationsInPeriod2Component
            state={{
                fromUser: {
                    dateFrom: DEFAULTDATEINPUT,
                    dateTo: DEFAULTDATEINPUT
                },
                asnc: {
                    reservations: FS.none
                }
            }}
            getDispatch={dispatchFactory}
            fetchReservations={({ dateFrom, dateTo }) => TE.right([])}
        />)
        wrapper.find("#fetch-button").simulate("click")
        await flushPromises()
        expect(mock).not.toBeCalledWith(actions.newReservations([]))
    }
    )

    test("should NOT dispatch NewReservations action", async () => {
        const mock = jest.fn()
        const dispatchFactory = (action: any) => () => { mock(action) }
        const wrapper = shallow(<
            ReservationsInPeriod2Component
            state={{
                fromUser: {
                    dateFrom: DEFAULTDATEINPUT,
                    dateTo: DEFAULTDATEINPUT
                },
                asnc: {
                    reservations: FS.inputErrors(["input is invalid"])
                }
            }}
            getDispatch={dispatchFactory}
            fetchReservations={({ dateFrom, dateTo }) => TE.right([])}
        />)
        wrapper.find("#fetch-button").simulate("click")
        await flushPromises()
        expect(mock).not.toBeCalledWith(actions.newReservations([]))
    }
    )

    test("should dispatch NewServerError action", async () => {
        const mock = jest.fn()
        const dispatchFactory = (action: any) => () => { mock(action) }
        const wrapper = shallow(<
            ReservationsInPeriod2Component
            state={{
                fromUser: {
                    dateFrom: DEFAULTDATEINPUT,
                    dateTo: DEFAULTDATEINPUT
                },
                asnc: {
                    reservations: FS.checkedInput({ dateFrom: new Date(1, 1, 2021), dateTo: new Date(2, 2, 2021) })
                }
            }}
            getDispatch={dispatchFactory}
            fetchReservations={({ dateFrom, dateTo }) => TE.left(Error("some server error"))}
        />)
        wrapper.find("#fetch-button").simulate("click")
        await flushPromises()
        expect(mock).toBeCalledWith(actions.newServerError(Error("some server error")))
    }
    )

})

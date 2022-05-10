import React from "react"
import Enzyme, { shallow } from 'enzyme'
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import { YearReservationsCountComponent } from "./YearReservationsCountComponent"
import { right, toError } from "fp-ts/lib/Either"
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"
import * as TE from "fp-ts/lib/TaskEither"
import { task } from "fp-ts"
import { flushPromises } from "../functions"
import { pipe } from "fp-ts/lib/function"
import * as Tbcs from "../types/tbcs"
import * as Tbca from "../types/tbca"
import * as actions from "./actions"

Enzyme.configure({ adapter: new Adapter() })

describe("Pressing a key", () => {
    test("on enter should dispatch ParseYearInput and CheckInputs actions", () => {
        const mock = jest.fn()
        const wrapper = shallow(
            <YearReservationsCountComponent
                state={{
                    userInputs: {
                        year: {
                            input: "2021",
                            value: Tbcs.none
                        }
                    },
                    asyncStuffs: {
                        reservationsCount: Tbca.none
                    }
                }}
                fetchReservationsCount={(y) => TE.of(100)}
                getDispatch={(a) => () => { mock(a) }}
            />)
        wrapper.find("#year-input").simulate("keypress", { key: "Enter" })
        expect(mock).toBeCalledWith(actions.parseYearInput())
        expect(mock).toBeCalledWith(actions.checkInputs())
    })

    test("on any other should not dispatch ParseYearInput and CheckInputs actions", () => {
        const mock = jest.fn()
        const wrapper = shallow(
            <YearReservationsCountComponent
                state={{
                    userInputs: {
                        year: {
                            input: "2021",
                            value: Tbcs.none
                        }
                    },
                    asyncStuffs: {
                        reservationsCount: Tbca.none
                    }
                }}
                fetchReservationsCount={(y) => TE.of(100)}
                getDispatch={(a) => () => { mock(a) }}
            />)
        wrapper.find("#year-input").simulate("keypress", { key: "a" })
        expect(mock).not.toBeCalledWith(actions.parseYearInput())
        expect(mock).not.toBeCalledWith(actions.checkInputs())
    })

})

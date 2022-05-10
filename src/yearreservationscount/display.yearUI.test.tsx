import { pipe } from "fp-ts/lib/function"
import Enzyme, { shallow } from 'enzyme'
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import * as io from "fp-ts/lib/IO"
import { YearReservationsCountComponent } from "./YearReservationsCountComponent"
import * as Tbcs from "../types/tbcs"
import * as Tbca from "../types/tbca"
import { YearReservationsCount2 } from "./YearReservationsCountComponent"

Enzyme.configure({ adapter: new Adapter() })

describe("Displaying inputs in YearReservationsCountComponent", () => {
    test("Any year input, not yet parsed", pipe(
        {
            userInputs: {
                year: {
                    input: "2000",
                    value: Tbcs.none
                }
            },
            asyncStuffs: {
                reservationsCount: Tbca.none
            }

        },
        (state): [YearReservationsCount2, Enzyme.ShallowWrapper] => [state, shallow(
            <YearReservationsCountComponent
                state={state}
                fetchReservationsCount={jest.fn()}
                getDispatch={jest.fn()}
            />)],
        ([state, wrapper]) => () => {
            expect(wrapper.find("#year-input").props().value).toEqual(state.userInputs.year.input)
            expect(wrapper.find("#year-invalid-message").length).toEqual(0)
        })
    )

    test("Any year input, parsed and valid", pipe(
        {
            userInputs: {
                year: {
                    input: "2000",
                    value: Tbcs.stuff(2000)
                }
            },
            asyncStuffs: {
                reservationsCount: Tbca.none
            }

        },
        (state): [YearReservationsCount2, Enzyme.ShallowWrapper] => [state, shallow(
            <YearReservationsCountComponent
                state={state}
                fetchReservationsCount={jest.fn()}
                getDispatch={jest.fn()}
            />)],
        ([state, wrapper]) => () => {
            expect(wrapper.find("#year-input").props().value).toEqual(state.userInputs.year.input)
            expect(wrapper.find("#year-invalid-message").length).toEqual(0)
        })
    )

    test("Any year input, parsed and invalid", pipe(
        {
            userInputs: {
                year: {
                    input: "20xx00",
                    value: Tbcs.error(Error("Invalid input"))
                }
            },
            asyncStuffs: {
                reservationsCount: Tbca.none
            }

        },
        (state): [YearReservationsCount2, Enzyme.ShallowWrapper] => [state, shallow(
            <YearReservationsCountComponent
                state={state}
                fetchReservationsCount={jest.fn()}
                getDispatch={jest.fn()}
            />)],
        ([state, wrapper]) => () => {
            expect(wrapper.find("#year-input").props().value).toEqual(state.userInputs.year.input)
            expect(wrapper.find("#year-invalid-message").text()).toEqual("Invalid input")
        })
    )

})

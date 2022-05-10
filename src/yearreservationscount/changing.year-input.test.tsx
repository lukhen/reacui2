import React from "react"
import { pipe } from "fp-ts/lib/function"
import Enzyme, { shallow } from 'enzyme'
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import { chain as ioChain } from "fp-ts/lib/IO"
import * as io from "fp-ts/lib/IO"
import { withEffectful } from "../functions"
import { YearReservationsCountComponent } from "./YearReservationsCountComponent"
import * as Tbcs from "../types/tbcs"
import * as Tbca from "../types/tbca"
import * as actions from "./actions"

Enzyme.configure({ adapter: new Adapter() })

describe("Entering input into year-input", () => {

    type TestData = [Enzyme.ShallowWrapper, jest.FunctionLike]
    const dispatchMock = jest.fn()
    const dispatchFactory = (action: any) => () => { dispatchMock(action) }

    const wrapper = shallow(<YearReservationsCountComponent
        state={{
            userInputs: {
                year: {
                    input: "",
                    value: Tbcs.none
                }
            },
            asyncStuffs: {
                reservationsCount: Tbca.none
            }
        }}
        fetchReservationsCount={jest.fn()}
        getDispatch={dispatchFactory}
    />)

    const testData: TestData = [wrapper,
        dispatchMock
    ]

    test("should dispatch a NewYearInput action", pipe(
        io.of(testData),
        withEffectful(([wrapper, _]) => () => {
            wrapper.find("#year-input").simulate("change", { target: { value: "1" } })
        }),
        ioChain(([_, mock]) => () => {
            expect(mock).toBeCalledWith(actions.newYearInput("1"))
        })
    )
    )
})

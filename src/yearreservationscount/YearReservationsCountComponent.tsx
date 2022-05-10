import * as React from "react"
import { UserInput } from "../types/userinput"
import * as Tbcs from "../types/tbcs"
import * as Tbca from "../types/tbca"
import { pipe } from "fp-ts/lib/function"
import { InvalidInputComponent } from "../reservationsinperiod/InvalidInputComponent"
import * as TE from "fp-ts/lib/TaskEither"
import * as T from "fp-ts/lib/Task"
import { Job } from "../types/Job"
import * as actions from "./actions"
import { FetchingComponent } from "../reservationsinperiod/FetchingComponent"
import * as io from "fp-ts/lib/IO"
import { fold as foldKeys, KeyboardKey } from "../types/KeyboardKey"
import { connect } from "react-redux"

export interface YearReservationsCount2 {
    userInputs: {
        year: UserInput<number>
    },
    asyncStuffs: {
        reservationsCount: Tbca.TBCA<number, number>
    }

}

interface Props {
    state: YearReservationsCount2,
    fetchReservationsCount: (year: number) => TE.TaskEither<Error, number>
    getDispatch: (action: actions.ReservationsCountAction) => Job
}

export const YearReservationsCountComponent: React.FC<Props> = (props) => (
    <div>
        <input id="year-input"
            value={props.state.userInputs.year.input}
            onChange={(e) => { props.getDispatch(actions.newYearInput(e.target.value))() }}
            onKeyPress={(e) => pipe(
                e.key,
                foldKeys([
                    [key => key == "Enter",
                    pipe(
                        props.getDispatch(actions.parseYearInput()),
                        io.chain(() => props.getDispatch(actions.checkInputs()))
                    )]
                ],
                    () => { })
            )()}
        />

        {pipe(
            props.state.userInputs.year.value,
            Tbcs.fold(
                {
                    whenNone: () => <div />,
                    whenError: (e) => <div id="year-invalid-message">{e.message}</div>,
                    whenStuff: (s) => <div />
                }
            )
        )}

        {pipe(
            props.state.asyncStuffs.reservationsCount,
            Tbca.fold({
                whenNone: () => <div />,
                whenInputErrors: (errorMessages) => <InvalidInputComponent errorMessages={errorMessages} />,
                // SMELL: SRP violation
                whenCheckedInput: (checkedInput) => {
                    pipe(
                        props.fetchReservationsCount(checkedInput),
                        TE.fold(
                            (e) =>
                                T.of(
                                    props.getDispatch(
                                        actions.newAsyncError(e)
                                    )),
                            (reservationsCount) =>
                                T.of(
                                    props.getDispatch(
                                        actions.newReservationsCount(reservationsCount)
                                    )
                                )
                        )
                    )().then(
                        job => job()
                    )
                    return <FetchingComponent />
                },
                whenAsyncError: (e) => <div id="async-error-message">{e.message}</div>,
                whenStuff: (reservationsCount) => <div id="reservations-count">{reservationsCount}</div>
            })
        )}
    </div>
)

const mapStateToProps = (store: any) => {
    return {
        state: store.yearReservationsCount2
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        getDispatch: (action: any) => () => { dispatch(action) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(YearReservationsCountComponent)

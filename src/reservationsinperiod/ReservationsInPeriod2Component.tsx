import React from "react";
import { errorMsg } from "../types/userinput"
import { Reservation } from "../types/reservation"
import * as tbca from "../types/tbca"
import { ReservationsComponent } from "./ReservationsComponent";
import { FetchingComponent } from "./FetchingComponent"
import { Job } from "../types/Job"
import * as actions from "./actions"
import * as tbcs from "../types/tbcs"
import * as TE from "fp-ts/lib/TaskEither"
import * as T from "fp-ts/lib/Task"
import { InvalidInputComponent } from "./InvalidInputComponent"
import { ReservationsInPeriod2 } from "./ReservationsInPeriod2";
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import { connect } from "react-redux"

export interface Props {
    state: ReservationsInPeriod2
    getDispatch: (action: any) => Job
    // !!! change signature to input: {dateFrom, dateTo}
    fetchReservations: (dates: { dateFrom: Date, dateTo: Date })
        => TE.TaskEither<Error, Array<Reservation>>
}


export const ReservationsInPeriod2Component: React.FC<Props> = (props: Props) => {
    return <div>
        <input
            id="date-from-input"
            data-id="date-from-input"
            value={props.state.fromUser.dateFrom.input}
            onChange={(e) => { props.getDispatch(actions.newDateFrom(e.target.value))() }}
        />
        {O.fold(
            () => <div />,
            (errMsg: string) =>
                <div id="date-from-error">
                    {errMsg}
                </div>
        )(errorMsg(props.state.fromUser.dateFrom))}

        <input
            id="date-to-input"
            data-id="date-to-input"
            value={props.state.fromUser.dateTo.input}
            onChange={(e) => { props.getDispatch(actions.newDateTo(e.target.value))() }}
        />
        {O.fold(
            () => <div />,
            (errMsg: string) =>
                <div id="date-to-error">
                    {errMsg}
                </div>
        )(errorMsg(props.state.fromUser.dateTo))}
        <button id="fetch-button" data-id="fetch-button" onClick={(e) => {
            props.getDispatch(actions.parseDateFrom())()
            props.getDispatch(actions.parseDateTo())()
            props.getDispatch(actions.checkInputs())()
        }}>Fetch</button>
        {tbca.fold(
            {
                whenNone: () => <div></div>,
                whenInputErrors: (los) =>
                    <InvalidInputComponent errorMessages={los} />,
                whenCheckedInput: (chi: { dateFrom: Date, dateTo: Date }) => {
                    TE.fold(
                        (e: Error) => T.of(props.getDispatch(actions.newServerError(e))),
                        (r: Array<Reservation>) => T.of(props.getDispatch(actions.newReservations(r)))
                    )(props.fetchReservations(chi))().then(
                        job => job()
                    )
                    return <FetchingComponent />
                },
                whenAsyncError: (e) => <div id="reservations-error">{e.message}</div>,
                whenStuff: (reservations: Array<Reservation>) => <ReservationsComponent reservations={reservations} />
            }
        )(props.state.asnc.reservations)
        }

    </div>;
};


const mapStateToProps = (store: any) => {
    return {
        state: store.reservationsInPeriod
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        getDispatch: (action: any) => () => { dispatch(action) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReservationsInPeriod2Component)

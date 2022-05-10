import * as E from "fp-ts/lib/Either"
import { ActionTypes } from "../types/actions"
import { NewYearInputAction } from "../types/actions"
import * as actions from "./actions"
import { ReservationsInPeriod2 } from "./ReservationsInPeriod2"
import { Reducer } from "redux"
import { numberToEither, appendSome } from "../functions"
import * as tbcs from "../types/tbcs"
import * as tbca from "../types/tbca"
import { errorMsg, UserInput, notSetError, allStuff } from "../types/userinput"
import { Reservation } from "../types/reservation"
import { pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/lib/Option"
import { parseDate } from "../functions"
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray"
import { isEmpty } from "fp-ts/lib/Array"

export const reduceReservationsInPeriod: Reducer<ReservationsInPeriod2, actions.ReservationsInPeriodAction> =
    (reservationInPeriod =
        {
            fromUser: {
                dateFrom: { input: "", value: tbcs.none },
                dateTo: { input: "", value: tbcs.none }
            },
            asnc: {
                reservations: tbca.none
            }
        },
        action) => {

        return actions.fold({
            whenNewDateFrom: (a) => {
                return {
                    ...reservationInPeriod,
                    fromUser: {
                        ...reservationInPeriod.fromUser,
                        dateFrom: { input: a.dateInput, value: tbcs.none }
                    },
                    asnc: {
                        reservations: tbca.none
                    }
                }
            },
            whenNewDateTo: (a) => {
                return {
                    ...reservationInPeriod,
                    fromUser: {
                        ...reservationInPeriod.fromUser,
                        dateTo: { input: a.dateInput, value: tbcs.none }
                    },
                    asnc: {
                        reservations: tbca.none
                    }
                }
            },
            whenCheckInputs: (a) => {
                return {
                    ...reservationInPeriod,
                    asnc: {
                        reservations: E.fold(
                            (errors: NonEmptyArray<string>) => tbca.inputErrors(errors),
                            (inputs: { dateFrom: Date, dateTo: Date }) => tbca.checkedInput(inputs)
                        )(dateInputsToDates(reservationInPeriod.fromUser))
                    }
                }
            },
            whenNewReservations: (a) => {
                return {
                    ...reservationInPeriod,
                    asnc: {
                        reservations: tbca.stuff(a.reservations)
                    }
                }
            },
            whenNewServerError: (a) => {
                return {
                    ...reservationInPeriod,
                    asnc: {
                        reservations: tbca.asyncError(a.err)
                    }
                }
            },
            whenParseDateFrom: (a) => {
                return {
                    ...reservationInPeriod,
                    fromUser: {
                        ...reservationInPeriod.fromUser,
                        dateFrom: {
                            ...reservationInPeriod.fromUser.dateFrom,
                            value: E.fold(
                                (e: Error) => tbcs.error(e),
                                (d: Date) => tbcs.stuff(d)
                            )(parseDate(reservationInPeriod.fromUser.dateFrom.input))
                        }
                    }
                }
            },
            whenParseDateTo: (a) => {
                return {
                    ...reservationInPeriod,
                    fromUser: {
                        ...reservationInPeriod.fromUser,
                        dateTo: {
                            ...reservationInPeriod.fromUser.dateTo,
                            value: E.fold(
                                (e: Error) => tbcs.error(e),
                                (d: Date) => tbcs.stuff(d)
                            )(parseDate(reservationInPeriod.fromUser.dateTo.input))
                        }
                    }
                }
            },
            otherwise: () => reservationInPeriod
        })(action)
    }

/**
   Produce a list of error messages.
**/
export function findErrorsInDates(inputs: {
    dateFrom: UserInput<Date>,
    dateTo: UserInput<Date>
}): Array<string> {
    return pipe(
        [],
        appendSome(notSetError(inputs.dateFrom)),
        appendSome(notSetError(inputs.dateTo)),
        appendSome(errorMsg(inputs.dateFrom)),
        appendSome(errorMsg(inputs.dateTo)),
        O.fold(
            () => (arr: Array<string>) => arr,
            ([dF, dT]: Array<Date>) => appendSome(errordTolderThandF(dF, dT))
        )(allStuff([inputs.dateFrom, inputs.dateTo]))
    )
}
/**
   Produce an array of error messages if date inputs have errors,
   otherwise produce dates.
**/
export function dateInputsToDates(inputs: {
    dateFrom: UserInput<Date>,
    dateTo: UserInput<Date>
}): E.Either<NonEmptyArray<string>, { dateFrom: Date, dateTo: Date }> {
    return pipe(
        findErrorsInDates(inputs),
        errors => isEmpty(errors) ? E.right({
            dateFrom: (inputs.dateFrom.value as tbcs.Stuff<Date>).value,
            dateTo: (inputs.dateTo.value as tbcs.Stuff<Date>).value
        }) :
            E.left(errors as NonEmptyArray<string>)
    )
}

/**
   Produce an error message if stardDate >= endDate, otherwise produce none.
**/
function errordTolderThandF(startDate: Date, endDate: Date): O.Option<string> {
    return startDate < endDate ? O.none : O.some("Start date should be older than end date.")
}

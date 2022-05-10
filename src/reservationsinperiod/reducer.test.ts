import { reduceReservationsInPeriod, findErrorsInDates } from "./reducer"
import * as actions from "./actions"
import * as rip from "./ReservationsInPeriod2"
import * as tbcs from "../types/tbcs"
import * as tbca from "../types/tbca"
import * as Reservation from "../types/reservation"
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import { parseDate } from "../functions"
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray"
import { allStuff } from "../types/userinput"

describe("Reduce ReservationsInPeriod2", () => {
    test("on newDateFrom action", () => {
        expect(reduceReservationsInPeriod(rip.RIP1, actions.newDateFrom("112233")))
            .toEqual({
                ...rip.RIP1,
                fromUser: {
                    ...rip.RIP1.fromUser,
                    dateFrom: { input: "112233", value: tbcs.none }
                },
                asnc: {
                    reservations: tbca.none
                }
            })
    })

    test("on newDateTo action", () => {
        expect(reduceReservationsInPeriod(rip.RIP1, actions.newDateTo("irrelevant input")))
            .toEqual({
                ...rip.RIP1,
                fromUser: {
                    ...rip.RIP1.fromUser,
                    dateTo: { input: "irrelevant input", value: tbcs.none }
                },
                asnc: {
                    reservations: tbca.none
                }
            })
    })

    test("on checkInputs action", () => {
        const expected: rip.ReservationsInPeriod2 = {
            ...rip.EMPTY,
            asnc: {
                reservations: ((errors: Array<string>) => errors.length > 0 ?
                    tbca.inputErrors(errors as NonEmptyArray<string>) :
                    O.fold(
                        () => tbca.asyncError(Error("")),
                        ([dF, dT]: Array<Date>) => tbca.checkedInput({
                            dateFrom: dF,
                            dateTo: dT
                        })
                    )(allStuff([
                        rip.EMPTY.fromUser.dateFrom,
                        rip.EMPTY.fromUser.dateTo
                    ]))
                )(findErrorsInDates(rip.EMPTY.fromUser))
            }
        }

        expect(reduceReservationsInPeriod(rip.EMPTY, actions.checkInputs()))
            .toEqual(expected)
    })

    test("on newReservations action with an empty list of reservations", () => {
        const expected: rip.ReservationsInPeriod2 = {
            ...rip.EMPTY,
            asnc: {
                reservations: tbca.stuff([])
            }
        }

        expect(reduceReservationsInPeriod(rip.EMPTY, actions.newReservations([])))
            .toEqual(expected)
    })

    test("on newReservations action with a non-empty list of reservations", () => {
        const expected: rip.ReservationsInPeriod2 = {
            ...rip.EMPTY,
            asnc: {
                reservations: tbca.stuff([Reservation.dummy])
            }
        }

        expect(reduceReservationsInPeriod(rip.EMPTY, actions.newReservations([Reservation.dummy])))
            .toEqual(expected)
    })

    test("on newServerError action", () => {
        const expected: rip.ReservationsInPeriod2 = {
            ...rip.EMPTY,
            asnc: {
                reservations: tbca.asyncError(Error("Some server error message"))
            }
        }

        expect(reduceReservationsInPeriod(rip.EMPTY, actions.newServerError(Error("Some server error message"))))
            .toEqual(expected)
    })

    test("on ParseDateFrom  action", () => {

        const expected: rip.ReservationsInPeriod2 = {
            ...rip.EMPTY,
            fromUser: {
                ...rip.EMPTY.fromUser,
                dateFrom: {
                    ...rip.EMPTY.fromUser.dateFrom,
                    value: E.fold(
                        (e: Error) => tbcs.error(e),
                        (d: Date) => tbcs.stuff(d)
                    )(parseDate(rip.EMPTY.fromUser.dateFrom.input))
                }
            }
        }
        expect(reduceReservationsInPeriod(rip.EMPTY, actions.parseDateFrom()))
            .toEqual(expected)
    })

    test("on ParseDateTo  action", () => {

        const expected: rip.ReservationsInPeriod2 = {
            ...rip.EMPTY,
            fromUser: {
                ...rip.EMPTY.fromUser,
                dateTo: {
                    ...rip.EMPTY.fromUser.dateTo,
                    value: E.fold(
                        (e: Error) => tbcs.error(e),
                        (d: Date) => tbcs.stuff(d)
                    )(parseDate(rip.EMPTY.fromUser.dateTo.input))
                }
            }
        }
        expect(reduceReservationsInPeriod(rip.EMPTY, actions.parseDateTo()))
            .toEqual(expected)
    })

})


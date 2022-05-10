import React from 'react';
import YearReservationsCountComponent from "./yearreservationscount/YearReservationsCountComponent"
import { TaskEither, tryCatch, left } from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { toError, Either } from 'fp-ts/lib/Either';
import axios from "axios"
import RIPC from "./reservationsinperiod/ReservationsInPeriod2Component"
import { Reservation } from './types/reservation';


const getTE = (year: E.Either<Error, number>): TaskEither<Error, number> =>
    E.fold(
        (e: Error) => left(e),
        (n: number) => tryCatch(
            () => new Promise((resolve, reject) => {
                axios
                    .get(`${process.env.REACT_APP_RESERVATIONS_URL}/countreservations/${n}`)
                    .then(response => { resolve(response.data.reservation_count) })
                    .catch(e => { reject(e) })
            }),
            toError
        )
    )(year)


const fetchReservations = (dates: { dateFrom: Date, dateTo: Date }): TaskEither<Error, Array<Reservation>> =>
    tryCatch(
        () => new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([

                ])
            }, 1000)
        }),
        toError
    )

const fetchReservationsCount = (year: number): TaskEither<Error, number> =>
    tryCatch(
        () => new Promise((resolve, reject) => {
            axios
                .get(`${process.env.REACT_APP_RESERVATIONS_URL}/countreservations/${year}`)
                .then(response => { resolve(response.data.reservation_count) })
                .catch(e => { reject(e) })
        }),
        toError
    )

const ReceptionPage: React.FC = () => {
    return (
        <div >
            <YearReservationsCountComponent
                fetchReservationsCount={fetchReservationsCount}
            />
            <RIPC fetchReservations={fetchReservations} />
        </div>
    );
}

export default ReceptionPage;

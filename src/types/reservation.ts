import { ___ } from "./templates"

/**
Reservation of a room between dateFrom and dateTo
**/

export interface Reservation {
    dateFrom: Date;
    dateTo: Date;
    guest: string;
    room: string;
}

function fn_for_reservation<A>(r: Reservation): A {
    return ___<A>(
        r.dateFrom,
        r.dateTo,
        r.guest,
        r.room
    )
}

/**
   A dummy Reservation used mainly for tests.
**/
export const dummy: Reservation = {
    dateFrom: new Date(Date.parse("2021-1-1")),
    dateTo: new Date(Date.parse("2021-1-3")),
    guest: "Dummy Joe",
    room: "Dummy room"
}

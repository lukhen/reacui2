import { ActionTypes } from "../types/actions";
import { Reservation } from "../types/reservation";

export interface NewDateFrom {
    type: ActionTypes.NEWDATEFROM;
    dateInput: string;
}

export interface NewDateTo {
    type: ActionTypes.NEWDATETO;
    dateInput: string;
}


export interface ParseDateTo {
    type: ActionTypes.PARSEDATETO
}

export interface ParseDateFrom {
    type: ActionTypes.PARSEDATEFROM
}

export interface NewReservations {
    type: ActionTypes.NEWRESERVATIONS,
    reservations: Array<Reservation>
}

export interface NewServerError {
    type: ActionTypes.NEWSERVERERROR,
    err: Error
}

export interface CheckInputs {
    type: ActionTypes.CHECKINPUTS
}

export type ReservationsInPeriodAction = NewDateFrom | NewDateTo | ParseDateFrom |
    ParseDateTo | NewReservations | NewServerError | CheckInputs

export function fold<X>(handlers: {
    whenNewDateFrom: (a: NewDateFrom) => X,
    whenNewDateTo: (a: NewDateTo) => X,
    whenParseDateFrom: (a: ParseDateFrom) => X,
    whenParseDateTo: (a: ParseDateTo) => X,
    whenCheckInputs: (a: CheckInputs) => X,
    whenNewReservations: (a: NewReservations) => X,
    whenNewServerError: (a: NewServerError) => X,
    otherwise: () => X
}): (ripa: ReservationsInPeriodAction) => X {
    return ripa => {
        switch (ripa.type) {
            case ActionTypes.NEWDATEFROM: return handlers.whenNewDateFrom(ripa)
            case ActionTypes.NEWDATETO: return handlers.whenNewDateTo(ripa)
            case ActionTypes.PARSEDATEFROM: return handlers.whenParseDateFrom(ripa)
            case ActionTypes.PARSEDATETO: return handlers.whenParseDateTo(ripa)
            case ActionTypes.CHECKINPUTS: return handlers.whenCheckInputs(ripa)
            case ActionTypes.NEWRESERVATIONS: return handlers.whenNewReservations(ripa)
            case ActionTypes.NEWSERVERERROR: return handlers.whenNewServerError(ripa)
            default: return handlers.otherwise()
        }
    }
}

export function newDateFrom(dateInput: string): NewDateFrom {
    return { type: ActionTypes.NEWDATEFROM, dateInput: dateInput };
}

// Action creator
// Produce an action
export function newDateTo(dateInput: string): NewDateTo {
    return { type: ActionTypes.NEWDATETO, dateInput: dateInput }
}

export function parseDateFrom(): ParseDateFrom {
    return { type: ActionTypes.PARSEDATEFROM }
}

export function parseDateTo(): ParseDateTo {
    return { type: ActionTypes.PARSEDATETO }
}

export function newReservations(reservations: Array<Reservation>): NewReservations {
    return { type: ActionTypes.NEWRESERVATIONS, reservations: reservations }
}

export function newServerError(err: Error): NewServerError {
    return { type: ActionTypes.NEWSERVERERROR, err: err }
}

export function checkInputs(): CheckInputs {
    return { type: ActionTypes.CHECKINPUTS }
}

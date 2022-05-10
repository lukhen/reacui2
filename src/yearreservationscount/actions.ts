export enum ActionTypes {
    NEWRESERVATIONSCOUNT = "NEWRESERVATIONSCOUNT",
    NEWASYNCERROR = "NEWASYNCERROR",
    NEWYEARINPUT = "NEWYEARINPUT",
    PARSEYEARINPUT = "PARSEYEARINPUT",
    CHECKINPUTS = "CHECKINPUTS"
}

export interface NewReservationsCountAction {
    type: ActionTypes.NEWRESERVATIONSCOUNT,
    reservationsCount: number
}

export interface NewAsyncError {
    type: ActionTypes.NEWASYNCERROR,
    error: Error
}

export interface NewYearInput {
    type: ActionTypes.NEWYEARINPUT,
    yearInput: string
}

export interface ParseYearInput {
    type: ActionTypes.PARSEYEARINPUT,
}

export interface CheckInputs {
    type: ActionTypes.CHECKINPUTS,
}

export function newAsyncError(e: Error): NewAsyncError {
    return {
        type: ActionTypes.NEWASYNCERROR,
        error: e
    }
}

export function newYearInput(yearInput: string): NewYearInput {
    return {
        type: ActionTypes.NEWYEARINPUT,
        yearInput: yearInput
    }
}

export function newReservationsCount(reservationsCount: number): NewReservationsCountAction {
    return {
        type: ActionTypes.NEWRESERVATIONSCOUNT,
        reservationsCount: reservationsCount
    }
}

export function parseYearInput(): ParseYearInput {
    return {
        type: ActionTypes.PARSEYEARINPUT,
    }
}

export function checkInputs(): CheckInputs {
    return {
        type: ActionTypes.CHECKINPUTS,
    }
}

export type ReservationsCountAction = NewReservationsCountAction | NewAsyncError | NewYearInput | ParseYearInput | CheckInputs

export function fold<X>(handlers: {
    whenNewYearInput: (a: NewYearInput) => X,
    whenParseYearInput: (a: ParseYearInput) => X,
    whenCheckInputs: (a: CheckInputs) => X,
    whenNewReservationsCountAction: (a: NewReservationsCountAction) => X,
    whenNewAsyncError: (a: NewAsyncError) => X,
    otherwise: X
}): (a: ReservationsCountAction) => X {
    return a => {
        switch (a.type) {
            case ActionTypes.NEWYEARINPUT: return handlers.whenNewYearInput(a)
            case ActionTypes.PARSEYEARINPUT: return handlers.whenParseYearInput(a)
            case ActionTypes.CHECKINPUTS: return handlers.whenCheckInputs(a)
            case ActionTypes.NEWRESERVATIONSCOUNT: return handlers.whenNewReservationsCountAction(a)
            case ActionTypes.NEWASYNCERROR: return handlers.whenNewAsyncError(a)
            default: return handlers.otherwise
        }
    }
}

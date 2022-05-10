import { UserInput } from "../types/userinput"
import { Reservation, dummy } from "../types/reservation";
import { ___ } from "../utils"
import { fn_for_UserInput3 } from "../types/userinput"
import * as tbca from "../types/tbca"
import * as tbcs from "../types/tbcs"

/**
   interp. ReservationsInPeriod2 is an array of reservations between dateFrom and dateTo
 **/
export interface ReservationsInPeriod2 {
    fromUser: {
        dateFrom: UserInput<Date>;
        dateTo: UserInput<Date>;
    };
    asnc: {
        reservations: tbca.TBCA<{ dateFrom: Date, dateTo: Date }, Array<Reservation>>;
    };
}

//examples:
export const EMPTY: ReservationsInPeriod2 = {
    fromUser: {
        dateFrom: { input: "", value: tbcs.none },
        dateTo: { input: "", value: tbcs.none }
    },
    asnc: {
        reservations: tbca.none
    }
}

export const RIP1: ReservationsInPeriod2 = {
    fromUser: {
        dateFrom: { input: "1-1-2000", value: tbcs.stuff(new Date(1, 1, 2021)) },
        dateTo: { input: "2-2-2000", value: tbcs.stuff(new Date(2, 2, 2021)) }
    },
    asnc: {
        reservations: tbca.stuff([dummy])
    }
}


function fn_for_ReservationsInPeriod<X>(rip: ReservationsInPeriod2): X {
    return ___<X>(
        fn_for_UserInput3(rip.fromUser.dateFrom),
        fn_for_UserInput3(rip.fromUser.dateTo),
        tbca.fold({
            whenAsyncError: (e) => ___(e),
            whenCheckedInput: (chi) => ___(chi),
            whenInputErrors: (los) => ___(los),
            whenNone: () => ___(),
            whenStuff: (reservations) => ___(reservations)
        })(rip.asnc.reservations))
}

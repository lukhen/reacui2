import React from "react";
import { Reservation } from "../types/reservation"


interface Props {
    reservations: Array<Reservation>
}

export const ReservationsComponent: React.FC<Props> = (props: Props) => {
    return <div id="reservation-list" data-id="reservation-list">Reservations</div>;
};

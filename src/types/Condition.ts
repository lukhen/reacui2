import { ___ } from "./templates";

export type Condition<A> = [boolean, A];

export function fn_for_Condition<A>(c: Condition<unknown>) {
    if (c[0])
        ___<A>(c[1]);

    else
        ___<A>(c[1]);
}

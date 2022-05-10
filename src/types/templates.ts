import either, { Either } from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import * as t from "fp-ts/lib/Task";
import * as te from "fp-ts/lib/TaskEither";
import * as io from "fp-ts/lib/IO";


export function ___<B>(...a: any): B {
    const f: (x: any) => B = x => x
    return f(a)
}

export function fn_for_either<A>(e: Either<Error, unknown>): A {
    return either.fold(
        e => ___<A>(e),
        a => ___<A>(a)
    )(e);
}

export function fn_for_option<A>(o: O.Option<unknown>): A {
    return O.fold(
        () => ___<A>(),
        s => ___<A>(s)
    )(o);
}


export function fn_for_task_either<A>(x: te.TaskEither<unknown, unknown>): t.Task<A> {
    return te.fold(
        e => t.of(___<A>(e)),
        a => t.of(___<A>(a))
    )(x);
}


export function fn_for_io<A>(i: io.IO<unknown>): A {
    return ___<A>(i);
}


import { chain as ioChain, map as ioMap } from "fp-ts/lib/IO"
import { IO } from "fp-ts/lib/IO"
import { Either, right, left } from "fp-ts/lib/Either"
import { task } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import * as io from "fp-ts/lib/IO"
import * as t from "fp-ts/lib/Task"
import * as te from "fp-ts/lib/TaskEither"
import { Craft } from "./types/Craft"
import { TaskJob } from "./types/TaskJob"
import { KeyboardKey } from "./types/KeyboardKey"
import { Condition } from "./types/Condition"
import * as A from "fp-ts/Array";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either"

export const flushPromises = () => new Promise((foo) => { setTimeout(foo, 0) })

export function log<A>(x: A): IO<void> {
    return () => { console.log(x) }
}

export function withEffectful<A, B>(x: (a: A) => IO<B>): (action: IO<A>) => IO<A> {
    return action => ioChain((a: A) => ioMap(() => a)(x(a)))(action)
}

export const numberToEither = (n: number, errMsg: string): Either<Error, number> =>
    isNaN(n) ? left(Error(errMsg)) : right(n)


export type CondIO = [boolean, io.IO<void>]

export const foldTrueIOs: (conds: CondIO[]) => io.IO<void> = conds => pipe(
    conds
        .filter(c => c[0])
        .map(([_, action]) => action),
    io.sequenceArray
)

export type CondTask = [boolean, task.Task<io.IO<void>>]

export const foldTrueTasks: (conds: CondTask[]) => task.Task<io.IO<void>> = conds => pipe(
    conds
        .filter(cond => cond[0])
        .map(([_, action]) => action),
    task.sequenceSeqArray,
    task.map(io.sequenceArray)
)

function ___<B>(...a: any): B {
    const f: (x: any) => B = x => x
    return f(a)
}

export function fn_for_Condition<A>(c: Condition<unknown>): A {
    if (c[0])
        return ___<A>(c[1])
    else
        return ___<A>(c[1])
}

export function cond<A>(conditons: Condition<A>[], otherwise: A): A {
    return pipe(
        conditons
            .filter(c => c[0])
            .map(([_, a]) => a),
        (ar: Array<A>) => ar.concat([otherwise]),
        (ar: Array<A>) => ar[0]
    )
}

export const emptyTaskJob: TaskJob =
    t.of(() => { })

export const getTaskJob = <A>(
    taskEither: te.TaskEither<Error, A>,
    onRight: Craft<A>,
    onLeft: Craft<Error>): TaskJob => {
    return te.fold(
        (e: Error) => t.of(onLeft(e)),
        (a: A) => t.of(onRight(a))
    )(taskEither)
}

export const getOnKeyTaskJob = <A>(
    key: KeyboardKey,
    taskEither: te.TaskEither<Error, A>,
    onRight: Craft<A>,
    onLeft: Craft<Error>): TaskJob =>
    cond<TaskJob>(
        [
            [key === "Enter", functions.getTaskJob(taskEither, onRight, onLeft)],
        ],
        emptyTaskJob
    )

const functions = {
    getTaskJob,
    getOnKeyTaskJob
}
export default functions

/**
   Produce a new array with s added if s is not none, otherwise return the same array.
**/
export function appendSome<A>(o: O.Option<A>): (as: Array<A>) => Array<A> {
    return O.fold(
        () => (as: Array<A>) => as,
        (a: A) => A.append(a)
    )(o);
}

/**
   Produce a right(Date) if s can be parsed into a Date, otherwise produce left(Error)
**/
export function parseDate(s: string): E.Either<Error, Date> {
    function validDateString(s: string): E.Either<Error, string> {
        return /^\d\d\d\d-\d+-\d+$/.test(s) ? E.right(s) : E.left(Error("Invalid string format"))
    }

    function parseValidDateString(s: string): E.Either<Error, Date> {
        return pipe(
            s.split("-"),
            xs => xs.map(s => +s),
            (x: number[]) => new Date(Date.UTC(x[0], x[1] - 1, x[2])),
            n => isNaN(n.getDate()) ? E.left(Error("Invalid date")) : E.right(n)
        )
    }

    return pipe(
        s,
        validDateString,
        E.chain(parseValidDateString)
    )
}

/**
   Produce Some<Array<any>> from Array<Option<any>> if all elements are Some,
   otherwise produce None
 **/
export function allSomes(a: Array<O.Option<any>>): O.Option<Array<any>> {
    return pipe(
        a,
        A.map(el => O.isSome(el) ? el.value : el),
        A.filter(el => O.isNone(el) ? false : true),
        els => els.length == a.length ? O.some(els) : O.none
    );
}

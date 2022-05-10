import { task } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import { foldTrueIOs, foldTrueTasks, flushPromises } from "./functions"

describe("", () => {

    const mock1 = jest.fn()
    const mock2 = jest.fn()
    const mock3 = jest.fn()
    const mock4 = jest.fn()

    test("1 true", pipe(
        [[true, () => mock1()]],
        foldTrueIOs,
        (func) => () => {
            func()
            expect(mock1).toBeCalledTimes(1)
        }
    ))

    test("1 true", pipe(
        [[false, () => mock2()]],
        foldTrueIOs,
        (func) => () => {
            func()
            expect(mock2).toBeCalledTimes(0)
        }
    ))

    test("2 true, false", pipe(
        [[true, () => { mock3() }], [false, () => { mock4() }]],
        foldTrueIOs,
        (func) => () => {
            func()
            expect(mock3).toBeCalledTimes(1)
            expect(mock4).toBeCalledTimes(0)
        }
    ))

    test("5: true, false, true, true, false", async () => {
        const mocka = jest.fn()
        const mockb = jest.fn()
        const mockc = jest.fn()
        const mockd = jest.fn()
        const mocke = jest.fn()



        foldTrueTasks([
            [true, task.of(() => { mocka() })],
            [false, task.of(() => { mockb() })],
            [true, task.of(() => { mockc() })],
            [true, task.of(() => { mockd() })],
            [false, task.of(() => { mocke() })]])().then(
                f => f())
        await flushPromises()
        expect(mocka).toBeCalledTimes(1)
        expect(mockb).toBeCalledTimes(0)
        expect(mockc).toBeCalledTimes(1)
        expect(mockd).toBeCalledTimes(1)
        expect(mocke).toBeCalledTimes(0)
    })
})

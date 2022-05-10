import * as te from "fp-ts/lib/TaskEither"
import { emptyTaskJob, getTaskJob } from "./functions"
import functions from "./functions"
import * as t from "fp-ts/lib/Task"

describe("getOnKeyTaskJob", () => {
    test("should return getTaskJob when enter pressed ", () => {
        const irrelevantTE = te.right(100)
        const irrelevantOnRight = jest.fn()
        const irrelevantOnLeft = jest.fn()
        const expectedTaskJob = t.of(() => { })

        // make sure getTaskJob returns expectedTaskJob when called with
        // irrelevantTE, irrelevantOnRight and irrelevantOnLeft
        jest.spyOn(functions, "getTaskJob").mockImplementation(
            (taskEither, onRight, onLeft) => {
                if ((taskEither === irrelevantTE)
                    && (onRight === irrelevantOnRight)
                    && (onLeft === irrelevantOnLeft)) {
                    return expectedTaskJob
                }
                else
                    return t.of(() => { })
            })

        expect(functions.getOnKeyTaskJob("Enter", irrelevantTE, irrelevantOnRight, irrelevantOnLeft))
            .toStrictEqual(functions.getTaskJob(irrelevantTE, irrelevantOnRight, irrelevantOnLeft))
    })

    test("should return emptyTaskJob when other key pressed ", () => {
        const irrelevantTE = te.right(100)
        const irrelevantOnRight = jest.fn().mockReturnValue(() => { })
        const irrelevantOnLeft = jest.fn().mockReturnValue(() => { })

        expect(functions.getOnKeyTaskJob("p", irrelevantTE, irrelevantOnRight, irrelevantOnLeft))
            .toStrictEqual(emptyTaskJob)
    })
})

describe("getTaskJob", () => {
    test("on success", async () => {
        const successfulTE = te.right(100)
        const expectedJob = () => { }
        const onRightMock = jest.fn().mockReturnValue(expectedJob)
        const onLeftMock = jest.fn()

        const job = await getTaskJob(successfulTE, onRightMock, onLeftMock)()
        expect(job).toStrictEqual(expectedJob)
    })

    test("on failure", async () => {
        const failinglTE = te.left(Error("Fetch failed"))
        const expectedJob = () => { }
        const onRightMock = jest.fn()
        const onLeftMock = jest.fn().mockReturnValue(expectedJob)

        const job = await getTaskJob(failinglTE, onRightMock, onLeftMock)()
        expect(job).toStrictEqual(expectedJob)
    })

})



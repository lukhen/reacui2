import { fold } from "./KeyboardKey"

describe("Folding KeyboardKey", () => {
    test("should return value on Enter key", () => {
        expect(fold([
            [(key) => key == "Enter", "some value on enter"],
        ], "other value")("Enter")).toEqual("some value on enter")
    })

    test("should return value on w key", () => {
        expect(fold([
            [(key) => key == "w", "some value on w"],
        ], "other value")("w")).toEqual("some value on w")
    })

    test("should return other on x key", () => {
        expect(fold([
            [(key) => key == "d", "some value on d"],
        ], "other value")("x")).toEqual("other value")
    })


})

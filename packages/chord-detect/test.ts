import { detect } from "./index";

describe("@tonal/chord-detect", () => {
  test("detect", () => {
    expect(detect(["D", "F#", "A", "C"])).toEqual(["D7"]);
    expect(detect(["F#", "A", "C", "D"])).toEqual(["D7/F#"]);
    expect(detect(["A", "C", "D", "F#"])).toEqual(["D7/A"]);
    expect(detect(["E", "G#", "B", "C#"])).toEqual(["E6", "C#m7/E"]);
  });

  test("(regression) detect aug", () => {
    expect(detect(["C", "E", "G#"])).toEqual(["Caug", "Eaug/C", "G#aug/C"]);
  });

  test("edge cases", () => {
    expect(detect([])).toEqual([]);
  });
});

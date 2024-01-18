import { exportObjectArrowFunction } from "../playground";
import { describe, test, expect } from "vitest";

describe("index", () => {
  test("should pass", () => {
    expect(exportObjectArrowFunction()).toBe("bar");
  });
});

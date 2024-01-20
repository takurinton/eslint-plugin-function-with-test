import { exportObjectNamedFunction } from "..";
import { describe, test, expect } from "vitest";

describe("index", () => {
  test("should pass", () => {
    expect(exportObjectNamedFunction()).toBe("hoge");
  });
});

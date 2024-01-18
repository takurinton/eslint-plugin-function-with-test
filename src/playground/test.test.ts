import { test, describe, expect } from "vitest";
import { exportObjectNamedFunction } from "./playground";

describe("index", () => {
  test("should pass", () => {
    expect(exportObjectNamedFunction()).toBe("hoge");
  });
});

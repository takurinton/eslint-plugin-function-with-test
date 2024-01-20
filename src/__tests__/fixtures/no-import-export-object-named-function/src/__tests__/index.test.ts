import {
  exportObjectArrowFunction,
  exportNamedFunction,
  exportArrowFunction,
} from "..";
import { describe, test, expect } from "vitest";

describe("index", () => {
  test("should pass", () => {
    expect(exportObjectArrowFunction()).toBe("bar");
  });

  test("should pass", () => {
    expect(exportNamedFunction()).toBe("hoge");
  });

  test("should pass", () => {
    expect(exportArrowFunction()).toBe("bar");
  });
});

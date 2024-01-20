import {
  exportObjectNamedFunction,
  exportNamedFunction,
  exportArrowFunction,
} from "..";
import { describe, test, expect } from "vitest";

describe("index", () => {
  test("should pass", () => {
    expect(exportObjectNamedFunction()).toBe("hoge");
  });

  test("should pass", () => {
    expect(exportNamedFunction()).toBe("hoge");
  });

  test("should pass", () => {
    expect(exportArrowFunction()).toBe("bar");
  });
});

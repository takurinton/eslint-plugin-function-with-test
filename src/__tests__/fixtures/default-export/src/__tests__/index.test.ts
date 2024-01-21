import defaultExportFunction from "..";

import { describe, test, expect } from "vitest";

describe("index", () => {
  test("should pass", () => {
    expect(defaultExportFunction()).toBe("hoge");
  });
});

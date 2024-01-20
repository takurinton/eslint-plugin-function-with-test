import { describe, it, expect } from "vitest";
import { getTester } from "../testRunner";

const tester = getTester("__tests__/fixtures/ignore-comment");

describe("function-with-test", () => {
  it("should pass", async () => {
    const result = await tester.lint("src/index.ts");
    expect(result).toEqual([]);
  });
});

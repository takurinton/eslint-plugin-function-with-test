import { describe, it, expect } from "vitest";
import { getTester } from "../testRunner";

const tester = getTester("__tests__/fixtures/basic");

describe("function-with-test", () => {
  it("should pass", async () => {
    const result = await tester.lint("src/index.ts");
    expect(result).toEqual([]);
  });
});

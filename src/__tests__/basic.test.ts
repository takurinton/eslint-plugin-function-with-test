import { describe, it, expect } from "vitest";
import { getTester } from "../testRunner";

const tester = getTester();

describe("function-with-test", () => {
  it("should pass", async () => {
    const result = await tester.lint("src/basic/index.ts");
    expect(result).toEqual([]);
  });
});

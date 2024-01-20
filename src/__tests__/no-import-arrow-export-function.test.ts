import { describe, it, expect } from "vitest";
import { getTester } from "../testRunner";

const tester = getTester("__tests__/fixtures/no-import-arrow-export-function");

describe("function-with-test", () => {
  it("should 1 error", async () => {
    const result = await tester.lint("src/index.ts");
    expect(result).toMatchInlineSnapshot(`
        Array [
            Object {
            "column": 1,
            "line": 1,
            "message": "関数にテストを必ず書いてください",
            "path": "src/no-import-arrow-export-function/__tests__/index.test.ts",
            "ruleId": "no-import-arrow-export-function",
            "severity": 2,
            },
        ]
        `);
  });
});

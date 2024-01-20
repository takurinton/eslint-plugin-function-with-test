import { describe, it, expect } from "vitest";
import { getTester } from "../testRunner";

const tester = getTester("__tests__/fixtures/no-import-export-arrow-function");

describe("function-with-test", () => {
  it("should 1 error", async () => {
    const result = await tester.lint("src/index.ts");
    expect(result).toHaveLength(1);
    expect(result).toMatchInlineSnapshot(`
[
  {
    "column": 1,
    "endColumn": 48,
    "endLine": 5,
    "line": 5,
    "message": "関数にテストを必ず書いてください",
    "messageId": "test_required",
    "nodeType": "ExportNamedDeclaration",
    "ruleId": "function-with-test/require-test",
    "severity": 2,
  },
]`);
  });
});

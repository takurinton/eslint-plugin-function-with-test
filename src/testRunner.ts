import * as parser from "@typescript-eslint/parser";
import { TSESLint } from "@typescript-eslint/utils";
import { readFile } from "fs/promises";
import path from "path";
import { Program } from "typescript";
import { requireTest } from "./rules";

class Tester {
  root: string;
  linter: TSESLint.Linter;
  program: Program;

  constructor(root: string) {
    this.root = root;
    this.linter = new TSESLint.Linter({
      cwd: this.root,
    });
    this.program = parser.createProgram("./tsconfig.json", root);
    this.linter.defineParser("@typescript-eslint/parser", parser);
    this.linter.defineRule("function-with-test/require-test", requireTest);
  }

  async lint(filePath: string) {
    const filename = path.join(this.root, filePath);
    const code = await readFile(filename, {
      encoding: "utf8",
    });

    return this.linter.verify(
      code,
      {
        parser: "@typescript-eslint/parser",
        parserOptions: {
          ecmaVersion: 2022,
          tsconfigRootDir: this.root,
          project: "./tsconfig.json",
          sourceType: "module",
          program: this.program,
        },
        rules: {
          "function-with-test/require-test": "error",
        },
      },
      {
        filename,
      }
    );
  }
}

export const getTester = (rootPath?: string) => {
  const root = path.resolve(__dirname, rootPath ?? "__tests__/fixtures");
  console.log(root);
  return new Tester(root);
};

import { TSESLint } from "@typescript-eslint/experimental-utils";
import { Errors } from "./types";
import { messages } from "./messages";
import fs from "fs";

/**
 * プロジェクトの全てのテストファイルの名前を取得する
 */
const getTestFileNames = () =>
  fs.readdirSync(".").filter((fileName) => fileName.match(/\.test\.ts$/));

/**
 * @description export されている全ての関数にテストを必ず書くようにするためのルール
 *
 * @memo テストが書かれているかどうかの確認方法は、.test.ts という拡張子の中で FunctionDeclaration の名前と一致するものがあるかどうかで判断する
 *
 * @todo テストが書いてなかったらエラーを出す
 * @todo test-ignore コメントがあったら無視する
 */
export const requireTest: TSESLint.RuleModule<Errors, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "関数にテストを必ず書いてください",
      category: "Best Practices",
      recommended: "error",
      url: "",
    },
    fixable: "code",
    schema: [],
    messages,
  },
  create(context) {
    return {
      ExportNamedDeclaration(node) {
        const { specifiers } = node;
        // export { foo, bar } の形式
        if (specifiers.length > 0) {
          for (const specifier of specifiers) {
            const exportedName = specifier.exported.name;
            const variable = context
              .getScope()
              .variables.find((v) => v.name === exportedName);

            if (variable) {
              for (const def of variable.defs) {
                /**
                 * export されてる関数を取得
                 * function foo() {} の形式は FunctionName で取得可能
                 * const foo = () => {} の形式は Variable で取得可能、init に ArrowFunctionExpression が入っているのでそれを確認する
                 * 補足) Variable だと変数も一緒に取れてしまうので、区別する必要がある
                 */
                if (
                  def.type === "FunctionName" ||
                  (def.type === "Variable" &&
                    def.node.init?.type === "ArrowFunctionExpression")
                ) {
                  // TODO: 実装
                  // console.log(`${exportedName} is a function`);
                }
              }
            }
          }
        }

        const { declaration } = node;
        // function 宣言
        if (declaration?.type === "FunctionDeclaration") {
          // console.log(declaration);
        }

        // arrow function
        if (
          declaration?.type === "VariableDeclaration" &&
          declaration.declarations.length > 0 &&
          declaration.declarations[0].init?.type ===
            "ArrowFunctionExpression" &&
          declaration.declarations[0].id.type === "Identifier"
        ) {
          console.log(declaration.declarations[0].id.name);
        }
      },
      // ExportDefaultDeclaration(node) {}
      // ExportAllDeclaration(node) {}
    };
  },
};

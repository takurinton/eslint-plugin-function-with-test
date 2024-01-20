import { TSESLint } from "@typescript-eslint/utils";
import { Errors } from "./types";
import { messages } from "./messages";
import { getIsImported, getTestFileNames, isIgnoreTest } from "./utils";

/**
 * @description export されている全ての関数にテストを必ず書くようにするためのルール
 *
 * @memo テストが書かれているかどうかの確認方法は、.test.ts という拡張子の中で FunctionDeclaration の名前と一致するものがあるかどうかで判断する
 *
 * @todo test-ignore コメントがあったら無視する
 */
export const requireTest: TSESLint.RuleModule<Errors, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "関数にテストを必ず書いてください",
      recommended: "recommended",
      url: "",
    },
    schema: [],
    messages,
  },
  defaultOptions: [],
  create(context) {
    const { cwd } = context;
    const testFileNames = getTestFileNames(cwd);

    return {
      ExportNamedDeclaration(node) {
        const { filename } = context;
        const { specifiers } = node;

        // export { foo, bar } の形式での export がされてるときに specifiers から
        // export と import を取得し、マッチしていたらそれはテストが書かれているものと
        // して扱う
        if (specifiers.length > 0) {
          for (const specifier of specifiers) {
            const node = specifier.exported;
            const comments = context.sourceCode.getCommentsBefore(node);
            const ignore = isIgnoreTest(comments);
            if (ignore) {
              return;
            }

            // 関数名を取得
            const exportedName = specifier.exported.name;

            // 関数名に一致する variable を取得
            const variable = context.sourceCode
              .getScope?.(node)
              .variables.find((v) => v.name === exportedName);

            let isImported = false;

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
                  isImported = getIsImported(
                    exportedName,
                    testFileNames!,
                    filename
                  );
                }
              }

              // 全てのテストファイルを見て、import されていなかったらエラーを出す
              if (!isImported) {
                context.report({
                  node,
                  messageId: "test_required",
                });
              }
            }
          }
        }

        const { declaration } = node;
        // function 宣言
        if (declaration?.type === "FunctionDeclaration") {
          const comments = context.sourceCode.getCommentsBefore(node);
          const ignore = isIgnoreTest(comments);
          if (ignore) {
            return;
          }

          const functionName = declaration?.id?.name;

          const isImported = getIsImported(
            functionName!,
            testFileNames!,
            filename
          );

          if (!isImported) {
            context.report({
              node,
              messageId: "test_required",
            });
          }
        }

        // arrow function
        if (
          declaration?.type === "VariableDeclaration" &&
          declaration.declarations.length > 0 &&
          declaration.declarations[0].init?.type ===
            "ArrowFunctionExpression" &&
          declaration.declarations[0].id.type === "Identifier"
        ) {
          const comments = context.sourceCode.getCommentsBefore(node);
          const ignore = isIgnoreTest(comments);
          if (ignore) {
            return;
          }

          const functionName = declaration.declarations[0].id.name;

          const isImported = getIsImported(
            functionName,
            testFileNames!,
            filename
          );

          if (!isImported) {
            context.report({
              node,
              messageId: "test_required",
            });
          }
        }
      },
      // ExportDefaultDeclaration(node) {}
      // ExportAllDeclaration(node) {}
    };
  },
};

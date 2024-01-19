import { TSESLint } from "@typescript-eslint/experimental-utils";
import { Errors } from "./types";
import { messages } from "./messages";
import {
  getFilePath,
  getImportDeclarationFromFilePath,
  getRelativePath,
  getTestFileNames,
  isNodeModulesImport,
} from "./utils";

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
    const testFileNames = getTestFileNames(process.cwd());

    return {
      ExportNamedDeclaration(node) {
        const filename = context.getFilename();
        const { specifiers } = node;

        // export { foo, bar } の形式での export がされてるときに specifiers から
        // export と import を取得し、マッチしていたらそれはテストが書かれているものと
        // して扱う
        if (specifiers.length > 0) {
          for (const specifier of specifiers) {
            // 関数名を取得
            const exportedName = specifier.exported.name;
            // 関数名に一致する variable を取得
            const variable = context
              .getScope()
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
                  const functionName = exportedName;
                  for (const testFileName of testFileNames!) {
                    const importDeclarations =
                      getImportDeclarationFromFilePath(testFileName);

                    // 今の node の関数（functionName）が import されているかどうかを確認する
                    // import されているかどうかの基準は
                    // - import されているファイルのパスが一致しているかどうか
                    // - import している関数名が一致しているかどうか
                    for (const importDeclaration of importDeclarations) {
                      if (importDeclaration.type !== "ImportDeclaration") {
                        return;
                      }

                      const { source, specifiers } = importDeclaration;
                      if (isNodeModulesImport(source.value)) {
                        continue;
                      }

                      const relativePath = getRelativePath(
                        testFileName,
                        filename
                      );

                      // テストファイルのパスから、import しているファイルのパスを取得する
                      // ./foo/bar/index.ts => ./foo/bar に変換している
                      const filePath = getFilePath(relativePath);

                      // import する値を取得
                      // MEMO: source.value と source.raw の違い調べる
                      const { value } = source;

                      // path が違ったら return
                      if (value !== filePath) {
                        continue;
                      }

                      // import をしているファイルの中に、今の node の関数が import されているかどうかを確認する
                      for (const specifier of specifiers) {
                        if (specifier.type !== "ImportSpecifier") {
                          return;
                        }

                        const { imported } = specifier;

                        // 関数名が同じだったら、import されているということなので、isImported を true にする
                        // 複数ファイルに分散してる可能性や、同じファイル内で import されている可能性もあるので、return はしない
                        if (imported.name === functionName) {
                          isImported = true;
                        }
                      }
                    }
                  }
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
          let isImported = false;
          const functionName = declaration?.id?.name;

          for (const testFileName of testFileNames!) {
            const importDeclarations =
              getImportDeclarationFromFilePath(testFileName);

            // 今の node の関数（functionName）が import されているかどうかを確認する
            // import されているかどうかの基準は
            // - import されているファイルのパスが一致しているかどうか
            // - import している関数名が一致しているかどうか
            for (const importDeclaration of importDeclarations) {
              if (importDeclaration.type !== "ImportDeclaration") {
                return;
              }

              const { source, specifiers } = importDeclaration;
              if (isNodeModulesImport(source.value)) {
                continue;
              }

              const relativePath = getRelativePath(testFileName, filename);

              // テストファイルのパスから、import しているファイルのパスを取得する
              // ./foo/bar/index.ts => ./foo/bar に変換している
              const filePath = getFilePath(relativePath);

              // import する値を取得
              // MEMO: source.value と source.raw の違い調べる
              const { value } = source;

              // path が違ったら return
              if (value !== filePath) {
                continue;
              }

              // import をしているファイルの中に、今の node の関数が import されているかどうかを確認する
              for (const specifier of specifiers) {
                if (specifier.type !== "ImportSpecifier") {
                  return;
                }

                const { imported } = specifier;

                // 関数名が同じだったら、import されているということなので、isImported を true にする
                // 複数ファイルに分散してる可能性や、同じファイル内で import されている可能性もあるので、return はしない
                if (imported.name === functionName) {
                  isImported = true;
                }
              }
            }
          }

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
          let isImported = false;
          const functionName = declaration.declarations[0].id.name;

          for (const testFileName of testFileNames!) {
            const importDeclarations =
              getImportDeclarationFromFilePath(testFileName);

            // 今の node の関数（functionName）が import されているかどうかを確認する
            // import されているかどうかの基準は
            // - import されているファイルのパスが一致しているかどうか
            // - import している関数名が一致しているかどうか
            for (const importDeclaration of importDeclarations) {
              if (importDeclaration.type !== "ImportDeclaration") {
                return;
              }

              const { source, specifiers } = importDeclaration;
              if (isNodeModulesImport(source.value)) {
                continue;
              }

              const relativePath = getRelativePath(testFileName, filename);

              // テストファイルのパスから、import しているファイルのパスを取得する
              // ./foo/bar/index.ts => ./foo/bar に変換している
              const filePath = getFilePath(relativePath);

              // import する値を取得
              // MEMO: source.value と source.raw の違い調べる
              const { value } = source;

              // path が違ったら return
              if (value !== filePath) {
                continue;
              }

              // import をしているファイルの中に、今の node の関数が import されているかどうかを確認する
              for (const specifier of specifiers) {
                if (specifier.type !== "ImportSpecifier") {
                  return;
                }

                const { imported } = specifier;

                // 関数名が同じだったら、import されているということなので、isImported を true にする
                // 複数ファイルに分散してる可能性や、同じファイル内で import されている可能性もあるので、return はしない
                if (imported.name === functionName) {
                  isImported = true;
                }
              }
            }
          }

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

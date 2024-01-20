import { parse } from "@typescript-eslint/parser";
import type { TSESTree } from "@typescript-eslint/types";
import fs from "fs";
import path from "path";

/**
 *
 * @param testFileName
 * @param filename
 * @returns
 *
 * テストファイルのパスと、テスト対象のファイルのパスから、相対パスを取得する
 */
export const getRelativePath = (
  testFileName: string,
  filename: string
): string => {
  const relativePath = path.relative(path.dirname(testFileName), filename);
  return relativePath;
};

/**
 *
 * @param relativePath
 * @returns ファイルパスを取得する
 *
 * - relativePath が index.ts で終わっている場合は、index.ts を削除する
 * - relativePath が .ts で終わっている場合は、.ts を削除する
 * - relativePath が .ts で終わっていない場合は、何もしない
 * - 同じディレクトリにテストファイルがある場合、相対パスの形式に変換する
 */
export const getFilePath = (relativePath: string): string => {
  let filePath: string = "";
  if (relativePath.endsWith("index.ts")) {
    filePath = relativePath.replace("index.ts", "");
  } else {
    filePath = relativePath.replace(".ts", "");
  }

  if (!filePath.startsWith(".")) {
    filePath = `./${filePath}`;
  }

  return filePath;
};

/**
 *
 * @param a
 * @param b
 * @returns boolean
 *
 * file path が同義がどうかを判定する
 */
export const isSameFilePath = (a: string, b: string): boolean => {
  // ./foo/bar/index => ./foo/bar に変換している
  const importPathA = a.endsWith("index") ? a.replace("index", "") : a;
  const importPathB = b.endsWith("index") ? b.replace("index", "") : b;

  switch (true) {
    case importPathA === importPathB: // 同じパス
    case importPathA === `${importPathB}/`: // ./ と . や ../ と .. が同じという扱いにする
    case `${importPathA}/` === importPathB: // ./ と . や ../ と .. が同じという扱いにする
      return true;
    default:
      return false;
  }
};

/**
 * @param value
 *
 * node_modules から import されているかどうかを判定する
 * 判定方法は、source が . で始まっていたら相対パスという扱いにする
 * @memo path alias 使ったら動きません
 */
export const isNodeModulesImport = (value: string): boolean => {
  return !value.startsWith(".");
};

/**
 * @param filePath
 *
 * - ファイルパスから、import 文を取得する
 * - テストファイルで使用することを想定している
 */
export const getImportDeclarationFromFilePath = (
  filePath: string
): TSESTree.Program["body"] => {
  const testFile = fs.readFileSync(filePath, "utf-8");
  const tree = parse(testFile);

  return tree.body.filter((b) => b.type === "ImportDeclaration");
};

/**
 * プロジェクトの全てのテストファイルの名前を取得する
 */
export const getTestFileNames = (path: string) => {
  if (path.includes("node_modules")) {
    return;
  }

  const testFileNames: string[] = [];
  const files = fs.readdirSync(path);

  for (const file of files) {
    const filePath = `${path}/${file}`;
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      testFileNames.push(...(getTestFileNames(filePath) ?? []));
    } else {
      if (file.endsWith(".test.ts")) {
        testFileNames.push(filePath);
      }
    }
  }

  return testFileNames;
};

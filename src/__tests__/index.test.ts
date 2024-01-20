import { test, describe, expect } from "vitest";
import {
  getRelativePath,
  getFilePath,
  // getTestFileNames,
  isNodeModulesImport,
  isSameFilePath,
  // getIsImported,
} from "../rules/utils";

describe("utils", () => {
  describe("getRelativePath", () => {
    test("should return relative path", () => {
      expect(getRelativePath("/a/b/c.ts", "/a/b/d.ts")).toBe("d.ts");
      expect(getRelativePath("/a/b/c.ts", "/a/d.ts")).toBe("../d.ts");
      expect(getRelativePath("/a/b/c.ts", "/d.ts")).toBe("../../d.ts");
    });
  });

  describe("getFilePath", () => {
    test("should return file path", () => {
      expect(getFilePath("./a/b/c.ts")).toBe("./a/b/c");
      expect(getFilePath("./a/b/c")).toBe("./a/b/c");
      expect(getFilePath("./a/b/c/index.ts")).toBe("./a/b/c/");
      expect(getFilePath("./a/b/c/index")).toBe("./a/b/c/index");
    });
  });

  // describe("getTestFileNames", () => {
  //   test("should return test file names", () => {
  //     const testFileNames = getTestFileNames(process.cwd());
  //   });
  // });

  describe("isNodeModulesImport", () => {
    test("should return true", () => {
      expect(isNodeModulesImport("a")).toBe(true);
      expect(isNodeModulesImport("a/b")).toBe(true);
      expect(isNodeModulesImport("a/b/c")).toBe(true);
    });

    test("should return false", () => {
      expect(isNodeModulesImport("./a")).toBe(false);
      expect(isNodeModulesImport("./a/b")).toBe(false);
      expect(isNodeModulesImport("./a/b/c")).toBe(false);
    });
  });

  describe("isSameFilePath", () => {
    test("should return true", () => {
      expect(isSameFilePath("./", ".")).toBe(true);
      expect(isSameFilePath("..", "../")).toBe(true);
      expect(isSameFilePath("./a/b/c", "./a/b/c")).toBe(true);
      expect(isSameFilePath("./a/b/c", "./a/b/c/")).toBe(true);
      expect(isSameFilePath("./a/b/c/", "./a/b/c")).toBe(true);
      expect(isSameFilePath("./a/b/c/", "./a/b/c/")).toBe(true);
      expect(isSameFilePath("./a/b/c/index", "./a/b/c/")).toBe(true);
      expect(isSameFilePath("./a/b/c/", "./a/b/c/index")).toBe(true);
      expect(isSameFilePath("./a/b/c", "./a/b/d")).toBe(false);
      expect(isSameFilePath("./a/b/c", "./a/b/d/")).toBe(false);
      expect(isSameFilePath("./a/b/c/", "./a/b/d")).toBe(false);
      expect(isSameFilePath("./a/b/c/", "./a/b/d/")).toBe(false);
    });
  });

  // describe("getIsImported", () => {
  // });
});

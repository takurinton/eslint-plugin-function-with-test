import { requireTest } from "./rules";

export = {
  rules: {
    "require-test": requireTest,
  },
  configs: {
    all: {
      plugins: ["function-with-test"],
      rules: {
        "function-with-test/require-test": "error",
      },
    },
  },
};

// test-ignore
export const exportArrowFunction = () => "bar";

/**
 * @description test-ignore with jsdoc comment
 * test-ignore
 */
export function exportNamedFunction() {
  return "hoge";
}

/**
 * test-ignore
 */
const exportObjectArrowFunction = () => "bar";

/**
 * test-ignore
 */
function exportObjectNamedFunction() {
  return "hoge";
}

// export する関数にテストは必要
export { exportObjectArrowFunction, exportObjectNamedFunction };

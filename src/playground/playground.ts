// 変数にテストは不要
export const variable = "foo";

// アロー関数にテストは必要
export const exportArrowFunction = () => "bar";

// 名前付き関数にテストは必要
export function exportNamedFunction() {
  return "hoge";
}

// クラスにテストは必要
export class ExportClass {
  public baz() {
    return "baz";
  }
}

// 後から export するアロー関数
const exportObjectArrowFunction = () => "bar";
// 後から export する名前付き関数
function exportObjectNamedFunction() {
  return "hoge";
}

// export する関数にテストは必要
export { exportObjectArrowFunction, exportObjectNamedFunction };

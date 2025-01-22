import * as assert from "assert";
import * as vscode from "vscode";
import { EnumHoverProvider } from "../../providers/enumHoverProvider";

suite("EnumHoverProvider テスト", () => {
  const constantMap = new Map();
  constantMap.set("UnitType", {
    PLAYER: 1,
    ENEMY: 2,
    ALLY: 3
  });
  suite("EnumHoverProvider.provideHover テスト", () => {
    test("UnitType.ALLYのうち、ALLYにホバーした時にUnitTypeの情報が表示される。ALLYだけ青色になる。", async () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 13 } }),
        lineAt: () => ({ text: "UnitType.ALLY" }),
        getText: () => "UnitType.ALLY"
      } as unknown as vscode.TextDocument;
      const mockPosition = new vscode.Position(0, 10);
      const mockToken = {} as vscode.CancellationToken;

      const hoverProvider = new EnumHoverProvider(constantMap);
      const hoverResult = hoverProvider.provideHover(mockDocument, mockPosition, mockToken);

      assert.ok(hoverResult);
      assert.ok(hoverResult.contents.length > 0);
      assert.ok(hoverResult.contents[0] instanceof vscode.MarkdownString);
      assert.strictEqual(
        hoverResult.contents[0].value,
        '<span style="color:#00cc66;">UnitType</span><br><hr><br>PLAYER: 1<br>ENEMY: 2<br><span style="color:#00b0ff;">ALLY: 3</span><br>'
      );
    });
    test("UnitType.ALLYのうち、UnitTypeにホバーした時にUnitTypeの情報が表示される。ALLYだけ青色になる。", async () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 13 } }),
        lineAt: () => ({ text: "UnitType.ALLY" }),
        getText: () => "UnitType.ALLY"
      } as unknown as vscode.TextDocument;
      const mockPosition = new vscode.Position(0, 2);
      const mockToken = {} as vscode.CancellationToken;

      const hoverProvider = new EnumHoverProvider(constantMap);
      const hoverResult = hoverProvider.provideHover(mockDocument, mockPosition, mockToken);

      assert.ok(hoverResult);
      assert.ok(hoverResult.contents.length > 0);
      assert.ok(hoverResult.contents[0] instanceof vscode.MarkdownString);
      assert.strictEqual(
        hoverResult.contents[0].value,
        '<span style="color:#00cc66;">UnitType</span><br><hr><br>PLAYER: 1<br>ENEMY: 2<br><span style="color:#00b0ff;">ALLY: 3</span><br>'
      );
    });
    test("UnitTypeにホバーした時に、UnitTypeの情報が表示される", async () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 8 } }),
        lineAt: () => ({ text: "UnitType" }),
        getText: () => "UnitType"
      } as unknown as vscode.TextDocument;
      const mockPosition = new vscode.Position(0, 8);
      const mockToken = {} as vscode.CancellationToken;

      const hoverProvider = new EnumHoverProvider(constantMap);
      const hoverResult = hoverProvider.provideHover(mockDocument, mockPosition, mockToken);

      assert.ok(hoverResult);
      assert.ok(hoverResult.contents.length > 0);
      assert.ok(hoverResult.contents[0] instanceof vscode.MarkdownString);
      assert.strictEqual(
        hoverResult.contents[0].value,
        '<span style="color:#00cc66;">UnitType</span><br><hr><br>PLAYER: 1<br>ENEMY: 2<br>ALLY: 3<br>'
      );
    });
  });
});

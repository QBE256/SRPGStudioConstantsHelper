import * as assert from "assert"
import * as vscode from "vscode"
import { EnumNameCompletionItemProvider } from "../../providers/enumNameCompletionItemProvider"

suite("EnumNameCompletionProvider テスト", () => {
  const constantMap = new Map()
  constantMap.set("UnitType", {
    PLAYER: 0,
    ENEMY: 1,
    ALLY: 2,
  })
  constantMap.set("DamageType", {
    FIXED: 0,
    PHYSICS: 1,
    MAGIC: 2,
  })
  suite("EnumNameCompletionProvider.provideCompletionItems テスト", () => {
    test("サジェストにUnitTypeとDamageTypeの情報が表示される。", () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 0 } }),
        lineAt: () => ({ text: "" }),
        getText: () => "",
      } as unknown as vscode.TextDocument
      const mockPosition = new vscode.Position(0, 0)

      const completionItemProvider = new EnumNameCompletionItemProvider(constantMap)
      const completionItemResult = completionItemProvider.provideCompletionItems(mockDocument, mockPosition)

      assert.ok(completionItemResult)
      assert.ok(completionItemResult.length === 2)
      assert.strictEqual(completionItemResult[0].label, "UnitType")
      assert.strictEqual(
        completionItemResult[0].detail,
        JSON.stringify(
          {
            PLAYER: 0,
            ENEMY: 1,
            ALLY: 2,
          },
          null,
          2,
        ),
      )
      assert.strictEqual(completionItemResult[1].label, "DamageType")
      assert.strictEqual(
        completionItemResult[1].detail,
        JSON.stringify(
          {
            FIXED: 0,
            PHYSICS: 1,
            MAGIC: 2,
          },
          null,
          2,
        ),
      )
    })
  })
})

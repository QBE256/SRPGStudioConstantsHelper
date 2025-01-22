import * as assert from "assert"
import * as vscode from "vscode"
import { StringTableNameCompletionItemProvider } from "../../providers/stringTableNameCompletionItemProvider"

suite("StringTableNameCompletionProvider Test", () => {
  const constantMap = new Map()
  constantMap.set("StringTable", {
    MESSAGE: "システムメッセージです",
    ERROR: "エラーです",
  })
  suite("StringTableNameCompletionProvider.provideCompletionItems テスト", () => {
    test("サジェストにStringTableの情報が表示される。", async () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 0 } }),
        lineAt: () => ({ text: "" }),
        getText: () => "",
      } as unknown as vscode.TextDocument
      const mockPosition = new vscode.Position(0, 0)

      const completionItemProvider = new StringTableNameCompletionItemProvider(constantMap)
      const completionItemResult = completionItemProvider.provideCompletionItems(mockDocument, mockPosition)

      assert.ok(completionItemResult)
      assert.ok(completionItemResult.length === 1)
      assert.strictEqual(completionItemResult[0].label, "StringTable")
      assert.strictEqual(
        completionItemResult[0].detail,
        JSON.stringify(
          {
            MESSAGE: "システムメッセージです",
            ERROR: "エラーです",
          },
          null,
          2,
        ),
      )
    })
  })
})

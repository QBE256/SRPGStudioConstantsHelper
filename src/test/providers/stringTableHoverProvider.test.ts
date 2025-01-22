import * as assert from "assert"
import * as vscode from "vscode"
import { StringTableHoverProvider } from "../../providers/stringTableHoverProvider"

suite("StringTableHoverProvider Test", () => {
  const constantMap = new Map()
  constantMap.set("StringTable", {
    MESSAGE: "システムメッセージです",
    ERROR: "エラーです",
  })
  suite("StringTableHoverProvider.provideHover テスト", () => {
    test("StringTable.MESSAGEのMESSAGEにホバーした時に、メッセージ内容が展開される", async () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 19 } }),
        lineAt: () => ({ text: "StringTable.MESSAGE" }),
        getText: () => "StringTable.MESSAGE",
      } as unknown as vscode.TextDocument
      const mockPosition = new vscode.Position(0, 17)
      const mockToken = {} as vscode.CancellationToken

      const hoverProvider = new StringTableHoverProvider(constantMap)
      const hoverResult = hoverProvider.provideHover(mockDocument, mockPosition, mockToken)

      assert.ok(hoverResult)
      assert.ok(hoverResult.contents.length > 0)
      assert.ok(hoverResult.contents[0] instanceof vscode.MarkdownString)
      console.log(hoverResult.contents[0].value)
      assert.strictEqual(
        hoverResult.contents[0].value,
        '<span style="color:#00cc66;">This is the message shown in game.</span><br><hr><br><span style="color:#00b0ff;">システムメッセージです</span><br>',
      )
    })
    test("StringTable.MESSAGEのStringTableにホバーした時に、メッセージ内容が展開される", async () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 19 } }),
        lineAt: () => ({ text: "StringTable.MESSAGE" }),
        getText: () => "StringTable.MESSAGE",
      } as unknown as vscode.TextDocument
      const mockPosition = new vscode.Position(0, 3)
      const mockToken = {} as vscode.CancellationToken

      const hoverProvider = new StringTableHoverProvider(constantMap)
      const hoverResult = hoverProvider.provideHover(mockDocument, mockPosition, mockToken)

      assert.ok(hoverResult)
      assert.ok(hoverResult.contents.length > 0)
      assert.ok(hoverResult.contents[0] instanceof vscode.MarkdownString)
      console.log(hoverResult.contents[0].value)
      assert.strictEqual(
        hoverResult.contents[0].value,
        '<span style="color:#00cc66;">This is the message shown in game.</span><br><hr><br><span style="color:#00b0ff;">システムメッセージです</span><br>',
      )
    })
    test("StringTableのみだとホバーした時に何も表示されない", async () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 10 } }),
        lineAt: () => ({ text: "StringTable" }),
        getText: () => "StringTable",
      } as unknown as vscode.TextDocument
      const mockPosition = new vscode.Position(0, 8)
      const mockToken = {} as vscode.CancellationToken

      const hoverProvider = new StringTableHoverProvider(constantMap)
      const hoverResult = hoverProvider.provideHover(mockDocument, mockPosition, mockToken)

      assert.ok(!hoverResult)
    })
  })
})

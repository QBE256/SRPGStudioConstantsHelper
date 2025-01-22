import * as assert from "assert"
import * as vscode from "vscode"
import { StringTableMemberCompletionItemProvider } from "../../providers/stringTableMemberCompletionItemProvider"

suite("StringTableMemberCompletionItemProvider テスト", () => {
  const constantMap = new Map()
  constantMap.set("StringTable", {
    MESSAGE: "システムメッセージです",
    ERROR: "エラーです",
  })
  suite("StringTableMemberCompletionItemProvider.provideCompletionItems テスト", () => {
    test("StringTable.と入力した時にStringTableのメンバー情報がサジェストに表示される。", async () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 12 } }),
        lineAt: () => ({ text: "StringTable." }),
        getText: () => "StringTable.",
        uri: vscode.Uri.parse("file:///test.js"),
        fileName: "test.js",
        languageId: "javascript",
      } as unknown as vscode.TextDocument
      const mockPosition = new vscode.Position(0, 12)
      const mockToken = {
        isCancellationRequested: false,
        onCancellationRequested: () => ({ dispose: () => {} }),
      } as vscode.CancellationToken
      const mockContext = {
        triggerKind: vscode.CompletionTriggerKind.Invoke,
        triggerCharacter: ".",
      } as vscode.CompletionContext

      const completionItemProvider = new StringTableMemberCompletionItemProvider(constantMap)
      const completionItemResult = completionItemProvider.provideCompletionItems(
        mockDocument,
        mockPosition,
        mockToken,
        mockContext,
      )

      assert.ok(completionItemResult)
      assert.ok(completionItemResult instanceof vscode.CompletionList)
      assert.ok(completionItemResult.items.length === 2)
      assert.deepEqual(completionItemResult.items[0], {
        label: "MESSAGE",
        insertText: "StringTable.MESSAGE",
        detail: "MESSAGE:システムメッセージです",
        sortText: "\u00000",
        filterText: "StringTable.MESSAGE",
        range: {
          c: {
            c: 0,
            e: 0,
          },
          e: {
            c: 0,
            e: 12,
          },
        },
        kind: vscode.CompletionItemKind.EnumMember,
      })
      assert.deepEqual(completionItemResult.items[1], {
        label: "ERROR",
        insertText: "StringTable.ERROR",
        detail: "ERROR:エラーです",
        sortText: "\u00001",
        filterText: "StringTable.ERROR",
        range: {
          c: {
            c: 0,
            e: 0,
          },
          e: {
            c: 0,
            e: 12,
          },
        },
        kind: vscode.CompletionItemKind.EnumMember,
      })
    })
    test("StringTableと入力した時にサジェストは表示されない", async () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 8 } }),
        lineAt: () => ({ text: "UnitType" }),
        getText: () => "UnitType",
        uri: vscode.Uri.parse("file:///test.js"),
        fileName: "test.js",
        languageId: "javascript",
      } as unknown as vscode.TextDocument
      const mockPosition = new vscode.Position(0, 8)
      const mockToken = {
        isCancellationRequested: false,
        onCancellationRequested: () => ({ dispose: () => {} }),
      } as vscode.CancellationToken
      const mockContext = {
        triggerKind: vscode.CompletionTriggerKind.Invoke,
        triggerCharacter: "e",
      } as vscode.CompletionContext

      const completionItemProvider = new StringTableMemberCompletionItemProvider(constantMap)
      const completionItemResult = completionItemProvider.provideCompletionItems(
        mockDocument,
        mockPosition,
        mockToken,
        mockContext,
      )

      assert.ok(completionItemResult)
      assert.ok(completionItemResult instanceof vscode.CompletionList)
      assert.strictEqual(completionItemResult.items.length, 0)
    })
  })
})

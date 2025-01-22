import * as assert from "assert"
import * as vscode from "vscode"
import { EnumMemberCompletionItemProvider } from "../../providers/enumMemberCompletionItemProvider"

suite("EnumMemberCompletionProvider テスト", () => {
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
  suite("EnumMemberCompletionProvider.provideCompletionItems テスト", () => {
    test("UnitType.と入力した時にUnitTypeのメンバー情報がサジェストに表示される。", () => {
      const mockDocument = {
        getWordRangeAtPosition: () => ({ start: { character: 0 }, end: { character: 9 } }),
        lineAt: () => ({ text: "UnitType." }),
        getText: () => "UnitType.",
        uri: vscode.Uri.parse("file:///test.js"),
        fileName: "test.js",
        languageId: "javascript",
      } as unknown as vscode.TextDocument
      const mockPosition = new vscode.Position(0, 9)
      const mockToken = {
        isCancellationRequested: false,
        onCancellationRequested: () => ({ dispose: () => {} }),
      } as vscode.CancellationToken
      const mockContext = {
        triggerKind: vscode.CompletionTriggerKind.Invoke,
        triggerCharacter: ".",
      } as vscode.CompletionContext

      const completionItemProvider = new EnumMemberCompletionItemProvider(constantMap)
      const completionItemResult = completionItemProvider.provideCompletionItems(
        mockDocument,
        mockPosition,
        mockToken,
        mockContext,
      )

      assert.ok(completionItemResult)
      assert.ok(completionItemResult instanceof vscode.CompletionList)
      assert.ok(completionItemResult.items.length === 3)
      assert.deepEqual(completionItemResult.items[0], {
        label: "PLAYER",
        insertText: "UnitType.PLAYER",
        detail: "UnitType.PLAYER:0",
        sortText: "\u00000",
        filterText: "UnitType.PLAYER",
        range: {
          c: {
            c: 0,
            e: 0,
          },
          e: {
            c: 0,
            e: 9,
          },
        },
        kind: vscode.CompletionItemKind.EnumMember,
      })
      assert.deepEqual(completionItemResult.items[1], {
        label: "ENEMY",
        insertText: "UnitType.ENEMY",
        detail: "UnitType.ENEMY:1",
        sortText: "\u00001",
        filterText: "UnitType.ENEMY",
        range: {
          c: {
            c: 0,
            e: 0,
          },
          e: {
            c: 0,
            e: 9,
          },
        },
        kind: vscode.CompletionItemKind.EnumMember,
      })
      assert.deepEqual(completionItemResult.items[2], {
        label: "ALLY",
        insertText: "UnitType.ALLY",
        detail: "UnitType.ALLY:2",
        sortText: "\u00002",
        filterText: "UnitType.ALLY",
        range: {
          c: {
            c: 0,
            e: 0,
          },
          e: {
            c: 0,
            e: 9,
          },
        },
        kind: vscode.CompletionItemKind.EnumMember,
      })
    })
    test("UnitTypeと入力した時にサジェストは表示されない", () => {
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

      const completionItemProvider = new EnumMemberCompletionItemProvider(constantMap)
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

import * as vscode from "vscode"

export class StringTableNameCompletionItemProvider implements vscode.CompletionItemProvider {
  constantMap: Map<string, object>

  constructor(constantMap: Map<string, object>) {
    this.constantMap = constantMap
  }

  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    const completionItems: vscode.CompletionItem[] = []
    this.constantMap.forEach((value, key) => {
      const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Enum)
      item.detail = JSON.stringify(value, null, 2)
      completionItems.push(item)
    })
    return completionItems
  }
}

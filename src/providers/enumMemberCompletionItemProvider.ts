import * as vscode from "vscode"

export class EnumMemberCompletionItemProvider implements vscode.CompletionItemProvider {
  constantMap: Map<string, object>

  constructor(constantMap: Map<string, object>) {
    this.constantMap = constantMap
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ) {
    const currentLinePrefix = document.lineAt(position).text.slice(0, position.character)
    const completionItems: vscode.CompletionItem[] = []
    const headChainPattern = /\b\w+\.(?=\s*\{|\s*\(|\s*\[|\s*\w|$)/g
    const matchChains = currentLinePrefix.match(headChainPattern)
    if (!matchChains) {
      return new vscode.CompletionList([])
    }
    if (context.triggerCharacter !== ".") {
      return new vscode.CompletionList([])
    }
    const headChain = matchChains.pop()?.trim().replace(".", "") || ""
    if (this.constantMap.has(headChain)) {
      const enumMember = this.constantMap.get(headChain) as object
      if (!enumMember) {
        return new vscode.CompletionList([])
      }
      const items = Object.entries(enumMember).map(([enumMemberKey, enumMemberValue], index) => {
        const completionItem = new vscode.CompletionItem(`${enumMemberKey}`, vscode.CompletionItemKind.EnumMember)
        completionItem.label = `${enumMemberKey}`
        completionItem.insertText = `${headChain}.${enumMemberKey}`
        completionItem.detail = `${headChain}.${enumMemberKey}:${enumMemberValue}`
        completionItem.sortText = `\u0000${index}`
        completionItem.filterText = `${headChain}.${enumMemberKey}`
        completionItem.range = new vscode.Range(position.translate(0, -1 * headChain.length - 1), position)
        completionItem.kind = vscode.CompletionItemKind.EnumMember
        return completionItem
      })
      completionItems.push(...items)
    }
    return new vscode.CompletionList(completionItems)
  }
}

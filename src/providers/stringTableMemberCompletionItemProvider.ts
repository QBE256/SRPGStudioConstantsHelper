import * as vscode from "vscode";

export class StringTableMemberCompletionItemProvider implements vscode.CompletionItemProvider {
  constantMap: Map<string, object>;

  constructor(constantMap: Map<string, object>) {
    this.constantMap = constantMap;
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ) {
    const currentLinePrefix = document.lineAt(position).text.slice(0, position.character);
    const completionItems: vscode.CompletionItem[] = [];
    const headChainPattern = /\b\w+\.(?=\s*\{|\s*\(|\s*\[|\s*\w|$)/g;
    const matchChains = currentLinePrefix.match(headChainPattern);
    if (!matchChains) {
      return new vscode.CompletionList([]);
    }
    if (context.triggerCharacter !== ".") {
      return new vscode.CompletionList([]);
    }
    const headChain = matchChains.pop()?.trim().replace(".", "") || "";
    if (this.constantMap.has(headChain)) {
      const stringTable = this.constantMap.get(headChain) as object;
      if (!stringTable) {
        return new vscode.CompletionList([]);
      }
      const items = Object.entries(stringTable).map(([stringTableKey, stringTableValue], index) => {
        const completionItem = new vscode.CompletionItem(`${stringTableKey}`, vscode.CompletionItemKind.EnumMember);
        completionItem.label = `${stringTableKey}`;
        completionItem.insertText = `${headChain}.${stringTableKey}`;
        completionItem.detail = `${stringTableKey}:${stringTableValue}`;
        completionItem.sortText = `\u0000${index}`;
        completionItem.filterText = `${headChain}.${stringTableKey}`;
        completionItem.range = new vscode.Range(position.translate(0, -1 * headChain.length - 1), position);
        completionItem.kind = vscode.CompletionItemKind.EnumMember;
        return completionItem;
      });
      completionItems.push(...items);
    }
    return new vscode.CompletionList(completionItems);
  }
}

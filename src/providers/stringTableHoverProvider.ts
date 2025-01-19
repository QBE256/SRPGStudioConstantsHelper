import * as vscode from "vscode"

export class StringTableHoverProvider implements vscode.HoverProvider {
  constantMap: Map<string, object>

  constructor(constantMap: Map<string, object>) {
    this.constantMap = constantMap
  }

  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
    const stringTableRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9_\-\.]+/)
    if (!stringTableRange) {
      return null
    }
    const currentLine = document.lineAt(position).text
    const currentWord = document.getText(stringTableRange)
    const stringTableElements = currentWord.split(".")
    if (stringTableElements.length >= 3 || stringTableElements.length === 0) {
      return null
    }
    const isWrittenStringTableMember = stringTableElements.length === 2 && !!stringTableElements[1]
    if (!isWrittenStringTableMember) {
      return null
    }
    const stringTableName = stringTableElements[0]
    const stringTableMemberKey = stringTableElements[1]
    if (!this.constantMap.has(stringTableName)) {
      return null
    }
    const stringTableMembers = this.constantMap.get(stringTableName) as object
    const stringTableValue = stringTableMembers[stringTableMemberKey as keyof typeof stringTableMembers]
    const markdown = new vscode.MarkdownString()
    markdown.supportHtml = true
    markdown.appendMarkdown(`<span style="color:#00cc66;">This is the message shown in game.</span><br>`)
    markdown.appendMarkdown(`<hr><br>`)
    markdown.appendMarkdown(`<span style="color:#00b0ff;">${stringTableValue}</span><br>`)
    return new vscode.Hover(markdown)
  }
}

import * as vscode from "vscode"

export class EnumHoverProvider implements vscode.HoverProvider {
  constantMap: Map<string, object>

  constructor(constantMap: Map<string, object>) {
    this.constantMap = constantMap
  }

  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
    const enumRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9_\-\.]+/)
    if (!enumRange) {
      return null
    }
    const currentLine = document.lineAt(position).text
    const currentWord = document.getText(enumRange)
    const enumElements = currentWord.split(".")
    if (enumElements.length >= 3 || enumElements.length === 0) {
      return null
    }
    const isWrittenEnumMember = enumElements.length === 2 && !!enumElements[1]

    const enumName = isWrittenEnumMember ? enumElements[0] : currentWord
    const currentEnumMemberKey = isWrittenEnumMember ? enumElements[1] : null
    if (!this.constantMap.has(enumName)) {
      return null
    }
    const enumMembers = this.constantMap.get(enumName) as object
    const markdown = new vscode.MarkdownString()
    markdown.supportHtml = true
    markdown.appendMarkdown(`<span style="color:#00cc66;">${enumName}</span><br>`)
    markdown.appendMarkdown(`<hr><br>`)
    for (const [enumMemberKey, enumMemberValue] of Object.entries(enumMembers)) {
      if (enumMemberKey === currentEnumMemberKey) {
        markdown.appendMarkdown(`<span style="color:#00b0ff;">${enumMemberKey}: ${enumMemberValue}</span><br>`)
      } else {
        markdown.appendMarkdown(`${enumMemberKey}: ${enumMemberValue}<br>`)
      }
    }

    return new vscode.Hover(markdown)
  }
}

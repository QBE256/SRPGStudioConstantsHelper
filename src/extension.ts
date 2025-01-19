import * as vscode from "vscode"
import { readScriptFolder, createConstantMap } from "./libs/readFile"
import { EnumNameCompletionItemProvider } from "./providers/enumNameCompletionItemProvider"
import { EnumMemberCompletionItemProvider } from "./providers/enumMemberCompletionItemProvider"
import { EnumHoverProvider } from "./providers/enumHoverProvider"

export const activate = (context: vscode.ExtensionContext) => {
  const register = vscode.commands.registerCommand("extension.showConstants", async () => {
    const folderUri = await readScriptFolder()
    if (folderUri && folderUri[0]) {
      const constantMap = await createConstantMap(folderUri, "constants", "constants-enumeratedtype.js")

      if (constantMap.size === 0) {
        vscode.window.showErrorMessage("Read error in the file.")
        return
      }

      const enumNameCompletionItemProvider = new EnumNameCompletionItemProvider(constantMap)
      const enumMemberCompletionItemProvider = new EnumMemberCompletionItemProvider(constantMap)
      const enumHoverProvider = new EnumHoverProvider(constantMap)

      const completionEnumNameProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "javascript" },
        enumNameCompletionItemProvider,
      )
      context.subscriptions.push(completionEnumNameProvider)

      const completionEnumMemberProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "javascript" },
        enumMemberCompletionItemProvider,
        ".",
      )
      context.subscriptions.push(completionEnumMemberProvider)

      const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: "file", language: "javascript" },
        enumHoverProvider,
      )
      context.subscriptions.push(hoverProvider)
    }
  })

  context.subscriptions.push(register)
}

export const deactivate = () => {}

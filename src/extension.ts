import * as vscode from "vscode"
import { readScriptFolder, createConstantMap } from "./libs/readFile"
import { EnumNameCompletionItemProvider } from "./providers/enumNameCompletionItemProvider"
import { EnumMemberCompletionItemProvider } from "./providers/enumMemberCompletionItemProvider"
import { EnumHoverProvider } from "./providers/enumHoverProvider"
import { StringTableNameCompletionItemProvider } from "./providers/stringTableNameCompletionItemProvider"
import { StringTableMemberCompletionItemProvider } from "./providers/stringTableMemberCompletionItemProvider"
import { StringTableHoverProvider } from "./providers/stringTableHoverProvider"

export const activate = (context: vscode.ExtensionContext) => {
  const register = vscode.commands.registerCommand("extension.showConstants", async () => {
    const folderUri = await readScriptFolder()
    if (folderUri && folderUri[0]) {
      const enumMap = await createConstantMap(folderUri, "constants", "constants-enumeratedtype.js")
      const stringTableMap = await createConstantMap(folderUri, "constants", "constants-stringtable.js")
      if (enumMap.size === 0 || stringTableMap.size === 0) {
        vscode.window.showErrorMessage("Read error in the file.")
        return
      }
      stringTableMap.forEach((value, key) => {
        if (key !== "StringTable") {
          enumMap.set(key, value)
          stringTableMap.delete(key)
        }
      })

      const enumNameCompletionItemProvider = new EnumNameCompletionItemProvider(enumMap)
      const enumMemberCompletionItemProvider = new EnumMemberCompletionItemProvider(enumMap)
      const enumHoverProvider = new EnumHoverProvider(enumMap)
      const stringTableNameCompletionItemProvider = new StringTableNameCompletionItemProvider(stringTableMap)
      const stringTableMemberCompletionItemProvider = new StringTableMemberCompletionItemProvider(stringTableMap)
      const stringTableHoverProvider = new StringTableHoverProvider(stringTableMap)

      context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
          { scheme: "file", language: "javascript" },
          enumNameCompletionItemProvider,
        ),
      )
      context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
          { scheme: "file", language: "javascript" },
          enumMemberCompletionItemProvider,
          ".",
        ),
      )
      context.subscriptions.push(
        vscode.languages.registerHoverProvider({ scheme: "file", language: "javascript" }, enumHoverProvider),
      )
      context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
          { scheme: "file", language: "javascript" },
          stringTableNameCompletionItemProvider,
        ),
      )
      context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
          { scheme: "file", language: "javascript" },
          stringTableMemberCompletionItemProvider,
          ".",
        ),
      )
      context.subscriptions.push(
        vscode.languages.registerHoverProvider({ scheme: "file", language: "javascript" }, stringTableHoverProvider),
      )
    }
  })

  context.subscriptions.push(register)
}

export const deactivate = () => {}

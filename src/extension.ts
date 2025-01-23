import * as vscode from "vscode"
import { readScriptFolder, createConstantMap } from "./libs/readFile"
import { EnumNameCompletionItemProvider } from "./providers/enumNameCompletionItemProvider"
import { EnumMemberCompletionItemProvider } from "./providers/enumMemberCompletionItemProvider"
import { EnumHoverProvider } from "./providers/enumHoverProvider"
import { StringTableNameCompletionItemProvider } from "./providers/stringTableNameCompletionItemProvider"
import { StringTableMemberCompletionItemProvider } from "./providers/stringTableMemberCompletionItemProvider"
import { StringTableHoverProvider } from "./providers/stringTableHoverProvider"

const registeredProvider: {
  enumNameCompletionItem: vscode.Disposable | undefined;
  enumMemberCompletionItem: vscode.Disposable | undefined;
  enumHover: vscode.Disposable | undefined;
  stringTableNameCompletionItem: vscode.Disposable | undefined;
  stringTableMemberCompletionItem: vscode.Disposable | undefined;
  stringTableHover: vscode.Disposable | undefined;
} = {
  enumNameCompletionItem: undefined,
  enumMemberCompletionItem: undefined,
  enumHover: undefined,
  stringTableNameCompletionItem: undefined,
  stringTableMemberCompletionItem: undefined,
  stringTableHover: undefined,
}

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

      if (!!registeredProvider.enumNameCompletionItem) {
        registeredProvider.enumNameCompletionItem.dispose()
      }
      registeredProvider.enumNameCompletionItem = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "javascript" },
        enumNameCompletionItemProvider,
      )
      context.subscriptions.push(registeredProvider.enumNameCompletionItem)

      if (!!registeredProvider.enumMemberCompletionItem) {
        registeredProvider.enumMemberCompletionItem.dispose()
      }
      registeredProvider.enumMemberCompletionItem = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "javascript" },
        enumMemberCompletionItemProvider,
        ".",
      )
      context.subscriptions.push(registeredProvider.enumMemberCompletionItem)

      if (!!registeredProvider.enumHover) {
        registeredProvider.enumHover.dispose()
      }
      registeredProvider.enumHover = vscode.languages.registerHoverProvider(
        { scheme: "file", language: "javascript" },
        enumHoverProvider,
      )
      context.subscriptions.push(registeredProvider.enumHover)

      if (!!registeredProvider.stringTableNameCompletionItem) {
        registeredProvider.stringTableNameCompletionItem.dispose()
      }
      registeredProvider.stringTableNameCompletionItem = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "javascript" },
        stringTableNameCompletionItemProvider,
      )
      context.subscriptions.push(registeredProvider.stringTableNameCompletionItem)

      if (!!registeredProvider.stringTableMemberCompletionItem) {
        registeredProvider.stringTableMemberCompletionItem.dispose()
      }
      registeredProvider.stringTableMemberCompletionItem = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "javascript" },
        stringTableMemberCompletionItemProvider,
        ".",
      )
      context.subscriptions.push(registeredProvider.stringTableMemberCompletionItem)

      if (!!registeredProvider.stringTableHover) {
        registeredProvider.stringTableHover.dispose()
      }
      registeredProvider.stringTableHover = vscode.languages.registerHoverProvider(
        { scheme: "file", language: "javascript" },
        stringTableHoverProvider,
      )
      context.subscriptions.push(registeredProvider.stringTableHover)
    }
  })

  context.subscriptions.push(register)
}

export const deactivate = () => {}

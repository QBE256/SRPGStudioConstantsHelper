import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

export const readScriptFolder = async ():Promise<vscode.Uri[] | undefined> => {
  const folderUri = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Select Script Folder',
  })
  return folderUri
}

const createShowConstantsCommand = async (context: vscode.ExtensionContext): Promise<vscode.Disposable | undefined> => {
  const folderUri = await readScriptFolder()
  if (folderUri && folderUri[0]) {
    const constantsPath = path.join(folderUri[0].fsPath, 'constants', 'constants-enumeratedtype.js')  
    if (fs.existsSync(constantsPath)) {
      const fileContent = await fs.promises.readFile(constantsPath, 'utf8')
      const constantMap: Map<string, object> = new Map()
      const regex = /var\s+(\w+)\s*=\s*({[^}]+});/g
      let match
      while ((match = regex.exec(fileContent)) !== null) {
        try {
          // JSON変換に不都合な部分を置換する
          // 16進数の値はJSON.parseには使えないため、文字列に変換する
          const jsonString = match[2]
            .replace(/\/\/.*/g, '')
            .replace(/(\w+)\s*:/g, '"$1":')
            .replace(/'/g, '"')
            .replace(/0x[0-9a-fA-F]+/g, (hex) => `"${hex}"`)
          constantMap.set(match[1], JSON.parse(jsonString))
        } catch (e) {
          console.log(e)
        }
      }
                
      if (constantMap.size === 0) {
        vscode.window.showErrorMessage('Read error in the file.')
        return
      }
                
      const completionEnumProvider = vscode.languages.registerCompletionItemProvider( { scheme: 'file', language: 'javascript' }, {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
          const completionItems: vscode.CompletionItem[] = []
          constantMap.forEach((value, key) => {
            const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Enum)
            item.detail = JSON.stringify(value, null, 2)
            completionItems.push(item)
          })
          return completionItems
        },
      })

      const completionEnumeratorProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'javascript' },{
          provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
            const currentLinePrefix = document.lineAt(position).text.slice(0, position.character)
            const completionItems: vscode.CompletionItem[] = []
            const headChainPattern = /\b\w+\.(?=\s*\{|\s*\(|\s*\[|\s*\w|$)/g
            const matchChains = currentLinePrefix.match(headChainPattern)
            if (!matchChains) {
              return []
            }
            if (context.triggerCharacter !== '.') {
              return []
            }
            const headChain = matchChains.pop()?.trim().replace('.', '') || ''
            if (constantMap.has(headChain)) {
              const enumMember = constantMap.get(headChain) as object
              if (!enumMember) {
                return []
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
          },
        },
        '.',
      )

      context.subscriptions.push(completionEnumeratorProvider)
      return vscode.Disposable.from(completionEnumProvider, completionEnumeratorProvider)
    }
  }
}

export const activate = (context: vscode.ExtensionContext) => {
  const register = vscode.commands.registerCommand('extension.showConstants', async () => {
    const completionItemProvider = await createShowConstantsCommand(context)
    if (!!completionItemProvider) {
      context.subscriptions.push(completionItemProvider)
    }
  })

  context.subscriptions.push(register)
}

export const deactivate = () => {}

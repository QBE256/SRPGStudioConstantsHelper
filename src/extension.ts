import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

export const readScriptFolder = async ():Promise<vscode.Uri[] | undefined> => {
  const folderUri = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Select Script Folder.',
  })
  return folderUri
}

const createShowConstantsCommand = async (context: vscode.ExtensionContext): Promise<vscode.Disposable | undefined> => {
  const folderUri = await readScriptFolder()
  if (folderUri && folderUri[0]) {
    const constantsPath = path.join(folderUri[0].fsPath, 'constants', 'constants-enumeratedtype.js')  
    if (fs.existsSync(constantsPath)) {
      const fileContent = await fs.promises.readFile(constantsPath, 'utf8')
      const constantMap: Map<string, Record<string, string | number>> = new Map()
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
          provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const currentLinePrefix = document.lineAt(position).text.slice(0, position.character)
            const completionItems: vscode.CompletionItem[] = []
            const headChainPattern = /\s*[a-zA-Z0-9][^.]*\.$/
            const headChainMatch = currentLinePrefix.match(headChainPattern)
            if (!headChainMatch) {
              return []
            }
            const headChainStr = headChainMatch[0].trim().replace('.', '')
            if (constantMap.has(headChainStr)) {
              const enumerator = constantMap.get(headChainStr)
              if (!enumerator) {
                return []
              }
              const items = Object.entries(enumerator).map(([enumerator, value]) => {
                const completionItem = new vscode.CompletionItem(enumerator, vscode.CompletionItemKind.Constant)
                completionItem.label = `${enumerator} - ${value}`
                completionItem.insertText = enumerator
                completionItem.detail = `${headChainStr}.${enumerator}:${value}`
                return completionItem
              })
              completionItems.push(...items)
            }
            return completionItems
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

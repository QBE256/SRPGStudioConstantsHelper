import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"

export const readScriptFolder = async (): Promise<vscode.Uri[] | undefined> => {
  const folderUri = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: "Select Script Folder",
  })
  return folderUri
}

export const createConstantMap = async (
  readFolder: vscode.Uri[],
  folderName: string,
  fileName: string,
): Promise<Map<string, object>> => {
  const enumsPath = path.join(readFolder[0].fsPath, folderName, fileName)
  const constantMap: Map<string, object> = new Map()
  if (fs.existsSync(enumsPath)) {
    const fileContent = await fs.promises.readFile(enumsPath, "utf8")
    const regex = /var\s+(\w+)\s*=\s*({[^}]+});/g
    let match
    while ((match = regex.exec(fileContent)) !== null) {
      try {
        // JSON変換に不都合な部分を置換する
        // 16進数の値はJSON.parseには使えないため、文字列に変換する
        const jsonString = match[2]
          .replace(/\/\/.*/g, "")
          .replace(/(\w+)\s*:/g, '"$1":')
          .replace(/'/g, '"')
          .replace(/0x[0-9a-fA-F]+/g, (hex) => `"${hex}"`)
        constantMap.set(match[1], JSON.parse(jsonString))
      } catch (e) {
        console.log(e)
      }
    }
  }
  return constantMap
}

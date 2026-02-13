import * as vscode from "vscode";

const BASE_URL = "http://localhost:3000";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context: vscode.ExtensionContext
  ) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      console.log("Message received in backend:", data.command);
      switch (data.command) {
        case "checkLogin": {
          const savedAuth = this._context.globalState.get<{ auth: string, username: string }>("loginData");
          if (savedAuth) {
            this._view?.webview.postMessage({
              command: "loginResponse",
              success: true,
              auth: savedAuth.auth,
              username: savedAuth.username,
            });
          }
          break;
        }
        case "getFiles": {
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (!workspaceFolders) {
            this._view?.webview.postMessage({ command: "files", value: [] });
            return;
          }

          const rootUri = workspaceFolders[0].uri;
          try {
            const entries = await vscode.workspace.fs.readDirectory(rootUri);
            const files = entries.map(([name, type]) => ({
              name,
              type: type === vscode.FileType.Directory ? 'directory' : 'file'
            }));
            this._view?.webview.postMessage({ command: "files", value: files });
          } catch (err) {
            console.error(err);
          }
          break;
        }
        case "login": {
          const { username, password } = data.value;
          const auth = Buffer.from(`${username}:${password}`).toString("base64");
          try {
            const response = await fetch(`${BASE_URL}/register`, {
              method: "POST",
              headers: {
                Authorization: `Basic ${auth}`,
              },
            });

            if (response.ok) {
              const result: any = await response.json();
              const problems = result.problems || [];

              // Persist login
              await this._context.globalState.update("loginData", { auth, username });

              // Create files for problems
              const workspaceFolders = vscode.workspace.workspaceFolders;
              if (workspaceFolders) {
                const rootUri = workspaceFolders[0].uri;
                for (const problem of problems) {
                  const fileName = `${problem.id}.${problem.lang}`;
                  const fileUri = vscode.Uri.joinPath(rootUri, fileName);
                  const content = Buffer.from(problem.code, "utf8");
                  try {
                    await vscode.workspace.fs.writeFile(fileUri, content);
                  } catch (err) {
                    console.error(`Error writing file ${fileName}:`, err);
                  }
                }
              }

              this._view?.webview.postMessage({
                command: "loginResponse",
                success: true,
                auth,
                username,
              });
            } else {
              const errorData = await response.json().catch(() => ({}));
              this._view?.webview.postMessage({
                command: "loginResponse",
                success: false,
                error: errorData.error || "Invalid credentials",
              });
            }
          } catch (err) {
            console.error("Login fetch error:", err);
            this._view?.webview.postMessage({
              command: "loginResponse",
              success: false,
              error: "Server connection failed",
            });
          }
          break;
        }
        case "logout": {
          const result = await vscode.window.showInformationMessage(
            "Are you sure you want to log out?",
            "Yes",
            "No"
          );

          if (result === "Yes") {
            await this._context.globalState.update("loginData", undefined);
            this._view?.webview.postMessage({ command: "logoutSuccess" });
          }
          break;
        }
        case "openFile": {
          const { fileName } = data.value;
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (!workspaceFolders) {
            return;
          }

          const fileUri = vscode.Uri.joinPath(workspaceFolders[0].uri, fileName);
          try {
            const document = await vscode.workspace.openTextDocument(fileUri);
            await vscode.window.showTextDocument(document);
          } catch (err) {
            vscode.window.showErrorMessage(`Error opening file: ${err}`);
          }
          break;
        }
        case "submit": {
          const { fileName, auth } = data.value;
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (!workspaceFolders) {
            return;
          }

          const fileUri = vscode.Uri.joinPath(workspaceFolders[0].uri, fileName);
          try {
            const contentBuffer = await vscode.workspace.fs.readFile(fileUri);
            const content = new TextDecoder().decode(contentBuffer);

            const response = await fetch(`${BASE_URL}/submit`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${auth}`,
              },
              body: JSON.stringify({
                problemId: fileName.split(".")[0],
                solution: content,
              }),
            });

            const result = await response.json();
            if (response.ok) {
              vscode.window.showInformationMessage(`Submitted ${fileName} successfully!`);
              this._view?.webview.postMessage({
                command: "submissionResponse",
                success: true,
                fileName,
              });
            } else {
              vscode.window.showErrorMessage(`Submission failed: ${result.error}`);
              this._view?.webview.postMessage({
                command: "submissionResponse",
                success: false,
                fileName,
                error: result.error,
              });
            }
          } catch (err) {
            vscode.window.showErrorMessage(`Error submitting file: ${err}`);
          }
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "dist", "webview", "home.js")
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'nonce-${nonce}' 'unsafe-eval';">
    <title>BugZero Sidebar</title>
</head>
<body>
    <div id="root">Loading BugZero (React)...</div>
    <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
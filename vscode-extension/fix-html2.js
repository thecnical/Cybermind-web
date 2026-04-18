const fs = require('fs');

let html = fs.readFileSync('src/panel/webview/chat.html', 'utf8');

// Fix broken ?? fallback icons in JS strings
html = html.replace(/a\.icon \|\| '(\?\?)'/, "a.icon || '\uD83E\uDD16'");
html = html.replace(/a\.icon \|\| '(\?\?)'/, "a.icon || '\uD83E\uDD16'");

// Fix file icon in at-mention dropdown
html = html.replace(
  "'<span class=\"dropdown-item-icon\">??</span>'",
  "'<span class=\"dropdown-item-icon\">\uD83D\uDCC4</span>'"
);

// Fix model selector arrow in loadSessionIntoUI
html = html.replace(
  "document.getElementById('btn-model-selector').textContent = currentModel + ' ?';",
  "document.getElementById('btn-model-selector').textContent = currentModel + ' \u25BE';"
);

// Fix agent selector arrow in loadSessionIntoUI
html = html.replace(
  "document.getElementById('btn-agent-selector').innerHTML = agent.icon + ' ' + agent.name + ' ?';",
  "document.getElementById('btn-agent-selector').textContent = agent.icon + ' ' + agent.name + ' \u25BE';"
);

// Fix model dropdown item click handler arrow
html = html.replace(
  "document.getElementById('btn-model-selector').textContent = name + ' ?';",
  "document.getElementById('btn-model-selector').textContent = name + ' \u25BE';"
);

// Fix welcome screen signup URL
html = html.replace(
  "https://cybermind-backend-8yrt.onrender.com/signup",
  "https://cybermindcli1.vercel.app/auth/register"
);

// Fix "Continue Free" to not send empty API key
html = html.replace(
  "vscode.postMessage({ type: 'signInWithApiKey', apiKey: '' });\n    showScreen('chat');",
  "showScreen('chat');\n    vscode.postMessage({ type: 'continueAsFree' });"
);

fs.writeFileSync('src/panel/webview/chat.html', html, 'utf8');
console.log('Fixed chat.html (pass 2)');

// Verify no more ?? in JS section
const jsStart = html.indexOf('<script nonce=');
const jsSection = html.slice(jsStart);
const broken = (jsSection.match(/\?\?/g) || []).length;
console.log('Remaining ?? in JS:', broken);

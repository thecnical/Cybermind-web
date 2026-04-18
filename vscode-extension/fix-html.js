const fs = require('fs');

// Fix chat.html broken characters and logic issues
let html = fs.readFileSync('src/panel/webview/chat.html', 'utf8');

// Fix broken replacement character (U+FFFD) used as bullet/separator
html = html.replace(/\uFFFD/g, '\u00B7');

// Fix broken emoji placeholders in JS (the ?? ones that are garbled)
// These appear in AGENT_ICONS and dropdown rendering
html = html.replace(/'security: '\\?\\?'/g, "security: '\uD83D\uDD12'");

// Fix the agent icon rendering in dropdown - replace ?? with proper fallback
html = html.replace(/escHtml\(a\.icon \|\| '\\?\\?'\)/g, "escHtml(a.icon || '\uD83E\uDD16')");
html = html.replace(/escHtml\(a\.icon \|\| '\\?\\?'\)/g, "escHtml(a.icon || '\uD83E\uDD16')");

// Fix welcome screen signup URL
html = html.replace(
  "vscode.postMessage({ type: 'openExternal', url: 'https://cybermind-backend-8yrt.onrender.com/signup' });",
  "vscode.postMessage({ type: 'openExternal', url: 'https://cybermindcli1.vercel.app/auth/register' });"
);

// Fix "Continue Free" - should show chat without requiring API key
html = html.replace(
  "document.getElementById('btn-continue-free').addEventListener('click', function() {\n    vscode.postMessage({ type: 'signInWithApiKey', apiKey: '' });\n    showScreen('chat');\n  });",
  "document.getElementById('btn-continue-free').addEventListener('click', function() {\n    showScreen('chat');\n    vscode.postMessage({ type: 'continueAsFree' });\n  });"
);

// Fix model selector arrow character
html = html.replace(/\+ ' \?' \+ /g, "+ ' \u25BE' + ");
html = html.replace(/\+ ' \?'/g, "+ ' \u25BE'");
html = html.replace(/' \?'/g, "' \u25BE'");

// Fix file icon in at-mention
html = html.replace(/'<span class="dropdown-item-icon">\\?\\?<\/span>'/g, "'<span class=\"dropdown-item-icon\">\uD83D\uDCC4</span>'");

// Fix scan results emoji
html = html.replace("'?? Security Scan Complete'", "'\uD83D\uDD0D Security Scan Complete'");

fs.writeFileSync('src/panel/webview/chat.html', html, 'utf8');
console.log('Fixed chat.html');
console.log('File size:', html.length);

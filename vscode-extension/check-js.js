const fs = require('fs');
const html = fs.readFileSync('src/panel/webview/chat.html', 'utf8');
const scriptStart = html.indexOf('<script nonce=');
const scriptEnd = html.lastIndexOf('</script>');
const rawScript = html.slice(scriptStart, scriptEnd + 9);
// Extract just the JS content between the script tags
const jsContent = rawScript.replace(/<script[^>]*>/, '').replace(/<\/script>$/, '');

try {
  // Wrap in a function to allow top-level return etc
  new Function('acquireVsCodeApi', jsContent);
  console.log('✅ JS syntax is VALID');
} catch(e) {
  console.log('❌ JS SYNTAX ERROR:', e.message);
  
  // Find the line
  const lines = jsContent.split('\n');
  const match = e.message.match(/line (\d+)/i);
  if (match) {
    const lineNum = parseInt(match[1]) - 1;
    console.log('\nContext around line', lineNum + 1, ':');
    for (let i = Math.max(0, lineNum - 5); i < Math.min(lines.length, lineNum + 5); i++) {
      const marker = i === lineNum ? '>>> ' : '    ';
      console.log(marker + (i+1) + ': ' + lines[i]);
    }
  }
}

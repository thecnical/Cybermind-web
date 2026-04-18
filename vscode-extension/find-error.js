const fs = require('fs');
const html = fs.readFileSync('src/panel/webview/chat.html', 'utf8');
const scriptStart = html.indexOf('<script nonce=');
const scriptEnd = html.lastIndexOf('</script>');
const js = html.slice(scriptStart + html.slice(scriptStart).indexOf('>') + 1, scriptEnd);

const lines = js.split('\n');
console.log('Total JS lines:', lines.length);

// Binary search for the error line
let lo = 0, hi = lines.length;
while (lo < hi - 1) {
  const mid = Math.floor((lo + hi) / 2);
  try {
    new Function(lines.slice(0, mid).join('\n'));
    lo = mid;
  } catch(e) {
    hi = mid;
  }
}
console.log('Error around line', hi);
for (let i = Math.max(0, hi-8); i < Math.min(lines.length, hi+8); i++) {
  console.log((i+1) + ': ' + lines[i].slice(0, 150));
}

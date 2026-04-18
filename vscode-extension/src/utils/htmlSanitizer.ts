/**
 * Escapes HTML special characters to prevent XSS in Webview content.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Converts a subset of Markdown to safe HTML.
 * Supports: code blocks, inline code, bold, italic, links (validated), paragraphs.
 * Strips: script, iframe, object, embed, form tags.
 */
export function sanitizeMarkdown(markdown: string): string {
  let html = markdown;

  // Strip dangerous tags first
  html = html.replace(/<\s*(script|iframe|object|embed|form|input|button)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, '');
  html = html.replace(/<\s*(script|iframe|object|embed|form|input|button)[^>]*\/?>/gi, '');

  // Fenced code blocks: ```lang\ncode\n```
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escapedCode = escapeHtml(code.trimEnd());
    const langAttr = lang ? ` class="language-${escapeHtml(lang)}"` : '';
    return `<pre><code${langAttr}>${escapedCode}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`\n]+)`/g, (_, code) => {
    return `<code>${escapeHtml(code)}</code>`;
  });

  // Bold: **text** or __text__
  html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_\n]+)_/g, '<em>$1</em>');

  // Links: [text](url) — only allow https:// and http:// URLs
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    const trimmedUrl = url.trim();
    if (/^https?:\/\//i.test(trimmedUrl)) {
      return `<a href="${escapeHtml(trimmedUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
    }
    return escapeHtml(text);
  });

  // Paragraphs: double newlines
  html = html.replace(/\n\n+/g, '</p><p>');
  html = `<p>${html}</p>`;

  // Single newlines to <br>
  html = html.replace(/\n/g, '<br>');

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

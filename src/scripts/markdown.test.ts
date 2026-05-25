import MarkdownIt from 'markdown-it';
import { describe, expect, it } from 'vite-plus/test';
import { mdMermaid } from '@/scripts/markdown';

describe('mdMermaid', () => {
  it('emits a pre.mermaid.not-prose block for ```mermaid fences', () => {
    const md = new MarkdownIt();
    md.use(mdMermaid);
    const out = md.render('```mermaid\ngraph TD; A-->B;\n```');
    expect(out).toContain('<pre class="mermaid not-prose">');
    expect(out).toContain('graph TD; A--&gt;B;');
  });

  it('leaves non-mermaid fences alone', () => {
    const md = new MarkdownIt();
    md.use(mdMermaid);
    const out = md.render('```ts\nconst x = 1;\n```');
    expect(out).not.toContain('class="mermaid');
    expect(out).toContain('<code');
  });
});

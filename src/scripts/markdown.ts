import type MarkdownIt from 'markdown-it';

const MD_LINK = /^(?:\.\/)?([^#?:/]+(?:\/[^#?:/]+)*)\.md(\?[^#]*)?(#.*)?$/u;

export function mdLinkRewriter(md: MarkdownIt): void {
  const defaultRender =
    md.renderer.rules.link_open ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (!token) return defaultRender(tokens, idx, options, env, self);
    const hrefIndex = token.attrIndex('href');
    if (hrefIndex >= 0) {
      const href = token.attrs?.[hrefIndex]?.[1];
      if (href) {
        const match = href.match(MD_LINK);
        if (match) {
          const basename = match[1]?.split('/').pop() ?? '';
          const query = match[2] ?? '';
          const hash = match[3] ?? '';
          const path = basename === 'index' ? '' : `/${basename}`;
          token.attrs![hrefIndex]![1] = `${path || '/'}${query}${hash}`;
        }
      }
    }
    return defaultRender(tokens, idx, options, env, self);
  };
}

export function mdTableWrapper(md: MarkdownIt): void {
  const defaultOpen =
    md.renderer.rules.table_open ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.table_open = (tokens, idx, options, env, self) =>
    `<div class="table-wrap">${defaultOpen(tokens, idx, options, env, self)}`;

  const defaultClose =
    md.renderer.rules.table_close ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.table_close = (tokens, idx, options, env, self) =>
    `${defaultClose(tokens, idx, options, env, self)}</div>`;
}

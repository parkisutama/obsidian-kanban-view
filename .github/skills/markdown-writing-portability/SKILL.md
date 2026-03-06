---
name: markdown-writing-portability
description: >
  Definitive guide for writing portable, cross-platform Markdown (CommonMark,
  GFM, Obsidian). Use this skill every time you write, edit, or review any
  Markdown document — READMEs, Obsidian notes, technical docs, blog posts,
  or any .md content. This skill prescribes exact syntax choices (not
  suggestions) based on compatibility testing across 7 platforms: Hugo,
  Quartz, MkDocs, Pandoc, GitHub/GitHub Pages, Typora, and Obsidian. Also
  trigger when the user asks to fix, lint, or improve an existing Markdown
  file, or when converting content to Markdown format.
---

# Portable & Compatible Markdown Writing

Two governing principles — apply to every decision:

1. **Obsidian is a renderer, not the format authority.** Every `.md` file
   MUST be readable and meaningful outside Obsidian without conversion.
2. **Syntax hierarchy: CommonMark → GFM → Wide Extensions → Obsidian-only.**
   ALWAYS use the lowest level that satisfies the requirement.

Output MUST be processable without modification by: Hugo, Quartz, MkDocs,
Pandoc, GitHub/GitHub Pages, Typora, and Obsidian.

---

## 1. DEFINITIVE SYNTAX TABLE

This table is the primary reference. Every row is a final decision, not a
choice. When writing Markdown, follow this table exactly.

| Need | MUST Use | NEVER Use | Level |
| --- | --- | --- | --- |
| Bold | `**text**` | `__text__` | CommonMark |
| Italic | `*text*` | `_text_` | CommonMark |
| Bold italic | `***text***` | `___text___` | CommonMark |
| Heading | `# H1` … `#### H4` (ATX style) | Setext (`===` / `---` underline) | CommonMark |
| Link | `[text](url)` | — | CommonMark |
| Image | `![alt text](image.png)` | — | CommonMark |
| Internal link | `[Text](file.md)` | `[[file]]` | CommonMark |
| Inline code | `` `code` `` | — | CommonMark |
| Code block | ` ```language ` (ALWAYS specify language) | Indented code block (4 spaces) | CommonMark |
| Blockquote | `> text` | — | CommonMark |
| Unordered list | `- item` (dash only) | `*` or `+` as list marker | CommonMark |
| Ordered list | `1. item` | — | CommonMark |
| Thematic break | `---` | `***` or `___` | CommonMark |
| Strikethrough | `~~text~~` | — | GFM |
| Task list | `- [ ] item` / `- [x] item` | — | GFM |
| Table | GFM pipe table (compact style, leading + trailing pipe) | — | GFM |
| Callout / Alert | `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` | Obsidian-only types (`[!example]`, `[!info]`, `[!quote]`) | GFM |
| Footnote | `[^1]` … `[^1]: text` | — | Wide Extension (7/7 platforms) |
| Math inline | `$expression$` | — | Wide Extension |
| Math block | `$$expression$$` | — | Wide Extension |
| Highlight | `<mark>text</mark>` | `==text==` | HTML inline (6/7 platforms) |
| Tags / metadata | YAML frontmatter `tags:` (multiline list) | `#tag` inline in body | Frontmatter |
| Embed file | `![[file.md]]` — **ONLY if target is Obsidian-only** | — | Obsidian |
| Bare URL | `<https://url>` or `[text](url)` | `https://url` naked in text | CommonMark |

> **Highlight note:** `<mark>` is supported by 6/7 platforms. Hugo requires
> `markup.goldmark.renderer.unsafe: true`. If the primary target is Hugo
> without custom config, use `**bold**` as fallback instead of `<mark>`.

---

## 2. FORMATTING RULES

### Headings

- ALWAYS place exactly one space after `#` — write `# Title`, not `#Title`
- ALWAYS increment one level at a time — NEVER skip (e.g., H2 → H4)
- ALWAYS surround headings with exactly one blank line above and below
- NEVER use more than one H1 per document
- NEVER use identical heading text more than once in a document
  (`MD024/no-duplicate-heading`). Duplicate headings produce colliding
  anchor IDs, broken TOC entries, and ambiguous link targets. When a
  document repeats a section structure (e.g., iterations, changelog
  entries), append distinguishing context to each heading:
  `### Hasil — Runtime TypeError` instead of bare `### Hasil`

### Emphasis

- ALWAYS use asterisks (`*`, `**`, `***`) — NEVER underscores
- Reason: underscores inside words (`my_variable_name`) are not parsed as
  emphasis in GFM and many other parsers; asterisks are universally consistent

### Lists

- ALWAYS use dash (`-`) as unordered list marker
- ALWAYS indent nested lists with exactly **4 spaces** — NEVER use tabs
- Reason: Obsidian requires 4-space indentation for proper nested list rendering;
  tab characters render inconsistently across parsers and should never appear in
  Markdown source
- ALWAYS place one blank line before and after a list block

### Blockquotes

- NEVER separate related blockquote paragraphs with a bare blank line.
  A blank line between two `>` lines creates two separate blockquotes and
  triggers `MD028/no-blanks-blockquote`.
- To add a paragraph break inside a blockquote, use a line with only `>`:

```markdown
> First paragraph
>
> Second paragraph (same blockquote)
```

- NEVER write:

```markdown
> First paragraph

> Second paragraph (MD028 violation — two separate blockquotes)
```

### Tables

- ALWAYS use leading and trailing pipes on every row
- ALWAYS use compact column style: 1 space padding, minimal `---` delimiter
- ALWAYS surround tables with one blank line above and below
- ALWAYS ensure all rows have the same number of columns
- NEVER use aligned/padded style — emoji and Unicode characters (✅, ❌, etc.)
  have inconsistent display widths that break visual alignment and trigger
  `MD060/table-column-style` violations. Compact style is immune to this.
- The delimiter row MUST use the same spacing as data rows: `| --- |`,
  NEVER `|---|`

```markdown
| Header 1 | Header 2 | Header 3 |
| --- | --- | --- |
| Cell | Cell | Cell |
```

For column alignment, use colons on the delimiter row:

```markdown
| Left | Center | Right |
| :--- | :---: | ---: |
| text | text | text |
```

### Code Blocks

- ALWAYS use fenced code blocks (`` ``` ``) with a language identifier
- NEVER use indented code blocks (4-space indent)
- For non-code content (diagrams, plain text, version lists, command output),
  use `text` as the language identifier. This satisfies `MD040/fenced-code-language`
  while signaling that no syntax highlighting is needed.

### Frontmatter

Every document MUST include YAML frontmatter with at minimum these fields:

```yaml
---
title: Document Title
created: 2026-03-05T14:30
modified: 2026-03-05T14:30
tags:
  - tag1
  - tag2
---
```

- `created` and `modified` use `YYYY-MM-DDTHH:mm` format (ISO 8601 without
  seconds). This matches the Obsidian Linter `yaml-timestamp` configuration.
- `title` is auto-generated by Obsidian Linter's `yaml-title` rule from
  the first H1 or filename.

### Whitespace

- NEVER leave trailing spaces at end of lines
- ALWAYS use spaces, NEVER tabs
- NEVER use more than one consecutive blank line

### URLs

- NEVER use bare URLs in body text — ALWAYS wrap in angle brackets or use
  a proper Markdown link
- Write `<https://example.com>` or `[Example](https://example.com)`,
  NEVER just `https://example.com` on its own
- Reason: bare URLs render inconsistently across parsers; both Obsidian
  Linter (`no-bare-urls`) and VSCode markdownlint (`MD034`) enforce this

### Inline HTML and Highlights

- Use `<mark>text</mark>` for highlights instead of `==text==`
- Note: VSCode markdownlint rule `MD033` blocks all inline HTML by default.
  To allow `<mark>`, add to `.markdownlint.json`:
  `"MD033": { "allowed_elements": ["mark"] }`
- Obsidian Linter does not restrict inline HTML

---

## 3. OBSIDIAN PORTABILITY RULES

Obsidian-specific syntax is ONLY permitted when BOTH conditions are true:
(a) no standard equivalent exists, AND (b) the file is explicitly designed
as Obsidian-only (will never be exported or read elsewhere).

| Syntax | Decision | Reason |
| --- | --- | --- |
| `![[embed]]` | ✅ Allowed (Obsidian-only files) | No standard equivalent exists |
| `[[wikilink]]` | ❌ Replace with `[Text](file.md)` | CommonMark equivalent exists |
| `==highlight==` | ❌ Replace with `<mark>text</mark>` | HTML inline equivalent exists |
| `> [!info]`, `> [!example]` | ❌ Replace with standard GFM Alerts | Use only: NOTE, TIP, IMPORTANT, WARNING, CAUTION |
| `#tag` inline | ❌ Replace with frontmatter `tags:` | YAML equivalent exists |

---

## 4. USE CASE GUIDE

| Use Case | Target Platform | Allowed Syntax |
| --- | --- | --- |
| GitHub README | GFM | CommonMark + GFM (Alerts, Tables, Task lists, Strikethrough) |
| Technical docs | CommonMark | Core features + Fenced code blocks (with language) |
| Blog post | GFM | Core + Tables + GFM Alerts + Footnotes |
| Portable notes | Obsidian + export | CommonMark + GFM; avoid all Obsidian-only syntax |
| Local-only notes | Obsidian-only | All syntax allowed — accept migration cost tradeoff |
| Knowledge base | GFM | CommonMark + GFM; avoid all Obsidian-only syntax |
| API documentation | CommonMark | Core + Fenced code blocks (with language) |

---

## 5. PRE-PUBLISH CHECKLIST

Before finalizing any Markdown document, verify every item:

- [ ] Internal links use `[text](file.md)`, not `[[file]]`
- [ ] Highlights use `<mark>`, not `==text==` (VSCode needs `MD033` config for `mark`)
- [ ] Callouts use standard GFM Alerts only (NOTE / TIP / IMPORTANT / WARNING / CAUTION)
- [ ] Tags are in YAML frontmatter, not inline `#tag` in body text
- [ ] Tables use GFM pipe syntax, compact style, with leading + trailing pipes
- [ ] Table delimiter rows use spaced format `| --- |`, never `|---|` (MD060)
- [ ] Emphasis uses asterisks (`*` / `**` / `***`), never underscores
- [ ] Lists use dash `-`, 4-space indent for nesting (never tabs), blank line before and after
- [ ] Headings have space after `#`, increment one level at a time, max one H1
- [ ] No duplicate heading text in the same document — append context to disambiguate (MD024)
- [ ] Code blocks are fenced with language identifier, never indented style (MD040)
- [ ] Non-code fenced blocks (diagrams, plain text) use `text` as language
- [ ] Frontmatter includes at minimum: `title`, `created`, `modified`, `tags`
- [ ] Timestamps use `YYYY-MM-DDTHH:mm` format (ISO 8601 without seconds)
- [ ] No bare URLs — wrap in `<url>` or `[text](url)`
- [ ] Consecutive blockquote paragraphs use `>` on blank line, not bare blank line (MD028)
- [ ] No trailing spaces, no tabs, no multiple consecutive blank lines
- [ ] Embeds (`![[]]`) used only in Obsidian-only files with no standard alternative

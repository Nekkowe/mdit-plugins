import MarkdownIt from "markdown-it";
import { describe, expect, it } from "vitest";

import { spoiler } from "../src/index.js";

describe("spoiler", () => {
  const markdownIt = MarkdownIt({ linkify: true }).use(spoiler);

  it("should render", () => {
    expect(markdownIt.render(`||Mark||`)).toEqual(
      `<p><span class="spoiler" tabindex="-1">Mark</span></p>\n`,
    );
  });

  it("Can nested", () => {
    expect(markdownIt.render(`x ||||||||foo|| bar||`)).toEqual(
      `<p>x <span class="spoiler" tabindex="-1"><span class="spoiler" tabindex="-1">foo</span> bar</span></p>\n`,
    );
    expect(markdownIt.render(`x ||foo ||bar||||`)).toEqual(
      `<p>x <span class="spoiler" tabindex="-1">foo <span class="spoiler" tabindex="-1">bar</span></span></p>\n`,
    );
    expect(markdownIt.render(`x ||||foo||||`)).toEqual(
      `<p>x <span class="spoiler" tabindex="-1"><span class="spoiler" tabindex="-1">foo</span></span></p>\n`,
    );
    expect(markdownIt.render(`||foo ||bar|| baz||`)).toEqual(
      `<p><span class="spoiler" tabindex="-1">foo <span class="spoiler" tabindex="-1">bar</span> baz</span></p>\n`,
    );
    expect(markdownIt.render(`||f **o ||o b|| a** r||`)).toEqual(
      `<p><span class="spoiler" tabindex="-1">f <strong>o <span class="spoiler" tabindex="-1">o b</span> a</strong> r</span></p>\n`,
    );
  });

  it("should handle multiple '|'", () => {
    expect(markdownIt.render(`x |||foo|||`)).toEqual(
      `<p>x |<span class="spoiler" tabindex="-1">foo</span>|</p>\n`,
    );
  });

  it("Have the same priority as emphases", () => {
    expect(markdownIt.render(`**||test**||`)).toEqual(
      `<p><strong>||test</strong>||</p>\n`,
    );
    expect(markdownIt.render(`||**test||**`)).toEqual(
      `<p><span class="spoiler" tabindex="-1">**test</span>**</p>\n`,
    );
  });

  it("Have the same priority as emphases with respect to links", () => {
    expect(markdownIt.render(`[||link]()||`)).toEqual(
      `<p><a href="">||link</a>||</p>\n`,
    );
    expect(markdownIt.render(`||[link||]()`)).toEqual(
      `<p>||<a href="">link||</a></p>\n`,
    );
  });

  it("Have the same priority as emphases with respect to backticks", () => {
    expect(markdownIt.render("||`code||`")).toEqual(
      `<p>||<code>code||</code></p>\n`,
    );
    expect(markdownIt.render("` || code`||")).toEqual(
      `<p><code> || code</code>||</p>\n`,
    );
  });

  it("should not render a whitespace or newline between text and '||'", () => {
    expect(markdownIt.render("foo || bar || baz")).toEqual(
      `<p>foo || bar || baz</p>\n`,
    );

    expect(
      markdownIt.render(`
||test
|| a
`),
    ).toEqual(`<p>||test
|| a</p>\n`);

    expect(
      markdownIt.render(`
||
test||
`),
    ).toEqual(`<p>||
test||</p>\n`);
  });
});

import { container } from "@mdit/plugin-container";
import { snippet } from "@mdit/plugin-snippet";
import { getDirname, path } from "@vuepress/utils";
import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import theme from "./theme.js";

import type { MarkdownEnv } from "@vuepress/markdown";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/mdit-plugins/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Markdown It Plugins",
      description: "Some powerful markdown-it plugins",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "Markdown It 插件",
      description: "一些强大的 markdown-it 插件",
    },
  },

  markdown: {
    code: {
      lineNumbers: 10,
    },
  },

  pagePatterns: ["**/*.md", "!**/*.snippet.md", "!.vuepress", "!node_modules"],

  extendsMarkdown: (md) => {
    md.use(container, {
      name: "hint",
      openRender: (tokens, index, _options): string => {
        const token = tokens[index];

        // resolve info (title)
        let info = token.info.trim().slice(4).trim();

        return `<div class="custom-container hint">\n<p class="custom-container-title">${
          info || "Hint"
        }</p>\n`;
      },
    });

    md.use(snippet, {
      currentPath: (env: MarkdownEnv) => env.filePath,

      // add support for @snippets/ alias
      resolvePath: (filePath: string, cwd: string) => {
        if (filePath.startsWith("@snippets/"))
          return path.resolve(
            __dirname,
            "snippets",
            filePath.replace("@snippets/", "")
          );

        return path.join(cwd, filePath);
      },
    });
  },

  theme,

  plugins: [searchProPlugin({ indexContent: true })],
});

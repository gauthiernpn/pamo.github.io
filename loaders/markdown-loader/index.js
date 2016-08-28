import frontMatter from 'front-matter';
import markdownIt from 'markdown-it';
import emoji from 'markdown-it-emoji';
import instagramEmbed from './embed';
import hljs from 'highlight.js';
import objectAssign from 'object-assign';
import mdFigCaption from 'mdfigcaption';

const highlight = (str, lang) => {
  if ((lang !== null) && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str).value;
    } catch (_error) {
      console.error(_error);
    }
  }
  try {
    return hljs.highlightAuto(str).value;
  } catch (_error) {
    console.error(_error);
  }
  return '';
};

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight,
})
  .use(mdFigCaption)
  .use(emoji)
  .use(instagramEmbed);

module.exports = function (content) {
  this.cacheable();
  const meta = frontMatter(content);
  const body = md.render(meta.body);
  const result = objectAssign({}, meta.attributes, {
    body,
  });
  this.value = result;
  return `module.exports = ${JSON.stringify(result)}`;
};

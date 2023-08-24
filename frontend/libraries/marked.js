import {marked} from 'marked';
import {markedHighlight} from "marked-highlight";
// import hljs from 'highlight.js/lib/languages/accesslog'
// import godot from 'highlightjs-gdscript/src/languages/gdscript.js'
import { markedUrlPattern } from './marked_urlpatterns';

// hljs.registerLanguage('godot', godot);
import Prism from 'prismjs'
// import 'prismjs/components/prism-gdscript';
import 'prismjs/components/prism-csharp';

// import 'prismjs/plugins/line-numbers/prism-line-numbers';
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

Prism.languages.gdscript = Prism.languages.extend('clike', {
  keyword: /\b(?:const|export|onready|tool|var|if|elif|else|while|for|break|continue|pass|match|extends|class|class_name|func|static|return|true|false|null|self|preload|yield|signal|enum|in|not|assert|remote|master|sync|puppet|slave)\b/,
  operator: /\.\.\.|[!$%&*+\-~\/^<=>]=?|\|\||\/\/|->/,
});

function sanitize(str) {
  return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
}

marked.use({
  renderer: {
    image(src, title, alt) {
      if (title !== null && title.startsWith('=')) {
        const [width, height] = title.startsWith('=') ? title.slice(1).split('x').map(v => v.trim()).filter(Boolean) : [];
        return `<img src="${sanitize(src)}" alt="${sanitize(alt)}" ${width ? ` width="${width}"${height ? ` height="${height}"` : ''}` : ''}>`;
      }else{
        return `<img src="${sanitize(src)}" alt="${sanitize(alt)}" class='defaultimg'>`;
      }
    }
  }
})


marked.setOptions({
  mangle: false,
  headerIds: false,
  gfm: true,
  unicode: true
})

// marked.use(markedHighlight({
//   langPrefix: 'hljs language-',
//   highlight(code, lang) {
//     const language = hljs.getLanguage(lang) ? lang : 'plaintext';
//     return hljs.highlight(code, { language }).value;
//   }
// }));

marked.use(markedHighlight({
  // langPrefix: 'hljs language-',
  highlight(code, lang) {
    
    // const language = hljs.getLanguage(lang) ? lang : 'text';
    if (Prism.languages[lang]) {
      var highlighted = Prism.highlight(code, Prism.languages[lang], lang);
      return highlighted;
    }else{
      return code;
    }

  }
}));





marked.use(markedUrlPattern);

export {marked};
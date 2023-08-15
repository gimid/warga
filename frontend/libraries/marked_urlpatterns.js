const markedUrlPattern = {
  extensions: [{
    name: 'importUrl',
    level: 'block',
    start(src) { return src.indexOf('\n{%'); },
    tokenizer(src) {
      const rule = /^\s*{% embed\s+(.*?)\s*%}/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'importUrl',
          raw: match[0],
          url: match[1],
          html: '' // will be replaced in walkTokens
        };
      }
    },
    renderer(token) {
      return token.html;
    }
  }],
  async: true, // needed to tell marked to return a promise
  async walkTokens(token) {
    if (token.type === 'importUrl') {
      // const res = await fetch(token.url);
      // token.html = await res.text();
      token.html = await parseEmbed(token.url)
    }
  }
};


const parseEmbed = async(url) => {
  if (url.includes("youtube.com")) {
    return parseYoutube(url)
  }else if (url.includes("itch.io")) {
    return parseItch(url)
  }

  return ""
}

const parseYoutube = (url) => {
  const rule = /(?:\?v=|\/embed\/|\/\d+\/|\/vi\/|\/v\/|https?:\/\/(?:www\.)?youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|watch&.+v=))([^#\&\?\/\s]{11})/;
  const match = rule.exec(url);

  if (match != null) {
    if (match.length > 1) {
      const videoID = match[1];
      return `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
    }
  }
  
  return `<div>Youtube Embed Error (${url}) </div>`;
}


const parseItch = (url) => {

  const rule = /https?:\/\/itch.io\/embed-upload\/(\d+)/;
  const match = rule.exec(url);

  console.log(rule)

  if (match != null) {
    if (match.length > 1) {
      const gameID = match[1];
      return `<div><iframe  width="560" height="315" frameborder="0" src="https://itch.io/embed-upload/${gameID}?color=333333"></iframe></div>asdasd`;
    }
  }
  
  return `<div>itch.io Embed Error (${url}) </div>`;

  
}

export {markedUrlPattern};
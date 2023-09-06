const ytRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
function youtubeParser(url) {
  const match = url.match(ytRegex);
  return match && match[7].length === 11 ? match[7] : url;
}

/* eslint-disable max-len */
const vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
/* eslint-enable max-len */
function vimeoParser(url) {
  const match = url.match(vimeoRegex);
  return match && typeof match[3] === 'string' ? match[3] : url;
}

// const vineRegex = /^http(?:s?):\/\/(?:www\.)?vine\.co\/v\/([a-zA-Z0-9]{1,13}).*/;
// function vineParser(url) {
//   const match = url.match(vineRegex);
//   return match && match[1].length === 11 ? match[1] : url;
// }

// const preziRegex = /^https:\/\/prezi.com\/(.[^/]+)/;
// function preziParser(url) {
//   const match = url.match(preziRegex);
//   return match ? match[1] : url;
// }

// // TODO: Write regex for staging and local servers.
// const mfrRegex = /^http(?:s?):\/\/(?:www\.)?mfr\.osf\.io\/render\?url=http(?:s?):\/\/osf\.io\/([a-zA-Z0-9]{1,5})\/\?action=download/;
// function mfrParser(url) {
//   const match = url.match(mfrRegex);
//   return match ? match[1] : url;
// }


// const EMBED_REGEX = /{% embed ([a-zA-Z]+) [\s]*(.*?)[\s]*[%}]/im;
const EMBED_REGEX = /{% embed[\s]*(.*?)[\s]*%}/im;

function videoEmbed(md, options) {
  function videoReturn(state, silent) {
    var serviceEnd;
    var serviceStart;
    var token;
    var videoID;
    var theState = state;
    const oldPos = state.pos;

    // if (state.src.charCodeAt(oldPos) !== 0x40/* @ */ ||
    //   state.src.charCodeAt(oldPos + 1) !== 0x5B/* [ */) {
    //   return false;
    // }

    const match = EMBED_REGEX.exec(state.src.slice(state.pos, state.src.length));

    if (!match || match.length < 2) {
      return false;
    }

    videoID = match[1];

    let service = "";
    // const service = match[1];
    if (videoID.includes("youtube.com")) {
      service = "youtube"
    }else if(videoID.includes("vimeo.com")){
      service = "vimeo"
    }else if(videoID.includes("github.com")){
      service = "github"
    }else{
      service = "embed";
    }
    
    const serviceLower = service.toLowerCase();

    if (serviceLower === 'youtube') {
      videoID = youtubeParser(videoID);
    }
    // If the videoID field is empty, regex currently make it the close parenthesis.
    if (videoID === ')') {
      videoID = '';
    }

    serviceStart = oldPos + 2;
    serviceEnd = md.helpers.parseLinkLabel(state, oldPos + 1, false);

    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
      theState.pos = serviceStart;
      theState.service = theState.src.slice(serviceStart, serviceEnd);
      const newState = new theState.md.inline.State(service, theState.md, theState.env, []);
      newState.md.inline.tokenize(newState);

      token = theState.push('video', '');
      token.videoID = videoID;
      token.service = service;
      token.url = match[1];
      token.level = theState.level;
      console.log(token)
    }

    theState.pos += theState.src.indexOf('}', theState.pos);
    return true;
  }

  return videoReturn;
}

const extractVideoParameters = (url) => {
  const parameterMap = new Map();
  const params = url.replace(/&amp;/gi, '&').split(/[#?&]/);

  if (params.length > 1) {
    for (let i = 1; i < params.length; i += 1) {
      const keyValue = params[i].split('=');
      if (keyValue.length > 1) parameterMap.set(keyValue[0], keyValue[1]);
    }
  }

  return parameterMap;
}


let itIFrame = 0;

const videoUrl = (service, videoID, url, options) => {
  switch (service) {
    case 'youtube': {
      const parameters = extractVideoParameters(url);
      if (options.youtube.parameters) {
        Object.keys(options.youtube.parameters).forEach((key) => {
          parameters.set(key, options.youtube.parameters[key]);
        });
      }

      // Start time parameter can have the format t=0m10s or t=<time_in_seconds> in share URLs,
      // but in embed URLs the parameter must be called 'start' and time must be in seconds
      const timeParameter = parameters.get('t');
      if (timeParameter !== undefined) {
        let startTime = 0;
        const timeParts = timeParameter.match(/[0-9]+/g);
        let j = 0;

        while (timeParts.length > 0) {
          /* eslint-disable no-restricted-properties */
          startTime += Number(timeParts.pop()) * Math.pow(60, j);
          /* eslint-enable no-restricted-properties */
          j += 1;
        }
        parameters.set('start', startTime);
        parameters.delete('t');
      }

      parameters.delete('v');
      parameters.delete('feature');
      parameters.delete('origin');

      const parameterArray = Array.from(parameters, p => p.join('='));
      const parameterPos = videoID.indexOf('?');

      let finalUrl = 'https://www.youtube';
      if (options.youtube.nocookie || url.indexOf('youtube-nocookie.com') > -1) finalUrl += '-nocookie';
      finalUrl += '.com/embed/' + (parameterPos > -1 ? videoID.substr(0, parameterPos) : videoID);
      if (parameterArray.length > 0) finalUrl += '?' + parameterArray.join('&');
      return finalUrl;
    }
    case 'vimeo':
      return 'https://player.vimeo.com/video/' + videoID;
    // case 'vine':
    //   return 'https://vine.co/v/' + videoID + '/embed/' + options.vine.embed;
    // case 'prezi':
    //   return 'https://prezi.com/embed/' + videoID +
    //     '/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;' +
    //     'landing_data=bHVZZmNaNDBIWnNjdEVENDRhZDFNZGNIUE43MHdLNWpsdFJLb2ZHanI5N1lQVHkxSHFxazZ0UUNCRHloSXZROHh3PT0&amp;' +
    //     'landing_sign=1kD6c0N6aYpMUS0wxnQjxzSqZlEB8qNFdxtdjYhwSuI';
    // case 'osf':
    //   return 'https://mfr.osf.io/render?url=https://osf.io/' + videoID + '/?action=download';
    // default:
    //   return service;
    case 'github':
      // console.log(videoID);
      // return videoID;
      return videoID;
    default:
      return service;
  }
}

const tokenizeVideo = (md, options) => {
  function tokenizeReturn(tokens, idx) {
    const videoID = md.utils.escapeHtml(tokens[idx].videoID);
    const service = md.utils.escapeHtml(tokens[idx].service).toLowerCase();

    

    var checkUrl = /http(?:s?):\/\/(?:www\.)?[a-zA-Z0-9-:.]{1,}\/render(?:\/)?[a-zA-Z0-9.&;?=:%]{1,}url=http(?:s?):\/\/[a-zA-Z0-9 -:.]{1,}\/[a-zA-Z0-9]{1,5}\/\?[a-zA-Z0-9.=:%]{1,}/;
    var num;

    if (service === 'osf' && videoID) {
      num = Math.random() * 0x10000;

      if (videoID.match(checkUrl)) {
        return '<div id="' + num + '" class="mfr mfr-file"></div><script>' +
          '$(document).ready(function () {new mfr.Render("' + num + '", "' + videoID + '");' +
          '    }); </script>';
      }
      return '<div id="' + num + '" class="mfr mfr-file"></div><script>' +
        '$(document).ready(function () {new mfr.Render("' + num + '", "https://mfr.osf.io/' +
        'render?url=https://osf.io/' + videoID + '/?action=download%26mode=render");' +
        '    }); </script>';
    }


    if (service === 'github') {
      itIFrame++;

      // return `<div><iframe
      // id="w-iframe"
      // class="w-iframe"
      // width="100%"
      // onload=""
      // src="data:text/html;charset=utf-8,
      // <head><base target='_blank' /></head>
      // <body><script src='${videoID}.js'></script>
      // <script>
        
      // </script>
      // </body>"></iframe><div>`
      // return `<script src="${videoID}.js"></script>`
      // return `<div>test</div>`;

      let gistregex = /https:\/\/gist.github.com\/(?:.+)\/([^\s]+)/;

      let match = gistregex.exec(videoID);
      

      if (match && match.length > 0) {
        return `<code class='gist-container' data-gist-id="${match[1]}"></code>`;
      }

    }

    return videoID === '' ? '' :
      '<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item ' +
      service + '-player" type="text/html" width="' + (options[service].width) +
      '" height="' + (options[service].height) +
      '" src="' + options.url(service, videoID, tokens[idx].url, options) +
      '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
  }

  return tokenizeReturn;
}

const defaults = {
  url: videoUrl,
  youtube: { width: 560, height: 300, nocookie: false },
  vimeo: { width: 500, height: 281 },
  vine: { width: 600, height: 600, embed: 'simple' },
  prezi: { width: 550, height: 400 },
  osf: { width: '100%', height: '100%' },
  embed: { width: '100%', height: '100%' },  
  github: { width: '100%', height: '100%' },
};

const videoplugin = (md, options) => {
  var theOptions = options;
  var theMd = md;
  if (theOptions) {
    Object.keys(defaults).forEach(function checkForKeys(key) {
      if (typeof theOptions[key] === 'undefined') {
        theOptions[key] = defaults[key];
      }
    });
  } else {
    theOptions = defaults;
  }


  theMd.renderer.rules.video = tokenizeVideo(theMd, theOptions);
  theMd.inline.ruler.before('emphasis', 'video', videoEmbed(theMd, theOptions));
};

export{videoplugin}
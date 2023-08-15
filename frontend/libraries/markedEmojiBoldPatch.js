// const emojiRegex = /\*([\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F30D}-\u{1F567}]*)(.*)\*/ug;
const emojiRegex = /([\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F30D}-\u{1F567}])/gu;

// const emojiRegex = /\*Unity(.*)/g;

const markedEmojiBoldPatch = (str) => {  
  return str.replaceAll(emojiRegex, '<span class="emoji">$1</span>');
}


export {markedEmojiBoldPatch};
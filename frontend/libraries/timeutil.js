const getTimeAgo = (timestamp) => {

  let date = new Date(timestamp);

  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + ' tahun yang lalu';
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + ' bulan yang lalu';
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + ' hari yang lalu';
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + ' jam yang lalu';
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + ' menit yang lalu';
  }

  if(seconds < 10) return 'baru saja';

  return Math.floor(seconds) + ' detik yang lalu';
}

export {getTimeAgo}
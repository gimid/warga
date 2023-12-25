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


const getTimeFormatted = (timestamp) => {
  console.log(timestamp);
  let date = new Date(timestamp);

  let year = date.getFullYear();

  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }

  let dayDate = date.getDate();
  if (dayDate < 10) {
    dayDate = "0" + dayDate;
  }


  const stringDate = year + "-" + month + "-" + dayDate;


  return stringDate;

}

export {getTimeAgo, getTimeFormatted}
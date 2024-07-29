
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// ----------------------------------------------------------------------


export  function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);
  const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  const formattedDate = date.toLocaleDateString('en-GB', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
  return `${formattedDate} ${formattedTime}`;
}


export function getRelativeTime(date){
  return dayjs(date).fromNow();
};

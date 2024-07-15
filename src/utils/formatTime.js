import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
} 
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

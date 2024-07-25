import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00');
}

export function formatCurrency(cents) {
  // Ensure the input is a string and parse it to an integer
  const amountInCents = parseInt(cents, 10);
  
  // Convert cents to dollars
  let amountInDollars = amountInCents / 100;
  
  // Convert to string to count total digits and check the length
  let amountString = amountInDollars.toString();
  
  // Find the position of the decimal point
  const decimalIndex = amountString.indexOf('.');
  
  // If total digits exceed 4, adjust to 4 significant digits
  if (amountString.replace('.', '').length > 4) {
    if (decimalIndex !== -1 && decimalIndex < 4) {
      // Case where decimal point is within the first 4 digits
      const integerPartLength = decimalIndex;
      const fractionalPartLength = 4 - integerPartLength;
      amountInDollars = amountInDollars.toFixed(fractionalPartLength);
    } else {
      // Case where decimal point is not within the first 4 digits
      amountInDollars = parseFloat(amountInDollars.toPrecision(4));
    }
  }

  // Format the result as a currency string without locale formatting to match your example
  amountString = amountInDollars.toString();
  
  // Ensure the string is within 4 characters
  if (amountString.replace('.', '').length > 4) {
    amountString = parseFloat(amountString).toPrecision(4);
  }

  return '$'+amountString;
}



export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}

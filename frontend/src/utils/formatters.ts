import dayjs from 'dayjs';

export const formatAddress = (address: {
  addressOne?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}) => {
  let result = ``;

  address = {
    addressOne: address?.addressOne?.trim(),
    city: address?.city?.trim(),
    state: address?.state?.trim(),
    zipCode: address?.zipCode?.trim(),
    country: address?.country?.trim(),
  };

  if (address?.addressOne || address?.city) {
    if (address.city && address.addressOne) {
      result += `${address?.addressOne}. ${address.city},`;
    }

    if (address.addressOne && !address.city) {
      result += `${address?.addressOne},`;
    }

    if (!address.addressOne && address.city) {
      result += `${address?.city},`;
    }
  }

  if (address?.state) {
    result += ` ${address?.state}`;
  }

  if (address?.zipCode) {
    result += ` ${address?.zipCode}`;
  }

  if (address?.country) {
    result += ` ${address?.country}`;
  }

  // Remove trailing comma
  if (result.trim()[result.trim().length - 1] === ',') {
    result = result.trim().slice(0, -1);
  }

  return result;
};

export const formatOrderDate = (date?: string | number | Date) => {
  return dayjs(date).format('DD.MM.YYYY');
};

export const convertToKST = (utcDateString: string) => {
    const date = new Date(utcDateString);
    return new Date(date.getTime() + (9 * 60 * 60 * 1000));
  };
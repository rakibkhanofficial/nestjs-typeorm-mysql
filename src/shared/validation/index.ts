export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isEmpty = (data: string): boolean => {
  return data == null || data === '' || data.length === 0;
};

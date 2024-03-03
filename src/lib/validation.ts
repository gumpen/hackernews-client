export const validateUserInput = (id: string, password: string): boolean => {
  // validation
  if (id.length < 3 || id.length > 64) {
    throw new Error("user id length is invalid");
  }

  if (password.length < 8 || password.length > 128) {
    throw new Error("user password length is invalid");
  }

  return true;
};

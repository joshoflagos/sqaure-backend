export function generateRandomString(length = 6) {
  // Create a character set to choose from.
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // Create an empty string to store the random string.
  let randomString = '';

  // Iterate over the desired length of the string.
  for (let i = 0; i < length; i++) {
    // Generate a random index in the character set.
    const randomIndex = Math.floor(Math.random() * characters.length);

    // Get the character at the random index.
    const randomCharacter = characters[randomIndex];

    // Add the random character to the random string.
    randomString += randomCharacter;
  }

  // Return the random string.
  return randomString;
}

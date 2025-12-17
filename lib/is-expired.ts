export function isExpired(dateString: string) {
  const expiryDate = new Date(dateString);
  if (isNaN(expiryDate.getTime())) return false;

  return expiryDate < new Date();
}

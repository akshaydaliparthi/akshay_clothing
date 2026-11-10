export function formatINR(amount) {
  const num = Number(amount) || 0;
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

function generateInvoiceNumber(orderId) {
  const id = parseInt(orderId, 10);

  if (isNaN(id) || id <= 0) {
    throw new Error('Invalid orderId. Must be a positive integer.');
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const fyStart = month >= 4 ? year : year - 1;
  const fyEnd = (fyStart + 1).toString().slice(-2);
  const fy = `${fyStart}-${fyEnd}`;

  const paddedOrderId = String(id).padStart(5, '0');

  return `INV/${fy}/${paddedOrderId}`;
}



module.exports = { generateInvoiceNumber }
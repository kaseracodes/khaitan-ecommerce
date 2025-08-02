const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');
const fs = require('fs');
const path = require('path');

const FONT_REGULAR = path.join(__dirname, 'NotoSans-Regular.ttf');
const FONT_BOLD = path.join(__dirname, 'NotoSans-Bold.ttf');
const LOGO_PATH = path.join(__dirname, 'logo.png');
const RUPEE = '₹';

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

async function createInvoice(user, order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const bufferStream = new streamBuffers.WritableStreamBuffer({
      initialSize: 100 * 1024,
      incrementAmount: 10 * 1024,
    });

    doc.pipe(bufferStream);

    // Register fonts
    doc.registerFont('NotoSans', FONT_REGULAR);
    doc.registerFont('NotoSans-Bold', FONT_BOLD);

    doc.font('NotoSans');
    const logoY = 50;

    if (fs.existsSync(LOGO_PATH)) {
      doc.image(LOGO_PATH, 50, logoY, { width: 100 });
    }

    const invoiceNumber = order.invoiceNumber;
    doc.font('NotoSans-Bold').fontSize(14);
    doc.text(`Invoice`, 400, logoY + 4, { align: 'right' });
    doc.font('NotoSans').fontSize(10);
    doc.moveTo(50, logoY + 30).lineTo(550, logoY + 30).stroke();

    const companyY = logoY + 40;
    doc.text('12C Lakeview Rd', 50, companyY);
    doc.text('Laketown, Kolkata 700048', 50, companyY + 12);
    doc.text('Email: support@khaitanecom.in', 50, companyY + 24);
    doc.text('Phone: +91-9876543210', 50, companyY + 36);

    doc.text(`${invoiceNumber}`, 300, companyY, { align: 'right' });
    doc.text(`Order Date ${new Date(order.createdAt).toLocaleDateString()}`, 300, companyY + 12, { align: 'right' });
    doc.text(`Expected Delivery Date ${new Date(order.createdAt).toLocaleDateString()}`, 300, companyY + 24, { align: 'right' });

    let y = companyY + 60;
    doc.font('NotoSans-Bold').fontSize(11).text('Customer Details', 50, y);
    y += 15;
    doc.font('NotoSans').fontSize(10);
    doc.text(`Name: ${user.name}`, 50, y);
    doc.text(`Email: ${user.email}`, 50, y + 12);
    doc.text(`Phone: ${user.phoneNumber}`, 50, y + 24);

    y += 50;
    doc.font('NotoSans-Bold').fontSize(11).text('Delivery Address', 50, y);
    y += 15;
    doc.font('NotoSans').text(order.deliveryAddress, 50, y, { width: 500 });

    // ----------------------------------------------
    // 🎨 Colored Table Header with realigned columns
    // ----------------------------------------------
    y += 40;
    const startX = 50;
    const colWidths = {
      product: 250,
      qty: 50,
      price: 80,
      total: 80
    };

    doc.rect(startX, y, 500, 25).fill('#f0f0f0');
    doc.fillColor('#000').font('NotoSans-Bold').fontSize(11);
    doc.text('Product', startX + 5, y + 7, { width: colWidths.product });
    doc.text('Qty', startX + colWidths.product + 10, y + 7);
    doc.text('Price', startX + colWidths.product + colWidths.qty + 20, y + 7);
    doc.text('Total', startX + colWidths.product + colWidths.qty + colWidths.price + 30, y + 7);


    y += 30;
    doc.font('NotoSans').fontSize(10);

    order.products.forEach((product, index) => {
      const qty = product.quantity;
      const orderedPrice = product.orderedPrice;
      const totalOrderedPriceForProduct = qty * orderedPrice;

      // Alternate row background
      if (index % 2 === 0) {
        doc.rect(startX, y - 2, 500, 20).fill('#f9f9f9').fillColor('#000');
      }

      doc.text(product.title, startX + 5, y, { width: colWidths.product });
      doc.text(`${qty}`, startX + colWidths.product + 10, y);
      doc.text(`${RUPEE}${orderedPrice}`, startX + colWidths.product + colWidths.qty + 20, y);
      doc.text(`${RUPEE}${totalOrderedPriceForProduct}`, startX + colWidths.product + colWidths.qty + colWidths.price + 30, y);

      y += 25;
    });


    doc.moveTo(startX, y+5).lineTo(550, y+5).stroke();
    y += 15;

    const totals = [
      { label: 'Subtotal:', value: +(order.subTotal) },
      { label: 'GST (18%):', value: +(order.totalGST) },
      { label: 'Grand Total:', value: +(order.totalPrice) }
    ];

    totals.forEach(({ label, value }, i) => {
      const isGrand = label === 'Grand Total:';
      const bgColor = isGrand ? '#e0e0e0' : '#f6f6f6';
      const textY = y + i * 20;

      // Colored row background
      doc.rect(startX + 250, textY - 2, 250, 18).fill(bgColor);
      doc.fillColor('#000').font('NotoSans-Bold').text(label, startX + 255, textY);
      doc.text(`${RUPEE}${value.toFixed(2)}`, startX + 400, textY);
    });


    doc.moveDown(4);
    doc.fontSize(10).font('NotoSans').text('Thank you for shopping with Khaitan!', 0, doc.y, {
      align: 'center',
    });

    doc.end();

    bufferStream.on('finish', () => {
      const buffer = bufferStream.getContents();
      resolve({ buffer, invoiceNumber });
    });

    bufferStream.on('error', reject);
  });
}

module.exports = { generateInvoiceNumber, createInvoice }
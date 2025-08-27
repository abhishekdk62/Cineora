// utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface PDFTicketData {
  ticket: any;
  seatGroups: any[];
  totalAmount: number;
  totalSeats: number;
  allSeats: string[];
  formatDate: (dateString: string) => string;
  formatTime: (timeString: string) => string;
}

export const generateTicketPDF = async ({
  ticket,
  seatGroups,
  totalAmount,
  totalSeats,
  allSeats,
  formatDate,
  formatTime
}: PDFTicketData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = '#6366f1'; // Indigo
  const secondaryColor = '#8b5cf6'; // Violet
  const textColor = '#1f2937'; // Gray-800
  const lightGray = '#f3f4f6'; // Gray-100

  // Header Background
  doc.setFillColor(99, 102, 241); // Indigo
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Cineora Logo/Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('CINEORA', 20, 25);

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Cinema Experience', 20, 32);

  // Reset text color
  doc.setTextColor(31, 41, 55);

  // Movie Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(ticket.movieId.title, 20, 55);

  // Booking ID
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Booking ID: ${ticket.ticketId}`, pageWidth - 80, 20);

  // Theater and Screen Info
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Theater Information', 20, 75);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  let currentY = 85;

  doc.text(`Theater: ${ticket.theaterId.name}`, 20, currentY);
  currentY += 8;
  doc.text(`Screen: ${ticket.screenId.name}`, 20, currentY);
  currentY += 8;
  doc.text(`Date: ${formatDate(ticket.showDate)}`, 20, currentY);
  currentY += 8;
  doc.text(`Time: ${formatTime(ticket.showTime)}`, 20, currentY);
  currentY += 15;

  // Seat Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Seat Details', 20, currentY);
  currentY += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Total Seats: ${totalSeats}`, 20, currentY);
  currentY += 8;
  doc.text(`Seat Numbers: ${allSeats.join(', ')}`, 20, currentY);
  currentY += 15;

  // Price Breakdown
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Price Breakdown', 20, currentY);
  currentY += 10;

  // Table header
  doc.setFillColor(243, 244, 246); // Light gray
  doc.rect(20, currentY - 5, pageWidth - 40, 12, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Seat Type', 25, currentY + 2);
  doc.text('Quantity', 80, currentY + 2);
  doc.text('Price', 120, currentY + 2);
  doc.text('Total', 160, currentY + 2);
  currentY += 15;

  // Price breakdown rows
  doc.setFont('helvetica', 'normal');
  seatGroups.forEach((group, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, currentY - 5, pageWidth - 40, 10, 'F');
    }
    
    doc.text(group.seatType, 25, currentY + 1);
    doc.text(group.count.toString(), 85, currentY + 1);
    doc.text(`₹${group.price}`, 120, currentY + 1);
    doc.text(`₹${group.totalPrice}`, 160, currentY + 1);
    currentY += 10;
  });

  // Total amount
  currentY += 5;
  doc.setFillColor(99, 102, 241);
  doc.rect(20, currentY - 5, pageWidth - 40, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT', 25, currentY + 2);
  doc.text(`₹${totalAmount}`, 160, currentY + 2);
  currentY += 20;

  // QR Code - FIXED VERSION
  try {
    if (ticket.qrCode) {
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('QR Code for Entry', 20, currentY);
      currentY += 10;

      // Use the EXACT same logic as your QRCodeDisplay component
      const encodedData = encodeURIComponent(ticket.qrCode);
      const verificationUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/common/verify-ticket/${encodedData}`;
      
      const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: 'H',  // Same as your component
        width: 256,                 // Higher resolution for PDF
        margin: 2,                  // Same as your component
        color: {
          dark: '#000000',          // Same as your component
          light: '#FFFFFF'          // Same as your component
        },
        // Additional settings for better PDF quality
        rendererOpts: {
          quality: 1
        }
      });

      // Add QR code to PDF with higher quality
      // Convert base64 to proper format for jsPDF
      const qrSize = 60; // Larger size for better scanning
      doc.addImage(qrCodeDataURL, 'PNG', 20, currentY, qrSize, qrSize, undefined, 'FAST');
      
      // QR code instructions
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Present this QR code at the theater entrance', 90, currentY + 15);
      doc.text('for quick verification and entry.', 90, currentY + 25);
      
      // Add a border around QR code for better visibility
      doc.setDrawColor(0, 0, 0);
      doc.rect(19, currentY - 1, qrSize + 2, qrSize + 2);
    }
  } catch (error) {
    console.error('Error generating QR code for PDF:', error);
    // Fallback: Add the raw verification URL as text
    doc.setFontSize(10);
    doc.text('QR Code generation failed. Use this URL:', 20, currentY + 10);
    doc.text(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/verify-ticket/${encodeURIComponent(ticket.qrCode)}`, 20, currentY + 20);
  }

  // // Footer
  // const footerY = pageHeight - 10;
  // doc.setFillColor(243, 244, 246);
  // doc.rect(0, footerY - 5, pageWidth, 35, 'F');

  // doc.setTextColor(107, 114, 128);
  // doc.setFontSize(9);
  // doc.setFont('helvetica', 'normal');
  // doc.text('Thank you for choosing Cineora! Enjoy your movie experience.', 20, footerY + 5);
  // doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, footerY + 15);
  // doc.text('For support, contact: support@cineora.com', 20, footerY + 25);

  // Status badge
  const statusX = pageWidth - 60;
  const statusY = 55;
  
  if (ticket.status === 'confirmed') {
    doc.setFillColor(34, 197, 94); // Green
  } else if (ticket.status === 'cancelled') {
    doc.setFillColor(239, 68, 68); // Red
  } else {
    doc.setFillColor(107, 114, 128); // Gray
  }
  
  doc.roundedRect(statusX, statusY - 5, 35, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(ticket.status.toUpperCase(), statusX + 2, statusY + 1);

  // Save the PDF
  const fileName = `Cineora_Ticket_${ticket.ticketId}_${ticket.movieId.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
};

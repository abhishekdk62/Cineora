//@ts-nocheck
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { TicketData } from '../components/User/MyAcount/Tickets/TicketsList';
import { Seat } from '../components/Owner/Screens/types';

interface PDFTicketData {
  ticket: TicketData;
  seatGroups: Seat[];
  totalAmount: number;
  totalSeats: number;
  allSeats: string[];
  formatDate: (dateString: string) => string;
  formatTime: (timeString: string) => string;
}

const calculatePriceWithTaxAndConvenience = (basePrice: number) => {
  const tax = basePrice * 0.18; 
  const convenience = basePrice * 0.05; 
  return basePrice + tax + convenience;
};

// Helper functions to safely access nested data
const getMovieData = (ticket: TicketData) => {
  return ticket.movie || ticket.movieId || {};
};

const getTheaterData = (ticket: TicketData) => {
  return ticket.theater || ticket.theaterId || {};
};

const getScreenData = (ticket: TicketData) => {
  return ticket.screen || ticket.screenId || {};
};

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
  
  const primaryColor = '#6366f1'; 
  const secondaryColor = '#8b5cf6'; 
  const textColor = '#1f2937'; 
  const lightGray = '#f3f4f6'; 

  // Get data using helper functions
  const movieData = getMovieData(ticket);
  const theaterData = getTheaterData(ticket);
  const screenData = getScreenData(ticket);

  // Header background
  doc.setFillColor(99, 102, 241); 
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('CINEORA', 20, 25);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Cinema Experience', 20, 32);

  doc.setTextColor(31, 41, 55);

  // Movie title with fallback
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(movieData.title || 'Unknown Movie', 20, 55);

  // Booking ID with fallback
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Booking ID: ${ticket.ticketId || 'N/A'}`, pageWidth - 80, 20);

  // Side-by-side Theater Information and Seat Details
  const leftX = 20; // Theater Info start x
  const rightX = pageWidth / 2 + 10; // Seat Details start x, right side with padding

  // Theater Information
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Theater Information', leftX, 75);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  let currentYTheater = 85;
  
  // Handle theater name - could be from theater object or direct property
  const theaterName = theaterData.name || ticket.theater?.name || 'Unknown Theater';
  doc.text(`Theater: ${theaterName}`, leftX, currentYTheater);
  currentYTheater += 8;
  
  // Handle screen name - could be from screen object or direct property
  const screenName = screenData.name || ticket.screen?.name || ticket.screenId || 'Unknown Screen';
  doc.text(`Screen: ${screenName}`, leftX, currentYTheater);
  currentYTheater += 8;
  
  doc.text(`Date: ${formatDate(ticket.showDate)}`, leftX, currentYTheater);
  currentYTheater += 8;
  doc.text(`Time: ${formatTime(ticket.showTime)}`, leftX, currentYTheater);

  // Seat Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Seat Details', rightX, 75);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  let currentYSeats = 85;
  doc.text(`Total Seats: ${totalSeats}`, rightX, currentYSeats);
  currentYSeats += 8;
  doc.text(`Seat Numbers: ${allSeats.join(', ')}`, rightX, currentYSeats);
  currentYSeats += 15;

  // Start Price Breakdown below the lower of currentYTheater and currentYSeats
  const priceBreakdownStartY = Math.max(currentYTheater, currentYSeats);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Price Breakdown', leftX, priceBreakdownStartY);
  let currentY = priceBreakdownStartY + 10;

  doc.setFillColor(243, 244, 246); // Light gray background for header row
  doc.rect(20, currentY - 5, pageWidth - 40, 12, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Seat Type', 25, currentY + 2);
  doc.text('Quantity', 80, currentY + 2);
  doc.text('Base Price', 115, currentY + 2);
  doc.text('Total', 155, currentY + 2);
  currentY += 15;

  doc.setFont('helvetica', 'normal');
  let calculatedTotal = 0;

  seatGroups.forEach((group, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, currentY - 5, pageWidth - 40, 10, 'F');
    }

    const priceWithExtras = calculatePriceWithTaxAndConvenience(group.price);
    const groupTotal = priceWithExtras * group.count;
    calculatedTotal += groupTotal;

    doc.text(group.seatType || 'Standard', 25, currentY + 1);
    doc.text(group.count.toString(), 85, currentY + 1);
    doc.text(`Rs.${group.price || 0}`, 115, currentY + 1);
    doc.text(`Rs.${Math.round(groupTotal)}`, 155, currentY + 1);
    currentY += 10;
  });

  currentY += 5;
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);

  const subtotal = seatGroups.reduce((sum, group) => sum + ((group.price || 0) * group.count), 0);
  const totalTax = subtotal * 0.18;
  const totalConvenience = subtotal * 0.05;

  doc.text(`Subtotal: Rs.${subtotal}`, 115, currentY);
  currentY += 8;
  doc.text(`Tax (18%): Rs.${Math.round(totalTax)}`, 115, currentY);
  currentY += 8;
  doc.text(`Convenience Fee (5%): Rs.${Math.round(totalConvenience)}`, 115, currentY);
  currentY += 10;

  doc.setFillColor(99, 102, 241);
  doc.rect(20, currentY - 5, pageWidth - 40, 12, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT', 25, currentY + 2);
  doc.text(`Rs.${Math.round(calculatedTotal)}`, 155, currentY + 2);
  currentY += 20;

  // QR Code generation with proper error handling
  try {
    if (ticket.qrCode) {
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('QR Code for Entry', 20, currentY);
      currentY += 10;

      const encodedData = encodeURIComponent(ticket.qrCode);
      const verificationUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/common/verify-ticket/${encodedData}`;

      const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: 'H',
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        rendererOpts: {
          quality: 1
        }
      });

      const qrSize = 60;
      doc.addImage(qrCodeDataURL, 'PNG', 20, currentY, qrSize, qrSize, undefined, 'FAST');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Present this QR code at the theater entrance', 90, currentY + 15);
      doc.text('for quick verification and entry.', 90, currentY + 25);

      doc.setDrawColor(0, 0, 0);
      doc.rect(19, currentY - 1, qrSize + 2, qrSize + 2);
    }
  } catch (error) {
    console.error('Error generating QR code for PDF:', error);
    doc.setFontSize(10);
    doc.text('QR Code generation failed. Use this URL:', 20, currentY + 10);
    if (ticket.qrCode) {
      doc.text(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/verify-ticket/${encodeURIComponent(ticket.qrCode)}`, 20, currentY + 20);
    }
  }

  // Ticket status indicator
  const statusX = pageWidth - 60;
  const statusY = 55;

  const ticketStatus = ticket.status || 'unknown';
  if (ticketStatus === 'confirmed') {
    doc.setFillColor(34, 197, 94);
  } else if (ticketStatus === 'cancelled') {
    doc.setFillColor(239, 68, 68);
  } else {
    doc.setFillColor(107, 114, 128);
  }

  doc.roundedRect(statusX, statusY - 5, 35, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(ticketStatus.toUpperCase(), statusX + 2, statusY + 1);

  const movieTitle = movieData.title || 'Unknown_Movie';
  const ticketId = ticket.ticketId || 'Unknown_ID';
  const fileName = `Cineora_Ticket_${ticketId}_${movieTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
};

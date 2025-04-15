import { stripe } from "../controllers/hotel.ctrl"
import { HotelType, UserType, } from "../types/types";
import { generateFakeAddress } from "./fakeruserdatas";
import Stripe from 'stripe';
import nodemailer from "nodemailer"

interface CreateInvoiceParams {
  user: Omit<UserType, 'password' | 'earned'>;
  hotel: Pick<HotelType, '_id' | 'name'>;
  bookingId: string | number;
  paymentintentId: string;
  amount: number;
  numberOfNights: number | string;
}


export const createAndSendInvoice = async ({
    user,
    hotel,
    bookingId,
    paymentintentId,
    amount,
    numberOfNights
  }: CreateInvoiceParams): Promise<string> => {
    try {

      const customerList = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });
  
      const {addresscity, addressline1, addressline2, addresspostcode, addresstate} = generateFakeAddress();
  
      let customer: Stripe.Customer;
      
      if (customerList.data.length === 0) {
        customer = await stripe.customers.create({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          metadata: {
            userId: user._id.toString(),
          },
          address: {
            line1: addressline1 || 'N/A',
            line2: addressline2 || 'N/A',
            city: addresscity || 'N/A',
            state: addresstate || 'N/A',
            postal_code: addresspostcode || 'N/A',
            country: "IN",
          },
        });
      } else {
        customer = customerList.data[0];
      }
  
      const invoice = await stripe.invoices.create({
        customer: customer.id,
        collection_method: 'send_invoice',
        days_until_due: 0,
        auto_advance: true,
        metadata: {
          hotelId: hotel._id.toString(),
          bookingId: bookingId?.toString() || 'pending',
          paymentIntentId: paymentintentId,
        },
        description: `Booking for ${hotel.name}`,
      });
  
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        amount: Math.round(amount * 100),
        currency: "inr",
        description: `Stay at ${hotel.name} for ${numberOfNights} nights`,
      });
  
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
      
      await stripe.invoices.sendInvoice(finalizedInvoice.id);

      const updatedInvoice = await stripe.invoices.retrieve(finalizedInvoice.id);

      if (!updatedInvoice.invoice_pdf) {
        throw new Error('Invoice PDF URL not available');
      }
  
      const pdfResponse = await fetch(updatedInvoice.invoice_pdf);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
      }
      const pdfBuffer = await pdfResponse.arrayBuffer();
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const formattedDate = new Date(updatedInvoice.created * 1000).toLocaleDateString();
      const formattedAmount = (updatedInvoice.amount_due / 100).toLocaleString('en-IN', {
        style: 'currency',
        currency: updatedInvoice.currency.toUpperCase()
      });
  
      const dueDate = updatedInvoice.due_date 
        ? new Date(updatedInvoice.due_date * 1000).toLocaleDateString()
        : 'Not specified';
  
      const customerAddress = updatedInvoice.customer_address ? `
        ${updatedInvoice.customer_address.line1}<br>
        ${updatedInvoice.customer_address.line2 ? updatedInvoice.customer_address.line2 + '<br>' : ''}
        ${updatedInvoice.customer_address.city}, ${updatedInvoice.customer_address.state}<br>
        ${updatedInvoice.customer_address.postal_code}<br>
        ${updatedInvoice.customer_address.country}
      ` : 'Address not specified';
  
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d3748;">Invoice Details</h2>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Invoice Number:</strong> ${updatedInvoice.number}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Status:</strong> ${updatedInvoice.status}</p>
            <p><strong>Amount Due:</strong> ${formattedAmount}</p>
            <p><strong>Description:</strong> ${updatedInvoice.description}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
          </div>
  
          <h3 style="color: #2d3748; margin-top: 24px;">Booking Details</h3>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Hotel:</strong> ${hotel.name}</p>
            <p><strong>Nights:</strong> ${numberOfNights}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
          </div>
  
          <h3 style="color: #2d3748; margin-top: 24px;">Customer Information</h3>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Address:</strong><br>${customerAddress}</p>
          </div>
  
        
          <p style="margin-top: 24px; color: #718096;">
            Thank you for your booking. Please find your invoice attached.
          </p>
        </div>
      `;
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Your Invoice #${updatedInvoice.number} for ${hotel.name}`,
        html: htmlContent,
        attachments: [
          {
            filename: `invoice_${updatedInvoice.number}.pdf`,
            content: Buffer.from(pdfBuffer),
            contentType: 'application/pdf'
          }
        ]
      };
  
      await transporter.sendMail(mailOptions);
      
      return updatedInvoice.id;

    } catch (error) {
      console.error('Error in createAndSendInvoice:', error);
      throw new Error('Failed to create invoice');
    }
  };
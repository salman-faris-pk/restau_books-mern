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
};



export const CancellationInvoice = async ({
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
                bookingId: bookingId?.toString() || 'cancelled',
                paymentIntentId: paymentintentId,
                type: 'cancellation'
            },
            description: `Cancellation for booking at ${hotel.name}`,
        });

        await stripe.invoiceItems.create({
            customer: customer.id,
            invoice: invoice.id,
            amount: Math.round(amount * 100),
            currency: "inr",
            description: `Refund for cancelled stay at ${hotel.name} (${numberOfNights} nights)`,
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
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const formattedDate = new Date(updatedInvoice.created * 1000).toLocaleDateString();
        const formattedAmount = (Math.abs(updatedInvoice.amount_due) / 100).toLocaleString('en-IN', {
            style: 'currency',
            currency: updatedInvoice.currency.toUpperCase()
        });

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2d3748;">Cancellation Confirmation</h2>
                <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
                    <p><strong>Invoice Number:</strong> ${updatedInvoice.number}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Status:</strong> ${updatedInvoice.status}</p>
                    <p><strong>Refund Amount:</strong> ${formattedAmount}</p>
                    <p><strong>Description:</strong> ${updatedInvoice.description}</p>
                </div>

                <h3 style="color: #2d3748; margin-top: 24px;">Cancelled Booking Details</h3>
                <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
                    <p><strong>Hotel:</strong> ${hotel.name}</p>
                    <p><strong>Nights:</strong> ${numberOfNights}</p>
                    <p><strong>Original Booking ID:</strong> ${bookingId}</p>
                    <p><strong>Payment Reference:</strong> ${paymentintentId}</p>
                </div>

                <h3 style="color: #2d3748; margin-top: 24px;">Customer Information</h3>
                <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
                    <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                </div>

                <p style="margin-top: 24px; color: #718096;">
                    Your booking has been cancelled and a refund of ${formattedAmount} has been processed.
                    Please allow 5-10 business days for the refund to appear in your account.
                </p>
            </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Cancellation Confirmation #${updatedInvoice.number} for ${hotel.name}`,
            html: htmlContent,
            attachments: [
                {
                    filename: `cancellation_${updatedInvoice.number}.pdf`,
                    content: Buffer.from(pdfBuffer),
                    contentType: 'application/pdf'
                }
            ]
        };

         const succesmail=await transporter.sendMail(mailOptions);
         console.log("all don esuccess",succesmail);
         
        return updatedInvoice.id;

    } catch (error) {
        console.error('Error in createAndSendCancellationInvoice:', error);
        throw new Error('Failed to create cancellation invoice');
    }
};
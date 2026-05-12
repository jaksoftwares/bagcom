/**
 * Bagcom Professional Mail Service
 * Powered by Postmark
 */

const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN;
const POSTMARK_FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL || 'contact@dovepeakdigital.com';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: MailOptions) {
  if (!POSTMARK_API_TOKEN) {
    console.error('MAIL_ERROR: POSTMARK_API_TOKEN is missing');
    return { success: false, error: 'Configuration missing' };
  }

  try {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK_API_TOKEN,
      },
      body: JSON.stringify({
        From: POSTMARK_FROM_EMAIL,
        To: to,
        Subject: subject,
        HtmlBody: html,
        TextBody: text || subject,
        MessageStream: 'outbound',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.Message || 'Failed to send email');
    }

    return { success: true, messageId: data.MessageID };
  } catch (error: any) {
    console.error('MAIL_ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Email Templates Generator
 */
export const EmailTemplates = {
  /**
   * Buyer Order Confirmation
   */
  orderConfirmation: (buyerName: string, orderNumber: string, productName: string, amount: string, deliveryCode: string) => ({
    subject: `Payment Confirmed: Order #${orderNumber} is ready for delivery!`,
    html: `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 40px; text-align: center;">
          <img src="https://bagcom.dovepeakdigital.com/brand/assets/logo/logo-dark-bg.png" alt="Bagcom" style="height: 40px; width: auto;" />
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 16px; letter-spacing: -0.02em;">Payment Confirmed!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">
            Hello ${buyerName}, your payment for <strong>${productName}</strong> has been successfully processed and is now held in Bagcom Escrow.
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <p style="text-transform: uppercase; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 8px;">Your Delivery Verification Code</p>
            <p style="font-family: monospace; font-size: 32px; font-weight: 900; color: #0F172A; margin: 0; letter-spacing: 0.2em;">${deliveryCode}</p>
          </div>

          <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
             <p style="font-size: 14px; font-weight: 700; color: #92400e; margin-bottom: 8px;">⚠️ Important Security Instruction</p>
             <p style="font-size: 13px; line-height: 1.5; color: #b45309; margin: 0;">
               Share this code with the seller <strong>ONLY AFTER</strong> you have physically received and inspected the item. Providing this code releases the payment to the seller and cannot be reversed.
             </p>
          </div>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
            <p style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">Order Summary</p>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="color: #64748b; padding: 4px 0;">Order Number</td>
                <td style="text-align: right; font-weight: 600; color: #0F172A;">#${orderNumber}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding: 4px 0;">Total Amount</td>
                <td style="text-align: right; font-weight: 600; color: #0F172A;">KSh ${amount}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 40px; text-align: center;">
            <a href="https://bagcom.dovepeakdigital.com/buyer/orders" style="background-color: #0F172A; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Track Your Order</a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} Bagcom Marketplace. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  /**
   * Seller New Order Notification
   */
  newOrderForSeller: (sellerName: string, orderNumber: string, productName: string, amount: string) => ({
    subject: `Action Required: New Order #${orderNumber} for ${productName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 40px; text-align: center;">
          <img src="https://bagcom.dovepeakdigital.com/brand/assets/logo/logo-dark-bg.png" alt="Bagcom" style="height: 40px; width: auto;" />
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 16px; letter-spacing: -0.02em;">New Order Received!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">
            Hello ${sellerName}, you have a new order for <strong>${productName}</strong>. The buyer has already paid, and the funds are secured in Bagcom Escrow.
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <p style="text-transform: uppercase; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 8px;">Order Reference</p>
            <p style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0;">#${orderNumber}</p>
          </div>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
            <p style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">Next Steps</p>
            <ol style="font-size: 14px; color: #64748b; padding-left: 20px; line-height: 1.6;">
              <li>Contact the buyer to arrange delivery or pickup.</li>
              <li>Hand over the item to the buyer.</li>
              <li>Ask the buyer for their <strong>Delivery Verification Code</strong>.</li>
              <li>Enter the code in your seller dashboard to release the payment.</li>
            </ol>
          </div>

          <div style="margin-top: 40px; text-align: center;">
            <a href="https://bagcom.dovepeakdigital.com/seller/orders" style="background-color: #0F172A; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Manage Order</a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} Bagcom Marketplace. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  /**
   * Order Completed (Buyer)
   */
  orderCompletedBuyer: (buyerName: string, orderNumber: string, productName: string) => ({
    subject: `Order Completed: #${orderNumber} - ${productName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 40px; text-align: center;">
          <img src="https://bagcom.dovepeakdigital.com/brand/assets/logo/logo-dark-bg.png" alt="Bagcom" style="height: 40px; width: auto;" />
        </div>
        <div style="padding: 40px; background-color: #ffffff; text-align: center;">
          <div style="height: 64px; width: 64px; background-color: #f0fdf4; border-radius: 50%; display: inline-flex; align-items: center; justify-center; margin-bottom: 24px;">
             <span style="color: #16a34a; font-size: 32px;">✓</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 16px; letter-spacing: -0.02em;">Order Successfully Completed!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 32px;">
            Hello ${buyerName}, your order for <strong>${productName}</strong> has been marked as delivered and funds have been released to the seller.
          </p>
          
          <div style="margin-top: 40px;">
            <a href="https://bagcom.dovepeakdigital.com/buyer/orders" style="background-color: #0F172A; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Rate Your Experience</a>
          </div>
        </div>
      </div>
    `
  }),

  /**
   * Out for Delivery (Buyer)
   */
  outForDeliveryBuyer: (buyerName: string, orderNumber: string, productName: string) => ({
    subject: `On the Way: Your order #${orderNumber} is out for delivery!`,
    html: `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 40px; text-align: center;">
          <img src="https://bagcom.dovepeakdigital.com/brand/assets/logo/logo-dark-bg.png" alt="Bagcom" style="height: 40px; width: auto;" />
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 16px; letter-spacing: -0.02em;">It's on the way!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">
            Hello ${buyerName}, the seller has marked your order for <strong>${productName}</strong> as out for delivery.
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
             <div style="font-size: 40px; margin-bottom: 16px;">🚚</div>
             <p style="font-size: 14px; font-weight: 700; color: #0F172A;">Get ready to meet the seller at your agreed location.</p>
          </div>

          <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin-bottom: 32px;">
            Remember to bring your phone to access your <strong>Delivery Verification Code</strong> once you've inspected the item.
          </p>

          <div style="text-align: center;">
            <a href="https://bagcom.dovepeakdigital.com/buyer/orders" style="background-color: #0F172A; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">View Tracking Details</a>
          </div>
        </div>
      </div>
    `
  }),

  /**
   * Item Reserved (Buyer)
   */
  itemReservedBuyer: (buyerName: string, orderNumber: string, productName: string) => ({
    subject: `Update: Your item ${productName} has been reserved`,
    html: `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 40px; text-align: center;">
          <img src="https://bagcom.dovepeakdigital.com/brand/assets/logo/logo-dark-bg.png" alt="Bagcom" style="height: 40px; width: auto;" />
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 16px; letter-spacing: -0.02em;">Item Reserved</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">
            Hello ${buyerName}, good news! The seller has confirmed your order for <strong>${productName}</strong> and has reserved it for you.
          </p>
          
          <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 32px;">
            The seller is currently preparing the item for delivery. You will receive another update as soon as it is in transit.
          </p>

          <div style="text-align: center;">
            <a href="https://bagcom.dovepeakdigital.com/buyer/orders" style="background-color: #0F172A; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">View Order Hub</a>
          </div>
        </div>
      </div>
    `
  }),

  /**
   * Dispute Raised (Buyer Confirmation)
   */
  disputeRaisedBuyer: (buyerName: string, orderNumber: string, productName: string) => ({
    subject: `Dispute Case Opened: Order #${orderNumber}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #ef4444; padding: 40px; text-align: center;">
           <img src="https://bagcom.dovepeakdigital.com/brand/assets/logo/logo-dark-bg.png" alt="Bagcom" style="height: 40px; width: auto;" />
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 16px; letter-spacing: -0.02em;">Dispute Case Opened</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">
            Hello ${buyerName}, we have received your dispute request for <strong>${productName}</strong> (Order #${orderNumber}).
          </p>
          
          <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
             <p style="font-size: 14px; font-weight: 700; color: #991b1b; margin-bottom: 8px;">Escrow Funds Frozen</p>
             <p style="font-size: 13px; line-height: 1.5; color: #b91c1c; margin: 0;">
               As per our security protocol, the funds for this transaction have been frozen in Bagcom Escrow and will not be released until our mediation team resolves the case.
             </p>
          </div>

          <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
            Our team will review your case and may reach out for further evidence. You can expect a response within 24-48 hours.
          </p>
        </div>
      </div>
    `
  }),

  /**
   * Dispute Notification (Seller)
   */
  disputeNotificationSeller: (sellerName: string, orderNumber: string, productName: string) => ({
    subject: `Urgent: Dispute Raised for Order #${orderNumber}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #ef4444; padding: 40px; text-align: center;">
           <img src="https://bagcom.dovepeakdigital.com/brand/assets/logo/logo-dark-bg.png" alt="Bagcom" style="height: 40px; width: auto;" />
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 16px; letter-spacing: -0.02em;">Order Disputed</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">
            Hello ${sellerName}, the buyer has raised a dispute for <strong>${productName}</strong> (Order #${orderNumber}).
          </p>
          
          <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
             <p style="font-size: 14px; font-weight: 700; color: #92400e; margin-bottom: 8px;">Action Required</p>
             <p style="font-size: 13px; line-height: 1.5; color: #b45309; margin: 0;">
               Funds for this order are currently frozen. Please ensure you have all delivery records and communication logs ready as our mediation team will be reviewing this transaction.
             </p>
          </div>

          <div style="text-align: center;">
            <a href="https://bagcom.dovepeakdigital.com/seller/orders" style="background-color: #0F172A; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Manage Dispute</a>
          </div>
        </div>
      </div>
    `
  }),

  /**
   * Dispute Resolved - Refund (Buyer)
   */
  disputeResolvedRefundBuyer: (buyerName: string, orderNumber: string, amount: string) => ({
    subject: `Dispute Resolved: Your refund of KSh ${amount} has been processed`,
    html: `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 40px; text-align: center;">
           <img src="https://bagcom.dovepeakdigital.com/brand/assets/logo/logo-dark-bg.png" alt="Bagcom" style="height: 40px; width: auto;" />
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 16px; letter-spacing: -0.02em;">Refund Processed</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">
            Hello ${buyerName}, our mediation team has resolved the dispute for Order #${orderNumber} in your favor.
          </p>
          
          <div style="background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
             <p style="text-transform: uppercase; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: #059669; margin-bottom: 8px;">Refund Amount</p>
             <p style="font-size: 32px; font-weight: 900; color: #059669; margin: 0;">KSh ${amount}</p>
          </div>

          <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
            The funds have been returned to your M-PESA wallet. Thank you for your patience during this process.
          </p>
        </div>
      </div>
    `
  }),

  /**
   * Payout Initiated (Seller)
   */
  payoutInitiatedSeller: (sellerName: string, amount: string, orderNumber: string) => ({
    subject: `Payment Released: KSh ${amount} is on its way!`,
    html: `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 40px; text-align: center;">
          <img src="https://bagcom.dovepeakdigital.com/brand/assets/logo/logo-dark-bg.png" alt="Bagcom" style="height: 40px; width: auto;" />
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 16px; letter-spacing: -0.02em;">Funds Released!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">
            Great news ${sellerName}! The buyer has confirmed delivery for order <strong>#${orderNumber}</strong>. We have initiated your payout of <strong>KSh ${amount}</strong>.
          </p>
          
          <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
            <p style="text-transform: uppercase; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: #16a34a; margin-bottom: 8px;">Payout Amount</p>
            <p style="font-size: 32px; font-weight: 900; color: #16a34a; margin: 0;">KSh ${amount}</p>
          </div>

          <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
            The funds should appear in your M-PESA wallet shortly. Thank you for being a trusted seller on Bagcom.
          </p>
        </div>
      </div>
    `
  })
};

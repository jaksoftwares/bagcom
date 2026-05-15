import axios from 'axios';

/**
 * Safaricom M-PESA Daraja API Integration Service
 * 
 * This service handles STK push requests (Buyer Payments) and B2C payouts (Seller Payouts)
 * for the Bagcom Escrow marketplace.
 */
export class MpesaService {
  private static get auth() {
    const isProduction = process.env.MPESA_ENV === 'production';
    return {
      consumerKey: process.env.MPESA_CONSUMER_KEY!,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
      baseUrl: isProduction ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke',
      passkey: process.env.MPESA_PASSKEY!,
      
      // STK / Buyer Payment Keys
      shortcode: process.env.MPESA_SHORTCODE!,
      partyB: process.env.MPESA_PARTY_B!,
      transactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerBuyGoodsOnline',
      
      // B2C / Seller Payout Keys
      b2cShortcode: process.env.MPESA_B2C_SHORTCODE!,
      initiator: process.env.MPESA_INITIATOR_NAME!,
      securityCredential: process.env.MPESA_SECURITY_CREDENTIAL!,
    };
  }

  /**
   * Generates an OAuth2 access token for M-PESA APIs
   */
  static async getAccessToken() {
    const auth = Buffer.from(`${this.auth.consumerKey}:${this.auth.consumerSecret}`).toString('base64');
    
    try {
      const response = await axios.get(`${this.auth.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      return response.data.access_token;
    } catch (error: any) {
      console.error('M-PESA Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to generate M-PESA access token');
    }
  }

  /**
   * Initiates an STK Push (Express) to the buyer's phone
   * Used when a buyer clicks "Pay Now"
   */
  static async initiateSTKPush(phoneNumber: string, amount: number, orderNumber: string) {
    const token = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(`${this.auth.shortcode}${this.auth.passkey}${timestamp}`).toString('base64');
    
    const formattedPhone = phoneNumber.startsWith('0') ? `254${phoneNumber.slice(1)}` : phoneNumber;

    const payload = {
      BusinessShortCode: this.auth.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: this.auth.transactionType,
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: this.auth.partyB,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.MPESA_CALLBACK_URL}/stk/callback`,
      AccountReference: orderNumber,
      TransactionDesc: `Bagcom Order ${orderNumber}`
    };

    // Development Check: Safaricom will reject 'localhost' URLs
    if (payload.CallBackURL.includes('localhost')) {
      console.warn('CRITICAL WARNING: M-PESA CallBackURL is set to localhost. Safaricom will reject this request. Use Ngrok or a public URL.');
    }


    try {
      const response = await axios.post(`${this.auth.baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error('STK Push Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Initiates a B2C Payout to a seller's phone
   * Used when delivery is confirmed to release escrow funds.
   */
  static async initiateB2CPayout(phoneNumber: string, amount: number, payoutId: string) {
    // Infrastructure Check: Ensure B2C keys are present before attempting
    if (!this.auth.initiator || !this.auth.securityCredential) {
      console.error('CRITICAL: B2C Payout attempted but Initiator Name or Security Credential is missing in .env');
      return { 
        ResponseCode: "1", 
        ResponseDescription: "B2C Configuration Missing. Payout remains PENDING for manual processing." 
      };
    }

    const token = await this.getAccessToken();
    const formattedPhone = phoneNumber.startsWith('0') ? `254${phoneNumber.slice(1)}` : phoneNumber;
    
    // Generate a unique OriginatorConversationID (Required for B2C v3)
    const originatorConversationID = `BAG_${payoutId.slice(0, 8)}_${Date.now()}`;

    const payload = {
      OriginatorConversationID: originatorConversationID,
      InitiatorName: this.auth.initiator,
      SecurityCredential: this.auth.securityCredential,
      CommandID: "BusinessPayment",
      Amount: Math.round(amount),
      PartyA: this.auth.b2cShortcode,
      PartyB: formattedPhone,
      Remarks: "Bagcom Seller Payout",
      QueueTimeOutURL: `${process.env.MPESA_CALLBACK_URL}/timeout`,
      ResultURL: `${process.env.MPESA_CALLBACK_URL}/b2c/callback`,
      Occassion: payoutId // Using payoutId as the Occassion for tracking
    };

    try {
      const response = await axios.post(`${this.auth.baseUrl}/mpesa/b2c/v3/paymentrequest`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Return both the response and the OriginatorConversationID for database tracking
      return {
        ...response.data,
        OriginatorConversationID: originatorConversationID
      };
    } catch (error: any) {
      console.error('B2C Payout Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Checks the M-PESA Account Balance
   */
  static async getAccountBalance() {
    if (!this.auth.initiator || !this.auth.securityCredential) {
      throw new Error('M-PESA Credentials missing');
    }

    const token = await this.getAccessToken();
    const payload = {
      Initiator: this.auth.initiator,
      SecurityCredential: this.auth.securityCredential,
      CommandID: "AccountBalance",
      PartyA: this.auth.b2cShortcode,
      IdentifierType: "4", // Shortcode
      Remarks: "Balance Query",
      QueueTimeOutURL: `${process.env.MPESA_CALLBACK_URL}/timeout`,
      ResultURL: `${process.env.MPESA_CALLBACK_URL}/balance/callback`
    };

    try {
      const response = await axios.post(`${this.auth.baseUrl}/mpesa/accountbalance/v1/query`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error('Account Balance Query Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Checks the status of an STK Push transaction
   */
  static async checkSTKStatus(checkoutRequestID: string) {
    const token = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(`${this.auth.shortcode}${this.auth.passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: this.auth.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID
    };

    try {
      const response = await axios.post(`${this.auth.baseUrl}/mpesa/stkpushquery/v1/query`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error('STK Query Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export interface WhatsAppMessage {
  to: string;
  message: string;
  type?: 'text' | 'image' | 'document';
}

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
  try {
    const apiKey = process.env.WHATSAPP_API_KEY || process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!apiKey || !phoneNumberId) {
      return {
        success: false,
        error: "WhatsApp API credentials not configured"
      };
    }

    // Using WhatsApp Business API
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: message.to,
        type: 'text',
        text: {
          body: message.message
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `WhatsApp API error: ${response.status} ${JSON.stringify(errorData)}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.messages?.[0]?.id
    };
  } catch (error) {
    console.error('WhatsApp API error:', error);
    return {
      success: false,
      error: `Failed to send WhatsApp message: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function sendOrderStatusUpdate(phoneNumber: string, orderNumber: string, status: string): Promise<WhatsAppResponse> {
  const statusMessages = {
    processing: `Your order #${orderNumber} is being processed. We'll update you once it's ready for printing!`,
    printing: `Great news! Your order #${orderNumber} is now being printed. It should be ready for shipping soon.`,
    shipped: `Your order #${orderNumber} has been shipped! You'll receive tracking information shortly.`,
    delivered: `Your order #${orderNumber} has been delivered. Thank you for choosing EXPEROUTFIT!`,
    cancelled: `Your order #${orderNumber} has been cancelled. If you have questions, please contact our support team.`
  };

  const message = statusMessages[status as keyof typeof statusMessages] || 
    `Your order #${orderNumber} status has been updated to: ${status}`;

  return sendWhatsAppMessage({
    to: phoneNumber,
    message: `🔔 EXPEROUTFIT Order Update\n\n${message}\n\nFor questions, reply to this message or visit our website.`
  });
}

export async function sendWelcomeMessage(phoneNumber: string, customerName?: string): Promise<WhatsAppResponse> {
  const greeting = customerName ? `Hi ${customerName}!` : 'Hi there!';
  
  const message = `${greeting} 👋\n\nWelcome to EXPEROUTFIT! I'm here to help you with:\n\n🎨 Custom design questions\n📦 Order tracking\n👕 Product recommendations\n💬 General support\n\nHow can I assist you today?`;

  return sendWhatsAppMessage({
    to: phoneNumber,
    message
  });
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present (assuming US +1)
  if (cleaned.length === 10) {
    return `1${cleaned}`;
  }
  
  return cleaned;
}

export interface RemoveBgResult {
  success: boolean;
  imageData?: string; // base64
  error?: string;
}

export async function removeBackground(imageFile: Buffer): Promise<RemoveBgResult> {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY || process.env.REMOVEBG_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        error: "Remove.bg API key not configured"
      };
    }

    const formData = new FormData();
    formData.append('image_file', new Blob([imageFile]), 'image.jpg');
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Remove.bg API error: ${response.status} ${errorText}`
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    return {
      success: true,
      imageData: base64
    };
  } catch (error) {
    console.error('Remove.bg error:', error);
    return {
      success: false,
      error: `Failed to remove background: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function removeBackgroundFromUrl(imageUrl: string): Promise<RemoveBgResult> {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY || process.env.REMOVEBG_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        error: "Remove.bg API key not configured"
      };
    }

    const formData = new FormData();
    formData.append('image_url', imageUrl);
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Remove.bg API error: ${response.status} ${errorText}`
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    return {
      success: true,
      imageData: base64
    };
  } catch (error) {
    console.error('Remove.bg error:', error);
    return {
      success: false,
      error: `Failed to remove background: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

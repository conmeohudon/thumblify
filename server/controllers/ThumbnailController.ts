import { Request, Response } from 'express';
import Thumbnail from '../models/Thumbnail';
import {
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory
} from '@google/genai';
import ai from '../config/ai';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

const stylePrompts = {
  'Bold & Graphic':
    'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
  'Tech/Futuristic':
    'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech atmosphere, sharp lighting, high-tech atmosphere',
  Minimalist:
    'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
  Photorealistic:
    'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
  Illustrated:
    'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style'
};

const colorSchemeDescriptions = {
  vibrant:
    'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
  sunset:
    'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
  forest:
    'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
  neon:
    'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
  purple:
    'purple-dominant color palette, magenta and violet tones, modern and stylish feel',
  monochrome:
    'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
  ocean:
    'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
  pastel:
    'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic'
};

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay
    } = req.body;

    // create initial DB record
    const thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used: user_prompt,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true
    });

    const model = 'gemini-3-pro-image-preview';

    const generationConfig: GenerateContentConfig = {
      maxOutputTokens: 32768,
      temperature: 1,
      topP: 0.95,
      responseModalities: ['IMAGE'],
      imageConfig: {
        aspectRatio: aspect_ratio || '16:9',
        imageSize: '1K'
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.OFF
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.OFF
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.OFF
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.OFF
        }
      ]
    };

    let prompt = `Create a ${
      stylePrompts[style as keyof typeof stylePrompts]
    } for: "${title}". `;

    if (color_scheme) {
      prompt += `Use a ${
        colorSchemeDescriptions[
          color_scheme as keyof typeof colorSchemeDescriptions
        ]
      }. `;
    }

    if (user_prompt) {
      prompt += `Additional details: ${user_prompt}. `;
    }

    prompt += `The thumbnail should be ${
      aspect_ratio || '16:9'
    }, visually stunning, bold, professional and optimized for maximum click-through rate.`;

    // 🔥 Generate image from Gemini
    const response: any = await ai.models.generateContent({
      model,
      contents: [prompt],
      config: generationConfig
    });

    if (!response?.candidates?.[0]?.content?.parts) {
      throw new Error('Invalid AI response');
    }

    const parts = response.candidates[0].content.parts;

    let base64Image: string | null = null;

    for (const part of parts) {
      if (part.inlineData?.data) {
        base64Image = part.inlineData.data;
      }
    }

    if (!base64Image) {
      throw new Error('No image data received from AI');
    }

    // 🚀 Upload trực tiếp base64 lên Cloudinary (KHÔNG dùng fs)
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      {
        folder: 'thumbnails'
      }
    );

    thumbnail.image_url = uploadResult.secure_url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    res.json({
      message: 'Thumbnail Generated',
      thumbnail
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message || 'Thumbnail generation failed'
    });
  }
};

// delete thumbnail
export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    await Thumbnail.findOneAndDelete({
      _id: id,
      userId
    });

    res.json({ message: 'Thumbnail deleted successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

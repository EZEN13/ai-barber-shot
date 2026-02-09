import { NextRequest, NextResponse } from 'next/server';
import {
  constructPrompt,
  generateHairstyle,
  mockGenerateHairstyle,
  GenerateRequest,
} from '@/lib/ai-service';

// Environment variable for API key
const NANO_BANANA_API_KEY = process.env.NANO_BANANA_API_KEY;
const USE_MOCK = process.env.USE_MOCK_AI === 'true' || !NANO_BANANA_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.clientPhoto) {
      return NextResponse.json(
        { success: false, error: 'Фото клиента обязательно' },
        { status: 400 }
      );
    }

    // Check that either hairstyle, reference, or edit mode is provided
    if (!body.hairstyleName && !body.referencePhoto && !body.isEdit) {
      return NextResponse.json(
        { success: false, error: 'Выберите стрижку или загрузите референс' },
        { status: 400 }
      );
    }

    // Validate edit mode
    if (body.isEdit && !body.editPrompt) {
      return NextResponse.json(
        { success: false, error: 'Укажите что нужно изменить' },
        { status: 400 }
      );
    }

    // Construct the request object
    const generateRequest: GenerateRequest = {
      clientPhoto: body.clientPhoto,
      hairstyleName: body.hairstyleName || undefined,
      beardName: body.beardName || undefined,
      referencePhoto: body.referencePhoto || undefined,
      modifications: body.modifications || undefined,
      gender: body.gender || 'male',
      isEdit: body.isEdit || false,
      editPrompt: body.editPrompt || undefined,
    };

    // Log the constructed prompt for debugging
    const prompt = constructPrompt(generateRequest);
    console.log('Generated prompt:', prompt);

    let result;

    if (USE_MOCK) {
      console.log('Using mock AI generation');
      result = await mockGenerateHairstyle(generateRequest);
    } else {
      console.log('Using Nano Banana Pro API');
      result = await generateHairstyle(generateRequest, NANO_BANANA_API_KEY!);
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        resultImage: result.resultImage,
        prompt, // Include prompt for debugging
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось сгенерировать изображение. Попробуйте позже.',
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mockMode: USE_MOCK,
    hasApiKey: !!NANO_BANANA_API_KEY,
  });
}

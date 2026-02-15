/**
 * AI Service for Nano Banana PRO API integration
 * API: https://docs.nanobananaapi.ai/nanobanana-api/generate-image-pro
 */

export interface GenerateRequest {
  clientPhoto: string;
  hairstyleName?: string;
  beardName?: string;
  hairColorName?: string;
  referencePhoto?: string;

  // Что копировать с референса
  referenceCopyTargets?: {
    hair?: boolean;
    beard?: boolean;
    hairColor?: boolean;
    fullStyle?: boolean;
  };

  modifications?: string;
  gender?: 'male' | 'female';
  // Для редактирования результата
  isEdit?: boolean;
  editPrompt?: string;
}

export interface GenerateResponse {
  success: boolean;
  resultImage?: string;
  error?: string;
}

// Детальные промпты для стрижек
const HAIRSTYLE_PROMPTS: Record<string, string> = {
  'Buzz Cut': 'extremely short buzz cut, uniform 3mm length all over the head, clean military-style cut, neat and minimal, no styling needed',
  'Crew Cut': 'classic crew cut, short tapered sides fading from 6mm to 12mm, slightly longer textured top about 2-3cm, clean professional barbershop look',
  'Fade': 'high skin fade haircut, gradual seamless transition from bald/skin at temples up to longer hair on top, ultra clean fade lines, modern barber precision',
  'Mid Fade': 'mid fade haircut, fade starts at middle of the head sides, smooth gradient transition, clean and sharp lines, versatile modern style',
  'Low Fade': 'low fade haircut, subtle fade starting just above the ears, gentle transition, professional and conservative style, clean neck taper',
  'Undercut': 'disconnected undercut, sides and back buzzed to 3-6mm with hard part line, top left long 8-12cm styled to side or slicked back, dramatic contrast',
  'Pompadour': 'classic pompadour, short tapered sides, top hair 10-15cm swept dramatically upward and back, high volume at front, glossy pomade finish',
  'Quiff': 'modern textured quiff, faded sides, front hair styled upward and slightly back with natural volume, messy textured finish, effortless cool look',
  'Slick Back': 'slicked back hairstyle, hair combed straight back with wet-look pomade, shiny polished finish, short tapered sides, elegant sophisticated style',
  'Textured Crop': 'textured crop haircut, choppy textured top 3-5cm with movement, short fringe falling on forehead, faded sides, modern messy European style',
  'French Crop': 'French crop, very short textured top with straight blunt fringe across forehead, high skin fade on sides, clean minimal aesthetic',
  'Edgar Cut': 'Edgar cut / takuache style, straight line fringe across forehead creating sharp edge, high bald fade on sides, very precise geometric lines, TikTok trending style',
  'Mullet': 'modern mullet, short textured top and sides, significantly longer hair at back reaching neck/shoulders, party in back business in front, retro-modern style',
  'Curtains': 'curtain bangs hairstyle, middle part with hair falling on both sides of face, 90s Leonardo DiCaprio style, soft layers framing face, medium length',
  'Wolf Cut': 'wolf cut, shaggy layered mullet with lots of volume and texture, longer at back, heavy layers throughout, messy undone rock star aesthetic',
  'Two Block': 'Korean two block cut, dramatic disconnection between long top and very short buzzed sides, K-pop idol style, sleek or textured top styling',
  'Man Bun': 'man bun hairstyle, long hair 15-20cm pulled back into bun at crown of head, some loose strands around face, undercut or tapered sides optional',
  'Burst Fade': 'burst fade, curved fade radiating around and behind the ear in semicircle pattern, dramatic visual effect, often paired with mohawk or curly top',
};

// Детальные промпты для бород
const BEARD_PROMPTS: Record<string, string> = {
  'Clean Shaven': 'completely clean shaven face, no facial hair at all, smooth skin, fresh barbershop shave',
  'Stubble': 'designer stubble, 3-5 days beard growth, even length all around, rugged masculine look, well-maintained short facial hair',
  'Short Beard': 'short well-groomed beard about 1-2cm length, neat trimmed edges, defined cheek and neck lines, professional maintained look',
  'Full Beard': 'full thick beard, natural growth covering cheeks jaw and chin, medium length 5-8cm, well-maintained and conditioned, masculine classic style',
  'Goatee': 'goatee beard style, hair only on chin and around mouth, clean shaved cheeks, pointed or rounded chin beard, no mustache connection',
  'Van Dyke': 'Van Dyke beard, separate goatee and mustache not connected, clean shaved cheeks, artistic stylish facial hair, distinguished look',
  'Circle Beard': 'circle beard / door knocker, rounded goatee connected to mustache forming circle around mouth, clean shaved cheeks, neat and balanced',
  'Balbo': 'Balbo beard, beard on chin and jaw without sideburns, separated mustache, clean cheeks, Tony Stark / Robert Downey Jr style',
};

// Детальные промпты для цветов волос
const HAIR_COLOR_PROMPTS: Record<string, string> = {
  'Natural': 'keep natural hair color unchanged, maintain original tone',
  'Platinum Blonde': 'platinum blonde hair color, very light silvery-white blonde, cool tone, professional salon color, ultra-light bleached look',
  'Ash Blonde': 'ash blonde hair color, cool-toned blonde with grey undertones, silvery blonde, natural-looking light hair without warmth',
  'Golden Blonde': 'golden blonde hair color, warm honey blonde tones, sun-kissed golden highlights, radiant warm blonde',
  'Caramel': 'caramel hair color, warm caramel brown tones, golden-brown highlights, sweet toffee color, natural-looking warm brunette',
  'Auburn': 'auburn hair color, rich reddish-brown tones, mahogany with copper highlights, natural-looking red-brown hair',
  'Dark Brown': 'dark brown hair color, rich deep chocolate brown, professional dark brunette tone',
  'Black': 'jet black hair color, deep true black, intense dark color, professional black dye',
  'Highlights': 'blonde highlights, light streaks throughout hair, sun-kissed balayage effect, natural-looking dimension with lighter pieces',
  'Balayage': 'balayage hair coloring, gradual ombré transition from darker roots to lighter ends, hand-painted natural-looking highlights, dimensional color melt',
};

/**
 * Создаёт точный промпт для изменения причёски, бороды и/или цвета
 */
export function constructPrompt(request: GenerateRequest): string {
  // Если это редактирование результата
  if (request.isEdit && request.editPrompt) {
    return `Edit this image: ${request.editPrompt}.
Keep everything else identical.
Photorealistic result.`;
  }

  const usingReference = !!request.referencePhoto;
  const targets = request.referenceCopyTargets;

  const modifications: string[] = [];

  // REFERENCE MODE - копируем стиль с референса
  if (usingReference && targets) {
    modifications.push(`
REFERENCE MODE ENABLED

Image 1 = SOURCE PERSON (CLIENT PHOTO - IDENTITY LOCKED)
Image 2 = REFERENCE STYLE PHOTO

Extract ONLY selected features from Image 2 and apply them to Image 1.

CRITICAL: NEVER copy face, identity, head shape, or skin tone from reference.
ONLY copy the specified style elements.
`);

    if (targets.fullStyle || targets.hair) {
      modifications.push(`
COPY HAIRSTYLE FROM REFERENCE IMAGE

Extract from Image 2:
- Haircut structure and shape
- Fade pattern and transitions
- Hair length distribution
- Styling direction
- Hair texture and volume

Apply to Image 1 person while preserving their face and identity.

DO NOT copy reference person's face or head shape.
`);
    }

    if (targets.fullStyle || targets.beard) {
      modifications.push(`
COPY BEARD FROM REFERENCE IMAGE

Extract from Image 2:
- Beard length and trim style
- Beard shape and outline
- Beard density and coverage
- Mustache style

Apply to Image 1 person.

DO NOT copy reference person's face.
`);
    }

    if (targets.fullStyle || targets.hairColor) {
      modifications.push(`
COPY HAIR COLOR FROM REFERENCE IMAGE

Extract hair color from Image 2 and apply to Image 1.
Match the tone, highlights, and color variations.
`);
    }

  } else {
    // CATALOG MODE - используем выбранные стили из каталога
    if (request.hairstyleName && HAIRSTYLE_PROMPTS[request.hairstyleName]) {
      modifications.push(`
NEW HAIRSTYLE:
${HAIRSTYLE_PROMPTS[request.hairstyleName]}
`);
    }

    if (request.beardName && BEARD_PROMPTS[request.beardName]) {
      modifications.push(`
NEW BEARD:
${BEARD_PROMPTS[request.beardName]}
`);
    }

    if (request.hairColorName && HAIR_COLOR_PROMPTS[request.hairColorName]) {
      modifications.push(`
NEW HAIR COLOR:
${HAIR_COLOR_PROMPTS[request.hairColorName]}
`);
    }
  }

  // Дополнительные модификации от пользователя
  if (request.modifications && request.modifications.trim()) {
    modifications.push(`
ADDITIONAL REQUESTS:
${request.modifications.trim()}
`);
  }

  return `
MULTI IMAGE BARBER EDIT TASK

${usingReference ? `
Image 1 = CLIENT PHOTO (IDENTITY LOCKED)
Image 2 = REFERENCE STYLE PHOTO
` : `
Image 1 = CLIENT PHOTO
`}

CRITICAL IDENTITY LOCK:

The client's face MUST remain absolutely identical.

DO NOT change:
- Face structure, features, expression
- Eyes, nose, mouth, jawline
- Person's identity
- Head shape
- Skin tone
- Body position and pose
- Background
- Clothing
- Lighting and camera angle

ONLY APPLY THE FOLLOWING MODIFICATIONS:

${modifications.join('\n')}

REALISM REQUIREMENTS:

- Photorealistic barber result
- Natural hair physics and flow
- Professional haircut precision
- Seamless blend between hair and scalp
- Realistic hair texture

OUTPUT:

Same person (Image 1) with modified hairstyle/beard/color.
Face and identity MUST be preserved 100%.
`;
}

/**
 * Загрузка изображения на freeimage.host
 */
async function uploadToFreeImageHost(base64Data: string): Promise<string> {
  const base64Only = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

  const formData = new FormData();
  formData.append('source', base64Only);
  formData.append('type', 'base64');
  formData.append('action', 'upload');

  const response = await fetch('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (data.status_code === 200 && data.image?.url) {
    console.log('Uploaded to freeimage.host:', data.image.url);
    return data.image.url;
  }

  throw new Error(data.error?.message || 'FreeImage upload failed');
}

/**
 * Загрузка изображения
 */
async function uploadImageForApi(base64Data: string): Promise<string> {
  if (base64Data.startsWith('http://') || base64Data.startsWith('https://')) {
    return base64Data;
  }
  return await uploadToFreeImageHost(base64Data);
}

/**
 * Рекурсивный поиск URL изображения в объекте
 */
function findImageUrl(obj: unknown, depth = 0): string | null {
  if (depth > 10) return null;
  if (obj === null || obj === undefined) return null;

  if (typeof obj === 'string') {
    const str = obj as string;
    if (str.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i) ||
        str.includes('storage.googleapis.com') ||
        str.includes('cloudinary') ||
        str.includes('imgur') ||
        str.includes('cdn') ||
        (str.startsWith('https://') && str.length > 20)) {
      return str;
    }
    return null;
  }

  if (typeof obj !== 'object') return null;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findImageUrl(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  const o = obj as Record<string, unknown>;
  const priorityKeys = ['resultImageUrl', 'imageUrl', 'url', 'image', 'result', 'output', 'imageUrls', 'images', 'src'];

  for (const key of priorityKeys) {
    if (o[key]) {
      if (typeof o[key] === 'string') {
        const url = o[key] as string;
        if (url.startsWith('http')) return url;
      }
      const found = findImageUrl(o[key], depth + 1);
      if (found) return found;
    }
  }

  for (const [key, value] of Object.entries(o)) {
    if (!priorityKeys.includes(key)) {
      const found = findImageUrl(value, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Polling статуса задачи
 */
async function pollTaskStatus(
  taskId: string,
  apiKey: string,
  maxAttempts: number = 180,
  intervalMs: number = 3000
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  console.log(`Polling task ${taskId}...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `https://api.nanobananaapi.ai/api/v1/nanobanana/record-info?taskId=${taskId}`,
        {
          headers: { 'Authorization': `Bearer ${apiKey}` },
        }
      );

      const data = await response.json();

      // Логируем полный ответ каждые 10 попыток или если что-то изменилось
      if (attempt === 1 || attempt % 20 === 0) {
        console.log(`Poll #${attempt} - Full response:`, JSON.stringify(data, null, 2));
      }

      // Проверяем разные варианты структуры ответа
      const status = data.data?.status ?? data.status ?? data.data?.state;
      const code = data.code ?? data.statusCode;

      console.log(`Poll #${attempt}: code=${code}, status=${status}`);

      // Успешное завершение - проверяем разные варианты статуса
      if (status === 1 || status === 'completed' || status === 'success' || code === 200) {
        // Проверяем есть ли уже URL в данных
        const resultUrl = findImageUrl(data);

        if (resultUrl) {
          console.log('✅ Found image URL:', resultUrl);
          return { success: true, imageUrl: resultUrl };
        }

        // Если статус успешный но URL не нашли - продолжаем ждать
        if (attempt < maxAttempts) {
          console.log('Status looks complete but no URL yet, continuing...');
          await new Promise(r => setTimeout(r, intervalMs));
          continue;
        }

        console.error('❌ Could not find image URL in response after max attempts!');
        return { success: false, error: 'Изображение не найдено в ответе' };
      }

      // Ошибки
      if (status === 2 || status === 3 || status === 'failed' || status === 'error') {
        console.error('❌ Task failed with status:', status);
        return {
          success: false,
          error: data.msg || data.message || 'Ошибка генерации'
        };
      }

      await new Promise(r => setTimeout(r, intervalMs));
    } catch (error) {
      console.error(`Poll #${attempt} error:`, error);
      await new Promise(r => setTimeout(r, intervalMs));
    }
  }

  return { success: false, error: 'Таймаут генерации. Попробуйте ещё раз.' };
}

/**
 * Генерация через Nano Banana PRO API
 */
export async function generateHairstyle(
  request: GenerateRequest,
  apiKey: string
): Promise<GenerateResponse> {
  try {
    const prompt = constructPrompt(request);
    console.log('=== Nano Banana PRO Generation ===');
    console.log('Prompt:', prompt);

    // Загружаем фото
    console.log('Uploading photo...');
    const clientImageUrl = await uploadImageForApi(request.clientPhoto);
    console.log('Photo URL:', clientImageUrl);

    const imageUrls = [clientImageUrl];

    // Референс если есть
    if (request.referencePhoto) {
      console.log('Uploading reference...');
      const refUrl = await uploadImageForApi(request.referencePhoto);
      imageUrls.push(refUrl);
    }

    const requestBody = {
      prompt,
      imageUrls,
      aspectRatio: '3:4',
      resolution: '2K',
      callBackUrl: 'https://example.com/webhook',
    };

    console.log('Sending to PRO API...');

    const response = await fetch('https://api.nanobananaapi.ai/api/v1/nanobanana/generate-pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (data.code !== 200 || !data.data?.taskId) {
      return {
        success: false,
        error: data.msg || data.message || 'Ошибка создания задачи',
      };
    }

    console.log('Task created:', data.data.taskId);

    const result = await pollTaskStatus(data.data.taskId, apiKey);

    return {
      success: result.success,
      resultImage: result.imageUrl,
      error: result.error,
    };
  } catch (error) {
    console.error('Generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка сети',
    };
  }
}

/**
 * Мок для тестирования
 */
export async function mockGenerateHairstyle(request: GenerateRequest): Promise<GenerateResponse> {
  console.log('=== MOCK Generation ===');
  console.log('Prompt:', constructPrompt(request));

  await new Promise(r => setTimeout(r, 2000));

  return {
    success: true,
    resultImage: request.clientPhoto,
  };
}

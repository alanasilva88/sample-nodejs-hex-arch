import { Controller, Get, Query } from '@nestjs/common';
import { OpenAiService } from '../service/openai.service';

@Controller('api/v1/openai')
export class OpenAiController {
    constructor(private readonly openAiService: OpenAiService) {}

    @Get('chat')
    async chat(@Query('prompt') prompt: string): Promise<{ response: string }> {
        const response = await this.openAiService.getChatResponse(prompt);
        return { response };
    }
}

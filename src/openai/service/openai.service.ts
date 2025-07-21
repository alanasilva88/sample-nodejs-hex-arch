import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';
import { ServiceException } from '../../common/exceptions/service.exception';
import { LogDbService } from '../../logdb/service/logdb.service';

dotenv.config();

@Injectable()
export class OpenAiService {
    private readonly apiKey: string;
    private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
    private readonly model: string;

    constructor(
        private readonly httpService: HttpService,
        public readonly logDbService: LogDbService
    ) {
        // define chaves por ambiente
        this.apiKey = process.env.NODE_ENV === 'production'
            ? process.env.OPENAI_API_KEY
            : process.env.OPENAI_API_KEY_TEST;

        // define modelo por ambiente
        this.model = process.env.NODE_ENV === 'production'
            ? 'gpt-4o'
            : 'gpt-3.5-turbo';
    }

    async getChatResponse(prompt: string): Promise<string> {
        const requestBody = {
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0,  // determinístico
        };

        try {
            const response = await firstValueFrom(
                this.httpService.post(this.apiUrl, requestBody, {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                })
            );

            // opcional: log do rate limit
            const rateLimitRemaining = response.headers['x-ratelimit-remaining'];
            const rateLimitReset = response.headers['x-ratelimit-reset'];
            console.log(`OpenAI RateLimit Remaining: ${rateLimitRemaining}`);
            console.log(`OpenAI RateLimit Reset: ${rateLimitReset}`);

            return response.data.choices[0].message.content;
        } catch (error: any) {
            console.error('Erro na comunicação com OpenAI:', error?.response?.data || error);
            throw new ServiceException('Falha ao obter resposta da OpenAI.');
        }
    }
}

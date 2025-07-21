import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenAiController } from './controller/openai.controller';
import { OpenAiService } from './service/openai.service';
import { LogDbModule } from '../logdb/logdb.module';

@Module({
    imports: [
        HttpModule,
        forwardRef(() => LogDbModule),
    ],
    controllers: [OpenAiController],
    providers: [OpenAiService],
    exports: [OpenAiService]
})
export class OpenAiModule { }
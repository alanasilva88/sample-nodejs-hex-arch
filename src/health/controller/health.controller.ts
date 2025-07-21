import { Controller, Get, HttpCode } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('healthz')
export class HealthController {
  @Get()
  @HttpCode(200) // Explicitly sets the HTTP status code
  @SkipThrottle() // Skips rate-limiting for health checks
  healthCheck() {
    return { status: 'OK' }; // Returns a JSON object for clarity
  }
}

import { Module } from '@nestjs/common';
import { CheckincheckoutTokenService } from './checkincheckout-token.service';

@Module({
  providers: [CheckincheckoutTokenService],
  exports: [CheckincheckoutTokenService],
})
export class CheckincheckoutTokenModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { CheckincheckoutTokenService } from './checkincheckout-token.service';

describe('CheckincheckoutTokenService', () => {
  let service: CheckincheckoutTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckincheckoutTokenService],
    }).compile();

    service = module.get<CheckincheckoutTokenService>(CheckincheckoutTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

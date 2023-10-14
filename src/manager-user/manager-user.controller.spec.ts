import { Test, TestingModule } from '@nestjs/testing';
import { ManagerUserController } from './manager-user.controller';
import { ManagerUserService } from './manager-user.service';

describe('ManagerUserController', () => {
  let controller: ManagerUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerUserController],
      providers: [ManagerUserService],
    }).compile();

    controller = module.get<ManagerUserController>(ManagerUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthType } from './enums/auth-type.enum';
import { AuthGuard } from './decorators/auth-guard.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto, LoginOrganizerUserDto } from './dto/login.dto';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.loginService.login(loginDto);
  }

  @Post('login/organizer')
  public async loginCarOwnerUser(
    @Body() loginOrganizerUserDto: LoginOrganizerUserDto,
  ): Promise<any> {
    return await this.loginService.loginCarOwnerUser(loginOrganizerUserDto);
  }

  @Post('refresh-tokens')
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.loginService.refreshTokens(refreshTokenDto);
  }
}

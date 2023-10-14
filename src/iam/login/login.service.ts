import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import jwtConfig from './config/jwt.config';
import { OrganizerUserService } from 'src/organizer-user/organizer-user.service';
import { LoginDto, LoginOrganizerUserDto } from './dto/login.dto';
import { IOrganizerUsers } from 'src/organizer-user/interfaces/organizer-users.interface';
import { OrganizerUser } from 'src/organizer-user/entities/organizer-user.entity';
import { ManagerUserService } from 'src/manager-user/manager-user.service';
import { IManagerUsers } from 'src/manager-user/interfaces/manager-user.interface';
import { ManagerUser } from 'src/manager-user/entities/manager-user.entity';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: ManagerUserService,
    private readonly OrganizerUsersService: OrganizerUserService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly hashingService: HashingService,
  ) {}

  public async findUserByEmail(loginDto: LoginDto): Promise<IManagerUsers> {
    return await this.usersService.findByEmail(loginDto.email.toLowerCase());
  }

  public async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.findUserByEmail(loginDto);
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }

      const passwordIsValid = await this.hashingService.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordIsValid) {
        throw new UnauthorizedException(
          'Authentication failed. Wrong password',
        );
      }

      return await this.generateTokens(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async generateTokens(user: ManagerUser) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JWTPayload>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email.toLowerCase() },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email.toLowerCase(),
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    // try {
    //   const { id } = await this.jwtService.verifyAsync<Pick<JWTPayload, 'id'>>(
    //     refreshTokenDto.refreshToken,
    //     {
    //       secret: this.jwtConfiguration.secret,
    //       audience: this.jwtConfiguration.audience,
    //       issuer: this.jwtConfiguration.issuer,
    //     },
    //   );
    //   const user = await this.OrganizerUsersService.findBySub(id);
    //   return this.generateTokens(user);
    // } catch (err) {
    //   throw new UnauthorizedException(err);
    // }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  // Organizer user login methods

  public async findCarOwnerUserByEmail(
    loginOrganizerUserDto: LoginOrganizerUserDto,
  ): Promise<IOrganizerUsers> {
    return await this.OrganizerUsersService.findByEmail(
      loginOrganizerUserDto.email.toLowerCase(),
    );
  }

  public async loginCarOwnerUser(
    loginOrganizerUserDto: LoginOrganizerUserDto,
  ): Promise<any> {
    try {
      const CarOwnerUser = await this.findCarOwnerUserByEmail(
        loginOrganizerUserDto,
      );
      if (!CarOwnerUser) {
        throw new UnauthorizedException('Store user does not exists');
      }

      const passwordIsValid = await this.hashingService.compare(
        loginOrganizerUserDto.password,
        CarOwnerUser.password,
      );

      if (!passwordIsValid) {
        throw new UnauthorizedException(
          'Authentication failed. Wrong password',
        );
      }

      return await this.generateCarOwnerUserTokens(CarOwnerUser);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async generateCarOwnerUserTokens(CarOwnerUser: OrganizerUser) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JWTPayload>>(
        CarOwnerUser.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: CarOwnerUser.email.toLowerCase() },
      ),
      this.signToken(CarOwnerUser.id, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return {
      accessToken,
      refreshToken,
      CarOwnerUser: {
        id: CarOwnerUser.id,
        email: CarOwnerUser.email.toLowerCase(),
        phone: CarOwnerUser.phone,
      },
    };
  }
}

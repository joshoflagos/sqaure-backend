import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// import { MailerService } from '../../shared/mailer/mailer.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { HashingService } from '../../shared/hashing/hashing.service';

import { MailerService } from 'src/shared/mailer/mailer.service';
import { OrganizerUser } from 'src/organizer-user/entities/organizer-user.entity';
import { ForgotOrganizerPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class ForgotPasswordService {
  constructor(
    // @InjectRepository(Passengers)
    // private readonly userRepository: Repository<Passengers>,
    @InjectRepository(OrganizerUser)
    private readonly CarOwnerUserRepository: Repository<OrganizerUser>,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
    private readonly hashingService: HashingService,
  ) {}

  //   public async forgotPassword(
  //     forgotPasswordDto: ForgotPasswordDto,
  //   ): Promise<any> {
  //     const userUpdate = await this.userRepository.findOneBy({
  //       email: forgotPasswordDto.email.toLowerCase(),
  //     });
  //     // userUpdate.password = await this.hashingService.hash(passwordRand);

  //     if (userUpdate) {
  //       //  const passwordRand = this.utilsService.generatePassword();
  //       const tokenRand = this.utilsService.generatePassword();
  //       userUpdate.reset_token = tokenRand;
  //       console.log({ tokenRand });

  //       const html = `
  //     <!DOCTYPE html>
  //     <html>
  //     <head>
  //         <title>Your password reset token</title>
  //     </head>
  //     <body>
  //         <p>Hi there,</p>

  //         <p>We are committed to ensuring the highest level of security for your account. As part of our efforts to protect your sensitive information, we have implemented a One-Time Password (OTP) system.</p>

  //         <p>Here is your password reset token:</p>
  //         <p><strong>https://drop.instadrop.com.ng/passenger/auth/reset-password?token=${tokenRand}</strong></p>

  //         <p>If you did not attempt to change your password, ignore or delete this message as someone may be attempting to reset ypur password via your email.</p>

  //         <p>If you encounter any issues or have concerns about your account's security, don't hesitate to reach out to us. We are here to assist you.</p>

  //         <p>Best regards,<br>
  //         -Drop Product Team<br>
  //         </p>
  // <p/>
  //         <footer>
  //         <i>U6/1A Hilly Street, Mortlake NSW 2137, AUSTRALIA.</i>
  //         </footer>
  //     </body>
  //     </html>
  //     `;

  //       const options = {
  //         email: userUpdate.email.toString(),
  //         subject: '[Drop] Password Reset Token',
  //         html: html,
  //       };
  //       await this.mailerService.sendMail(options);
  //       return await this.userRepository.save(userUpdate);
  //     } else {
  //       throw new BadRequestException('Error: This account does not exist!');
  //     }
  //   }

  public async forgotStorePassword(
    forgotStorePasswordDto: ForgotOrganizerPasswordDto,
  ): Promise<any> {
    try {
      const userUpdate = await this.CarOwnerUserRepository.findOneBy({
        email: forgotStorePasswordDto.email.toLowerCase(),
      });

      if (userUpdate) {
        const tokenRand = this.utilsService.generatePassword();
        userUpdate.reset_token = tokenRand;
        console.log({ tokenRand });

        const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Your password reset token</title>
    </head>
    <body>
        <p>Hi there,</p>
    
        <p>We are committed to ensuring the highest level of security for your account. As part of our efforts to protect your sensitive information, we have implemented a One-Time Password (OTP) system.</p>
    
        <p>Here is your password reset token:</p>
        <p><strong>https://drop.instadrop.com.ng/carowner/auth/reset-password?token=${tokenRand}</strong></p>
    
        <p>If you did not attempt to change your password, ignore or delete this message as someone may be attempting to reset ypur password via your email.</p>
    
        <p>If you encounter any issues or have concerns about your account's security, don't hesitate to reach out to us. We are here to assist you.</p>
  
    
        <p>Best regards,<br>
        -Drop Product Team<br>
        </p>
<p/>
        <footer>
        <i>U6/1A Hilly Street, Mortlake NSW 2137, AUSTRALIA.</i>
        </footer>
    </body>
    </html>      
    `;

        const options = {
          email: userUpdate.email.toString(),
          subject: '[Drop] Password Reset Token',
          html: html,
        };
        await this.mailerService.sendMail(options);
        return await this.CarOwnerUserRepository.save(userUpdate);
      } else {
        throw new BadRequestException('Error: This account does not exist!');
      }
    } catch (err) {
      throw new BadRequestException(err, 'Error: Failed to send token!');
    }
  }
}

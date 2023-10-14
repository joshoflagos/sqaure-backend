import { Injectable, Logger } from '@nestjs/common';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { IOrganizerUsers } from 'src/organizer-user/interfaces/organizer-users.interface';
import { RegisterOrganizerUserDto } from './dto/register-organizer-user.dto';
import { OrganizerUserService } from 'src/organizer-user/organizer-user.service';
import { IManagerUsers } from 'src/manager-user/interfaces/manager-user.interface';
import { ManagerUserService } from 'src/manager-user/manager-user.service';
import { RegisterManagerUserDto } from './dto/register-manager-user.dto';

@Injectable()
export class RegisterService {
  constructor(
    private readonly managerUserService: ManagerUserService,
    private readonly OrganizerUsersService: OrganizerUserService,
    private readonly hashingService: HashingService,
    private readonly mailerService: MailerService,
  ) {}

  public async register(
    registerPassengerDto: RegisterManagerUserDto,
  ): Promise<IManagerUsers> {
    registerPassengerDto.password = await this.hashingService.hash(
      registerPassengerDto.password,
    );
    registerPassengerDto.email = registerPassengerDto.email.toLowerCase();
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Welcome to Audstack</title>
      </head>
      <body>
          <p>Hi ${registerPassengerDto.full_name},</p>

          <p>Welcome to Drop - Your Uber and Bolt Re-Imagined </p>

          <p><strong> Why We Created Drop</strong>
          </p>
          <p>Inflation from energy price hikes bites. Unemployment is worsening and standard of living is dropping.
          </p>

          <p>We built Drop to reduce transportation cost for passengers and car owners by 50%.
          </p>

          <p><b>How To Get Started</b></p>
          <ul>
          <li> Signup and Login</li>
          <li> Visit our nearest office for accreditation. Click here to book a 10mins appointment.
  </li></ul>

          <p><b>Requirements</b></p>

          <ul>
    <li>Government ID for identity verification.</li>
      <li>BVN to access financial services. </li>
          </ul>

          <p><strong>Important Note</strong></p>
          <p>Passenger app cannot track car owner location before and after trip.</p>
          <p>Car owners and passengers are accurately vetted during physical accreditation. Whenever you visit, you will appreciate our security measures. .</p>
     <p><strong>In closing</strong></p>
          <p>We will like every car owner to always remember why we built Drop. Please partner with us, to help millions of Nigerians move at half the cost, safely and comfortably. </p>

          <p>COO,<br>
          Faith Kuyet Ishaya<br>
          </p>
          <p/>
          <hr/>
          <footer>
          <i>U6/1A Hilly Street, Mortlake NSW 2137, AUSTRALIA.</i>
          </footer>
      </body>
      </html>
      `;
    // return this.managerUserService.create(registerPassengerDto);

    const options = {
      email: registerPassengerDto.email,
      subject: 'Welcome to Drop',
      html: html,
    };
    const user = this.managerUserService.create(registerPassengerDto);
    await this.mailerService.sendMail(options);
    return user;
  }
  // store user reg service
  public async registerCarOwnerUser(
    registerOrganizerUserDto: RegisterOrganizerUserDto,
    ref: string,
  ): Promise<IOrganizerUsers> {
    registerOrganizerUserDto.ref = ref;
    registerOrganizerUserDto.password = await this.hashingService.hash(
      registerOrganizerUserDto.password,
    );
    registerOrganizerUserDto.email =
      registerOrganizerUserDto.email.toLowerCase();
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Welcome to Square CRM for Oganizations</title>
    </head>
    <body>
        <p>Hi ${registerOrganizerUserDto.full_name},</p>
    
        <p>Welcome to Square CRM for Oganizations </p>
    
        <p><strong> We help organisations plan and manage their programmes, managers, participants, attendance, travel and spend records.</strong>
        </p>
        <p>We help organization manage programmes sponsors, participant, travel and spend record 
        </p>
    
        <p><b>How To Get Started</b></p>
        <ul>
        <li> Signup and Login</li>
        <li> Create organisations. 
</li>
<li> Create managers. 
</li>
<li> Create programme. 
</li>
<li> Register programme participants. 
</li>
<li> Track participants attendance. 
</li>
<li> Download programme reports. 
</li>
<li> Download payout CSV. 
</li>
</ul>
    
        
        <p>COO,<br>
        Joshua Neonatar<br>
        </p>
<p/>
<hr/>
        <footer>
        <i>U6/1A Hilly Street, Mortlake NSW 2137, AUSTRALIA.</i>
        </footer>
    </body>
    </html>      
    `;

    const options = {
      email: registerOrganizerUserDto.email,
      subject: 'Welcome to Square',
      html: html,
    };
    const user = await this.OrganizerUsersService.create(
      registerOrganizerUserDto,
    );
    await this.mailerService.sendMail(options);
    return user;
  }
}

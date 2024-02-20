import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { Admin } from 'src/admin/entities/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { registerDto } from './dto/register.dto';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Store } from 'src/store/entities/store.entity';
import { PharmacyService } from 'src/pharmacy/pharmacy.service';
import { StoreService } from 'src/store/store.service';
import { AdminService } from 'src/admin/admin.service';
import { throwError } from 'rxjs';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  private twilioClient: Twilio;
  constructor(
    private readonly JwtService: JwtService,
    private configService: ConfigService,

    private PharmacyService: PharmacyService,
    private StoreService: StoreService,
    private AdminService: AdminService,
  ) {
    const twilioConfig = this.configService.get('twilio');
    this.twilioClient = new Twilio(
      twilioConfig.accountSid,
      twilioConfig.authToken,
    );
  }

  async register(user: any) {
    switch (user.userType) {
      case 'admin': {
        const { userType, ...result } = user;
        return await this.AdminService.create(result);

        //not exist ,creat
      }
      case 'store': {
        const { userType, ...result } = user;
        return await this.StoreService.create(result);
      }
      case 'pharmacy': {
        const { userType, ...result } = user;

        return await this.PharmacyService.create(result);
      }
    }
  }

  async login(user: any) {
    //userType
    let userType;
    let license = '';
    if (user.pharmacist) {
      userType = 'pharmacy';
      license = user.license;
    } else if (user.companyName) {
      userType = 'store';
      license = user.license;
    } else userType = 'admin';

    console.log(userType, '--------------------------------');

    console.log('login', user);
    const payload = {
      email: user.email,
      sub: {
        name: user.name,
        type: userType,
        license,
      },
    };
    console.log(payload);
    return {
      ...user,
      accessToken: await this.JwtService.signAsync(payload),
      refreshToken: await this.JwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }
  //
  async refreshToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.sub,
    };
    console.log(payload + 'refreshToken-----');
    return {
      accessToken: await this.JwtService.signAsync(payload),
    };
  }
  // forget password

  //reset password email ....

  async forgetPassword(token: string, USER: any) {
    console.log('forget user', USER);
    let user, email;
    if (USER.sub.type == 'pharmacy') {
      user = await this.PharmacyService.findByLicense(USER.sub.license);
      user.code = token;
      await this.PharmacyService.savingPharmacy(user);
      email = user.pharmacist.email;
    } else if (USER.sub.type == 'store') {
      user = await this.StoreService.findByLicense(USER.sub.license);
      user.code = token;
      //await this.StoreService.savingPharmacy(user);
      if (!user.email)
        throw new NotFoundException('you do not enter an  email ');
      email = user.email;
    } else if (USER.sub.type == 'admin') {
      email = user.email;
    }
    console.log('forget user', user);
    console.log('email', email); //
    if (!user) {
      //
      //throw not found exception
      throw new NotFoundException('Not foun user ');
    }

    const url = `http://localhost:3000/auth/reset-password/email/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'ahmedmo567765@gmail.com',
        pass: 'rzabfzrcekjzyqkc',
      },
    });

    const mailOptions = {
      from: 'ahmedmo567765@gmail.com',
      to: email,
      subject: 'Email verification ',
      html:
        '<p>Please take this url  to verify your email address:</p>' +
        `<p>${url}</p>` +
        `<br>` +
        `<p>use in body the attributes {password ,passwordConfirm}</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Error in sending email  ' + error);
        return true;
      } else {
        console.log('Email sent: ' + info.response);
        return false;
      }
    });

    return {
      message: 'check your email',
    };
  }
  //
  async resetPassword(body: any, token: string, USER: any) {
    console.log('reset password body ', body);
    console.log('reset password token ', token);
    console.log('reset password USER ', USER);

    const { password, passwordConfirm } = body;
    if (password != passwordConfirm) {
      throw new BadRequestException('passwords not matche');
    }
    let user;
    if (USER.sub.type == 'pharmacy') {
      user = await this.PharmacyService.findByLicense(USER.sub.license);
      if (user.code && user.code == token) {
        const hashedPass = await bcrypt.hash(password, 10);
        user.password = hashedPass;
        this.PharmacyService.savingPharmacy(user);
        return user;
      }
    } else if (USER.sub.type == 'store') {
      user = await this.StoreService.findByLicense(USER.sub.license);
      if (user.code && user.code == token) {
        const hashedPass = await bcrypt.hash(password, 10);
        user.password = hashedPass;
        this.StoreService.savingStore(user);
        return user;
      }
    } else if (USER.sub.type == 'admin') {
      user = await this.AdminService.findByemail(USER.sub.email);
      if (user.code && user.code == token) {
        const hashedPass = await bcrypt.hash(password, 10);
        user.password = hashedPass;
        this.AdminService.savingAdmin(user);
        return user;
      }
    }
    console.log('reset password user 1', user);
    throw new NotFoundException('use not found');
  }
  // //////////////////////////////////////////
  //   private generateRandomCode(): string {
  //     // Generate a random code using a library or custom logic
  //     // For example, you can use the 'randomstring' package:
  //     // const randomstring = require('randomstring');
  //     // return randomstring.generate({
  //     //   length: 6,
  //     //   charset: 'numeric',
  //     // });
  //     return Math.random().toString(20).substring(2, 12);
  //   }

  //   async sendPasswordResetCode(phoneNumber: string): Promise<void> {
  //     const code = this.generateRandomCode();
  //     await this.twilioClient.messages.create({
  //       body: `Your password reset code is: ${code}`,
  //       from: this.configService.get('twilio.phoneNumber'),
  //       to: phoneNumber,
  //     });

  //     // Store the code and the associated phone number in your database

  //     //const resetCode = new PasswordResetCode();
  //     // resetCode.phoneNumber = phoneNumber;
  //     // resetCode.code = code;
  //     //await this.passwordResetCodeRepository.save(resetCode);
  //     const resetCode = await this.adminRepository.findOne({
  //       where: { phone: phoneNumber },
  //     });
  //     resetCode.code = code;
  //     await this.adminRepository.save(resetCode);
  //   }

  //   async resetPassword(
  //     phoneNumber: string,
  //     code: string,
  //     newPassword: string,
  //   ): Promise<void> {
  //     const resetCode = await this.adminRepository.findOne({
  //       where: { phone: phoneNumber, code },
  //     });
  //     // const resetCode = await this.passwordResetCodeRepository.findOne({
  //     //   where: { phoneNumber, code },
  //     // });

  //     if (!resetCode) {
  //       // Code or phone number is invalid
  //       // Handle the error and return an appropriate response
  //       throw new Error('Invalid reset code');
  //     }

  //     // Code is valid, update the password for the user with the new password
  //     // Update the password for the user associated with the provided phone number
  //     // Example pseudocode:
  //     // const user = await this.adminRepository.findOne({
  //     //   where: { phone: phoneNumber },
  //     // });
  //     resetCode.password = newPassword;

  //     await this.adminRepository.save(resetCode);

  //     // Delete the used reset code from the database
  //     // await this.passwordResetCodeRepository.delete(resetCode.id);
  //   }
}

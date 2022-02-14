import { flatten, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as sgMail from '@sendgrid/mail';
import { AuthLocal } from 'src/auth/entities/auth-local.entity';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import {
  CreateVerificationInputDto,
  VerifyEmailAndCodeInputDto,
} from 'src/users/dtos/email-verification';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
import { Verifies } from './entities/verifies.entity';

@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Verifies)
    private mailRepository: Repository<Verifies>,
    @InjectRepository(UserProfile)
    private usersProfileRepository: Repository<UserProfile>,
    @InjectRepository(UserProfile)
    private usersLocalAuthRepository: Repository<AuthLocal>,
  ) {}

  getRandom6Digit(): number {
    return Math.floor(Math.random() * 899999 + 100000);
  }

  trimMilSec(number): number {
    return Math.floor(number / 1000);
  }

  async sendMail(email: string, code: string): Promise<boolean> {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_KEY'));
    const msg = {
      to: `${email}`, // Change to your recipient
      from: '2hakjoon@gmail.com', // Change to your verified sender
      subject: '소셜독 인증번호 전송',
      text: `소설독 메일 인증 번호입니다. - ${code} `,
      html: `<strong>인증번호 : ${code}</strong>`,
    };
    try {
      await sgMail.send(msg);
      console.log('Email sent');
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async createMailVerification({
    email,
  }: CreateVerificationInputDto): Promise<CoreOutputDto> {
    try {
      const user = await this.usersLocalAuthRepository.findOne({ email });
      if (user) {
        return {
          ok: false,
          error: '이미 존재하는 이메일입니다.',
        };
      }

      const verify = await this.mailRepository.findOne({ email });
      const code = String(this.getRandom6Digit());
      const expiryDate = this.trimMilSec(Date.now()) + 300;
      if (verify) {
        this.mailRepository.update(verify.id, { ...verify, code, expiryDate });
      } else {
        await this.mailRepository.save(
          this.mailRepository.create({
            email,
            code,
            expiryDate,
          }),
        );
      }
      await this.sendMail(email, code);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: '인증번호 생성에 실패했습니다.' };
    }
  }

  async verifyEmailAndCode({
    email,
    code,
  }: VerifyEmailAndCodeInputDto): Promise<CoreOutputDto> {
    try {
      const verification = await this.mailRepository.findOne({ email });
      if (!verification) {
        return {
          ok: false,
          error: '이메일이 존재하지 않습니다.',
        };
      }
      if (verification.code !== code) {
        return {
          ok: false,
          error: '인증번호가 잘못 되었습니다.',
        };
      }
      if (verification.expiryDate < this.trimMilSec(Date.now())) {
        return {
          ok: false,
          error: '인증번호가 만료 되었습니다.',
        };
      }
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '인증번호 검증중에 오류가 발생했습니다.',
      };
    }
  }
}

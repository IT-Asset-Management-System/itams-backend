import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AdminEntity from 'src/models/entities/admin.entity';
import Asset from 'src/models/entities/asset.entity';
import UserEntity from 'src/models/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserAcceptRequest(user: UserEntity, asset: Asset) {
    const url = `${this.configService.get('FRONTEND')}`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Request accept',
      template: './accept',
      context: {
        name: user.name,
        asset_id: asset.id,
        asset_name: asset.name,
        url,
      },
    });
  }

  async sendUserRejectRequest(user: UserEntity) {
    const url = `${this.configService.get('FRONTEND')}/request-asset`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Request reject',
      template: './reject',
      context: {
        name: user.name,
        url,
      },
    });
  }

  async sendUserCheckoutAsset(user: UserEntity, asset: Asset) {
    const url = `${this.configService.get('FRONTEND')}`;

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Checkout asset',
      template: './checkout',
      context: {
        name: user.name,
        asset_id: asset.id,
        asset_name: asset.name,
        url,
      },
    });
  }

  async sendAdminRequestAsset(user: UserEntity, admin: AdminEntity) {
    const url = `${this.configService.get('ADMIN')}/request-assets`;

    await this.mailerService.sendMail({
      to: admin?.email,
      subject: 'Request accept',
      template: './request',
      context: {
        user_name: user.name,
        user_id: user.id,
        url,
      },
    });
  }
}

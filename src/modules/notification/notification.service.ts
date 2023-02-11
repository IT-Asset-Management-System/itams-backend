import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/models/entities/notification.entity';
import { NotificationRepository } from 'src/models/repositories/notification.repository';
import { AssetService } from '../asset/asset.service';
import { LicenseService } from '../license/license.service';
import { NotificationDto } from './dtos/notification.dto';
import { NotificationType } from './notification.constants';

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepo: NotificationRepository,
    @Inject(forwardRef(() => AssetService))
    private assetService: AssetService,
    @Inject(forwardRef(() => LicenseService))
    private licenseService: LicenseService,
  ) {}

  async getAllNotifications() {
    const notifications = await this.notificationRepo.find({
      order: { expiration_date: 'ASC' },
    });
    const res = Promise.all(
      notifications.map(async (notification) => {
        const asset = await this.assetService.getAssetById(notification.itemId);
        const license = await this.licenseService.getLicenseById(
          notification.itemId,
        );
        return {
          ...notification,
          name:
            notification.type === NotificationType.ASSET
              ? asset?.name
              : license?.name,
        };
      }),
    );
    return res;
  }

  async createNewNotification(notificationDto: NotificationDto) {
    let notification = new Notification();
    notification.itemId = notificationDto.itemId;
    notification.expiration_date = notificationDto.expiration_date;
    notification.type = notificationDto.type;
    await this.notificationRepo.save(notification);
    return notification;
  }

  async deleteNotification(type: NotificationType, id: number) {
    let res;
    if (type === NotificationType.ASSET)
      res = await this.notificationRepo.delete({ type, itemId: id });
    else if (type == NotificationType.LICENSE)
      res = await this.notificationRepo.delete({ type, itemId: id });
    return res;
  }
}

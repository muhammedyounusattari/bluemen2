import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
	providedIn: 'root'
})

export class NotificationUtilities {

    constructor(private notification: NzNotificationService) { }

    createNotificationBasic(type: string, messageTitle: string, messageBody: string): void {
		this.notification.create(
			type,
			messageTitle,
			messageBody
		);
	}
}
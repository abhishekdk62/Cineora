import * as cron from 'node-cron';
import { NotificationService } from '../modules/notification/services/notification.service';
import Notification from '../modules/notification/models/notification.model'

export class NotificationScheduler {
  constructor(private readonly notificationService: NotificationService) {
  }

  private startScheduler() {
    cron.schedule('* * * * *', async () => {
      try {
        const now = new Date();
        const dueNotifications = await Notification.find({
          scheduledTime: { $lte: now }, 
          sent: false                
        });

        if (dueNotifications.length > 0) {
          console.log(`📱 Found ${dueNotifications.length} notifications to send!`);
          
          for (const notification of dueNotifications) {
            await this._sendScheduledNotification(notification);
          }
        } else {
        }
      } catch (error) {
        console.error('Scheduler error:', error);
      }
    });
    
    console.log(' Notification scheduler started! Checking every minute...');
  }

  private async _sendScheduledNotification(notification: any) {
    try {
      if (notification.type === 'reminder') {
        await this.notificationService.sendReminderNotification(
          notification.userId,
          notification.data
        );
      }
      
      notification.sent = true;
      await notification.save();
      
      console.log(`Sent ${notification.type} notification to user ${notification.userId}`);
    } catch (error) {
      console.error(` Failed to send notification ${notification.notificationId}:`, error);
    }
  }

  async scheduleReminder(userId: string, showDateTime: Date, movieData: any) {
    const reminderTime = new Date(showDateTime.getTime() - 2 * 60 * 60 * 1000); 
    
    if (reminderTime > new Date()) {
      const notificationId = `REM${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      await Notification.create({
        notificationId,
        userId,
        title: "Movie Reminder! 🍿",
        message: `Your movie ${movieData.movieTitle} starts in 2 hours.`,
        type: "reminder",
        scheduledTime: reminderTime,
        sent: false,               
        data: movieData
      });
      
      console.log(`Scheduled reminder for ${reminderTime} - Movie: ${movieData.movieTitle}`);
    }
  }
    async cancelReminderByBookingId(bookingId: string) {
    try {
      const result = await Notification.deleteMany({
        type: 'reminder',
        'data.bookingId': bookingId,
        sent: false
      });
      
      console.log(` Deleted ${result.deletedCount} scheduled reminders for booking: ${bookingId}`);
      return result.deletedCount > 0;
    } catch (error) {
      console.error(` Failed to cancel reminder for booking: ${bookingId}`, error);
      return false;
    }
  }

}

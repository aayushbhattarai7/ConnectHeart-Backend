
import cron from 'node-cron';
import authService from '../auth.service';
export class CronService{
 constructor() {}
        startJob() {
             cron.schedule('0 0 * * *', async () => {
      await authService.deleteAccounts()
    });
        }
    
}
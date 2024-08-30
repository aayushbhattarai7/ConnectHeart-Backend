import crypto from 'crypto'
import { HashService } from './utils/hash.service'

export class OtpService {
  constructor(private readonly hashService = new HashService()) {}

  async generateOtp() {
    return crypto.randomInt(10000, 99999)
  }

  verifyOtp(hashedOtp: string, data: any) {
    const hash = this.hashService.hashOtp(data)
    return hash === hashedOtp
  }
}

import net from 'net';
import dns from 'dns/promises';

interface CacheEntry {
  valid: boolean;
  timestamp: number;
}

class EmailVerifier {
  private cache: Map<string, CacheEntry>;
  private cacheTTL: number;

  constructor() {
    this.cache = new Map();
    this.cacheTTL = 24 * 60 * 60 * 1000;
  }

  private async directSMTPVerify(email: string): Promise<boolean | null> {
    return new Promise((resolve) => {

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return resolve(false);
      }

      const domain = email.split('@')[1];
      const smtpServer = domain === 'gmail.com' 
        ? 'gmail-smtp-in.l.google.com' 
        : `mx.${domain}`;

      const socket = net.createConnection(25, smtpServer);
      socket.setTimeout(5000);

      let responseData = '';

      socket.on('connect', () => {
        socket.write([
          'HELO example.com\r\n',
          'MAIL FROM: <verify@example.com>\r\n',
          `RCPT TO: <${email}>\r\n`,
          'QUIT\r\n'
        ].join(''));
      });

      socket.on('data', (data: Buffer) => {

        responseData += data.toString();
        if (responseData.includes('250 2.1.5')) {
          socket.end();
          resolve(true);
        } else if (responseData.includes('550')) {
          socket.end();
          resolve(false);
        }
      });

      socket.on('error', (err) => {
        console.error(`SMTP verification error for ${email}:`, err);
        socket.end();
        resolve(null);
      });

      socket.on('timeout', () => {
        socket.end();
        console.error(`SMTP verification timeout for ${email}`);
        resolve(null);
      });

      socket.on('end', () => {

        if (!responseData.includes('250 2.1.5') && !responseData.includes('550')) {
          resolve(null);
        }
      });
    });
  }

  private async verifyViaDNS(email: string): Promise<boolean> {
    const domain = email.split('@')[1];
    try {
      const mxRecords = await dns.resolveMx(domain);
      if (mxRecords.length > 0) return true;

      const aRecords = await dns.resolve(domain);
      return aRecords.length > 0;
    } catch (err) {
      console.error(`DNS verification failed for ${email}:`, err);
      return false;
    }
  }

  public async verifyEmail(email: string): Promise<boolean> {

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return false;
    }

    if (this.cache.has(email)) {
      const entry = this.cache.get(email)!;
      if (Date.now() - entry.timestamp < this.cacheTTL) {
        return entry.valid;
      }
    }

    let result = await this.directSMTPVerify(email);
    
    if (result === null) {
      result = await this.verifyViaDNS(email);
    }

    this.cache.set(email, {
      valid: result,
      timestamp: Date.now()
    });

    return result;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export default new EmailVerifier();
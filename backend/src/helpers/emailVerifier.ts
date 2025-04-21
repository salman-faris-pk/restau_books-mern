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

    if (process.env.RENDER) {
      return null;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return false;
    }

    const domain = email.split('@')[1];
    let smtpServer = `mx.${domain}`;
    
    if (domain === 'gmail.com') smtpServer = 'gmail-smtp-in.l.google.com';
    if (domain === 'yahoo.com') smtpServer = 'mta5.am0.yahoodns.net';
    if (domain === 'outlook.com') smtpServer = 'outlook-com.olc.protection.outlook.com';

    return new Promise((resolve) => {
      const socket = net.createConnection(25, smtpServer);
      socket.setTimeout(10000);

      let responseData = '';
      let responded = false;

      const cleanUp = () => {
        if (!responded) {
          responded = true;
          socket.end();
          resolve(null);
        }
      };

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
          responded = true;
          socket.end();
          resolve(true);
        } else if (responseData.includes('550')) {
          responded = true;
          socket.end();
          resolve(false);
        }
      });

      socket.on('error', cleanUp);
      socket.on('timeout', cleanUp);
      socket.on('end', cleanUp);
    });
  }

  private async verifyViaDNS(email: string): Promise<boolean> {
    const domain = email.split('@')[1];
    try {
      const mxRecords = await dns.resolveMx(domain);
      if (mxRecords?.length > 0) return true;

      try {
        const records = await Promise.any([
          dns.resolve(domain),
          dns.resolve4(domain),
          dns.resolve6(domain)
        ]);
        return records?.length > 0;
      } catch {
        return false;
      }
    } catch {
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

    const result = process.env.RENDER 
      ? await this.verifyViaDNS(email)
      : await this.directSMTPVerify(email) ?? await this.verifyViaDNS(email);

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
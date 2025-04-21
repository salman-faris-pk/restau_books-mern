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

      socket.on('error', () => {
        socket.end();
        resolve(null);
      });

      socket.on('timeout', () => {
        socket.end();
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
      if (mxRecords && mxRecords.length > 0) return true;

      const aRecords = await dns.resolve(domain);
      return aRecords && aRecords.length > 0;
    } catch {
      return false;
    }
  }

  public async verifyEmail(email: string): Promise<boolean | null> {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return false;
    }

    if (this.cache.has(email)) {
      const entry = this.cache.get(email)!;
      if (Date.now() - entry.timestamp < this.cacheTTL) {
        return entry.valid;
      }
    }

    const smtpResult = await this.directSMTPVerify(email);
    if (smtpResult !== null) {
      this.cache.set(email, {
        valid: smtpResult,
        timestamp: Date.now()
      });
      return smtpResult;
    }

    const dnsResult = await this.verifyViaDNS(email);
    this.cache.set(email, {
      valid: dnsResult,
      timestamp: Date.now()
    });

    return dnsResult;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export default new EmailVerifier();
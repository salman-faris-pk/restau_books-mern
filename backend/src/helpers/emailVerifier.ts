import net from 'net';

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

  private async verifyViaSMTP(email: string): Promise<boolean | null> {
    
    return new Promise((resolve) => {
      if (!email.endsWith('@gmail.com')) {
        return resolve(false);
      }

      const socket = net.createConnection(25, 'gmail-smtp-in.l.google.com');
      socket.setTimeout(5000);

      socket.on('connect', () => {
        socket.write([
          'HELO example.com\r\n',
          'MAIL FROM: <verify@example.com>\r\n',
          `RCPT TO: <${email}>\r\n`,
          'QUIT\r\n'
        ].join(''));
      });

      socket.on('data', (data: Buffer) => {
        const response = data.toString();
        if (response.includes('250 2.1.5')) {
          socket.end();
          resolve(true);
        } else if (response.includes('550')) {
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
    });
  }

  public async verifyEmail(email: string): Promise<boolean | null> {
     
    if (this.cache.has(email)) {
      const entry = this.cache.get(email)!;
      if (Date.now() - entry.timestamp < this.cacheTTL) {
        return entry.valid;
      }
    }

    const result = await this.verifyViaSMTP(email);
    if (result !== null) {
      this.cache.set(email, {
        valid: result,
        timestamp: Date.now()
      });
    }

    return result;
  }
}

export default new EmailVerifier();
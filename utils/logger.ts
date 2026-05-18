export class Logger {
  private static readonly RESET = '\x1b[0m';
  private static readonly BRIGHT = '\x1b[1m';
  private static readonly DIM = '\x1b[2m';
  private static readonly RED = '\x1b[31m';
  private static readonly GREEN = '\x1b[32m';
  private static readonly YELLOW = '\x1b[33m';
  private static readonly BLUE = '\x1b[34m';
  private static readonly CYAN = '\x1b[36m';

  static info(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`${this.BLUE}[${timestamp}] [INFO]${this.RESET} ${message}`);
  }

  static success(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`${this.GREEN}[${timestamp}] [SUCCESS]${this.RESET} ${message}`);
  }

  static error(message: string, error?: Error): void {
    const timestamp = new Date().toISOString();
    console.error(`${this.RED}[${timestamp}] [ERROR]${this.RESET} ${message}`);
    if (error) {
      console.error(`${this.RED}${error.message}${this.RESET}`);
      console.error(error.stack);
    }
  }

  static warn(message: string): void {
    const timestamp = new Date().toISOString();
    console.warn(`${this.YELLOW}[${timestamp}] [WARN]${this.RESET} ${message}`);
  }

  static debug(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`${this.DIM}[${timestamp}] [DEBUG]${this.RESET} ${message}`);
  }

  static section(title: string): void {
    const timestamp = new Date().toISOString();
    console.log(`\n${this.CYAN}${this.BRIGHT}========== ${title} ==========${this.RESET}`);
  }

  static table(data: any[]): void {
    console.table(data);
  }
}


class Logger {
  constructor(reporter = null, level = 1) {
    this.reporterAvailable = reporter !== null;
    this.reporter = reporter;
    this.level = level;
  }

  error(text) {
    if (this.reporterAvailable) {
      this.reporter.error(text);
    } else {
      console.error('[error]', text);
    }
  }

  info(text) {
    if (this.level < 1) return;

    if (this.reporterAvailable) {
      this.reporter.info(text);
    } else {
      console.log('[info]', text);
    }
  }

  debug(text) {
    if (this.level < 2) return;

    if (this.reporterAvailable) {
      this.reporter.info(text);
    } else {
      console.log('[debug]', text);
    }
  }
}

module.exports = Logger;

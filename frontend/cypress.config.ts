import { defineConfig } from 'cypress';
import axios from 'axios';
import { FetchMessageObject, ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export default defineConfig({
  env: {
    apiUrl: 'http://localhost:4000',
    mobileViewportWidthBreakpoint: '600',
  },
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      const { env } = config;
      const { apiUrl, SMTP_USER, SMTP_PASSWORD } = env;

      on('task', {
        async 'db:seed'() {
          const { data } = await axios.post(`${apiUrl}/test/seed`);
          return data;
        },

        async getLastEmail() {
          const client = new ImapFlow({
            host: 'imap.ethereal.email',
            port: 993,
            secure: true,
            auth: {
              user: SMTP_USER,
              pass: SMTP_PASSWORD,
            },
          });

          // Wait until client connects and authorizes
          await client.connect();

          // Select and lock a mailbox. Throws if mailbox does not exist
          const lock = await client.getMailboxLock('INBOX');

          // fetch latest message source
          const message = await client.fetchOne('*', { source: true });

          // Make sure lock is released, otherwise next `getMailboxLock()` never returns
          lock.release();
          // log out and close connection
          await client.logout();

          if (!message) {
            return null;
          }

          return await simpleParser(message.source);
        },
      });
    },
    baseUrl: 'http://localhost:3002',
  },
});

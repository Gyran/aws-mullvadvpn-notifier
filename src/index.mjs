import sendTelegramMessage from '@gyran/send-telegram-message';
import getExpiry from './get-expiry.mjs';
import getEnvValue from 'get-env-value';

// SETTINGS
const MULLVADVPN_ACCOUNT_TOKEN = getEnvValue.stringValue(
  'MULLVADVPN_ACCOUNT_TOKEN',
);
const TELEGRAM_BOT_TOKEN = getEnvValue.stringValue('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = getEnvValue.integerValue('TELEGRAM_CHAT_ID');
const NOTIFY_AT_DAYS_LEFT = getEnvValue.integerValue('NOTIFY_AT_DAYS_LEFT', -1);

if (
  !MULLVADVPN_ACCOUNT_TOKEN ||
  !TELEGRAM_BOT_TOKEN ||
  !TELEGRAM_CHAT_ID ||
  NOTIFY_AT_DAYS_LEFT < 0
) {
  throw new Error('You need to configure first!');
}

const DAY_MS = 86400000;

const handler = async () => {
  console.info('Starting!');
  console.info('MULLVADVPN_ACCOUNT_TOKEN: ***');
  console.info('TELEGRAM_BOT_TOKEN: ***');
  console.info('TELEGRAM_CHAT_ID:', TELEGRAM_CHAT_ID);
  console.info('NOTIFY_AT_DAYS_LEFT:', NOTIFY_AT_DAYS_LEFT);

  const expiry = await getExpiry(MULLVADVPN_ACCOUNT_TOKEN);
  const expiryTime = new Date(expiry);
  const now = new Date();

  const timeLeft = expiryTime - now;

  const daysLeft = Math.floor(timeLeft / DAY_MS);

  console.info('Days left:', daysLeft);

  if (daysLeft <= NOTIFY_AT_DAYS_LEFT && daysLeft >= 0) {
    console.info('Will notify!');

    await sendTelegramMessage(
      TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID,
      `${daysLeft} dagar kvar på mullvad innan det går ut!`,
    );
  } else {
    console.info('Did not notify');
  }
};

export { handler };

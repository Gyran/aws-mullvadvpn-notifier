const sendTelegramMessage = require('@gyran/send-telegram-message');

const getExpiry = require('./get-expiry');
const { getEnvValue, getEnvIntegerValue } = require('./env-util');

// SETTINGS
const MULLVADVPN_ACCOUNT_TOKEN = getEnvValue('MULLVADVPN_ACCOUNT_TOKEN');
const TELEGRAM_BOT_TOKEN = getEnvValue('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = getEnvIntegerValue('TELEGRAM_CHAT_ID');
const NOTIFY_AT_DAYS_LEFT = getEnvIntegerValue('NOTIFY_AT_DAYS_LEFT', -1);

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
  console.log('Starting!');
  console.log('MULLVADVPN_ACCOUNT_TOKEN:', MULLVADVPN_ACCOUNT_TOKEN);
  console.log('TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN);
  console.log('TELEGRAM_CHAT_ID:', TELEGRAM_CHAT_ID);
  console.log('NOTIFY_AT_DAYS_LEFT:', NOTIFY_AT_DAYS_LEFT);

  const expiry = await getExpiry(MULLVADVPN_ACCOUNT_TOKEN);
  const expiryTime = new Date(expiry);
  const now = new Date();

  const timeLeft = expiryTime - now;

  const daysLeft = Math.floor(timeLeft / DAY_MS);

  console.log('Days left:', daysLeft);

  if (daysLeft <= NOTIFY_AT_DAYS_LEFT && daysLeft >= 0) {
    console.log('Will notify!');

    await sendTelegramMessage(
      TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID,
      `${daysLeft} dagar kvar på mullvad innan det går ut!`,
    );
  } else {
    console.log('Did not notify');
  }
};

exports.handler = handler;

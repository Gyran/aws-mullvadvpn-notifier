const Notifyy = require('node-notifyy');

const getExpiry = require('./get-expiry');
const { getEnvValue, getEnvIntegerValue } = require('./env-util');

// SETTINGS
const MULLVADVPN_ACCOUNT_TOKEN = getEnvValue('MULLVADVPN_ACCOUNT_TOKEN');
const NOTIFYY_TOKEN = getEnvValue('NOTIFYY_TOKEN');
const NOTIFY_AT_DAYS_LEFT = getEnvIntegerValue('NOTIFY_AT_DAYS_LEFT', -1);

if (!MULLVADVPN_ACCOUNT_TOKEN || !NOTIFYY_TOKEN || NOTIFY_AT_DAYS_LEFT < 0) {
  throw new Error('You need to configure first!');
}

const DAY_MS = 86400000;

const handler = async () => {
  console.log('Starting!');
  console.log('MULLVADVPN_ACCOUNT_TOKEN:', MULLVADVPN_ACCOUNT_TOKEN);
  console.log('NOTIFYY_TOKEN:', NOTIFYY_TOKEN);
  console.log('NOTIFY_AT_DAYS_LEFT:', NOTIFY_AT_DAYS_LEFT);

  const expiry = await getExpiry(MULLVADVPN_ACCOUNT_TOKEN);
  const expiryTime = new Date(expiry);
  const now = new Date();

  const timeLeft = expiryTime - now;

  const daysLeft = Math.floor(timeLeft / DAY_MS);

  console.log('Days left:', daysLeft);

  if (daysLeft <= NOTIFY_AT_DAYS_LEFT && daysLeft >= 0) {
    console.log('Will notify!');

    const notifyy = new Notifyy({
      users: NOTIFYY_TOKEN
    });
    await notifyy.send({
      title: `${daysLeft} dagar kvar på mullvad innan det går ut!`
    });
  } else {
    console.log('Did not notify');
  }
};

exports.handler = handler;

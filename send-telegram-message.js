const https = require('https');
const querystring = require('querystring');

const _get = async url => {
  return new Promise((resovle, reject) => {
    let responseData = '';
    const request = https.get(url, response => {
      response.on('data', chunk => {
        responseData += chunk;
      });

      // The whole response has been received
      response.on('end', () => {
        try {
          const out = JSON.parse(responseData);

          if (response.statusCode === 200) {
            resovle(out);
          } else {
            reject(out);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on('error', error => {
      reject(error);
    });
    request.end();
  });
};

const sendTelegramMessage = async (botToken, chatId, message) => {
  const baseUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const params = querystring.stringify({
    chat_id: chatId,
    text: message,
  });

  const url = `${baseUrl}?${params}`;

  const response = await _get(url);

  return response.ok;
};

module.exports = sendTelegramMessage;

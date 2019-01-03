const https = require('https');

const HOST = 'api.mullvad.net';
const PORT = 443;
const PATH = '/rpc/';

const _post = async data => {
  return new Promise((resovle, reject) => {
    const postData = JSON.stringify(data);

    let responseData = '';

    const request = https.request(
      {
        method: 'post',
        port: PORT,
        host: HOST,
        path: PATH,
        headers: {
          'Content-type': 'application/json',
          'Content-Length': postData.length,
        },
      },
      response => {
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
      },
    );

    request.on('error', error => {
      reject(error);
    });
    request.write(postData);
    request.end();
  });
};

const getExpiry = async accountToken => {
  const data = {
    id: 1,
    jsonrpc: '2.0',
    method: 'get_expiry',
    params: [accountToken],
  };

  const response = await _post(data);

  return response.result;
};

// curl -s -d "{\"id\": 1, \"jsonrpc\": \"2.0\", \"method\":\"get_expiry\", \"params\":[\"$account_token\"] }" -H "Content-Type: application/json" $MULLVAD_API_URL

module.exports = getExpiry;

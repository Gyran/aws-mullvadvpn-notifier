const baseUrl = 'https://api.mullvad.net';

const getExpiry = async accountToken => {
  const response = await fetch(`${baseUrl}/www/accounts/${accountToken}/`);
  const data = await response.json();

  return data.account.expires;
};

export default getExpiry;

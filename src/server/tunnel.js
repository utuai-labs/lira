import localtunnel from 'localtunnel';

export default (port, subdomain) => {
  localtunnel(port, { subdomain, host: 'https://bot-tunnel.com' }, (err, tunnel) => {
    if (err) {
      console.error('Error Starting Tunnel: ', err);
    }

    console.log('Started Tunnel On: ', tunnel.url);
  });
};

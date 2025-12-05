const https = require('https');

const data = JSON.stringify({ recipes: [], nextId: 1 });

const options = {
    hostname: 'jsonblob.com',
    path: '/api/jsonBlob',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Location:', res.headers.location);
});

req.on('error', (e) => {
    console.error(e);
});

req.write(data);
req.end();

var csv = require('csv');
var fs = require('fs');
var request = require('request');
var moment = require('moment');
var argv = require('minimist')(process.argv.slice(2));

var url = process.env.URL;
var token = process.env.TOKEN;

if (!url ||  !token) {
    console.log('url and token needed');
    process.exit();
}

var parser = csv.parse({
    delimiter: ';',
    columns: null,
    trim: true
}, function(err, rows) {
    for (var i in rows) {
        var data = rows[i];

        if(data.length < 7) {
            continue;
        }

        if (data[6] == '') {
            continue;
        }

        params = {
            'account_id': 2,
            'booked_at': moment(data[2], 'DD.MM.YY').toISOString(),
            'value': parseFloat(data[6].replace(',', '.')) * 100,
            'original_text': data[3],
            'data': data
        }

        console.log(params);

        request({
            method: 'POST',
            uri: url,
            headers: {
                'X-Auth-Token': token
            },
            body: params,
            json: true
        }, function(error, response, body) {
            console.log(body);
        })


    }


});

fs.createReadStream(argv.file).pipe(parser);

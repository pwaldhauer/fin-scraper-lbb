
var downloadComplete = false;

var casper = require('casper').create({
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    },
    webSecurityEnabled: false,
    logLevel: "debug",
    verbose: true,
        onWaitTimeout: function() {
            logConsole('Wait TimeOut Occured');
            this.capture('xWait_timeout.png');
            this.exit();
        },
        onStepTimeout: function() {
            logConsole('Step TimeOut Occured');
            this.capture('xStepTimeout.png');
            this.exit();
        },

});

var env = require('system').env
var user = env.USER;
var password = env.PASSWORD;

if(!user || !password) {
    console.log('User and password needed');

    casper.exit();
}


casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4');

casper.start('https://kreditkarten-banking.lbb.de/Amazon/cas/dispatch.do?bt_PRELON=do&ref=1200_AMAZON&service=COS', function() {
    this.fillSelectors('form[name=preLogonForm]', {
        'input[name=user]': user,
        'input[name=password]': password,
    }, false);

    this.click('input[name=bt_LOGON]');
});

casper.waitForText('Kartenumsätze', function() {
    this.clickLabel('Kartenumsätze');
})

casper.then(function() {
    var url = this.getElementAttribute('a[href*="CSV"]', 'href');
    this.download(url, 'umsaetze_' + (new Date()).getTime() + '.csv');
})

casper.then(function() {
    this.clickLabel('Rechnungen');
})

casper.waitForText('Rechnungsdatum', function() {
    this.click('input[name="bt_STMT"]');
})


casper.waitForText('Kreditkartenabrechnung', function() {
    this.click('#statementSaveHeader');
})


casper.waitForText('Rechnung speichern', function() {  var url = this.getElementAttribute('a[href*="CSV"]', 'href');
    this.download(url, 'rechnung_' + (new Date()).getTime() + '.csv');
})

casper.run();

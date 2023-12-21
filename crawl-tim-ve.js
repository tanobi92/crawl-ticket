const puppeteer = require('puppeteer');
const configs = require('./configs/tim-ve.cfg');

const {url, address, email, password, headless, ticketURL, distance,
    phone, cardNumber} = configs;

const login = async (page) => {
    console.log('------ Start login Tim ve ------');

    await page.goto(`${url}/login`);
    // await page.waitForTimeout(1500);
    await page.waitForSelector('[name="email"]');

    const emailInput = await page.$('[name="email"]');

    await emailInput.type(email);

    const passInput = await page.$('[name="ipPwd"]');

    await passInput.type(password);

    await page.click('[ng-click="c.submitEmail(authForm)"]');
    // await page.waitForTimeout(1000);
    await page.waitForSelector('.user-avatar');
}
const main = async () => {
    try {
        let browser, page;
        browser = await puppeteer.launch({
            headless,
            args: [
                '--disable-notifications',
                '--window-size=1920,1080',
                '--lang=en',
                '--disable-extensions',
                '--disable-infobars',
                '--user-agent="Mozilla/5.0 (X11; Linux i686; rv:52.0) Gecko/20100101 Firefox/52.0"',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                // '--proxy-server=http://118.70.7.229:80'
            ],
            ignoreDefaultArgs: ["--enable-automation"],
            defaultViewport: null,
            devtools: false,
        });
        page = await browser.newPage();

        await login(page);

        await page.goto(ticketURL);

        // chon ca nhan
        await page.waitForSelector('.block-main .container');
        // await page.click('.block-main .container .text-center');
        let index;

        switch (distance) {
            case '5KM':
                index = 0;
                break;
            case '10KM':
                index = 1;
                break;
            case '21KM':
                index = 2;
                break;
            case '5KM (PRO)':
                index = 3;
                break;
            case '10KM (PRO)':
                index = 4;
                break;
            case '21KM (PRO)':
                index = 5;
                break;

        }
        const btnAdd = await page.$(`.tickets-table tbody .ticket-row:nth-child(${index+1}) .text-center .incr`);

        await btnAdd.click();

        const btnNext1 = await page.$('.btn[ng-click="ctrl.nextStep()"]');

        await btnNext1.click();

        // await page.waitForTimeout(1000);
        await page.waitForSelector('input[name="ipt_phoneIpt');

        const $phone = await page.$('input[name="ipt_phoneIpt"]');

        await $phone.type(phone);

        const btnNext2 = await page.$('.btn[ng-click="ctrl.nextStep()"]');

        await btnNext2.click();
        // await page.waitForTimeout(1500);
        await page.waitForSelector('button[ng-click="ctrl.openMyParticipants($index)"]');

        const btnInfo = await page.$('button[ng-click="ctrl.openMyParticipants($index)"]');

        await btnInfo.click();
        await (await page.$('.list-group-item:nth-child(1)')).click();
        // await page.waitForTimeout(1500);
        await page.waitForSelector(`input[ng-model="pat.moreInfos['Địa chỉ hiện tại']"]`);

        const $address = await page.$(`input[ng-model="pat.moreInfos['Địa chỉ hiện tại']"]`);

        await $address.type(address);

        const btnNext3 = await page.$('.btn[ng-click="ctrl.nextStep()"]');

        await btnNext3.click();

        // await page.waitForTimeout(1500);
        await page.waitForSelector('.pay-container');

        if (cardNumber) {
            const $cardVisa = await page.$('.pay-container:nth-child(2)');

            await $cardVisa.click();
        }

    } catch (error) {
        console.log(error);
    }
}

main().then();
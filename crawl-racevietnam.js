const puppeteer = require('puppeteer');
const configs = require('./configs/racevietnam.cfg');
const {district} = require("./configs/racevietnam.cfg");

const {url, urls, address, email, password, headless, ticketURL, distance,
    phone, cardNumber, loginURL, district, commune, bibName, sos, size, blood, hearth} = configs;

const login = async (page, uri) => {
    console.log('------ Start login Tim ve ------');
    let $email, $password, $btnLogin;

    await page.goto(`${uri}${loginURL}${email}`);
    // await page.waitForTimeout(1500);
    // await page.waitForSelector('#SignIn [name="UserName"]');

    // $email = await page.$('#SignIn [name="UserName"]');
    // await $email.type(email);

    // nhan dang nhap
    // $btnLogin = await page.$('#SignIn .btn[type="submit"]');
    // await $btnLogin.click();

    await page.waitForSelector('#SignIn [name="Password"]');
    $password = await page.$('#SignIn [name="Password"]');
    await $password.type(password);

    $btnLogin = await page.$('#SignIn .btn[type="submit"]');
    await $btnLogin.click();
    await page.waitForTimeout(1000);
    await page.waitForSelector('#users-dropdown-invoker-2');
}
const crawl = async (uri) => {
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
    try {
        await login(page, uri);

        await page.goto(`${uri}${ticketURL}`);

        // chon ca nhan
        await page.waitForSelector('#nav-raceregister');
        // await page.click('.block-main .container .text-center');
        let index;

        // chon cu ly
        await selectDropdown(page, 'RaceDistanceId', distance);

        // quan/huyen
        await selectDropdown(page, 'DistrictId', district);

        // xa/phuong
        await selectDropdown(page, 'DistrictId', commune);

        // dia chi
        await typeInput(page, 'Address', address);

        // bib name
        await typeInput(page, 'BibName', bibName);

        // lien he khan cap
        await typeInput(page, 'EmergencyContact', sos);

        // size ao
        await selectDropdown(page, 'SizeShirt', size);

        // nhom mau
        await selectDropdown(page, 'vq_46', blood);

        // tien su benh
        await typeInput(page, 'vq_47', hearth);

        // thuoc dieu tri
        await typeInput(page, 'vq_48', hearth);


        // thanh toan
        const btnPayment = await page.$('#buttonPayment');

        await btnPayment.click();

    } catch (error) {
        console.log(error);
        await page.close();
        await browser.close();
        throw error;
    }
}

const selectDropdown = async (page, id, text) => {
    let result;
    const $element = await page.$(`#${id}`);

    await $element.click();
    result = await page.evaluate((el, text) => {
        const opts = el.querySelectorAll('option');
        let value = null;
        for (let opt of opts) {
            if (opt.innerHTML.includes(text)) {
                value = opt.getAttribute('value');
                break;
            }
        }
        return value;
    }, $element, text);
    await page.select(`#${id}`, result);

    return true;
}

const typeInput = async (page, id, text) => {
    const $element = await page.$(`#${id}`);

    await $element.type(text);
}

const main = async () => {
    try {
        for (let uri of urls) {
            try {
               await crawl(uri);
            } catch (error) {

            }
        }

    } catch (error) {
        console.log('------------------------ ERROR Message:', error.message);
        retry();
    }

}
main();

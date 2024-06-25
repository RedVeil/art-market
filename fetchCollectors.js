import puppeteer from "puppeteer";
import fs from "fs";
import cheerio from "cheerio";

const wait = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,  // Set to true if you want to run in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Open the login page
  await page.goto('https://www.larryslist.com/', {
    waitUntil: 'networkidle2'
  });

  // Click the login button to open the login form (assuming there's a button to click to show the form)
  await page.click('span[class="login"]'); // Modify this selector to match the actual login button/link

  // Wait for the login form to be displayed
  await page.waitForSelector('form#login'); // Modify this selector to match the actual login form

  // Type the email and password
  await page.type('input[id="email"]', 'leon.niesler@gmail.com'); // Replace with your actual email
  await page.type('input[id="password"]', 'leon1996'); // Replace with your actual password

  // Submit the login form
  await page.click('button[type="submit"]'); // Modify this selector to match the actual submit button

  wait(10_000)

  await page.goto(`https://www.larryslist.com/collector/name/Ann%20Tenenbaum/2003/`, {
    waitUntil: 'networkidle2'
  });

  const bodyHTML = await page.evaluate(() => {
    return document.body.innerHTML;
  });

  const $ = cheerio.load(bodyHTML);
  getGenres($)
  getOrigins($)
  getMediums($)

  // Close the browser
  //await browser.close();

  // fs.writeFile('filteredResults.json', JSON.stringify(resultsArray, null, 2), err => {
  //   if (err) {
  //     console.log('Error writing to file', err);
  //   } else {
  //     console.log('Results saved to filteredResults.json');
  //   }
  // });
})();


function getGenres($) {
  // Select the parent element based on its class
  const parent = $('.genre');

  // Select all <a> elements within the parent element
  const genres = [];
  parent.find('a').each((index, element) => {
    genres.push($(element).text().trim());
  });

  console.log('Genres:', genres);
}

function getOrigins($) {
  // Select the parent element based on its class
  const parent = $('.origin');

  // Select all <a> elements within the parent element
  const origins = [];
  parent.find('a').each((index, element) => {
    origins.push($(element).text().trim());
  });

  console.log('Origins:', origins);
}

function getMediums($) {
  // Select the parent element based on its class
  const parent = $('.medium');

  // Select all <a> elements within the parent element
  const mediums = [];
  parent.find('a').each((index, element) => {
    mediums.push($(element).text().trim());
  });

  console.log('Mediums:', mediums);
}
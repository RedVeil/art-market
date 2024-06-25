import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const combinations2 = [];

  // Generate two-letter combinations
  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters.length; j++) {
      combinations2.push(letters[i] + letters[j]);
    }
  }

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

  // Set to store unique results
  const uniqueResults = new Set();

  for (let n = 0; n < combinations2.length; n++) {
    await page.goto(`https://www.larryslist.com/ajax.php?ajax_action=auto_comp_Collector&term=${combinations2[n]}`, {
      waitUntil: 'networkidle2'
    });

    const bodyHTML = await page.evaluate(() => {
      return document.body.innerHTML;
    });

    const collectors = JSON.parse(bodyHTML)
      .filter(e => e.labels === "collector")
      .map(e => { return { value: e.value, label: e.label.split(" (Collector)")[0] } })

    console.log({ key: combinations2[n], collectors })

    collectors.forEach(item => uniqueResults.add(JSON.stringify(item)));
  }
  const resultsArray = Array.from(uniqueResults).map(item => JSON.parse(item));
  console.log("ALL DONE")

  // Close the browser
  await browser.close();

  fs.writeFile('filteredResults.json', JSON.stringify(resultsArray, null, 2), err => {
    if (err) {
      console.log('Error writing to file', err);
    } else {
      console.log('Results saved to filteredResults.json');
    }
  });
})();
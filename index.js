const { cookies } = require("next/headers");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function loadPage(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  return page;
}

async function addToCart(page) {
  new Promise((resolve) => setTimeout(resolve, 2000));

  const addToCartButton = await page.waitForSelector("#ProductSubmitButton-");
  await addToCartButton.click();

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await page.waitForSelector("button[name='checkout']");
  await page.evaluate(() => {
    document.querySelector("button[name='checkout']").click();
  });
}

async function checkOut(page) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await page.waitForSelector("#email");
  await page.type("#email", "tuvcxmaxsuutadmkac@xfavaj.com");
  await page.type("#TextField0", "John");
  await page.type("#TextField1", "Doe");
  await page.type("#shipping-address1", "2401 Elliott Ave");
  await page.type("#TextField4", "Seattle");
  await page.type("#TextField6", "2345678901");
  await page.select("select[name='zone']", "WA");
  await page.type("#TextField5", "98121");

  await new Promise((resolve) => setTimeout(resolve, 2000));
  const continueToShipping = await page.waitForSelector(
    "button[type='submit']"
  );
  await continueToShipping.click();

  await new Promise((resolve) => setTimeout(resolve, 3000));
  const continueToPayment = await page.waitForSelector("button[type='submit']");
  await continueToPayment.click();

  await fillPaymentInfo(page);
}
async function addToCart(page) {
  await page.waitForSelector('button[name="add"]');
  let cookies = await page.cookies();
  await page.evaluate(async (cookies) => {
    let response = await fetch("https://www.stanley1913.com/cart/add", {
      headers: {
        accept: "application/javascript",
        "accept-language": "en-US,en;q=0.9",
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundary8eBkYfAvHXOHTy7I",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="137", "Chromium";v="137", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Mac OS X"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: cookies,
        Referer:
          "https://www.stanley1913.com/products/the-club-vintage-quencher-h2-0-flowstate%E2%84%A2-tumbler-30-oz?variant=53972848050536",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: '------WebKitFormBoundary8eBkYfAvHXOHTy7I\r\nContent-Disposition: form-data; name="form_type"\r\n\r\nproduct\r\n------WebKitFormBoundary8eBkYfAvHXOHTy7I\r\nContent-Disposition: form-data; name="utf8"\r\n\r\n✓\r\n------WebKitFormBoundary8eBkYfAvHXOHTy7I\r\nContent-Disposition: form-data; name="id"\r\n\r\n53972848050536\r\n------WebKitFormBoundary8eBkYfAvHXOHTy7I\r\nContent-Disposition: form-data; name="properties[Shipping]"\r\n\r\n\r\n------WebKitFormBoundary8eBkYfAvHXOHTy7I\r\nContent-Disposition: form-data; name="product-id"\r\n\r\n14973174088040\r\n------WebKitFormBoundary8eBkYfAvHXOHTy7I\r\nContent-Disposition: form-data; name="section-id"\r\n\r\ntemplate--24565634695528__4b86bc5c-f0d6-46d6-8684-1235f066332e\r\n------WebKitFormBoundary8eBkYfAvHXOHTy7I\r\nContent-Disposition: form-data; name="quantity"\r\n\r\n1\r\n------WebKitFormBoundary8eBkYfAvHXOHTy7I\r\nContent-Disposition: form-data; name="sections"\r\n\r\ncart-notification-product,cart-notification-button,cart-icon-bubble\r\n------WebKitFormBoundary8eBkYfAvHXOHTy7I\r\nContent-Disposition: form-data; name="sections_url"\r\n\r\n/products/the-club-vintage-quencher-h2-0-flowstate%E2%84%A2-tumbler-30-oz\r\n------WebKitFormBoundary8eBkYfAvHXOHTy7I--\r\n',
      method: "POST",
    });
  }, cookies);
}
async function getShippingtoken(page) {
  let response = await page.evaluate(async (cookies) => {
    let response = await fetch("https://www.stanley1913.com/cart.js", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="137", "Chromium";v="137", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Mac OS X"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie: cookies,
        Referer:
          "https://www.stanley1913.com/products/the-club-vintage-quencher-h2-0-flowstate%E2%84%A2-tumbler-30-oz?variant=53972848050536",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    });
    response = await response.json();
    return response;
  }, cookies);
  console.log(response.token);
  token = response.token.split("?")[0];
  console.log("token", token);
  shippingUrl =
    "https://www.stanley1913.com/checkouts/cn/" + token + "/information";
  await page.goto(shippingUrl);
}
async function fillPaymentInfo(page) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const cardNumberInput = await page.waitForSelector("#number");
  await cardNumberInput.type(" 4807706658353551", { delay: 100 });
  const cardExpiryInput = await page.waitForSelector("#expiry");
  await cardExpiryInput.type("03/2027", { delay: 300 });
  const cardCvcInput = await page.waitForSelector("#verification_value");
  await cardCvcInput.type(" 687", { delay: 1000 });

  const payNowButton = await page.waitForSelector("button[type='submit']");
  await payNowButton.click();
  console.log("Order was placed!");
}

async function run() {
  const page = await loadPage();
  await page.goto(
    "https://www.stanley1913.com/products/the-club-vintage-quencher-h2-0-flowstate%E2%84%A2-tumbler-30-oz?variant=53972848050536"
  );
  await addToCart(page);
  await getShippingtoken(page);
  await checkOut(page);
}

run();

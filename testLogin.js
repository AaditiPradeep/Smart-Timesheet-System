// testLogin.js
const { Builder, By, until } = require("selenium-webdriver");

(async function testLogin() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000");

    await driver.findElement(By.name("username")).sendKeys("Aaditi Pradeep");
    await driver.findElement(By.name("password")).sendKeys("aaditi");
    await driver.findElement(By.css("button")).click();

    await driver.wait(until.urlContains("/employee"), 5000);

    console.log("Login successful");
  } finally {
    await driver.quit();
  }
})();
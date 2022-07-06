const puppeteer = require('puppeteer');

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

async function redLog(str){
  console.log("\x1b[41m%s\x1b[0m", str)
}

(async () => {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page.goto('https://shazoo.ru/')
  await page.setViewport({width:1000, height:600})
  await delay(5000)

  let news=[]
  let platforms=[]
  let articles=[]
  let more=[]
//Заполним массив с Новостями
await page.mouse.move(172,28)
for (var i=1; i < 13; i++) {
  try{
    let element=await page.waitForXPath("((//a [@href='/news'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()])["+i+"]", {timeout:500})
    let value= await page.evaluate(element=>element.textContent,element)
    news.push(value)
    console.log(i, value)

  } catch(err){
    console.log(i, "xpath не найден")
  }
}
//Заполним массив с Платформами
await page.mouse.move(280,24)
for (var i=1; i < 10; i++) {
  try{
    let element=await page.waitForXPath("((//a [@href='/platforms'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()])["+i+"]", {timeout:500})
    let value= await page.evaluate(element=>element.textContent,element)
    platforms.push(value)
    console.log(i, value)

  } catch(err){
    console.log(i, "xpath не найден")
  }
}
//Заполним массив со Статьями
await page.mouse.move(365,35)
for (var i=1; i < 6; i++) {
  try{
    let element=await page.waitForXPath("((//a [@href='/editorial'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()])["+i+"]", {timeout:500})
    let value= await page.evaluate(element=>element.textContent,element)
    articles.push(value)
    console.log(i, value)

  } catch(err){
    console.log(i, "xpath не найден")
  }
}
//Заполним массив с Большей информацией
await page.mouse.move(444,32)
for (var i=1; i < 3; i++) {
  try{
    let element=await page.waitForXPath("((//a [@href='/discounts'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()])["+i+"]", {timeout:500})
    let value= await page.evaluate(element=>element.textContent,element)
    more.push(value)
    console.log(i, value)

  } catch(err){
    console.log(i, "xpath не найден")
  }
}

await delay(1000)
await browser.close()
})()
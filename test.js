const puppeteer = require('puppeteer');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

async function redLog(str){
  console.log("\x1b[41m%s\x1b[0m", str)
}

(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto('https://artworld.ru/catalog/?fields_filter%5Bstyle%5D=351')
  await page.setViewport({width:1200, height:700})
  await delay(5000)

  let artists = []
  //Подсчет количества элементов



  const countText=await page.$x("//div[text()='Художники']/..//li")
  const count=countText.length
  console.log (count)

  //Данные художников
  for (var i=1; i < count; i++) {
    let element=await page.waitForXPath("//div[text()='Художники']/..//li["+i+"]//a[text()]",{timeout:500})
    let value=await page.evaluate(element=>element.textContent,element)

    try{
        try { 
          let value_edit = value.replace(', LegacyArt', '')
          artists.push(value_edit)
          console.log(i, value_edit)
        } catch {
          let value_edit = value.replace(' , LegacyArt', '')
          artists.push(value_edit)
          console.log(i, value_edit)
        }
    } catch {
        let value_edit = value.replace('', '')
        artists.push(value_edit)
        console.log(i, value_edit)
    }
}

  await scrollPageToBottom(page,{
    size:1050,
    delay:250,
    stepsLimit: 5
  })

  await page.reload()
//Вводим в поле "Поиск" художника
  for (let i=1; i<12; i++){
    await page.keyboard.press("Tab") 
  }

  await page.keyboard.type(artists[15])
  for (let i=1; i<20; i++){
    await page.keyboard.press("Backspace")
  }
  await page.keyboard.press("Enter")
  await delay(1000)
  await(await page.waitForXPath("//input[@type='button' and @data-modal-data-id='item-321-modal']")).click()

  await page.reload()
  await(await page.waitForXPath("//a[@href='/emarket/cart/']")).click()

  //Проверка на наличие картины в корзине
  try{
    await page.waitForXPath("//a[contains(text(), 'Звездная ночь')]")
    console.log('Картина в корзине')

  } catch(err){
    redLog('Нет в корзине')
  }
  await browser.close()
} )()
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const bodyParser = require('body-parser')
const { find } = require('domutils')
const port = process.env.PORT || 3000
const app = express()
const data = ''

app.use(express.json());
app.use(express.urlencoded());

app.use('/', express.static('static'))

app.post('/stock', (req, res) =>{ 
    const cardObj = req.body
    const card = JSON.stringify(cardObj)
axios
.get("https://www.microcenter.com/search/search_results.aspx?Ntt=" + card + "&Ntk=all&sortby=pricelow&N=4294966937&storeid=051")
    .then(response => {
        var index = 0
        const data = []
        const base = response.data
        const scrape = cheerio.load(base)
        scrape(".product_wrapper", base).each(function() {
           const test = scrape(this).text()
            const name = scrape(this).find('.result_right').find('a').attr("data-name")
            const price = "$" + scrape(this).find('.result_right').find('a').attr("data-price")
            const productLink = scrape(this).find('.result_right').find('a').attr("href")
            const img = scrape(this).find('.SearchResultProductImage').attr("src")
            const link = "https://www.microcenter.com/" + productLink
            const stockScrape = scrape(this).find('.stock').text()
            const stockReplace = stockScrape.replace(/[\r\n]+/gm, "")
            const stockSpacing = stockReplace.replace("                                                                                    ", "")
            const stock = stockSpacing.replace("                                                                                                                                                                                                                                            ", "")
            var available = null
            if(stock.startsWith('SOLD OUT')) {
                available = false
            }
            else {
                available = true
            }
            index++
            data.push({
                index,
                name,
                price,
                stock,
                link,
                img,
                available
            })
        })
        console.log(data)
        res.send(data)
    })
    .catch(e => {
        console.log(e)
    })
    
})




app.listen(port, () => {
    console.log(`Serving at http://localhost:${port}`)
  })
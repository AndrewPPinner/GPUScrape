const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const bodyParser = require('body-parser')
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
        scrape(".result_right", base).each(function() {
           const test = scrape(this).text()
            const name = scrape(this).find('a').attr("data-name")
            const price = scrape(this).find('a').attr("data-price")
            const link = scrape(this).find('a').attr("href")
            const stockScrape = scrape(this).find('.stock').text()
            const stockReplace = stockScrape.replace(/[\r\n]+/gm, "")
            const stockSpacing = stockReplace.replace("                                                                                    ", "")
            const stock = stockSpacing.replace("                                                                                                                                                                                                                                            ", "")
            index++
            data.push({
                index,
                name,
                price,
                stock,
                link,
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
    console.log(`Serving at ${port}`)
  })
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { hasClass } = require('cheerio/lib/api/attributes')
const port = process.env.PORT || 3000

const app = express()
var card = '3060'
//var ti = true/false



app.get('/stock', (req, res) =>{ 
axios("https://www.microcenter.com/search/search_results.aspx?Ntt=" + card + "&Ntk=all&sortby=pricelow&N=4294966937&storeid=051")
    .then(response => {
        var index = 0
        const info = []
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
            info.push({
                index,
                name,
                price,
                stock,
                link,
            })
            
        })
        console.log(info)
        res.send(info)

    })
    .catch(e => {
        console.log(e)
    })
})




app.listen(port, () => {
    console.log(`Serving at ${port}`)
  })
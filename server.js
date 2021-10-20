const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const bodyParser = require('body-parser')
const { find } = require('domutils')
const https = require('https')
//set to allow heroku to set its own port value
const port = process.env.PORT || 3000
const app = express()

//wake up function to keep heroku app awake
setInterval(function() {
    https.get("https://gpu-scraper.herokuapp.com/");
    console.log("Wake Up")
}, 960000);
//bodyParser to get values from POST from front end
app.use(express.json());
app.use(express.urlencoded());
//default landing page to serve static HTML and JS
app.use('/', express.static('static'))
//to allow post request from front end at /stock url the request is the "card" value from front end send is value sent back to front end via axios request
app.post('/stock', (req, res) =>{
    const url = "https://www.microcenter.com/search/search_results.aspx?Ntt=" + req.body[0].card + "&Ntk=all&sortby=pricelow&N=4294966937&storeid=" + req.body[0].selectLocation
    //axios call to get standard HTML from webpage to be crawled
    axios
    .get(url)
    .then(response => {
        // const to use throughout entire call
        var index = 0
        const data = []
        //settingup cheerio
        const base = response.data
        //load axios plain HTML into cheerio so that it can be manipulated
        const scrape = cheerio.load(base)
        //starting point for cheerio with foreach loop to loop through each response on page
        scrape(".product_wrapper", base).each(function() {
            //useless boiler plate, should delete
           const test = scrape(this).text()
           //pointing to the specific date to scrape and turn into plain text
            const name = scrape(this).find('.result_right').find('a').attr("data-name")
            const price = "$" + scrape(this).find('.result_right').find('a').attr("data-price")
            const productLink = scrape(this).find('.result_right').find('a').attr("href")
            const img = scrape(this).find('.SearchResultProductImage').attr("src")
            const link = "https://www.microcenter.com/" + productLink
            //scrapped data came back poorly with alot of spacing. Replaced and removed in the ugliest way possible
            const stockScrape = scrape(this).find('.stock').text()
            const stockReplace = stockScrape.replace(/[\r\n]+/gm, "")
            const stockSpacing = stockReplace.replace("                                                                                    ", "")
            const stock = stockSpacing.replace("                                                                                                                                                                                                                                            ", "")
            //setting the base value of available so that it can be set as true or false
            var available = null
            //if statment to check if returned data frm "stock" is equal to SOLD OUT if so set value to false for front end to set text color to red
            if(stock.startsWith('SOLD OUT') || stock.startsWith("NOT")) {
                available = false
            }
            else {
                available = true
            }
            //did this to keep myself sane whilest trying to work out issues. I kind of like it here now
            index++
            //push cleaned and scrapped data to obj to use on front end
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
        //log data for server. more for testing purposes than anything as well as return data to front end from axios request
        console.log(data)
        res.send(data)
    })
    //catch all the stupid errors
    .catch(e => {
        console.log(e)
    })
    
})



//listen on variable port set by heroku or on local 3000 for development
app.listen(port, () => {
    console.log(`Serving at http://localhost:${port}`)
  })
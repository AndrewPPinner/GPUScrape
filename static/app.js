const app = Vue.createApp({
    data() {
        return {
            card: "",
            name: "",
            price: "",
            stock: "",
            link: "",
            show: false,
            resData: [{}]
        }
    },
    methods: {
        //call function passing the value of card input from front end
        search(card) {
            axios
            //post call to send value of card to server so it can make correct crawler
            .post("https://gpu-scraper.herokuapp.com/stock", card)
            .then(response => {
                //return data from server crawler if something is returned set show to true to show cards on front end
                this.resData = response.data
                this.show = true
                console.log(response)

            })
            .catch(e => {
                console.log(e)
                this.show = false
            })
        }
    },
})

app.mount("#app")
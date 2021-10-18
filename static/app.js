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
        search(card) {
            axios
            .post("https://gpu-scraper.herokuapp.com/stock", card)
            .then(response => {
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
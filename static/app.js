const app = Vue.createApp({
    data() {
        return {
            card: "",
            data: ""
        }
    },
    methods: {
        search(card) {
            axios
            .post("https://gpu-scraper.herokuapp.com/stock", card)
            .then(response => {
                this.data = response
                console.log(response)
                console.log(card)
            })
            .catch(e => {
                console.log(e)
            })
        }
    },
})

app.mount("#app")
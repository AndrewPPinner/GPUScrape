const app = Vue.createApp({
    data() {
        return {
            card: "",
            name: "",
            price: "",
            stock: "",
            link: "",
            selectLocation: "",
            show: false,
            sentReq: [],
            resData: [{}],
            locationArray:[
                {location: "Duluth, GA",
                id: "065"},
                {location: "Tustin, CA",
                id: "101"},
                {location: "Denver, CO",
                id: "181"},
                {location: "Marietta, GA",
                id: "041"},
                {location: "Chicago, IL",
                id: "151"},
                {location: "Westmont, IL",
                id: "025"},
                {location: "Overland Park, KS",
                id: "191"},
                {location: "Cambridge, MA",
                id: "121"},
                {location: "Rockville, MD",
                id: "085"},
                {location: "Parkville, MD",
                id: "125"},
                {location: "Madison Heights, MI",
                id: "055"},
                {location: "St. Louis Park, MN",
                id: "045"},
                {location: "Brentwood, MO",
                id: "095"},
                {location: "Paterson, NJ",
                id: "075"},
                {location: "Westbury, NY",
                id: "171"},
                {location: "Brooklyn, NY",
                id: "115"},
                {location: "Flushing, NY",
                id: "145"},
                {location: "Yonkers, NY",
                id: "105"},
                {location: "Columbus, OH",
                id: "141"},
                {location: "Mayfield Heights, OH",
                id: "051"},
                {location: "Sharonville, OH",
                id: "071"},
                {location: "St. Davids, PA",
                id: "061"},
                {location: "Houston, TX",
                id: "155"},
                {location: "Dallas, TX",
                id: "131"},
                {location: "Fairfax, VA",
                id: "081"}]

        }
    },
    methods: {
        //call function passing the value of card input from front end
        search(card, selectLocation, sentReq) {
            sentReq = [{card, selectLocation}]
            axios
            //post call to send value of card to server so it can make correct crawler
            .post("https://gpu-scraper.herokuapp.com/stock", sentReq)
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
        },
        location(loc) {
            this.selectLocation = loc.target.value
        }
    },
})

app.mount("#app")
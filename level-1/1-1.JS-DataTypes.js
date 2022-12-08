/** Data types & operators. Objects and functions */

/**
 * 
 */
function Entry() {

    this.ID = Math.random().toString(16).substring(2)
    this.date = Date.now()

    this.setID = function (id) {
        this.ID = id
    }

    this.getID = function () {
        return this.ID
    }

    this.setDate = function (date) {
        this.date = date
    }

    this.getDate = function () {
        let date = new Date(this.date)

        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay()
            + " " + date.getHours() + ":" + date.getMinutes() + ":" +
            date.getSeconds()
    }

    this.setProperties = function (param) {

        if (!param || !Object.entries(param)) {
            error(`setProperties(): calls with empty argument or not in {key:value} format`)
            return
        }

        for (let [key, value] of Object.entries(param)) {

            if (typeof (this[key]) === "undefined") {
                error(`setProperties(): parameter ${key} does not exist`)
                break
            }

            if (typeof (value) !== typeof (this[key])) {
                error(`setProperties(): parameter ${key} has type "${typeof (this[key])}", u try input "${typeof (value)}"`)
                break
            }

            this[key] = value

        }

    }

    this.getProperties = function (key) {
        if (typeof (this[key]) !== "undefined") {
            return this[key]
        } else {
            error(`Unxpected property "${key}"`)
            return null
        }
    }

    this.checkType = function (expected, current) {
        let result = expected === typeof (current)
        if (result) {
            return true
        } else {
            error(`Wrong type: expected ${expected}, current is ${typeof (current)}`)
            return false
        }
    }

    this.error = error

    function error(msg) {
        console.error('\033[91m' + msg + '\033[0m')
    }

}

function Product(args) {

    Entry.call(this)

    this.name = ""
    this.description = ""
    this.price = 0.0
    this.brand = ""
    this.sizes = []
    this.activeSize = ""
    this.quantity = 0
    this.reviews = []
    this.images = []

    this.setProperties(args)

    this.setName = function (name) {
        this.name =
            this.checkType("string", name)
                ? name
                : this.name
    }

    this.getName = function () {
        return this.name
    }

    this.setDescription = function (description) {
        this.description =
            this.checkType("string", description)
                ? description
                : this.description
    }

    this.getDescription = function () {
        return this.description
    }

    this.setPrice = function (price) {
        this.price =
            this.checkType("number", price) && price % 1 !== 0
                ? price
                : this.price
    }

    this.getPrice = function () {
        return this.price
    }

    this.setBrand = function (brand) {
        this.brand =
            this.checkType("string", brand)
                ? brand
                : this.brand
    }

    this.getBrand = function () {
        return this.brand
    }

    /* Size */
    this.setSizes = function (sizes) {
        this.sizes =
            this.checkType("object", sizes) && Array.isArray(sizes)
                ? sizes
                : this.sizes
    }
    this.getSizes = function () {
        return this.sizes
    }
    this.addSize = function (size) {
        if (this.checkType("string", size)) {
            this.sizes.push(size)
        } else {
            this.error("addSize(): wrong object type, only string")
        }
    }
    this.deleteSize = function (size) {
        if (this.sizes.includes(size)) {
            this.sizes = this.sizes.filter(e => e != size)
        } else {
            this.error(`deleteSize(): element ${size} not found`)
        }
    }


    this.setActiveSize = function (activeSize) {
        this.activeSize =
            this.checkType("string", activeSize)
                ? activeSize
                : this.activeSize
    }

    this.getActiveSize = function () {
        return this.activeSize
    }

    this.setQuantity = function (quantity) {
        this.quantity =
            this.checkType("number", quantity) && quantity % 1 === 0
                ? quantity
                : this.quantity
    }

    this.getQuantity = function () {
        return this.quantity
    }

    /* Review */

    this.addReview = function (params) {
        if (this.checkType("object", params)) {
            this.reviews.push(new Review(params))
        } else {
            this.error("addReview() wrong params")
        }
    }

    this.getReviewByID = function (id) {
        for (let review of this.reviews) {
            if (review.getProperties("ID") == id) return review
        }
        return null
    }
    this.getReviews = function () {
        return this.reviews
    }

    this.setReviews = this.addReview



    this.addImage = function (image) {
        if (this.checkType("object", image)) {
            this.images.push(image)
        } else {
            this.error("addImage() wrong params")
        }
    }

    this.setImage = this.addImage

    this.getImage = function (param) {
        if (param) {
            if (this.images) {
                for (let image of this.images) {

                    if (image[param]) {
                        return image
                    }
                }
                this.error("getImage() param not found in images")
                return null
            } else {
                this.error("Images not found")
                return null
            }
        } else {
            this.error("getImage() param is empty")
            return null
        }
    }

    this.getAverageRating = function () {
        let result = 0
        for (let review of this.reviews) result += review.getAverageRatingValue()
        return result / this.reviews.length
    }


}


function Review(args) {

    Entry.call(this)

    this.author = ""
    this.comment = ""
    this.rating = []

    this.setProperties(args)

    this.getAverageRatingValue = function () {
        let counter = 0,
            result = 0
        for (const [key, value] of Object.entries(this.rating)) {
            result += value
            counter++
        }
        return result / counter
    }

}

let x = new Product()
let y = new Product()
y.addReview({
    author: "Stephen Treppen",
    comment: "I like this content",
    rating: {
        service: 5,
        price: 3,
        value: 5,
        quality: 4
    }
})
console.log(x.getProperties("ID"))
console.log(y.ID)
console.log(y.getAverageRating())
console.log(y.getReviewByID(2))
console.log(x.getDate())
x.setSizes(['XL', 'd'])
x.addSize("B")
x.deleteSize('XL')
x.addImage({ id: 34, url: "dgsdgsh" })
console.log(x.getSizes())
console.log(x.getImage("id"))
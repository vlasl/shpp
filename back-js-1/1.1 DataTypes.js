/** Data types & operators. Objects and functions */

/** Prototype object for entries, has common methods and params */
function Entry() {

    /** Generate automaticly and set entry ID, convert number to base 16 symbols, it will look like "88a766e" */
    this.ID = Math.random().toString(16).substring(2)

    /** Generate automaticly and set entry date */
    this.date = Date.now()

    /** Set property ID, compare required type with user data */
    this.setID = id => this.compTypes("string", id) ? this.ID = id : null

    /** Get entry ID */
    this.getID = () => this.ID

    /** Set date, compare required type with user data */
    this.setDate = date => this.compTypes("integer", id) ? this.date = date : null

    /**
     * Get date in YYYY-MM-dd hh:mm:ss format
     * @returns string with date
     */
    this.getDate = function () {
        let date = new Date(this.date)
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " 
                + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    }

    /**
     * Basic method for set any object parameters. Takes object(args) in key-value 
     * format and changes parameter values. Does not allow creating new properties. 
     * Contains check for compliance with data types in each of the parameters
     * @param {*} args object in {key:value} format, any size
     */
    this.setProperties = function (args) {
        if (!args || !Object.entries(args)) {
            error(`setProperties() calls with empty argument or not in {key:value} format`)
            return
        }

        for (let [key, value] of Object.entries(args)) {
            if (typeof (this[key]) === "undefined") {
                error(`setProperties() ${key} does not exist`)
                break
            }
            if (typeof (value) !== typeof (this[key])) {
                error(`setProperties() ${key} has type "${typeof (this[key])}", u try input "${typeof (value)}"`)
                break
            }

            this[key] = value
        }
    }

    /**
     * Get any property of entry
     * @param {*} property desired parameter
     * @returns desired parameter or null if not found
     */
    this.getProperty = function (property) {
        return this[property] ? this[property] : null
    }

    /**
     * Special method for compare type of objects
     * @param {*} exp expected type
     * @param {*} curr current type
     * @returns match or not
     */
    this.compTypes = function (exp, curr) {
        let compare = exp === typeof (curr);
        switch (exp) {
            case "object":
                return compare
            case "number":
                return compare
            case "string":
                return compare
            case "integer":
                return typeof (curr) === "number" && curr % 1 === 0
            case "float":
                return typeof (curr) === "number" && curr % 1 !== 0
            case "array":
                return typeof (curr) === "object" && Array.isArray(curr)
            default:
                error(`Expected type ${exp}, curr is ${typeof (curr)}`)
                return false
        }
    }

    /**
     * Print error message with red color
     * @param {*} msg message
     */
    function error(msg) {
        console.error('\033[91m' + msg + '\033[0m')
    }

    /** Make function error available outside */
    this.error = error
}

/**
 * Entry with information about some product
 * @param {*} args parameters to define
 */
function Product(args) {

    /** Calling to parent and set context */
    Entry.call(this)

    /** Declaration of individual parameters and setting of initial data types */
    this.name = ""
    this.description = ""
    this.price = 0.0
    this.brand = ""
    this.sizes = []
    this.activeSize = ""
    this.quantity = 0
    this.reviews = []
    this.images = []

    /** Used as constructor() like method */
    this.setProperties(args)

    /** List of methods for setting and getting entry parameters */
    this.setName = name => this.name = this.compTypes("string", name) ? name : this.name
    this.getName = () => this.name

    this.setDescription = descr => this.description = this.compTypes("string", descr) ? descr : this.description
    this.getDescription = () => this.description

    this.setPrice = price => this.price = this.compTypes("float", price) ? price : this.price
    this.getPrice = () => this.price

    this.setBrand =  brand => this.brand = this.compTypes("string", brand) ? brand : this.brand
    this.getBrand = () => this.brand

    this.setSizes = sizes => this.sizes = this.compTypes("array", sizes) ? sizes : this.sizes
    this.getSizes = () => this.sizes

    this.addSize = size => this.compTypes("string", size) ? this.sizes.push(size) : null
    this.deleteSize = size => this.sizes.includes(size) ? this.sizes = this.sizes.filter(e => e != size) : null

    this.setActiveSize = actSize => this.activeSize = this.compTypes("string", actSize) ? actSize : this.activeSize
    this.getActiveSize = () => this.activeSize

    this.setQuantity = quantity => this.quantity = this.compTypes("integer", quantity) ? quantity : this.quantity
    this.getQuantity = () => this.quantity

    this.addReview = argss => this.compTypes("object", argss) ? this.reviews.push(new Review(argss)) : null
    this.setReviews = this.addReview
    this.getReviews = () => this.reviews

    this.addImage = image => this.compTypes("object", image) ? this.images.push(image) : null
    this.setImage = this.addImage

    /** Search review by id */
    this.getReviewByID = function (id) {
        for (let review of this.reviews) {
            if (review.getID() == id) return review
        }
        return null
    }

    /**
     * Get image by parameter and its value, example getImage({author:"Thomas"}).
     * If parameter not specified or incorrect - return first image from array or null
     * @param {*} args object with param and value
     * @returns image object or null
     */
    this.getImage = function (args) {
        if (Object.entries(args)) {
            let key = Object.entries(args)[0][0]
            let value = Object.entries(args)[0][1]
            if (this.images) {
                for (let image of this.images) {
                    if (image[key] === value) {
                        return image
                    }
                }
                this.error(`getImage(): args ${key} not found in images`)
                return null
            } else {
                this.error("Images not found")
                return null
            }
        } else {
            return this.images ? this.images[0] : null
        }
    }

    /** Get the average of all averages of all reviews */
    this.getAverageRating = function () {
        let result = 0
        for (let review of this.reviews) result += review.getAverageRatingValue()
        return result / this.reviews.length
    }
}

/**
 * Entry with information about some review
 * @param {*} args parameters to define
 */
function Review(args) {

    /** Calling to parent and set context */
    Entry.call(this)

    /** Declaration of individual parameters and setting of initial data types */
    this.author = ""
    this.comment = ""
    this.rating = []

    /** Used as constructor() like method */
    this.setProperties(args)

    /**
     * Get the average of all ratings of the current review
     * @returns average value
     */
    this.getAverageRatingValue = function () {
        let counter = 0,
            result = 0
        for (let [, value] of Object.entries(this.rating)) {
            result += value
            counter++
        }
        return result / counter
    }
}

/**
 * Search some text in array with Products objects.
 * @param {*} products array with products
 * @param {*} search text (used as regexp rule)
 * @returns an array with matching data
 */
function searchProducts(products, search) {
    let name, description, result = []
    for (let product of products) {
        name = product.getName()
        description = product.getDescription()
        if (name.match(search) || description.match(search)) {
            result.push(product)
        }
    }
    return result
}

/**
 * Sort array with product from smallest to largest, for param price, ID and name
 * @param {*} products array with product
 * @param {*} sortRule sorting criterion (ID, price or name)
 */
function sortProducts(products, sortRule) {
    function compString(first, second) {
        if (first.getProperty(sortRule).toLowerCase() > second.getProperty(sortRule).toLowerCase()) return 1
        if (first.getProperty(sortRule).toLowerCase() < second.getProperty(sortRule).toLowerCase()) return -1
        return 0
    }
    function compNumber(first, second) {
        return first.getProperty(sortRule) - second.getProperty(sortRule)
    }
    switch (sortRule) {
        case "name":
            products.sort(compString)
        case "ID":
            products.sort(compString)
        case "price":
            products.sort(compNumber)
    }
}

/** Examples */

let soccerBall = new Product({
    name: "Soccer Ball",
    description: "Rounded rubber bladder for enhanced stability and good air retention",
    price: 45.9,
    brand: "Puma",
    quantity: 10
})

soccerBall.addReview({
    author: "Tom",
    comment: "great balance of padding, reliability in flight and all-round fun factor when it came to striking the ball",
    rating: {
        service: 5,
        price: 4.5,
        value: 2,
        quality: 5
    }
})

soccerBall.addReview({
    author: "Mike",
    comment: "This is one of the best if not the best model from Puma balls",
    rating: {
        service: 2,
        price: 2,
        value: 5,
        quality: 3
    }
})

console.log("Soccer ball average rating is " + soccerBall.getAverageRating()) // -> 3.5625

let products = [
    soccerBall,
    new Product({
        ID:"12",
        name:"S",
        description:"WOW!",
        price: 77
    }),
    new Product({
        ID:"78",
        name:"B",
        description:"Nothing is as easy as it looks",
        price: 99
    }),
    new Product({
        ID:"2",
        name:"C",
        description:"Everything takes longer than you think it will",
        price: 11
    }),
    new Product({
        ID:"10",
        name:"A",
        description:"444 223 5667 899",
        price: 4
    }),
]

console.log(searchProducts(products,"44"))
sortProducts(products,"price")
console.log(products)
/**
 * @abstract class for Product (wihout constructor)
 */
const AbstractProduct = {

    id: 0,
    setId: function (id) { compareTypes("number", id) ? this.id = id : null },
    getId: function () { return this.id },

    date: 0,
    setDate: function (date) { compareTypes("number", date) ? this.date = date : null },
    getDate: function () {
        let d = new Date(this.date)
        return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay() + " "
            + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    },

    name: "",
    setName: function (name) { compareTypes("string", name) ? this.name = name : null },
    getName: function () { return this.name },

    description: "",
    setDescription: function (description) { compareTypes("string", description) ? this.description = description : null },
    getDescription: function () { return this.description },

    brand: "",
    setBrand: function (brand) { compareTypes("string", brand) ? this.brand = brand : null },
    getBrand: function () { return this.brand },

    price: 0,
    setPrice: function (price) { compareTypes("number", price) ? this.price = price : null },
    getPrice: function () { return this.price },
    getPriceForQuantity: function (quantity) { return `$${(this.price * quantity).toFixed(2)}` },

    quantity: 0,
    setQuantity: function (quantity) { compareTypes("number", quantity) ? this.quantity = quantity : null },
    getQuantity: function () { return this.quantity },

    reviews: [],
    addReview: function (args) { compareTypes("object", args) ? this.reviews.push(new Review(args)) : null },
    setReview: function (args) { this.addReview(args) },
    getReview: function () { return this.reviews },
    getReviewByID: function (id) {
        for (let review of this.reviews) {
            if (review.getId() == id) return review
        }
        return null
    },

    /** Get the average of all averages of all reviews */
    getAverageRating: function () {
        let result = 0
        for (let review of this.reviews) result += review.getAverageRatingValue()
        return result / this.reviews.length
    },

    images: [],
    addImage: function (image) { compareTypes("object", image) ? this.images.push(image) : null },
    setImage: function (image) { this.addImage(image) },

    /**
     * Get image by parameter and its value, example getImage({author:"Thomas"}).
     * If parameter not specified or incorrect - return first image from array or null
     * @param {*} args object with param and value
     * @returns image object or null
     */
    getImage: function (args) {
        if (typeof (args) == "object") {
            let key = Object.keys(args)[0]
            let value = args[key]
            if (this.images) {
                for (let image of this.images) {
                    if (image[key] === value) {
                        return image
                    }
                }
                return null
            } else {
                return null
            }
        } else {
            return this.images ? this.images[0] : null
        }
    },

    /**
     * Setter/Getter. 
     * When argument is string - returns value of parameter
     * When argument is array - returns object {parameter: value}
     * When argument is object - sets value of parameters
     * @param {*} args string, array or boject
     * @returns if getter - object or value
     */
    params: function (args) {
        /* If empty call - return null */
        if (!args) return null
        /* When args just a simple string like "id" or "name" */
        if (typeof (args) !== "object") return this[args]
        /* When args is array like ["id","price"] */
        if (compareTypes("array", args)) {
            let result = {}
            args.map(c => result[c] = this[c])
            return result
        }
        /* When args is object - make a setter function. Cheking types */
        if (!compareTypes("array", args) && (compareTypes("object", args))) {
            for (let [key, value] of Object.entries(args)) {
                if (typeof (this[key]) === typeof (value)) this[key] = value
            }
        }
    },

    /** Print on the screen all the defined parameters of object, without functions */
    getFullInformation: function () {
        /* hack instead of this.constructor.name */
        let className = this.material !== undefined ? "Clothes" : "Electronics"
        console.log(`\n[#${className}]`)
        for (let [key, value] of Object.entries(this)) {
            if (typeof (value) !== "function") console.log(key + ": " + value)
        }
        if (this.reviews.length) {
            console.log(`\n[#${className}: Reviews]`)
            for (let review of this.reviews) {
                console.log(review)
            }
        }
    },
}

const Clothes = function (args) {

    /* Add AbstractProduct object params and methods to Clothes prototype */
    this.__proto__ = AbstractProduct

    this.material = ""
    this.getMaterial = () => this.material
    this.setMaterial = (material) => compareTypes("string", material) ? this.material = material : null

    this.color = ""
    this.getColor = () => this.color
    this.setColor = (color) => compareTypes("string", color) ? this.color = color : null

    /* Set all params from args */
    this.params(args)

}

const Electronics = function (args) {

    /* Add AbstractProduct object params and methods to Electronics prototype */
    this.__proto__ = AbstractProduct

    this.warranty = 0
    this.getWarranty = () => this.warranty
    this.setWarranty = (warranty) => compareTypes("number", warranty) ? this.warranty = warranty : null

    this.power = 0
    this.getPower = () => this.power
    this.setPower = (power) => compareTypes("number", power) ? this.power = power : null

    /* Set all params from args */
    this.params(args)

}

const Review = function (args) {

    /** Take some functions from AbstractProduct */
    this.__proto__ = {
        params: AbstractProduct.params,
        getId: AbstractProduct.getId,
        setId: AbstractProduct.setId,
        getDate: AbstractProduct.getDate,
        setDate: AbstractProduct.setDate
    }

    /** Generate automaticly and set entry ID, convert number to string, it will look like "3268239" */
    this.id = Math.random().toString(8).substring(15)

    /** Generate automaticly and set entry date */
    this.date = Date.now()

    /** Declaration of individual parameters and setting of initial data types */
    this.author = ""
    this.getAuthor = () => this.author
    this.setAuthor = (author) => compareTypes("string", author) ? this.author = author : null

    this.comment = ""
    this.getComment = () => this.comment
    this.setComment = (comment) => compareTypes("string", comment) ? this.comment = comment : null

    this.rating = []
    this.getRating = () => this.rating
    this.setRating = (rating) => compareTypes("object", rating) ? this.rating.push(rating) : null

    /* Set all params from args */
    this.params(args)

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
 * Compare Types
 * @param {*} e expected type
 * @param {*} c current object
 * @returns boolean
 */
function compareTypes(e, c) {
    switch (e) {
        case "object":
        case "function":
        case "number":
        case "string":
            return e === typeof (c)
        case "integer":
            return typeof (c) === "number" && c % 1 === 0
        case "float":
            return typeof (c) === "number" && c % 1 !== 0
        case "array":
            return typeof (c) === "object" && Array.isArray(c)
        default:
            return false
    }
}

/**
 * Sort array with product from smallest to largest, for param price, ID and name
 * @param {*} products array with product
 * @param {*} sortRule sorting criterion (ID, price or name)
 */
function sortProducts(products, sortRule) {
    switch (sortRule) {
        case "name":
        case "ID":
            products.sort((a, b) => a[sortRule] > b[sortRule] ? 1 : a[sortRule] < b[sortRule] ? -1 : 0)
            break
        case "price":
            products.sort((a, b) => a[sortRule] - b[sortRule])
            break
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
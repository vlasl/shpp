/**
 * Function makes object from file, filters empty lines and comments, then turns the object into a map.
 * Then generates the top 10 records by population. 
 * Returns a function that replaces name of the city with information from the TOP10 database.
 * @param {string} path path/filename.csv
 * @returns function that replaces name of the city with information from the TOP10 database
 */
function FPCSV(path) {
    /* TOP10 list */
    let data = 
        /* get file */
        require('fs')
        .readFileSync(path, 'utf8')
        /* split by line break */
        .split("\r\n")
        /* RegExp: only with any word character, dont contains # as first symbol, case insensitive */
        .filter(line => line.match(/^((?=.*\w.*)(?!#.*).+)$/, "mi"))
        /* remove all # symbols from entries */
        .map(line => line.replaceAll("#", ""))
        /* split every line by comma */
        .map(line => line.split(","))
        /* build map for every line */
        .map(line => ({ "x": line[0], "y": line[1], "name": line[2], "population": line[3] }))
        /* sort by population (first highest) */
        .sort((a, b) => b.population - a.population)
        /* take first 10 entries */
        .slice(0, 10)
        /* transform lines to object like { CityName: { population: 23632, rating: 5}, City2:{...}... }*/
        .reduce((acc, curr, indx) => 
            { acc[curr.name] = { population: curr.population, rating: indx + 1 }; return acc }, {}
        )
    /* function that replaces name of the city */   
    return (txt) => {
        /* any city, like "Lviv|Lutsk" case insensitive search */
        let rule = new RegExp(Object.keys(data).join("|"), "gi")
        /* return original text with replaced city names */
        return txt.replace(
            rule, 
            function (match) {
                /* search real parameter name (case insensitive hack) */
                let city = Object.keys(data).filter(key => key.toLowerCase() == match.toLowerCase())[0]
                return `${city} [${data[city].rating} place ​in Ukraine ​TOP-10 with population ${data[city].population}]`
        }
        )
    }
}

console.log(FPCSV("back-js-1/assets/1.4.csv")
(`Kharkiv was founded in 1654 as Kharkiv fortress, and after these humble beginnings, it grew to be a major centre of \
industry, trade and Ukrainian culture.`))

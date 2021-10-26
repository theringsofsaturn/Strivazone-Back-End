import fs from 'fs-extra';
import {fileURLToPath} from "url";
import {join, dirname} from "path";

const {readJSON, writeJSON, writeFile} = fs

//const productsJSONPath = join(process.cwd(), "/src/data/products.json")
//console.log(productsJSONPath)

const productsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../data/products.json")

const reviewsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../data/reviews.json")

const publicFolderPath = join(process.cwd(), "./public/img/") //process.cwd() is ROOT


export const readProducts = () => readJSON(productsJSONPath)
export const writeProducts = content => writeJSON(productsJSONPath, content) // content is array

export const readReviews = () => readJSON(reviewsJSONPath)
export const writeReviews = content => writeJSON(reviewsJSONPath, content)

export const saveProductPicture = (fileName, content) => writeFile(join(publicFolderPath, fileName), content) // content is bufferFormat
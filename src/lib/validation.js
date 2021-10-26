import { body } from "express-validator"

export const productValidationMiddlewares = [
  body("name").exists().withMessage("Name is a mandatory field!"),
  body("description").exists().withMessage("Description is a mandatory field!"),
  body("price").exists().withMessage("Price is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
  body("brand").exists().withMessage("Brand is a mandatory field!"),
]

export const reviewsValidationMiddlewares = [
    body("comment").exists().withMessage("Comment is a mandatory field!"),
    body("rate").exists().withMessage("Rate is a mandatory field!"),
    body("productId").exists().withMessage("productId is a mandatory field!"),
  ]


import express from "express";
import uniqid from "uniqid";
import createError from "http-errors";
import multer from "multer";
import {
  readProducts,
  writeProducts,
  saveProductPicture,
  readReviews,
} from "../lib/fs-tools.js";
//import reviewsRouter from "./reviews.js";
import { productValidationMiddlewares } from "../lib/validation.js";
import { validationResult } from "express-validator";

const productsRouter = express.Router();

// GET all products
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await readProducts();
    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

// Get all reviews of specific product
productsRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const products = await readProducts();
    const singleProduct = products.find(
      (product) => product.id === req.params.id
    );

    if (singleProduct) {
      const reviews = await readReviews();
      const specificRevies = reviews.filter(
        (r) => r.productId === req.params.id
      );

      if (reviews) {
        res.send(specificRevies);
      } else {
        res.send("nada");
      }
    } else {
      next(createError(404, `This product id: ${req.params.id} was not find`));
    }
  } catch (error) {
    next(error);
  }
});


// POST product

productsRouter.post(
  "/",
  productValidationMiddlewares,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const products = await readProducts();

        const newProduct = { ...req.body, id: uniqid(), createdAt: new Date() };

        products.push(newProduct);

        await writeProducts(products);

        res.status(201).send(newProduct.id);
      } else {
        next(createError(400, { errors }));
      }
    } catch (error) {
      next(error);
    }
  }
);

// DELETE

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const products = await readProducts();

    const remainingProducts = products.filter(
      (product) => product.id !== req.params.id
    );

    writeProducts(remainingProducts);

    res
      .status(204)
      .send(`Author with id ${req.params.id} deleted successfully`);
  } catch (error) {
    next(error);
  }
});

//PUT

productsRouter.put(
  "/:id",
  productValidationMiddlewares,
  async (req, res, next) => {
    try {
      const products = await readProducts();

      const singleProductIndex = products.findIndex(
        (index) => index.id === req.params.id
      );

      const singleProduct = products[singleProductIndex];

      const updatedProduct = {
        ...singleProduct,
        ...req.body,
        updatedAt: new Date(),
      };

      products[singleProductIndex] = updatedProduct;

      writeProducts(products);

      res
        .status(200)
        .send(`product with id ${req.params.id} updated successfully`);
    } catch (error) {
      next(error);
    }
  }
);

// POST Picture

productsRouter.post(
  "/:id/uploadSingle",
  multer().single("productPicture"),
  async (req, res, next) => {
    try {
      const fileName = req.file.originalname;
      console.log("File Name", fileName);
      await saveProductPicture(fileName, req.file.buffer);

      res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

//get category
productsRouter.get("/search", async (req, res, next) => {
  try {
    const { category } = req.query;
    console.log("Category var", { category });
    const content = await readProducts();

    const filteredproduct = content.filter(
      (element) =>
        typeof element.category === "string" &&
        element.category.toLowerCase().includes(category.toLowerCase())
    );
    res.send(filteredproduct);
  } catch (error) {
    next(error);
  }
});

// GET individual product
productsRouter.get("/:id", async (req, res, next) => {
  try {
    const products = await readProducts();

    const singleProduct = products.find(
      (product) => product.id === req.params.id
    );

    if (singleProduct) {
      res.status(200).send(singleProduct);
    } else {
      next(createError(404, `product with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;

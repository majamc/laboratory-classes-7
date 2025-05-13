const Product = require("../models/Product");
const { MENU_LINKS } = require("../constants/navigation");
const { STATUS_CODE } = require("../constants/statusCode");
const cartController = require("./cartController");

exports.addProduct = async (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !description || !price) {
    return res.status(400).send("Wszystkie pola są wymagane.");
  }
  try {
    const existingProduct = await Product.findByName(name);
    if (existingProduct) {
      return res.status(400).send("Produkt o tej nazwie już istnieje.");
    }
    const newProduct = new Product(name, description, parseFloat(price));
    await newProduct.save();

    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas dodawania produktu.");
  }
};


exports.getProductsView = async (request, response) => {
  const cartCount = cartController.getProductsCount();
  const products = await Product.getAll();

  try {
    const products = await Product.getAll();

    response.render("products.ejs", {
      headTitle: "Shop - Products",
      path: "/",
      menuLinks: MENU_LINKS,
      activeLinkPath: "/products",
      products,
      cartCount,
    });
  } catch (err) {
    console.error(err);
    response.status(500).send("Błąd podczas ładowania produktów.");
  }
};

exports.getAddProductView = (request, response) => {
  const cartCount = cartController.getProductsCount();

  response.render("add-product.ejs", {
    headTitle: "Shop - Add product",
    path: "/add",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products/add",
    cartCount,
  });
};

exports.getNewProductView = async (request, response) => {
  const cartCount = cartController.getProductsCount();

  try {
    const newestProduct = await Product.getLast();

    response.render("new-product.ejs", {
      headTitle: "Shop - New product",
      path: "/new",
      activeLinkPath: "/products/new",
      menuLinks: MENU_LINKS,
      newestProduct,
      cartCount,
    });
  } catch (err) {
    console.error(err);
    response.status(500).send("Błąd podczas ładowania najnowszego produktu.");
  }
};

exports.getProductView = async (request, response) => {
  const cartCount = cartController.getProductsCount();
  const name = request.params.name;

  try {
    const product = await Product.findByName(name);

    if (!product) {
      return response.status(404).send("Produkt nie został znaleziony.");
    }

    response.render("product.ejs", {
      headTitle: "Shop - Product",
      path: `/products/${name}`,
      activeLinkPath: `/products/${name}`,
      menuLinks: MENU_LINKS,
      product,
      cartCount,
    });
  } catch (err) {
    console.error(err);
    response.status(500).send("Błąd podczas ładowania produktu.");
  }
};
exports.deleteProduct = async (request, response) => {
  const name = request.params.name;

  try {
    await Product.deleteByName(name);
    response.status(STATUS_CODE.OK).json({ success: true });
  } catch (err) {
    console.error(err);
    response.status(500).json({ success: false, message: "Błąd usuwania produktu." });
  }
};

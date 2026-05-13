const axios = require("axios");

// change this later
const SUPPLIER_MODE = "FAKE"; 

const fetchProducts = async () => {
  if (SUPPLIER_MODE === "FAKE") {
    const res = await axios.get("https://fakestoreapi.com/products");

    return res.data.map(p => {
      const originalPrice = Math.round(p.price * 1.5);
      const price = Math.round(p.price * 1.3);

      return {
        name: p.title,
        price,
        originalPrice,
        discount: Math.round(((originalPrice - price) / originalPrice) * 100),
        image: p.image,
        category: p.category,
        description: p.description,
        vendor: "Demo",
        vendorId: "demo",
        approved: true,
        inStock: true,
        isImported: true,
      };
    });
  }

  // for FUTURE when get real api key of cj droppshiping. 
  if (SUPPLIER_MODE === "REAL") {
    const res = await axios.get("https://api.cjdropshipping.com/product/list", {
      headers: {
        "CJ-Access-Token": "YOUR_API_KEY_HERE"
      }
    });

    return res.data.data.map(p => ({
      name: p.productName,
      price: Math.round(p.sellPrice * 1.3),
      originalPrice: p.sellPrice,
      image: p.productImage,
      category: p.categoryName,
      description: p.description,
      vendor: "Supplier",
      vendorId: "supplier",
      supplierProductId: p.pid,
      isImported: true,
      
    }));
  }
};

module.exports = { fetchProducts };
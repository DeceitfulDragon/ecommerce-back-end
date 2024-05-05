const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [Category, {
        model: Tag,
        through: ProductTag
      }]
    });

    if (!productData) {
      return res.status(400).json({ message: "Could not find products." });
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findOne({
      where: {
        id: req.params.id
      },
      include: [Category, {
        model: Tag,
        through: ProductTag
      }]
    });

    if (!productData) {
      return res.status(404).json({ message: "No product found with the specified ID" });
    }
    res.status(200).json(productData);

  } catch (err) {
    res.status(500).json(err);
  }
});


// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteProduct = await Product.destroy({
      where: { id: req.params.id }
    });

    if (!deleteProduct) {
      return res.status(404).json({ message: "No product found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

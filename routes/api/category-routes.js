const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET CATEGORIES
router.get('/', async (req, res) => {

  try {
    const categoryData = await Category.findAll({
      include: [Product]
    });

    if(!categoryData) {
      return res.status(400).json({ message: "Could not find categories"});
    }
    res.status(200).json(categoryData);

  } catch(err) { res.status(500).json(err); }
});

// GET CATEGORY
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findOne({
      where: {
        id: req.params.id
      },
      include: [Product]
    });

    if (!categoryData) {
      return res.status(404).json({ message: "Could not find category" });
    }
    res.status(200).json(categoryData);

  } catch (err) {
    res.status(500).json(err);
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const newCategoryData = await Category.create(req.body);

    res.status(200).json(newCategoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body, {
      where: { 
        id: req.params.id 
      }
    });

    res.status(200).json({ message: "Category updated" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: { 
        id: req.params.id 
      }
    });

    if (!categoryData) {
      return res.status(404).json({ message: "No category found" });
    }
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

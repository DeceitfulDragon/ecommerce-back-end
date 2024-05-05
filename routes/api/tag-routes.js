const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET ALL TAGS
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }]
    });

    if (!tagData) { return res.status(400).json({ message: "Could not find tags" }); }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ONE TAG
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findOne({
      where: {
        id: req.params.id
      },
      include: [{ model: Product }]
    });

    if (!tagData) { return res.status(400).json({ message: "Tag not found" }); }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE NEW TAG
router.post('/', async (req, res) => {
  try {
    const newTagData = await Tag.create(req.body);

    res.status(200).json(newTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE TAG
router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update(req.body, {
      where: { 
        id: req.params.id 
      }
    });
    if (tagData[0] === 0) { return res.status(400).json({ message: "No tag found" }); }

    res.status(200).json({ message: "Tag updated" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE TAG
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: { 
        id: req.params.id 
      }
    });
    if (!tagData) { return res.status(404).json({ message: "No tag found" }); }

    res.status(200).json({ message: "Tag deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

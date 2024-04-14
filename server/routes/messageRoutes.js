const express = require('express')
const router = express.Router()
const message = require('../models/message')

router.get('/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const messages = await message.find({ userId: userId })
      res.json(messages)
  } catch (error) {
      res.status(500).send({ message: 'Server error', error })
  }
});

module.exports = router
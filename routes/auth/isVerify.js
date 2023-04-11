module.exports = async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

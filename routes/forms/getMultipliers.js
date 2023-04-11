const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    let organisationId = req.user.organisationid;

    console.log("hoi");

    console.log(req.user.organisationid);

    if (organisationId === undefined || organisationId === null || organisationId === "") {
      res.status(400).send("Geen organisatie mee gegeven.");
      return;
    }

    let result = await db.query(
      `SELECT vraag, waarde from multipliers where multipliercode = (SELECT multipliercode FROM organisations WHERE CAST(pkey AS VARCHAR) = $1)`,
      [organisationId]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send("Multipliers voor organisatie niet gevonden.");
      return;
    }

    result = result.rows;

    console.log(result);

    // we geven een mooi objectje terug met de waarde per vraag
    let multipliers = {};

    result.forEach((el) => {
      multipliers[el.vraag] = el.waarde;
    });

    res.status(200).json(multipliers);
  } catch (error) {
    console.log(error);
  }
};

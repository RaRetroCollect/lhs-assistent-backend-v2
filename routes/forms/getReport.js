const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    let organisationid = req.user.organisationid;

    let reportid = req.params.reportid * 1;

    let result = await db.query(
      `SELECT r.*, g.gemeente from rapporten r LEFT JOIN gemeentes g on CAST(g.pkey AS VARCHAR) = r.gemeenteid where r.pkey = $1 and r.organisationid = $2`,
      [reportid, organisationid]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send("Rapport niet gevonden.");
      return;
    }

    result = result.rows;

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

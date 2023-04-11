const client = require("./connectdb.js");
const bcrypt = require("bcrypt");

const usernameExists = async (username) => {
  const data = await client.query(
    `SELECT u.pkey, u.username, u.password, u.email, u.role, u.sex, o.orgcode as organisation, u.firstname, u.lastname, ` +
      `COALESCE(u.deleted, false) as deleted, COALESCE(u.inactive, false) as inactive, o.orgnaam, u.refreshtoken, ` +
      `u.organisationid as organisationid, o.znomask, o.znoplaceholder from users u ` +
      `LEFT JOIN organisations o on CAST(o.pkey AS VARCHAR) = u.organisationid where u.username = $1 ` +
      `AND COALESCE(u.inactive, false) = false`,
    [username]
  );
  if (data.rowCount == 0) return false;

  return data.rows[0];
};

const getUserById = async (userid) => {
  const data = await client.query(
    `SELECT u.pkey, u.username, u.password, u.email, u.role, u.sex, o.orgcode as organisation, u.firstname, u.lastname, ` +
      `COALESCE(u.deleted, false) as deleted, COALESCE(u.inactive, false) as inactive, o.orgnaam, u.refreshtoken, ` +
      `o.pkey as organisationid from users u ` +
      `LEFT JOIN organisations o on CAST(o.pkey AS VARCHAR) = u.organisationid where u.pkey = $1`,
    [userid]
  );
  if (data.rowCount == 0) return false;
  return data.rows[0];
};

const ssoUserExists = async (provider, profileId) => {
  const data = await client.query(
    `SELECT * FROM sso_credentials WHERE provider = $1 AND profile_id = $2`,
    [provider, profileId]
  );
  if (data.rowCount === 0) return false;
  return data.rows[0].user_id;
};

const createSsoUser = async (profile) => {
  // bijbehorende organisatie ophalen
  const organisationId = await client.query(`SELECT pkey FROM organisations WHERE tid = $1`, [
    profile._json.tid,
  ]);
  profile._json.organisationid = organisationId.rows[0].pkey;

  // user aanmaken in user tabel
  const userId = await client.query(
    `INSERT INTO users (username, email, role, firstname, lastname, sex, organisationid) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING pkey`,
    [
      profile._json.mail,
      profile._json.mail,
      "user",
      profile._json.givenName,
      profile._json.surname,
      "male",
      profile._json.organisationid,
    ]
  );

  // user aanmaken in sso_credentials
  await client.query(
    `INSERT INTO sso_credentials (user_id, provider, profile_id) VALUES ($1,$2,$3)`,
    [userId.rows[0].pkey, profile.provider, profile.id]
  );

  return {
    pkey: userId.rows[0].pkey,
    username: profile._json.mail,
    password: null,
    email: profile._json.mail,
    role: "user",
    sex: "male",
  };
};

const matchPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};

const updateRefreshToken = async (username, refreshtoken) => {
  const data = await client.query(
    `UPDATE users SET refreshtoken = $1 WHERE username = $2 RETURNING *`,
    [refreshtoken, username]
  );
  if (data.rowCount == 0) return false;
  return data.rows[0];
};

const clearRefreshToken = async (username) => {
  const data = await client.query(
    `UPDATE users SET refreshtoken = null WHERE username = $1 RETURNING *`,
    [username]
  );
  if (data.rowCount == 0) return false;
  return data.rowCount;
};

module.exports = {
  usernameExists,
  ssoUserExists,
  matchPassword,
  updateRefreshToken,
  clearRefreshToken,
  ssoUserExists,
  createSsoUser,
  getUserById,
};

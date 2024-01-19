const pgPool = require("./connection");

const sql = {
  INSERT_PERSONAL_PAGE_ITEM: `
      INSERT INTO personalpage (username, linkName, personalLink)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
  GET_PERSONAL_LINKS_BY_USER:
    "SELECT personalpageid, linkname, personallink, dateadded FROM personalPage WHERE username = $1",
  DELETE_PERSONAL_LINK_BY_USER:
    "DELETE FROM personalpage WHERE username = $1 AND personalpageid = $2",
  GET_LINKS_BY_USER:
    "SELECT linkname, personallink, dateadded FROM personalpage WHERE username = $1",

  // Add more SQL commands as needed for other operations
};

async function addPersonalLink(username, linkName, personalLink) {
  const result = await pgPool.query(sql.INSERT_PERSONAL_PAGE_ITEM, [
    username,
    linkName,
    personalLink,
  ]);
  return result.rows[0];
}

async function getPersonalLinksByUser(username) {
  const result = await pgPool.query(sql.GET_PERSONAL_LINKS_BY_USER, [username]);
  return result.rows;
}

// Function to delete a link
async function deletePersonalLink(username, personalpageid) {
  const result = await pgPool.query(sql.DELETE_PERSONAL_LINK_BY_USER, [
    username,
    personalpageid,
  ]);
  return result.rowCount;
}

async function getUserLinks(username) {
  const result = await pgPool.query(sql.GET_LINKS_BY_USER, [username]);
  return result.rows;
}

module.exports = {
  addPersonalLink,
  getPersonalLinksByUser,
  deletePersonalLink,
  getUserLinks,
};

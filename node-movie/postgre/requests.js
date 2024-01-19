const pgPool = require("./connection");
const { checkMembership } = require("./group");

const sql = {
  POST_REQUEST:
    "INSERT INTO join_requests (groupid, username, admin, status) VALUES ($1, $2, $3, 'pending')",
  GET_REQUEST:
    "SELECT * FROM join_requests WHERE status = 'pending' AND admin = $1",
  ACCEPT_REQUEST:
    'INSERT INTO groupusers (username, groupid_usergroups) VALUES ($1, $2)',
  DELETE_REQUEST: "DELETE FROM join_requests WHERE id = $1",
  GET_ADMIN_BY_GROUPID: "SELECT admin FROM groups WHERE groupid = $1",
};

async function postRequest(groupid, username, admin) {
  try {
    const isAlreadyMember = await checkRequestMembership(username, groupid);
    const isAlreadyInGroup = await getGroupUsers(username, groupid);
    if (isAlreadyMember) {
      throw new Error("You have already sent a join request to this group");
    }
    else if (isAlreadyInGroup) {
      throw new Error("You are already a member of this group");
    }
  

    const result = await pgPool.query(sql.POST_REQUEST, [
      groupid,
      username,
      admin,
    ]);
    console.log(
      "Request inserted successfully in request.js backend:",
      result.rows[0]
    );
    console.log("username", username);
  } catch (error) {
    console.error("Error inserting request into the database:", error);
  }
}


async function getRequest(admin) {
  console.log("getRequest called in request.js backend");
  console.log("admin:", admin);
  try {
    const result = await pgPool.query(sql.GET_REQUEST, [
      admin,
      
    ]);
    console.log( "result.rows:", result.rows);
    return result.rows;
    
  } catch (error) {
    console.error("Error getting requests:", error);
    return null;
  }
}

async function acceptRequest(username, groupid_usergroups) {
  try {
    const isAlreadyMember = await getGroupUsers(username, groupid_usergroups);
    if (isAlreadyMember) {
      throw new Error("User is already a member of this group");
    }

    const result = await pgPool.query(sql.ACCEPT_REQUEST, [
      username,
      groupid_usergroups,
    ]);
    console.log(
      "Request accepted successfully in request.js backend:",
      result.rows[0]
    );
  } catch (error) {
    console.error("Error accepting request:", error);
  }
}


async function deleteRequest(id) {
  try {
    const result = await pgPool.query(sql.DELETE_REQUEST, [id]);
    console.log(
      "Request deleted successfully in request.js backend:",
      result.rows[0]
    );
  } catch (error) {
    console.error("Error deleting request:", error);
  }
}

async function getAdminUsernameByGroupId(groupid) {
  try {
    const result = await pgPool.query(sql.GET_ADMIN_BY_GROUPID, [groupid]);
    console.log(
      "Admin username retrieved successfully in request.js backend:",
      result.rows
    );
    return result.rows[0]?.admin || null;
  } catch (error) {
    console.error("Error getting admin by groupid:", error);
    return null;
  }
}

async function checkRequestMembership(username,groupid) {
  const result = await pgPool.query(
    "SELECT * FROM join_requests WHERE username = $1 AND groupid = $2",
    [username, groupid]
  );

  return result.rows.length > 0;
}

async function getGroupUsers(username, groupid_usergroups) {
  const result = await pgPool.query(
    "SELECT * FROM groupusers WHERE username = $1 AND groupid_usergroups = $2",
    [username, groupid_usergroups]
  );

  return result.rows.length > 0;
}


module.exports = {
  postRequest,
  getRequest,
  acceptRequest,
  deleteRequest,
  getAdminUsernameByGroupId,
};

const redis = require("redis");
const client = redis.createClient(process.env.REDISCLOUD_URL);

//Flush redis
client.flushdb();

//Save function
saveToRedis = async (table, data) => {
  try {
    for (const prop in data) {
      await client.hset(table, prop, data[prop]);
    }
  } catch (error) {
    console.error(error);
  }
};

// Save colorgame to redis
setColorgame = (id, users, score) => {
  const game = {
    id: id,
    users: JSON.stringify(users),
    score: score
  }
  saveToRedis("colorgame_" + id, game);
}

// Save new person to redis
setUser = (username, id) => {
  saveToRedis("user_" + id, { name: username });
};

setUserToGroup = (userId, groupId) => {
    saveToRedis("user_" + userId, { group_id: groupId });
};


//Save new group to redis
setGroup = (
  groupname,
  groupId,
  id,
  score,
  gameorder,
  completed,
  state,
  player_count
) => {
  const group = {
    groupname: groupname, //groupname
    groupId: groupId,
    score: score, //score 0
    gameorder: JSON.stringify(gameorder), //gameorder [1,2,3,4,5]
    completed: JSON.stringify(completed), // completed: [1,2,3]
    state: state, // 0,1,2
    playerCount: player_count //player_count: +3
  };
  saveToRedis('group_' + id, group);
};

increaseScore = (id, score, completed) => {
  const group = {
    score: score,
    completed: JSON.stringify(completed)
  }
  saveToRedis('group_' + id, group);
};

// Get user info from redis
getUser = (id) => {
    return new Promise((resolve, reject) => {
        (async () => {
            await client.hgetall("user_" + id, function(err, data) {
            resolve(data);
            });
        })();
    });
};

// Increase playerCount in existing Group
increasePlayerCount = (id, currentCount) => {
      saveToRedis("group_" + id, { playerCount: currentCount + 1 });
    };

doesGroupExist = (id) => {
    return new Promise((resolve, reject) => {
        client.exists('group_'+ id, function(err, data) {
          (!err && data) ? resolve(true) : resolve(false);
        });
    });
};


// Get group info from redis
getGroup = (id) => {
    return new Promise((resolve, reject) => {
        (async () => {
            await client.hgetall("group_" + id, function(err, data) {
            resolve(data);
            });
        })();
    });
};

// Get Group Names array from redis
getGroupNames = () => {
  return new Promise((resolve, reject) => {
    client.get("group_names", function(err, data) {
      (data === null) ? resolve([]) : resolve(JSON.parse(data));
    });
  });
};

// Save Group Names array to redis
setGroupNames = (groups) => {
    client.set('group_names', JSON.stringify(groups));
};

// Get Group Ids array from redis
getGroupIds = () => {
  return new Promise((resolve, reject) => {
    client.get("group_ids", function(err, data) {
      (data === null) ? resolve([]) : resolve(JSON.parse(data));
    });
  });
};

// Save Group Names array to redis
setGroupIds = (groupIds) => {
  client.set('group_ids', JSON.stringify(groupIds));
};

changeGroupStatus = (id, state) => {
  saveToRedis('group_' + id, { state: state });
}

module.exports = {
  setUser,
  setUserToGroup,
  setGroup,
  getUser,
  getGroup,
  getGroupNames,
  setGroupNames,
  getGroupIds,
  setGroupIds,
  increasePlayerCount,
  increaseScore,
  doesGroupExist,
  changeGroupStatus,
  setColorgame
};
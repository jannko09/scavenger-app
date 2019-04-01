const express = require("express");
const app = express();
const port = process.env.PORT || 7777;

// Initialize socket.io
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Initialize .env
require("dotenv").config();

// Import functions
const validate = require("./validate");
const cache = require("./cache");

// Suffle
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

// Redirect user to index on every request (due to React)
app.use(express.static("public"));

app.get("/*", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

var clues = { 'c-1': 'Eka vihje', 'c-2': 'Toka vihje', 'c-3': 'Kolmas vihje', 'c-4': 'Neljäs vihje', 'c-5': 'Viides vihje' };
var order = [['c-1', 'c-2', 'c-3', 'c-4', 'c-5'],
['c-2', 'c-3', 'c-4', 'c-5', 'c-1'],
['c-3', 'c-4', 'c-5', 'c-1', 'c-2'],
['c-4', 'c-5', 'c-1', 'c-2', 'c-3'],
['c-5', 'c-4', 'c-3', 'c-2', 'c-1'],
['c-5', 'c-4', 'c-3', 'c-2', 'c-1'],
['c-4', 'c-3', 'c-2', 'c-1', 'c-5'],
['c-3', 'c-2', 'c-1', 'c-4', 'c-5'],
['c-2', 'c-1', 'c-5', 'c-4', 'c-3'],
['c-1', 'c-5', 'c-4', 'c-3', 'c-2']];

// blue, green, red, yellow, black, pink, harmaa, ruskea, valkoinen, oranssi
var colorsArr = [
  {'Sininen': '#0000FF'},
  {'Vihreä': '#008000'},
  {'Punainen': '#FF0000'},
  {'Keltainen': '#FFFF00'},
  {'Musta': '#000000'},
  {'Pinkki': '#FF00FF'},
  {'Harmaa': '#C0C0C0'},
  {'Valkoinen': '#FFFFFF'},
  {'Oranssi': '#FF4500'}
];

// >>> 0 Socket on new connection
io.on("connection", socket => {
  // *** if first socket to connect
  // get info from mongoDB
  // save this to redis

  console.log(`New socket (${socket.id}) connected`);

  // Socket validate username
  // >>> username
  // <<< username or error
  socket.on("validateuser", data => {
    try {
      let username = data.username.trim();
      let validation = validate.user(username);
      if (validation.error) {
        io.in(socket.id).emit("uservalidation", validation);
        console.log(`Error in user validation: (${validation.error})`);
      } else {
        cache.setUser(username, socket.id);
        io.in(socket.id).emit("uservalidation", validation);
        console.log(`Username validation (${username}) succesfull`);
      }
    } catch {
      io.in(socket.id).emit("uservalidation", { error: "Bad Request" });
      console.log(`Error in user validation: Bad Request`);
    }
  });

  // >>> 1 Socket on new group (groupname, username)
  socket.on("newgroup", data => {
    try {
      let groupname = data.groupName.trim();
      cache.getGroupNames().then(groupNames => {
        cache.getGroupIds().then(groupIds => {
          let validation = validate.group(groupname, groupNames);
          if (validation.error) {
            io.in(socket.id).emit("groupvalidation", validation);
            console.log(`Error in group creation: (${validation.error})`);
          } else {
            // Save group
            let groupId = groupNames.length + 1;

            console.log('***' + groupIds + '***');
            console.log('*** Mathmax: ' + Math.max(...groupIds) + '***');
            console.log('groupIds:');
            console.log(groupIds.length);
            console.log(typeof groupIds);
            if (groupIds.length == 0) {
              var groupId2 = 1;
            } else {
              var groupId2 = Math.max(...groupIds) + 1
            }
            console.log(groupId2);
            /* let groupId2 = (groupsIds.length != 0) ?  Math.max(...groupIds) + 1 : 1;
            console.log(groupId2); */

            /* if(groupIds.length > 0){
              console.log(groupIds); 
              var groupId = Math.max(...groupIds) + 1;
            } else {
              var groupId = 1;
            } */

            //next clue
            let gameorder = order[groupId - 1];
            let nextClue = clues[gameorder[0]];

            cache.setGroup(groupname, groupId, groupId, 0, gameorder, [], 0, 1);

            // Save group_names & group_ids arrays to redis
            groupNames.push(groupname.toLowerCase());
            cache.setGroupNames(groupNames);
            groupIds.push(groupId);
            cache.setGroupIds(groupIds);

            // Save group id to user
            // ***** check this cache.setUserToGroup
            cache.setUserToGroup(socket.id, groupId);

            //***** Get user info and check here

            // Add user to room
            socket.join(groupId);


            //response to client here
            var lahjapaketti = {
              groupname: groupname,
              groupId: groupId,
              gameorder: gameorder,
              score: 0,
              playerCount: 1,
              state: 0,
              nextClue: nextClue
            };

            io.in(socket.id).in('admin').emit("groupvalidation", lahjapaketti);
            console.log(`New group (${groupname}), with id ${groupId} created successfully`);
          }
        });
      });
    } catch {
      io.in(socket.id).emit("groupvalidation", { error: "Bad Request" });
      console.log(`Error in group validation: Bad Request`);
    }
  });

  // >>> 9 Socket on new user (username, groupId)
  // *** save new user to redis (username, groupId)
  // *** add user to socket room
  // <<< 9.1 Emit username to app (group)
  // <<< 9.2. Emit ... to admin
  socket.on("newuser", data => {
    try {
      cache.doesGroupExist(data.groupId).then(groupExists => {
        if (groupExists) {
          //Check If player already in group
          cache.getGroup(data.groupId).then(res => {

            // Increase groups playercount
            cache.increasePlayerCount(data.groupId, parseInt(res.playerCount));

            // Add group to user
            cache.setUserToGroup(socket.id, data.groupId);

            //next clue
            let score = parseInt(res.score);
            let gameorder = JSON.parse(res.gameorder);
            let nextClue = clues[gameorder[score]];

            var lahjapaketti = {
              groupname: res.groupname,
              groupId: data.groupId,
              gameorder: gameorder,
              playerCount: parseInt(res.playerCount) + 1,
              score: parseInt(res.score),
              state: parseInt(res.state),
              nextClue: nextClue
            };

            // Add user to team's room and send response to every one
            socket.join(data.groupId);
            io.in(data.groupId).in('admin').emit("groupjoin", lahjapaketti);

            console.log(`New user joined to group (${res.groupname}) successfully. Group has now ${parseInt(res.playerCount) + 1} players.`);
          });
        } else {
          io.in(socket.id).emit("groupjoin", { error: "Group does not exist" });
          console.log(`Error in joining to group: Group does not exist.`);
        }
      });
    } catch {
      io.in(socket.id).emit("groupjoin", { error: "Bad Request" });
      console.log(`Error in joining to group: Bad Request.`);
    }
  });

  // >>> 3 Socket on group ready
  // *** change group status from 0 to 1 on redis
  // <<< 4.1 Emit groupStatus to app (group)
  // <<< 4.2 Emit groupStatus to admin

  socket.on("groupready", () => {
    try {
      cache.getUser(socket.id).then(user => {
        cache.getGroup(user.group_id).then(group => {
          group.state = 1;
          cache.changeGroupStatus(user.group_id, 1);
          //io.in(user.group_id).in('admin').emit("letsplay", { state: 1 });
          io.in(user.group_id).in('admin').emit("letsplay", group);
          // Send state to admin
        });
      });
    } catch {
      io.in(socket.id).emit("letsplay", { error: "Bad Request" });
      console.log(`Error in group ready: Bad Request.`);
    }
  });

  // >>> 5 Socket on game start
  // *** change gameStatus from 0 to 1 on redis
  // <<< 6.1 Emit gameStatus to app (everyone)
  // <<< 6.2. Emit gameStatus to admin
  socket.on('gamestart', () => {
    try {
      cache.getGroupIds().then(groupIds => {
        for (let id of groupIds) {
          cache.getGroup(id).then(group => {
            console.log(group);
            let state = parseInt(group.state);
            if (state == 1) {
              cache.changeGroupStatus(id, 2);

              //next clue
              let score = parseInt(group.score);
              let gameorder = JSON.parse(group.gameorder);
              let nextClue = clues[gameorder[score]];

              let lahjapaketti = {
                groupname: group.groupname,
                groupId: parseInt(group.groupId),
                gameorder: gameorder,
                playerCount: parseInt(group.playerCount),
                score: score,
                state: 2,
                nextClue: nextClue
              };
              io.in(id).in('admin').emit("startgame", lahjapaketti);
              console.log(`Group ${group.groupname} state changes to 2 succesfully`);
            }
          });
        }
      });
    } catch {
      io.in(socket.id).emit("startgame", { error: "Bad Request" });
      console.log(`Error in group ready: Bad Request.`);
    }
  });

  socket.on('gameend', () => {
    console.log('gameended');

  });

  // >>> 7 Socket on task completed
  // *** set new score to redis
  // *** calculate next game
  // *** calculate next clue
  // <<< 8.1 Emit score, nextGame, nextClue to app (group)
  // <<< 8.2 Emit score, nextGame, nextClue to admin
  socket.on('cluecorrect', () => {
    try {
      cache.getUser(socket.id).then(user => {
        cache.getGroup(user.group_id).then(group => {

          let gameorder = JSON.parse(group.gameorder);
          let completed = JSON.parse(group.completed);
          let score = parseInt(group.score);
          let current = '';
          let nextClue = '';
          let state = parseInt(group.state);

          if(score < gameorder.length) {
            current = gameorder[score];
            completed.push(current);
            score += 1;
            nextClue = clues[gameorder[score]];
            if(score == gameorder.length) {
              state = 2;
              cache.changeGroupStatus(group.groupId, 2);
            }
          }

          cache.increaseScore(group.groupId, score, completed);

          var lahjapaketti = {
            groupname: group.groupname,
            groupId: parseInt(group.groupId),
            gameorder: gameorder,
            playerCount: parseInt(group.playerCount),
            score: score,
            state: state,
            nextClue: nextClue
          };

          io.in(group.groupId).in('admin').emit("increasescore", lahjapaketti);
          console.log(`Group ${group.groupname} solved clue ${current}, total score ${score}`);
        });
      });
    } catch {
      io.in(socket.id).emit("increasescore", { error: "Bad Request" });
      console.log(`Error in group ready: Bad Request.`);
    }
  });

  // >>> 10 Socket on disconnect
  // *** delete user from redis
  // <<< ???

  //ADMIN LOGIN
  socket.on('adminlogin', () => {
    try {
      socket.join('admin');

      // Get all groups and send them to admin
      cache.getGroupIds().then(groupIds => {
        let groups = {};

        for (let i in groupIds) {
          cache.getGroup(groupIds[i]).then(group => {
            groups['team-' + groupIds[i]] = group;
            if (i == (groupIds.length - 1)) {
              io.in(socket.id).emit('adminlogin', groups);
            }
          });
        }
      });
    } catch {
      io.in(socket.id).emit('adminlogin', { error: 'Bad Request' });
    }
  });

  //GAMEINIT
  socket.on('colorgameinit', () => {
    try{
      cache.getUser(socket.id).then(user => {
        console.log(user);
        io.in(user.group_id).clients((error, clients) => {
          if (error) throw error;
          //var colors = shuffle(colorsArr).slice(0, clients.length);
          
          //respond to each client
          var randColors = shuffle(colorsArr);
          var randUsers = shuffle(clients);
          cache.setColorgame(user.group_id, randUsers, 0);

          console.log(randColors);
          console.log(randColors[0]);
          console.log(randUsers[0]);
          
          for(let i in randUsers) {
            let lahjapaketti = {
              score: 0,
              color: randColors[i],
              timelimit: 10000,
              clue: ''
            };
            if(i == 0){
              console.log(Object.keys(randColors)[0]);
              lahjapaketti.clue = Object.keys(randColors[i])[0];
            }
            io.in(randUsers[i]).emit('colorgameinit', lahjapaketti);
          }
        });
      });
    } catch {
      io.in(socket.id).emit('adminlogin', { error: 'Bad Request' });
    }
  });

});

// Start server
http.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
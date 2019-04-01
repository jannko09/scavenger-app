import React, { Component } from "react";
import "./Home.css";
import io from "socket.io-client";
import Groups from './Groups';
import Timer from "react-time-counter"
import map from "./img/map.png"
import ImageZoom from 'react-medium-image-zoom'

let socket = io(`https://loppuprojekti.herokuapp.com`);

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: []
    };
  }

  componentDidMount() {
    socket.on("adminlogin", login => {
      console.log("Admin logged in!");
      this.setState({ groups: login });
      login
        ? document.getElementById("modal").classList.toggle("hide")
        : console.log(login.error);
    });

    socket.on("groupvalidation", data => {
     // GET INFO OF NEW GROUP
      var groups = this.state.groups;
      groups["team-" + data.groupId] = data;
      this.setState({ groups: groups });
    });

    socket.on("groupjoin", data => {
    //FOR ADMIN TO SEE PLAYERS JOINING GROUPS FOR CHANGING COLOR FROM RED(NOTREADY) TO GREEN(READY)
      let id = "team-" + data.groupId;
      let groups = this.state.groups;
      groups[id] = data;
      this.setState({ groups: groups });
      console.log(data);
     });

     socket.on("letsplay", data => {
    //OK BUTTON PRESSED IN APP --> TEAM READY
      console.log(data);
      let id = "team-" + data.groupId;
      let groups = this.state.groups;
      groups[id] = data;
      this.setState({ groups: groups });
    });

    socket.on("endgame", data => {
      console.log(data)
      let id = "team-" + data.groupId;
      let groups = this.state.groups;
      groups[id] = data;
      this.setState({ groups: groups });
      console.log("Game ended!")
    })

    socket.on("startgame", data => {
      console.log(data)
      console.log(this.state.groups.state);
      let id = "team-" + data.groupId;
      let groups = this.state.groups;
      groups[id] = data;
      this.setState({ groups: groups });
    })

    socket.on("increasescore", data => {
    //GROUP ANSWERED CORRECTLY TO TASK
      console.log(data);
      let id = "team-" + data.groupId;
      let groups = this.state.groups;
      groups[id] = data;
      this.setState({ groups: groups });
    }); 
  }

  adminlogin = () => {
//LETTING SERVER KNOW OF ADMIN
console.log("admin pressed login")
    socket.emit("adminlogin");
  };

  gameStart = () => {
//ADMIN STARTS THE GAME 
    socket.emit("gamestart");
    var ongoinggame = 
    document.getElementById("ongoinggame");
    ongoinggame.innerHTML = "GAME IN PROGRESS";
    ongoinggame.classList.add("gameisongoing");
    console.log("gameStart pressed")
  }

  gameEnd = () => {
//ADMIN ENDS THE GAME
    socket.emit("gameend");
    var ongoinggame = 
    document.getElementById("ongoinggame");
    ongoinggame.innerHTML = "START GAME";
    ongoinggame.classList.remove("gameisongoing");
    console.log("endgame pressed")
    }
 

  render() {
    let groups = this.state.groups;
    let mappedkeys = Object.keys(groups).sort((a,b) => {
        return groups[b].score - groups[a].score;
        }
    )
        .map(function(key) {
      return (
        <Groups 
          key={key} group={groups[key]} />
      );
    });
    return (
      <div className="app">
      <h1 className="scoreboard">
      <ImageZoom
        image={{
          //START IMAGE
          src: map,
          alt: 'MAP',
          className: 'img',
          style: { 
            width: '2.5em',
            height: '2em'
            }
        }}
        //AFTER ZOOM
        zoomImage={{
          src: map,
          alt: 'map'
        }}
      />
        Scoreboard
      </h1>
      <Timer />
        <div className="but">
          <button className="button" onClick={this.gameStart}><span id="ongoinggame">GAME START</span></button>
          <button className="button" onClick={this.gameEnd}>GAME END</button>
        </div>
        <div>
          <div className="modal" id="modal">
            <button onClick={this.adminlogin}>Login</button>
          </div>
          <table>
          <thead>
          <tr>
          <th>Group name</th>
          <th>Score</th>
          <th>Playercount</th>
          <th>Group ready?</th>
          </tr>
          </thead>
              <tbody>{mappedkeys}
             </tbody>
          </table>
          
        </div>
      
      </div>
    );
  }
}

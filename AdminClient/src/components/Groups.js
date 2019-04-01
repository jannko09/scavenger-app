import React, { Component } from 'react';
import "./Home.css";
import Timer from "react-time-counter";

export default class Groups extends Component {

    render() {
        let timer = <Timer  />;
        let str = '';
        let jokustr = ['','🏆','🏆🏆','🏆🏆🏆','🏆🏆🏆🏆','🏆🏆🏆🏆🏆'];
            let pplstr= ['🤠']
        for(let i=0; i<parseInt(this.props.group.playerCount);i++){
            str += pplstr[Math.floor((Math.random()*pplstr.length))];
        }
        return(
<tr className=
{this.props.group.state > 0 ?  ' groupready' : 'notready' }>
    <td>{this.props.group.groupname}</td>
    <td>{jokustr[this.props.group.score]}</td>
    <td>{str}</td>
     <td id="tablecheckmark" className={
         (this.props.group.state) === 0 ? 'pending' :
         (this.props.group.state) === 1 ? 'ready' :
         (this.props.group.state) === 2 ? 'gameongoing' :
         (this.props.group.state) === 3 ? 'completed' : ''
         }>{ 
    parseInt(this.props.group.state) === 0 ? '✖' :
    parseInt(this.props.group.state) === 1 ? "✔" : 
    parseInt(this.props.group.state) === 2 ? timer : 
    parseInt(this.props.group.state) === 3 ? "Completed" : "Failed"
    }
     </td>
</tr>
)
}}

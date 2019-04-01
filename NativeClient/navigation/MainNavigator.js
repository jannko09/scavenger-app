import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Game from '../screens/Game';
import GameEnd from '../screens/GameEnd';

import MainMenu from '../screens/MainMenu';
import JoinGroup from '../screens/JoinGroup'
import CreateGroup from '../screens/CreateGroup';
import StartApp from '../screens/StartApp'; 
import TeamJoin from '../screens/TeamJoin';
import TeamWait from '../screens/TeamWait';
import Instructions from '../screens/Instructions';
import ButtonGame from '../screens/ButtonGame';
import RabbitGame from '../screens/RabbitGame';


const MainNavigator = createStackNavigator({
    Main: { screen: StartApp}, 
    MainMenu: {screen: MainMenu},
    EndScreen: {screen: GameEnd},
    Join: {screen: JoinGroup},
    Create: {screen: CreateGroup},
    Game: {screen:Game},
    TeamJoin: { screen: TeamJoin },
    TeamWait: { screen: TeamWait},
    Instructions: {screen: Instructions},
    ButtonGame: {screen: ButtonGame},
    RabbitGame: {screen: RabbitGame}

});

const AppContainer = createAppContainer(MainNavigator);

// Now AppContainer is thne main component for React to render

export default class AppNavigator extends React.Component {
    render() {
        return <AppContainer />;
    }
}
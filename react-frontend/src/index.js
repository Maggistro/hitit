import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Menu from './view/Menu.js';
import Game from './view/Game.js';
import Credits from './view/Credits.js';

class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            active: 'MENU'
        }
    }
    switchMain(target){
        this.setState({active: target});
    }

    render(){
        let active = this.state.active;
        return (
            <div>
                {active === 'MENU' ? (
                    <Menu switch={(t) => this.switchMain(t)}/>
                ) : active === 'GAME' ? (
                    <Game switch={(t) => this.switchMain(t)}/>
                ) : active === 'CREDITS' ? (
                    <Credits switch={(t) => this.switchMain(t)}/>
                ) : null}
            </div>
        )
    }
}

// ========================================

ReactDOM.render(
    <Main />,
    document.getElementById('root')
);
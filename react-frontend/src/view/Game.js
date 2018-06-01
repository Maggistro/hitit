import React from 'react';
import '../index.css';
import Scoreboard from '../components/Scoreboard';
import Screen from '../components/Screen';
import Navbar from '../components/Navbar';

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            running: 0,
            count: 0,
            points: 0,
            streak: 0,
            level: 0,
            buttons: [],
            users: {}
        }
    }

    timer = {};


    onHit(id){
        let newState = {
            points: this.state.points,
            streak: this.state.streak,
            buttons: this.state.buttons
        };

        newState.points += newState.streak + 1; //add point + streak bonus
        newState.streak+=1; //count streak
        let index = newState.buttons.findIndex((b) => {return b.count === id});
        newState.buttons.splice(index, 1);
        this.clearTimer(id);
        this.setState(newState,
            () => {this.updateButtons()});
    }

    clearTimer(id){
        if(id){
            clearTimeout(this.timer[id]);
            delete this.timer[id];
        }else{
            for(const button in this.timer){
                clearTimeout(this.timer[button]);
            }
            this.timer={};
        }
    }

    onMiss(){
        //count missed buttons, end streak and remove buttons left
        this.clearTimer();
        this.setState({streak: 0, buttons: []},
            () => this.updateButtons())
    }

    toSlow(id){
        this.timer[id] = (
            setTimeout(function(){
                if(this.state.running===2){
                    const newButtons = this.state.buttons,
                        index = newButtons.findIndex((b) => {return b.count === id});
                    newButtons.splice(index, 1);
                    this.setState({buttons: newButtons},
                        () => this.updateButtons())
                }
            }.bind(this), 10000 - Math.sqrt(id))
        )
    }

    componentDidMount(){
        this.updateButtons();
        fetch('/users')
            .then(res => res.json())
            .then(users => this.setState({users: users}))
    }

    updateButtons(){
        //get height for button position
        const height = this.size.height;
        const width = this.size.width;
        const currentLevel = Math.floor(Math.sqrt(this.state.count || 1));

        if(this.state.buttons.length< currentLevel){

            const newButtons = [];
            for(let level=this.state.buttons.length; level<currentLevel; level++){
                let left = Math.random() * width*0.6 + width*0.2,
                    top = Math.random() * height*0.8 + height*0.1;

                if(left && top)
                    newButtons.push({
                        count: this.state.count + level + 1,
                        top: top,
                        left: left,
                        timer: 0
                    })
            }

            this.setState({level: currentLevel, buttons: this.state.buttons.concat(newButtons), count: this.state.count + newButtons.length})
        }
    }

    startGame() {
        this.setState({running: 2},
            ()=>this.updateButtons()); //start
    }

    resetGame(){
        this.clearTimer();
        this.setState({
            running: 2,
            count: 0,
            points: 0,
            streak: 0,
            buttons: []
        }, () => this.updateButtons());
    }

    endGame(){
        this.clearTimer();
        this.setState({
            running: 0,
            count: 0,
            points: 0,
            streak: 0,
            buttons: []
        });
        this.props.switch('MENU');
    }

    sizeElement(element){
        if(element)
            this.size= {width: element.clientWidth, height: element.clientHeight};
    }

    render(){
        return (
            <div className="main">
                <Scoreboard points={this.state.points} level={this.state.level} streak={this.state.streak}/>
                <Screen
                    state={this.state.running}
                    buttons={this.state.buttons}
                    sizeElement={(element)=>this.sizeElement(element)}
                    toSlow={(id) => this.toSlow(id)}
                    onMiss={(id) => this.onMiss(id)}
                    onHit={(id) => this.onHit(id)}
                />
                <Navbar
                    startGame={() => this.startGame()}
                    resetGame={() => this.resetGame()}
                    endGame={() => this.endGame()}
                />
            </div>
        )
    }
}

export default Game;

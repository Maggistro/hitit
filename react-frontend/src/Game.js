import React from 'react';
import './index.css';

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

    timer = {}


    onHit(id){
        let newState = {
            points: this.state.points,
            streak: this.state.streak,
            buttons: this.state.buttons
        }

        newState.points += newState.streak + 1; //add point + streak bonus
        newState.streak+=1; //count streak
        let index = newState.buttons.findIndex((b) => {return b.count === id});
        newState.buttons.splice(index, 1);
        this.clearTimer(id)
        this.setState(newState,
            () => {this.updateButtons()});
    }

    clearTimer(id){
        if(id){
            clearTimeout(this.timer[id]);
            delete this.timer[id];
        }else{
            for(var button in this.timer){
                clearTimeout(this.timer[button]);
            }
            this.timer={};
        }
    }

    onMiss(){
        //count missed buttons, end streak and remove buttons left
        this.clearTimer()
        this.setState({streak: 0, buttons: []},
            () => this.updateButtons())
    }

    toSlow(id){
        this.timer[id] = (
            setTimeout(function(){
                if(this.state.running===2){
                    var newButtons = this.state.buttons,
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
        const currentLevel = Math.floor(Math.sqrt(this.state.count || 1))

        if(this.state.buttons.length< currentLevel){

            var newButtons = [];
            for(var level=this.state.buttons.length; level<currentLevel; level++){
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
        this.clearTimer()
        this.setState({
            running: 2,
            count: 0,
            points: 0,
            streak: 0,
            buttons: []
        }, () => this.updateButtons());
    }

    endGame(){
        this.clearTimer()
        this.setState({
            running: 0,
            count: 0,
            points: 0,
            streak: 0,
            buttons: []
        })
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

function Scoreboard(props){
    return (
        <div className="scoreBoard">
            <a>Score: {props.points}</a>
            <a>   </a>
            <a>Level: {props.level}</a>
            <a>Streak: {props.streak}</a>
        </div>
    )
}

class HitButton extends React.Component{
    render(){
        return (
            <div className='it' style={{left: this.props.left, top: this.props.top}} id={this.props.count} key={this.props.count}>
                <button onClick={(event) => {event.stopPropagation(); this.props.onHit()}}>
                    {this.props.count}
                </button>
            </div>
        )
    }

    componentDidMount(){
        this.props.toSlow();
    }
}

class Screen extends React.Component{

    render(){
        let orbs = [];
        var screenContent =
            <div className="screen"
                 ref={ (divElement) => this.props.sizeElement(divElement)}
                 onClick={() => this.props.onMiss()}
            >
                {orbs}
            </div>;
        switch(this.props.state){
            //game not running
            case 0:
                orbs.push(<div>You're not playing. Whats wrong?</div>)
                break;
            //game paused (tricky)
            case 1:
                orbs.push(<div>LAME!</div>)
                break;
            //game running
            case 2:
                for(var i=0; i< this.props.buttons.length; i++){
                    let hitButton = this.props.buttons[i];
                    orbs.push(<HitButton
                        count= {hitButton.count}
                        onHit= {() => this.props.onHit(hitButton.count)}
                        toSlow= {() => this.props.toSlow(hitButton.count)}
                        top= {hitButton.top}
                        left= {hitButton.left}
                    />);
                }
                break;
            default: console.error('not a legit game state');
        }
        return (screenContent)
    }

}

class Navbar extends React.Component{
    render(){
        return (
            <div>
                <button onClick={() => this.props.startGame()}>
                    Start game
                </button>
                <button onClick={() => this.props.resetGame()}>
                    Reset game
                </button>
                <button onClick={() => this.props.endGame()}>
                    End game
                </button>
            </div>
        )
    }
}


export default Game;

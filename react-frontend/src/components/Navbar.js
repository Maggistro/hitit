import React from 'react';

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

export default Navbar;

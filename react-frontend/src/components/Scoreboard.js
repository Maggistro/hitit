import React from 'react';

class Scoreboard extends React.Component {
    render() {
        return (
            <div className="scoreBoard">
                <a>Score: {this.props.points}</a>
                <a> </a>
                <a>Level: {this.props.level}</a>
                <a>Streak: {this.props.streak}</a>
            </div>
        )
    }
}

export default Scoreboard;
import React from 'react';


class Credits extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            credits: 'Programming and Design: </br> Maximilian Mühlfeld'
        }
    }

    componentDidMount(){
        fetch('/credits')
            .then(res => {if(res.status != 404) res.json()})
            .then(credits => {if(credits) this.setState({credits: credits})})
    }

    render(){
        return (
            <div className="credits">
                <a>{this.state.credits}</a>
                <button>Back to Menu</button>
            </div>
        )
    }
}

export default Credits;
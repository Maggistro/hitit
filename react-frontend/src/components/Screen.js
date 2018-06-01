import React from 'react';
import HitButton from './HitButton';

class Screen extends React.Component{

    render(){
        let orbs = [];
        const screenContent =
            <div className="screen"
                 ref={ (divElement) => this.props.sizeElement(divElement)}
                 onClick={() => this.props.onMiss()}
            >
                {orbs}
            </div>;
        switch(this.props.state){
            //game not running
            case 0:
                orbs.push(<div>You're not playing. Whats wrong?</div>);
                break;
            //game paused (tricky)
            case 1:
                orbs.push(<div>LAME!</div>);
                break;
            //game running
            case 2:
                for(let i=0; i< this.props.buttons.length; i++){
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

export default Screen;

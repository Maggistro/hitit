import React from 'react';


class Menu extends React.Component{

    render(){
        return (
            <div className="menu">
               <button onClick={() => this.props.switch('GAME')}>
                   Play
               </button>
               <button onClick={() => this.props.switch('HIGHSCORE')}>
                   Highscore
               </button>
               <button onClick={() => this.props.switch('CREDITS')}>
                    Credits
               </button>
            </div>
        )
    }
}

export default Menu;

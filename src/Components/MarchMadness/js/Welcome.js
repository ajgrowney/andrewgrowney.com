import React, { Component } from 'react'

class Welcome extends Component {
    render()
    {
        return(<div>
            <h1>March Madness 2020</h1>
            <button onClick={this.props.selectBracket}>Select Bracket</button>
        </div>)
    }
} 
export default Welcome;
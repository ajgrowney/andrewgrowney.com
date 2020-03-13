import React, { Component } from 'react'

class BracketSelect extends Component {
    render()
    {
        return(
            <div>
                <button onClick={() => window.location.href="/mm2020/espn" }>ESPN Bracketology Bracket</button>
                <button onClick={() => window.location.href="/mm2020/custom"}>Custom Bracket</button>
            </div>
        )
    }
} 
export default BracketSelect;
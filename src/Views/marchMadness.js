import React, { Component } from 'react';
import { BracketApp, Welcome, BracketSelect } from '../Components/MarchMadness/js/index.js'
class MarchMadness extends Component {
    constructor(props){
        super(props)
        console.log(props.page)
        this.state = {
            page: props.page,
            bracketType: null
        }
        this.changePage = this.changePage.bind(this);

    }

    changePage(newPage){
        if(newPage.startsWith("bracket/"))
        {
            let bracketType = newPage.split("/")[1];
            console.log(bracketType);
            window.location.href="/mm2020/espn"

        } else {
            this.setState(state => ({
                page: newPage
            }));
        }
    }

    render(){
        if(this.state.page === "welcome")
        {
            return(<Welcome selectBracket={() => this.changePage("select")}/>)
        }
        else if(this.state.page === "select")
        {
            return(
                <BracketSelect
                    espnBracket={() => this.changePage("bracket/espn")}
                    customBracket={() => this.changePage("bracket/custom")}
                />
            )
        }
        else
        {
            return(
                <BracketApp type={this.state.bracketType} />
            )
        }
    }
}
export default MarchMadness;
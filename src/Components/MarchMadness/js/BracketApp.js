import React, { Component } from 'react';
import espnBracket from '../../../Data/MarchMadness/espnBracketData';

const BracketData = {
    "espn": espnBracket
}

class Region
{
    constructor(i, regionObject){
        this.id=i
        this.name=regionObject.name
    }
}

class BracketApp extends Component
{
    constructor(props)
    {
        super(props);
        let regionsInitial = new Map()
        
        for(const [region_id,region_object] of Object.entries(BracketData[props.type].regions)){
            regionsInitial.set(region_id, new Region(region_id, region_object));
        }
        
        this.state = {
            regions: regionsInitial
        }
        
    }

    GetRegions()
    {
        let regionsArr = []
        this.state.regions.forEach((reg, idx) =>{
            regionsArr.push(reg.name)
        });
        return regionsArr.join()
    }

    render()
    {   
        return(
            <div className="bracketAppContainer">
                Bracket Application: {this.props.type}
                Regions: <div>{this.GetRegions()}</div>
            </div>
        )
    }
}

export default BracketApp;
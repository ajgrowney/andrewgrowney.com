import React from 'react';
import Image from 'react-bootstrap/Image'

import '../css/resourceView.css'

function ImageSet(props){
    let srcList = props.sources;
    let resultImages = []
    let order = 0;
    srcList.forEach(element => {
        order += 1
        resultImages.push(<Image className="imageSetitem" style={{'order': order}} src={element}/>)
    });
    return(
        <div className="imageSetContainer">
            {resultImages}
        </div>
    )
}
export default ImageSet
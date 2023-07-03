import React from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Image from 'react-bootstrap/Image'
import Carousel from 'react-bootstrap/Carousel'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/header.css'

function ImageCarousel(props){
    let { images } = props;
    let carouselElements
    carouselElements = images.map((im) => 
        <Carousel.Item key={im} className='carousel-inner'>
            <Image className="header_imageObject" src={im} alt="Profile Picture" roundedCircle={props.round} />
        </Carousel.Item>
    )
    
    if(images.length > 1)
    {
        return (<Carousel className="header_image">{carouselElements}</Carousel>)
    }else {
        return(<div className="header_image"><div><Image className="header_imageObject" src={images[0]} /></div></div>)
    }
}

// Prop: content { Object } with keys: titleContent, subtitleContent, image
function ResourceHeader(props){
    let { titleContent, subtitleContent, imageContent, imageRounded } = props.content;
    let HeaderImage = <ImageCarousel images={imageContent} round={imageRounded} />;
    
    return (
        <Jumbotron bg="dark" id="intro_id" className="jumboHeader">
            <div className="header_title">
                {titleContent.map(x => x)}
            </div>
            <div className="header_subtitle">
                {subtitleContent.map(x => x)}
            </div>
            {HeaderImage}
        </Jumbotron>
    )
}

export default ResourceHeader;
import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Image from 'react-bootstrap/Image'
import Carousel from 'react-bootstrap/Carousel'
import '../css/header.css'
import 'bootstrap/dist/css/bootstrap.css'


function HomeImage(props){
    let { image } = props;
    return (
        <div className="header_image">
            <Image className="header_imageObject"
                src={image} alt="Profile Picture"
                roundedCircle
            />
        </div>
    )
}

function ImageCarousel(props){
    let { images } = props;
    return (
        <Carousel className="header_image">
            {images.map((im) =>
                <div className='carousel-inner'>
                    <img className="header_imageObject" src={im} alt="Project" />
                </div>
            )}
        </Carousel>
    )
}

// Prop: content { Object } with keys: titleContent, subtitleContent, image
function Header(props){
    let { titleContent, subtitleContent, imageContent } = props.content;
    let HeaderImage = imageContent.length < 2 ? 
        <HomeImage image={imageContent[0]} /> : <ImageCarousel images={imageContent} />;
    
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

export default Header;
import * as React from 'react'
import {Loading, RootUrl} from './Utils'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {Navigation, Keyboard} from 'swiper';
import "swiper/swiper-bundle.min.css";
import './gallery.css';
export default Gallery;

SwiperCore.use([Navigation, Keyboard])

const ROOT_URL = RootUrl()

// Function that loads source images from PicSum for Demo
function buildSources (startId, numberOfImages) {
  let sources = []
  const stopId = startId + numberOfImages
  for (let i = startId; i < stopId; i++) {
    const url = "https://picsum.photos/id/" + i + "/800/600"
    const title = i.toString()
    const sourceLine = {title: title, src: url}
    sources.push(sourceLine)
  }
  return sources
}

// Build lightbox : developped with Swiper JS
function Slides (sources) {
  const slides = [];
  
  for (let i=0; i < sources.length; i++) {
    const url = ROOT_URL + "images/" + sources[i].src
    slides.push(
      <SwiperSlide key={i}>
        <img src={url} alt={""}></img>
      </SwiperSlide> 
    );
  }
  return slides
}

function Closer ({onCloseCall}) {
  const handleClose = (e) => {
    onCloseCall()
  }
  return <i className="fas fa-times" id="closebox" onClick={handleClose}></i>
}

const SwiperBox = ({sources, activeIndex, onCloseCall}) => {
  const slides = Slides(sources)

  const handleClose = () => {
    onCloseCall()
  }

  return <div id="box">
      <Swiper  
        id="main" 
        navigation
        keyboard
        onKeyPress={(swiper, keyCode) => {return keyCode === 27 ? handleClose() : null }}
        spaceBetween={5}
        autoHeight={true}
        onSwiper={(swiper) => {swiper.slideTo(activeIndex, 0)}}
        >
        {slides}
      </Swiper >
      <Closer onCloseCall={handleClose}/>
    </div>
}

// Map Gallery Grip and build HTML markup for : images, blocks, gallery
function galleryMapper (sources) {
  function imagesLeft (sources, map) {
      const b8 = map.b8 * 8
      const b4 = map.b4 * 4
      const b2 = map.b2 * 2
      const b1 = map.b1
      const totalMappedCount = b8 + b4 + b2 + b1
      const imgLeft = sources.length - totalMappedCount
      return imgLeft
  }
  // define number of blocs for map
  let map = {b8: 0, b4: 0, b2: 0, b1: 0}
  if (sources.length > 0) {
    // Count 8 blocks and push to map
    map.b8 = Math.trunc(sources.length / 8)
    // If images left >= 4 add one 4block to map
    if (imagesLeft(sources, map) >= 4) {map.b4 = 1}
    // If images left >= 2, add one 2block to map
    if (imagesLeft(sources, map) >= 2) {map.b2 = 1}
    // If images left >= 1, add one 1block to map
    if (imagesLeft(sources, map) >= 1) {map.b1 = 1}
    // Function : Count mapped images, return images left to map
  }
  return map
}

function blocksSlicer (sources, map) {
  // Function for slicing sources and get back blocks of sources in a list
  const sliceBlock = (blockSize) => {
      sliceStart = sliceStop
      sliceStop = sliceStart + blockSize
      const block = sources.slice(sliceStart, sliceStop)
      // const markupBlock = this.createBlock(block, blockKey, blockSize)
      return block
  }
  let galleryBlocks = []
  // blockKey to increment for each new block
  // let blockKey = 0
  // Slices starting values
  let sliceStart = 0
  let sliceStop = 0
  // If more than 8 images, loop and build 8blocks
  if (map.b8) {
      let i
      for (i = 0; i < map.b8; i++) {
        galleryBlocks.push(sliceBlock(8))
      }
  }
  // For other mapping values, build one block if needed
  if (map.b4) {galleryBlocks.push(sliceBlock(4))}
  if (map.b2) {galleryBlocks.push(sliceBlock(2))}
  if (map.b1) {galleryBlocks.push(sliceBlock(1))}
  return galleryBlocks
}

function ImageMarkup ({element, classIndex, index, onImageClick}) {
  const handleClick = (e) => {
    e.preventDefault()
    if (e.target.tagName === "A") {
        onImageClick(e.target)
    } else {
        onImageClick(e.target.parentNode)
    }
  }
  const imageClass = "img-" + (classIndex + 1)
  const url = ROOT_URL + "images/" + element.src
  const imageStyle = {
      backgroundImage: 'url(' + url + ')'
  }
  console.log(url)
  return <a href={url}
            className={imageClass} 
            style={imageStyle} 
            key={index} 
            name={index} 
            onClick={handleClick}>
    <i className="fas fa-expand"></i>
  </a>
}

function Block ({block, sources, ...props}) {
  let imagesMarkup = []
  // build className for the Block
  const blockClass = "gallery block" + block.length
  // Loop on block sources
  block.forEach((image, index) => {
    // Get back index of the current image in sources
    const imageIndex = sources.indexOf(image)
    imagesMarkup.push(<ImageMarkup 
      element={image} 
      key={index} 
      classIndex = {index}
      index={imageIndex} 
      {...props}/>)
    })
  return <div className={blockClass}>
      {imagesMarkup}
  </div>
}

function GalleryGrid ({sources, onSwiperCall}) {
  // const [sources, setSources] = React.userState(sources)
  const [blocks, setBlocks] = React.useState([])

  React.useEffect(() => {
    const map = galleryMapper(sources)
    const galleryBlocks = blocksSlicer(sources, map)
    let blocksMarkup = []
    galleryBlocks.forEach((block, index) => {
      blocksMarkup.push(<Block 
                        sources={sources}
                        block={block} 
                        key={index} 
                        onImageClick={handleImageClick}/>)
    })
    setBlocks(blocksMarkup)
    // setSources(sources)
  }, [])

  const handleImageClick = (e) => {
    onSwiperCall(e)
  }
  return <React.Fragment>
        {blocks}
      </React.Fragment>
}

// Put all together (Grid layout and LightBox)
function Gallery({galleryTitle}) {
  const [displaySwiper, setDisplaySwiper] = React.useState(false)
  const [imageToShow, setImageToShow] = React.useState('0')
  const [sources, setSources] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  // const SOURCES = buildSources(picsumStartId, numberOfImages)

  React.useEffect(() => {
    const url = ROOT_URL + "api/gallery/" + galleryTitle
    fetch(url).then(res => res.json()).then(data => {
      setSources(data)
      setLoading(false)
    });
  }, []);

  const showSwiper = (e) => {
    setDisplaySwiper(true)
    setImageToShow(e.name)
  }
  
  const hideSwiper = (e) => {
    setDisplaySwiper(false)
  }

  if (loading) {
    return <Loading/>
  } else {
    return <div>
      { displaySwiper && (<SwiperBox 
            sources={sources} 
            activeIndex={imageToShow}
            // onKeyPress={handleKeyPress}
            onCloseCall={hideSwiper}/>)}
      <GalleryGrid sources={sources} onSwiperCall={showSwiper}/>
    </div>
  }
}
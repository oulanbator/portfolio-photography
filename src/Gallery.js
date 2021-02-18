import * as React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {Navigation} from 'swiper';
import "swiper/swiper-bundle.min.css";
import './gallery.css';

SwiperCore.use([Navigation])

function Slides (sources) {
  const slides = [];
  for (let i=0; i < sources.length; i++) {
    slides.push(
      <SwiperSlide key={i}>
        <img src={sources[i].src} alt={""}></img>
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

function SwiperBox ({sources, activeIndex, onCloseCall}) {
  const slides = Slides(sources)

  const handleClose = () => {
    onCloseCall()
  }
  // keyboard: {
  //   enabled: true,
  //   onlyInViewport: false,
  // },
  return <div id="box">
      <Swiper  
        id="main" 
        navigation
        spaceBetween={5}
        autoHeight={true}
        onSwiper={(swiper) => {swiper.slideTo(activeIndex, 0)}}
        >
        {slides}
      </Swiper >
      <Closer onCloseCall={handleClose}/>
    </div>
}

function galleryMapper (sources) {
  // define number of blocs for galleryMap
  let galleryMap = {b8: 0, b4: 0, b2: 0, b1: 0}
  // Count 8 blocks and push to galleryMap
  galleryMap.b8 = Math.trunc(sources.length / 8)
  // If images left (source - countMap), try to add one 4block to map
  if ((sources.length - countGalleryMap(galleryMap)) >= 4) {
      galleryMap.b4 = 1
  }
  // If images left, try to add one 2block to map
  if ((sources.length - countGalleryMap(galleryMap)) >= 2) {
      galleryMap.b2 = 1
  }
  // If images left, try to add one 1block to map
  if ((sources.length - countGalleryMap(galleryMap)) >= 1) {
      galleryMap.b1 = 1
  }
  // Function to count mapped images (blocks in map * images in each block)
  function countGalleryMap (map) {
      const b8 = map.b8 * 8
      const b4 = map.b4 * 4
      const b2 = map.b2 * 2
      const b1 = map.b1
      const totalCount = b8 + b4 + b2 + b1
      return totalCount
  }
  return galleryMap
}

function blocksSlicer (sources, map) {
  // Function for slicing sources and get back blocks
  const sliceBlock = (blockSize) => {
      sliceStart = sliceStop
      sliceStop = sliceStart + blockSize
      const block = sources.slice(sliceStart, sliceStop)
      // const markupBlock = this.createBlock(block, blockKey, blockSize)
      galleryBlocks.push(block)
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
          sliceBlock(8)
      }
  }
  // For other mapping values, build one block if needed
  if (map.b4) {sliceBlock(4)}
  if (map.b2) {sliceBlock(2)}
  if (map.b1) {sliceBlock(1)}

  return galleryBlocks
}

class ImageMarkup extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    e.preventDefault()
    if (e.target.tagName === "A") {
        this.props.onImageClick(e.target)
    } else {
        this.props.onImageClick(e.target.parentNode)
    }
  }

  render () {
    const {element, index} = this.props
    const imageClass = "img-" + (index + 1)
    const imageStyle = {
        backgroundImage: 'url(' + element.src + ')'
    }
    return <a href={element.src} 
              className={imageClass} 
              style={imageStyle} 
              key={index} 
              name={index} 
              onClick={this.handleClick}>
      <i className="fas fa-expand"></i>
    </a>
  }
}

class Block extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    let imagesMarkup = []
    const {block, sources} = this.props
    const blockClass = "gallery block" + block.length
    block.forEach((image, index) => {
      // Get back index of the image in sources
      const imageIndex = sources.indexOf(image)
      imagesMarkup.push(<ImageMarkup element={image} key={index} index={imageIndex} {...this.props}/>)
    })
    return <div className={blockClass}>
        {imagesMarkup}
    </div>
  }
}

class Gallery extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sources: [],
      blocks: [],
      displaySwiper: true,
      imageToShow: ''
    }
    this.handleImageClick = this.handleImageClick.bind(this)
  }

  componentDidMount() {
    const {sources} = this.props
    const map = galleryMapper(sources)
    const galleryBlocks = blocksSlicer(sources, map)
    let blocksMarkup = []
    galleryBlocks.forEach((block, index) => {
      blocksMarkup.push(<Block 
                        sources={sources}
                        block={block} 
                        key={index} 
                        onImageClick={this.handleImageClick}/>)
    })
    this.setState({
      blocks: blocksMarkup,
      sources: sources
    })
  }

  handleImageClick = (e) => {
    this.props.onSwiperCall(e)
  }

  render () {
    const {blocks} = this.state
    return <React.Fragment>
        {blocks}
      </React.Fragment>
  }
}

function App({galleryTitle}) {
  const [sources, setSources] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [displaySwiper, setDisplaySwiper] = React.useState(false)
  const [imageToShow, setImageToShow] = React.useState('0')

  React.useEffect(() => {
    const url = "/gallery/" + galleryTitle
    fetch(url).then(res => res.json()).then(data => {
      setSources(data)
      setLoading(false)
    });
  }, []);
  console.log(sources)

  const handleSwiper = (e) => {
    setDisplaySwiper(true)
    setImageToShow(e.name)
  }
  const hideSwiper = (e) => {
    setDisplaySwiper(false)
  }
  if (loading) {
    return <h1>Chargement...</h1>
  } else {
    return <div>
      { displaySwiper && (<SwiperBox sources={sources} activeIndex={imageToShow} onCloseCall={hideSwiper}/>)}
      <Gallery sources={sources} onSwiperCall={handleSwiper}/>
    </div>
  }
}

export default App;

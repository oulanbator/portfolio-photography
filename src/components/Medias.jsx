import * as React from 'react'
import {Loading, RootUrl} from './Utils'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {Navigation, Keyboard} from 'swiper';
import "swiper/swiper-bundle.min.css";
import "./medias.css"

SwiperCore.use([Navigation, Keyboard])

const ROOT_URL = RootUrl()

const SwiperBox = ({sources, activeIndex, onClose, onDelete, onRotation}) => {
    const [modalSources, setModalSources] = React.useState(sources)
    const [index, setIndex] = React.useState(activeIndex)
    const [loading, setLoading] = React.useState(false)
  
    const handleClose = () => {
        onClose()
    }
    const handleDeleteClick = () => {
        setLoading(true)
        // fetch endpoint
        const url = ROOT_URL + "api/medias/delete/" + modalSources[index]
        fetch(url).then(res => res.json()).then(data => {
            if (data.status === "success") {
                let newIndex = false
                let newSources = [...modalSources]
                // calculate new index, depending on current image
                if (index < modalSources.length) {
                    newIndex = index
                } else if (index === modalSources.lenght) {
                    newIndex = index - 1
                }
                newSources.splice(index, 1)
                // send index of the deleted image to the parent
                onDelete(index)
                // Change states
                setModalSources(newSources)
                setIndex(newIndex)
                setLoading(false)
            } else if (data.status === "aborted") {
                const galleries = data.galleries
                const message = 'Cette image est utilisée dans les galeries suivantes : \n' + galleries + '\nSupprimer les images de ces galleries, ou supprimer les galleries concernées.' 
                alert(message)
                setLoading(false)
            }
        });
    }
    const handleRotateImage = () => {
        // const activeSlide = document.querySelector(".swiper-slide-active")
        setLoading(true)
        const url = ROOT_URL + "api/medias/rotate/" + modalSources[index]
        fetch(url).then(res => res.json()).then(data => {
            if (data.status === "success") {
                // send rotation signal to parent component
                onRotation()
                setLoading(false)
                const reloadedLink = ROOT_URL + "images/" + data.source
                const activeSlide = document.querySelector(".swiper-slide-active")
                activeSlide.children[0].src = "" // needed  ?
                activeSlide.children[0].src = reloadedLink
            }
        });
    }

    // Build slides markup
    let slides = [];
    for (let i=0; i < modalSources.length; i++) {
        const url = ROOT_URL + "images/" + modalSources[i]
        slides.push(<SwiperSlide key={i}>
            <img src={url} alt={""}></img>
        </SwiperSlide>)
    }
    // Loading spinner
    if (loading) {
        return <div id="swiper-modal">
            <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    }
    return <div id="swiper-modal">
        <Swiper  
            id="main" 
            navigation
            keyboard
            initialSlide={index}
            onKeyPress={(swiper, keyCode) => {return keyCode === 27 ? handleClose() : null }}
            onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
            spaceBetween={5}
            autoHeight={true} >
            {slides}
        </Swiper >
        <div className="mediasModalTools">
            <a href="#" onClick={handleRotateImage} title="Rotate Image"><i className="fas fa-redo"></i></a>
            <a href="#" onClick={handleDeleteClick} title="Delete Image"><i className="fas fa-trash"></i></a>
            <a href="#" onClick={handleClose} title="Close modal"><i className="fas fa-times-circle"></i></a>
        </div>
      </div>
}

const ImageBlock = ({element, onImageClick}) => {
    const handleClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // Callback for opening swiperbox
        onImageClick(element.src)
    }
    const url = ROOT_URL + "images/" + element.src
    return <div className="media-image-item">
        <a href="#" onClick={handleClick}>
            <img src={url} alt={element.title}/>
            <div className="media-image-hover">Edit image</div>
        </a>
    </div>
}

function Medias () {
    const [medias, setMedias] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [sources, setSources] = React.useState([])
    const [showModal, setShowModal] = React.useState(false)
    const [modalImageIndex, setModalImageIndex] = React.useState(false)

    React.useEffect(() => {
        const url = ROOT_URL + "api/medias"
        fetch(url).then(res => res.json()).then(data => {
            setMedias(data)
            setLoading(false)
        });
    }, []);

    const handleDelete = (index) => {
        let mediaList = [...medias]
        mediaList.splice(index, 1)
        setMedias(mediaList)
    }

    const handleOpenModal = (sourceImage) => {
        let activeIndex = false
        let mediasSources = []
        for (let i = 0; i < medias.length; i++) {
            mediasSources.push(medias[i].src)
            if (medias[i].src === sourceImage) {
                activeIndex = i 
            }
        }
        setSources(mediasSources)
        setModalImageIndex(activeIndex)
        setShowModal(true)
    }
    const handleCloseModal = (url) => {
        setShowModal(false)
    }
    const handleRotation = () => {
        // Trick for reloading medias after image rotated
        const sources = medias
        setMedias([])
        setMedias([...sources])
    }

    if (loading) {
        return <Loading/>
    } else {
        // Build image blocks
        const imagesLi = []
        medias.forEach((img, i) => {
            imagesLi.push(<ImageBlock key={i} element={img} onImageClick={handleOpenModal}/>)
        })
        return <div><h1>Medias</h1>
            <div className="media-image-list">
                {imagesLi}
            </div>
            {showModal ? <SwiperBox
                sources={sources}
                activeIndex={modalImageIndex} 
                onDelete={handleDelete} 
                onRotation={handleRotation}
                onClose={handleCloseModal}
                /> : null}
        </div>
    }
}

export default Medias;
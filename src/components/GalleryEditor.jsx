import * as React from 'react'
import "./editor.css"
import {RootUrl} from "./Utils"
export default GalleryEditor;

const ROOT_URL = RootUrl()

// function HeaderBlock ({title, description, cover, onHeadersChange, onSave, onCancel, mediasList}) {
//     const handleTitleChange = (e) => {
//         const header = "title"
//         onHeadersChange(header, e)
//     }
//     const handleImageChange = (e) => {
//         const header = "image"
//         onHeadersChange(header, e)
//     }
//     const handleDescriptionChange = (e) => {
//         const header = "description"
//         onHeadersChange(header, e)
//     }
//     const handleSave = (e) => {
//         onSave()
//     }
//     const handleCancel = (e) => {
//         onCancel()
//     }
//     let image_url = ""
//     if (mediasList.indexOf(cover) > -1) {
//         image_url = ROOT_URL + "images/" + cover
//     } else {
//         image_url = ROOT_URL + "images/default.png"
//     }

//     return <div className="editor-header">
//         <h2>Gallery Editor</h2>
//         <span className="row">
//             <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
//             <button className="btn btn-success" onClick={handleSave}>Save Changes</button>
//         </span>
//         <div className="row">
//             <div className="imageBloc">
//                 <img src={image_url} alt=""/>
//             </div>
//             <form>
//                 <label htmlFor="title" className="form-label">Title</label>
//                 <input className="form-control" id="title" type="text" value={title} onChange={handleTitleChange}/>
//                 <label htmlFor="image-url" className="form-label">Image Url</label>
//                 <input className="form-control" id="image-url" type="text" value={cover} onChange={handleImageChange}/>
//                 <label htmlFor="description" className="form-label">Description</label>
//                 <textarea className="form-control" id="description" rows="3" value={description} onChange={handleDescriptionChange}></textarea>
//             </form>
//         </div>
//     </div>
// }

function HeaderBlock ({title, description, cover, onHeadersChange, onSave, onCancel, mediasList}) {
    const handleTitleChange = (e) => {
        const header = "title"
        onHeadersChange(header, e)
    }
    const handleImageChange = (e) => {
        const header = "image"
        onHeadersChange(header, e)
    }
    const handleDescriptionChange = (e) => {
        const header = "description"
        onHeadersChange(header, e)
    }
    const handleSave = (e) => {
        onSave()
    }
    const handleCancel = (e) => {
        onCancel()
    }
    let image_url = ""
    if (mediasList.indexOf(cover) > -1) {
        image_url = ROOT_URL + "images/" + cover
    } else {
        image_url = ROOT_URL + "images/default.png"
    }

    return <div className="editor-header">
        <div className="header-title">
            <h2>Gallery Editor</h2>
        </div>
        <div className="header-buttons">
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            <button className="btn btn-success" onClick={handleSave}>Save Changes</button>
        </div>
        <div className="header-image">
            <img src={image_url} alt=""/>
        </div>
        <div className="header-form">
            <form>
                <label htmlFor="title" className="form-label">Title</label>
                <input className="form-control" id="title" type="text" value={title} onChange={handleTitleChange}/>
                <label htmlFor="image-url" className="form-label">Image Url</label>
                <input className="form-control" id="image-url" type="text" value={cover} onChange={handleImageChange}/>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" rows="3" value={description} onChange={handleDescriptionChange}></textarea>
            </form>
        </div>
    </div>
}

function ImageBlock ({img_url, isGallery, onAdd, onRemove, onCoverChange, usedImg}) {
    let isUsed = false
    if (!isGallery) {
        if (usedImg.indexOf(img_url) > -1) {
            isUsed = true
        }
    }
    const handleSelectCover = () => {
        onCoverChange(img_url)
    }
    const handleAdd = () => {
        onAdd(img_url)
    }
    const handleRemove = () => {
        onRemove(img_url)
    }
    const url = ROOT_URL + "images/" + img_url
    return <div className="image-item">
        <img src={url} alt="Gallery image"/>
        {!isGallery && !isUsed && <button className="btn btn-info" onClick={handleAdd}>Add</button>}
        {!isGallery && isUsed && <button className="btn btn-danger" onClick={handleRemove}>Remove</button>}
        {isGallery && <button className="btn btn-danger" onClick={handleRemove}>Remove</button>}
        <a href="#" onClick={handleSelectCover} title="Select as Gallery cover image"><i className="fas fa-image"></i></a>
    </div>
}

function ImageList ({sources, isGallery, onAdd, onRemove, onCoverChange, usedImg=[]}) {
    const imagesLi = []
    sources.forEach((img, i) => {
        imagesLi.push(<ImageBlock 
            key={i} 
            img_url={img} 
            isGallery={isGallery}
            usedImg={usedImg}
            onAdd={onAdd}
            onRemove={onRemove} 
            onCoverChange={onCoverChange} />)
    })
    return <div className="image-list">
        {imagesLi}
    </div>
}

function GalleryEditor ({title, onCancel}) {
    const originalTitle = React.useRef({ref: title})
    const [usedImages, setUsedImages] = React.useState([])
    const [medias, setMedias] = React.useState([])
    const [galleryTitle, setGalleryTitle] = React.useState(title)
    const [cover, setCover] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        const url = ROOT_URL + "api/gallery/" + title
        fetch(url).then(res => res.json()).then(data => {
            let sources = [] 
            data.forEach(img => {
                sources.push(img.src)
            })
            setUsedImages(sources)
        });
    }, []);
    React.useEffect(() => {
        const url = ROOT_URL + "api/galleryInfo/" + title
        fetch(url).then(res => res.json()).then(data => {
            setDescription(data.description)
            setCover(data.firstImage)
        });
    }, []);
    React.useEffect(() => {
        const url = ROOT_URL + "api/medias"
        fetch(url).then(res => res.json()).then(data => {
            let sources = [] 
            data.forEach(img => {
                sources.push(img.src)
            })
            setMedias(sources)
        });
    }, []);

    const handleHeadersChange = (header, e) => {
        if (header === "title") {
            setGalleryTitle(e.target.value)
        } else if (header === "image") {
            setCover(e.target.value)
        } else if (header === "description") {
            setDescription(e.target.value)
        }
    }
    const handleCoverChange = (img_url) => {
        setCover(img_url)
    }
    const handleCancelChanges = () => {
        onCancel()
    }
    const handleSaveGallery = () => {
        let request = new XMLHttpRequest()
        const checkStatus = () => {
            if (request.readyState < 4) {
                setLoading(true)
            } else if (request.readyState == 4) {
                const response = JSON.parse(request.response)
                setLoading(false)
                if (response.status === "success") {
                    onCancel()
                } else if (response.status === "aborted") {
                    alert('Aborted : this gallery title is already used.')
                }
            }
        }
        let form = new FormData()
        form.append("originalTitle", originalTitle.current.ref)
        form.append("title", galleryTitle)
        if (medias.indexOf(cover) > -1) {
            form.append("cover", cover)
        } else {
            form.append("cover", "default.png")
        }
        form.append("description", description)
        let galleryImages = []
        for (let i = 0; i < usedImages.length; i++) {
            galleryImages.push(usedImages[i])
        }
        form.append("images", galleryImages)
        request.onreadystatechange = checkStatus
        request.open("POST", ROOT_URL + "api/saveGallery")
        request.send(form)
    }
    const handleAddImage = (img_url) => {
        setUsedImages([...usedImages, img_url])
    }
    const handleRemoveImage = (img_url) => {
        let mediaList = [...usedImages]
        let index = 0
        usedImages.forEach((media, i) => {
            if (media === img_url) {
                index = i
            }
        })
        mediaList.splice(index, 1)
        setUsedImages(mediaList)
    }
    return <div>
            <HeaderBlock title={galleryTitle} 
                description={description} 
                cover={cover}
                onHeadersChange={handleHeadersChange}
                onSave={handleSaveGallery}
                onCancel={handleCancelChanges}
                mediasList={medias}/>
            {/* <HeaderBlock title={title} description={description} cover={cover}/> */}
            <h3>Gallery</h3>
            <ImageList isGallery={true} sources={usedImages} onRemove={handleRemoveImage} onCoverChange={handleCoverChange}/>
            <h3>Medias</h3>
            <ImageList isGallery={false} sources={medias} usedImg={usedImages} onAdd={handleAddImage} onRemove={handleRemoveImage} onCoverChange={handleCoverChange}/>
            {/* <p>Not used images : {medias}</p> */}
        </div>
}
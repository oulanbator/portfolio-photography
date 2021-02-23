import * as React from 'react'
import "./gallery.css"
export default GalleryEditor;

function copyToClipboard(source) {
    let field = document.createElement("textarea");
    document.body.appendChild(field);
    field.value = source;
    field.select();
    document.execCommand("copy");
    document.body.removeChild(field);
    console.log(source)
    alert("Url of the image has been copied to clipboard !")
}

function HeaderBlock ({title, description, cover, onHeadersChange, onSave, onCancel}) {
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
    if (cover) {
        image_url = "http://portfolio-photographie-api.herokuapp.com/images/" + cover
    }

    return <div className="editor-header">
        <h2>Gallery Editor</h2>
        <span className="row">
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            <button className="btn btn-success" onClick={handleSave}>Save Changes</button>
        </span>
        <div className="row">
            <div className="imageBloc">
                <img src={image_url} alt=""/>
            </div>
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

function ImageBlock ({img_url, isGallery, onAdd, onRemove}) {
    const handleCopyUrl = () => {
        copyToClipboard(img_url)
    }
    const handleAdd = () => {
        onAdd(img_url)
    }
    const handleRemove = () => {
        onRemove(img_url)
    }
    const url = "http://portfolio-photographie-api.herokuapp.com/images/" + img_url
    return <div className="image-item">
        <img src={url} alt="Gallery image"/>
        {!isGallery && <button className="btn btn-info" onClick={handleAdd}>Add</button>}
        {isGallery && <button className="btn btn-danger" onClick={handleRemove}>Remove</button>}
        <a href="#" onClick={handleCopyUrl} title="Copy relative link to clipboard"><i className="fas fa-copy"></i></a>
    </div>
}

function ImageList ({sources, isGallery, onAdd, onRemove}) {
    const imagesLi = []
    sources.forEach((img, i) => {
        imagesLi.push(<ImageBlock 
            key={i} 
            img_url={img} 
            isGallery={isGallery}
            onAdd={onAdd}
            onRemove={onRemove} />)
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
        const url = "http://portfolio-photographie-api.herokuapp.com/api/gallery/" + title
        fetch(url).then(res => res.json()).then(data => {
            let sources = [] 
            data.forEach(img => {
                sources.push(img.src)
            })
            setUsedImages(sources)
        });
    }, []);
    React.useEffect(() => {
        const url = "http://portfolio-photographie-api.herokuapp.com/api/galleryInfo/" + title
        fetch(url).then(res => res.json()).then(data => {
            setDescription(data.description)
            setCover(data.firstImage)
        });
    }, []);
    React.useEffect(() => {
        const url = "http://portfolio-photographie-api.herokuapp.com/api/medias"
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
                console.log(response)
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
        form.append("cover", cover)
        form.append("description", description)
        let galleryImages = []
        for (let i = 0; i < usedImages.length; i++) {
            galleryImages.push(usedImages[i])
        }
        form.append("images", galleryImages)
        request.onreadystatechange = checkStatus
        request.open("POST", "http://portfolio-photographie-api.herokuapp.com/api/saveGallery")
        request.send(form)
        console.log("save")
    }
    const handleAddImage = (img_url) => {
        let mediaList = [...medias]
        let index = 0
        medias.forEach((media, i) => {
            if (media === img_url) {
                index = i
            }
        })
        mediaList.splice(index, 1)
        setUsedImages([...usedImages, img_url])
        setMedias(mediaList)
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
        setMedias([img_url, ...medias])
    }
    return <div>
            <HeaderBlock title={galleryTitle} 
                description={description} 
                cover={cover}
                onHeadersChange={handleHeadersChange}
                onSave={handleSaveGallery}
                onCancel={handleCancelChanges}/>
            {/* <HeaderBlock title={title} description={description} cover={cover}/> */}
            <h3>Gallery</h3>
            <ImageList isGallery={true} sources={usedImages} onRemove={handleRemoveImage}/>
            <h3>Medias</h3>
            <ImageList isGallery={false} sources={medias} onAdd={handleAddImage}/>
            {/* <p>Not used images : {medias}</p> */}
        </div>
}
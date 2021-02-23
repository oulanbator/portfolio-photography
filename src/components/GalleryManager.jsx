import * as React from 'react'
import GalleryEditor from './GalleryEditor'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './gallery.css'
export default Manager;

function NewGalleryButton ({onNewGallery}) {
    const handleClick = (e) => {
        e.preventDefault()
        onNewGallery()
    }
    return <li>
        <div id="AddNewButton">
            <a href="#" className="btn btn-info" onClick={handleClick}>
                <h2>Add new Gallery</h2>
                <h2><i className="fas fa-plus deleteImage"></i></h2>
            </a>
        </div>
    </li>
}

function GalleryBlock ({source, onDelete, onEdit}) {
    const handleDelete = (e) => {
        e.preventDefault()
        onDelete(source.title)
    }
    const handleEdit = (e) => {
        e.preventDefault()
        onEdit(source.title)
    }
    // console.log(source)
    const url = "http://portfolio-photographie-api.herokuapp.com/images/" + source.firstImage
    const altText = "Gallery " + source.title + " - Cover Thumbnail"
    return <li>
            <img src={url} alt={altText} />
            <div className="gallery-body">
                <h5>{source.title}</h5>
                <a href="#" className="btn btn-warning" onClick={handleEdit}>Edit</a>
                <a href="#" className="btn btn-danger" onClick={handleDelete}>Delete</a>
            </div>
        </li>
}

function Manager () {
    // STATES
        // Global
    const [galleries, setGalleries] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [reload, setReload] = React.useState(0)
        // Modal
    const [show, setShow] = React.useState(false);
    const [titleValue, setTitleValue] = React.useState('')
    const [imageValue, setImageValue] = React.useState('')
        // Editor
    const [showEditor, setShowEditor] = React.useState(false)

    //  COMPONENT MOUNT
    React.useEffect(() => {
        const url = "http://portfolio-photographie-api.herokuapp.com/api/galleries"
        fetch(url).then(res => res.json()).then(data => {
            setGalleries(data)
            setLoading(false)
        });
    }, [reload]);

    // HANDLERS
        // Modal
    const onTitleChange = (e) => setTitleValue(e.target.value);
    const onImageChange = (e) => setImageValue(e.target.value);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setTitleValue('')
        setImageValue('')
        setShow(false);
    }
        // Global
    const handleCreateNewGallery = () => {
        const url = "http://portfolio-photographie-api.herokuapp.com/api/createGallery?title=" + titleValue + "&firstImage=" + imageValue
        handleClose()
        fetch(url).then(res => res.json()).then(data => {
            console.log(data.status)
            if (data.status === "success") {
                setReload(c => c + 1)
            } else if (data.status === "aborted") {
                alert('Aborted : this gallery title is already used.')
            }
        });
    }
    const handleDeleteGallery = (title) => {
        const url = "http://portfolio-photographie-api.herokuapp.com/api/deleteGallery/" + title
        fetch(url).then(res => res.json()).then(data => {
            console.log(data.status)
            if (data.status === "success") {
                setReload(c => c + 1)
            } else if (data.status === "aborted") {
                alert('Problem occured... Contact developper')
            }
        });
    }
    const handleEditGallery = (title) => {
        setShowEditor(title)
    }
    const handleCloseEditor = () => {
        setShowEditor(false)
        setReload(c => c + 1)
    }

    // RENDER
    if (loading) {
        return <h1>Chargement...</h1>
    } else {
        const galleryLi = []
        galleries.forEach((gallery, i) => {
            galleryLi.push(<GalleryBlock key={i} 
                source={gallery} 
                onDelete={handleDeleteGallery}
                onEdit={handleEditGallery}/>)
        })
        return <React.Fragment>
                {(!showEditor) && <div>
                    <h1>Gallery Manager</h1>
                    <ul id="GalleryList">
                        {galleryLi}
                        <NewGalleryButton onNewGallery={handleShow}/>
                    </ul>
                </div>}
                {(showEditor) && <GalleryEditor title={showEditor} onCancel={handleCloseEditor}/>}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="form-group mb-4">
                        <label htmlFor="new_gallery_title" className="form-label">Gallery title</label>
                        <input type="text" 
                            id="new_gallery_title" 
                            name="new_gallery_title" 
                            value={titleValue} 
                            onChange={onTitleChange} 
                            className="form-control" />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="new_gallery_image" className="form-label">Gallery Cover Image</label>
                        <input type="text" 
                            id="new_gallery_image" 
                            name="new_gallery_image" 
                            value={imageValue} 
                            onChange={onImageChange} 
                            className="form-control" />
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleCreateNewGallery}>
                            Create New Gallery
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
    }
}
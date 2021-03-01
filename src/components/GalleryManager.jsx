import * as React from 'react'
import GalleryEditor from './GalleryEditor'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {Loading, RootUrl} from './Utils'
import './galleryManager.css'
export default Manager;

const ROOT_URL = RootUrl()

function NewGalleryButton ({onNewGallery}) {
    const handleClick = (e) => {
        e.preventDefault()
        onNewGallery()
    }
    return <div id="AddNewButton">
            <a href="#" className="btn btn-outline-warning" onClick={handleClick}>
                <h2>Add new Gallery</h2>
                <i className="fas fa-plus"></i>
            </a>
        </div>
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
    const url = ROOT_URL + "images/" + source.firstImage
    const altText = "Gallery " + source.title + " - Cover Thumbnail"
    return <div className="GalleryItem">
            <img src={url} alt={altText} />
            <div className="gallery-body">
                <h5>{source.title}</h5>
                <a href="#" className="btn btn-warning" onClick={handleEdit}>Edit</a>
                <a href="#" className="btn btn-danger" onClick={handleDelete}>Delete</a>
            </div>
        </div>
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
    // const [imageValue, setImageValue] = React.useState('')
        // Editor
    const [showEditor, setShowEditor] = React.useState(false)

    //  COMPONENT MOUNT
    React.useEffect(() => {
        const url = ROOT_URL + "api/galleries"
        fetch(url).then(res => res.json()).then(data => {
            setGalleries(data)
            setLoading(false)
        });
    }, [reload]);

    // HANDLERS
        // Modal
    const onTitleChange = (e) => setTitleValue(e.target.value);
    // const onImageChange = (e) => setImageValue(e.target.value);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        // On modal close, reset the states of title and image fields
        setTitleValue('')
        // setImageValue('')
        setShow(false);
    }
        // Global
    const handleCreateNewGallery = () => {
        const url = ROOT_URL + "api/createGallery?title=" + titleValue
        // On validate modal, fetch API endpoint
        fetch(url).then(res => res.json()).then(data => {
            // if API returns success, close modal and reload state, else alert
            const response = JSON.stringify(data)
            if (data.status === "success") {
                handleClose()
                setReload(c => c + 1)
            } else if (data.status === "aborted") {
                alert('Aborted : this gallery title is already used.')
            }
        });
    }
    const handleDeleteGallery = (title) => {
        const url = ROOT_URL + "api/deleteGallery/" + title
        fetch(url).then(res => res.json()).then(data => {
            // if API returns success, reload state
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
        return <Loading/>
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
                    <div id="GalleryList">
                        {galleryLi}
                        <NewGalleryButton onNewGallery={handleShow}/>
                    </div>
                </div>}
                {(showEditor) && <GalleryEditor title={showEditor} onCancel={handleCloseEditor}/>}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new Gallery</Modal.Title>
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
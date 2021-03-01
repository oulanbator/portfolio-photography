import * as React from 'react'
import {Loading, RootUrl} from './Utils'
import "./medias.css"

const ROOT_URL = RootUrl()

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

function ImageBlock ({element, onDelete}) {

    const handleDeleteClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        onDelete(element.src)
    }

    const handleCopyUrl = (e) => {
        copyToClipboard(element.src)
    }

    const url = ROOT_URL + "images/" + element.src
    return <div>
        <img src={url} alt={element.title}/>
        <a href="#" onClick={handleDeleteClick} title="Delete Image"><i className="fas fa-times-circle"></i></a>
    </div>
}

function Medias () {
    const [medias, setMedias] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const url = ROOT_URL + "api/medias"
        fetch(url).then(res => res.json()).then(data => {
            setMedias(data)
            setLoading(false)
        });
    }, []);

    const handleDelete = (source) => {
        console.log(source)
        // const filename = source.replace("images/", "")
        const url = ROOT_URL + "api/medias/delete/" + source
        fetch(url).then(res => res.json()).then(data => {
            if (data.status === "success") {
                let mediaList = [...medias]
                let index = 0
                medias.forEach((media, i) => {
                    if (media.src === source) {
                        index = i
                    }
                })
                mediaList.splice(index, 1)
                setMedias(mediaList)
            } else if (data.status === "aborted") {
                const galleries = data.galleries
                console.log(data.galleries)
                const message = 'Cette image est utilisée dans les galeries suivantes : \n' + galleries + '\nSupprimer les images de ces galleries, ou supprimer les galleries concernées.' 
                alert(message)
            }
        });
    }

    if (loading) {
        return <Loading/>
    } else {
        const imagesLi = []
        medias.forEach((img, i) => {
            imagesLi.push(<ImageBlock key={i} element={img} onDelete={handleDelete}/>)
        })
        return <div><h1>Medias</h1>
            <div id="MediasList">
                {imagesLi}
            </div>
        </div>
    }
}

export default Medias;
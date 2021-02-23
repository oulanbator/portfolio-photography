import * as React from 'react'
import "./medias.css"

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

    const url = "http://portfolio-photographie-api.herokuapp.com/images/" + element.src
    return <li>
        <img src={url} alt={element.title}/>
        <a href="#" onClick={handleDeleteClick} title="Delete Image"><i className="fas fa-times-circle"></i></a>
        <a href="#" onClick={handleCopyUrl} title="Copy relative link to clipboard"><i className="fas fa-copy"></i></a>
    </li>
}

function Medias () {
    const [medias, setMedias] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const url = "http://portfolio-photographie-api.herokuapp.com/api/medias"
        fetch(url).then(res => res.json()).then(data => {
            setMedias(data)
            setLoading(false)
        });
    }, []);

    const handleDelete = (source) => {
        console.log(source)
        // const filename = source.replace("images/", "")
        const url = "http://portfolio-photographie-api.herokuapp.com/api/medias/delete/" + source
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
        return <h1>Chargement...</h1>
    } else {
        const imagesLi = []
        medias.forEach((img, i) => {
            imagesLi.push(<ImageBlock key={i} element={img} onDelete={handleDelete}/>)
        })
        return <div><h1>Medias</h1>
            <ul id="MediasList">
                {imagesLi}
            </ul>
        </div>
    }
}

export default Medias;
import React, { Component } from 'react';
import {Loading, RootUrl} from './Utils'
import "./upload.css"


const ROOT_URL = RootUrl()

// OLD Class object (keeping for bug fixing)


// class DragAndDrop extends Component {
//   dropRef = React.createRef()
//   state = {
//       drag: false
//   }
//   handleDrag = (e) => {
//       e.preventDefault()
//       e.stopPropagation()
//   }
//   handleDragIn = (e) => {
//       e.preventDefault()
//       e.stopPropagation()
//       this.dragCounter++
//       if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
//           this.setState({drag: true})
//       }
//   }
//   handleDragOut = (e) => {
//       e.preventDefault()
//       e.stopPropagation()
//       this.dragCounter--
//       if (this.dragCounter === 0) {
//           this.setState({drag: false})
//       }
//   }
//   handleDrop = (e) => {
//       e.preventDefault()
//       e.stopPropagation()
//       this.setState({drag: false})
//       if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//           this.props.handleDrop(e.dataTransfer.files)
//           e.dataTransfer.clearData()
//           this.dragCounter = 0    
//       }
//   }
//   componentDidMount() {
//       this.dragCounter = 0
//       let div = this.dropRef.current
//       div.addEventListener('dragenter', this.handleDragIn)
//       div.addEventListener('dragleave', this.handleDragOut)
//       div.addEventListener('dragover', this.handleDrag)
//       div.addEventListener('drop', this.handleDrop)
//   }
//   componentWillUnmount() {
//       let div = this.dropRef.current
//       div.removeEventListener('dragenter', this.handleDragIn)
//       div.removeEventListener('dragleave', this.handleDragOut)
//       div.removeEventListener('dragover', this.handleDrag)
//       div.removeEventListener('drop', this.handleDrop)
//   }
//   render() {
//       return (
//           <div style={{display: 'inline-block', position: 'relative'}}
//           ref={this.dropRef}>
//               {/* DragHover */}
//               {this.state.drag &&
//               <div style={{
//                   border: 'dashed grey 4px',
//                   backgroundColor: 'rgba(0,0,0,.8)',
//                   position: 'absolute',
//                   top: 0,
//                   bottom: 0,
//                   left: 0, 
//                   right: 0,
//                   zIndex: 9999
//                   }}>
//                   <div style={{
//                       position: 'absolute',
//                       top: '50%',
//                       right: 0,
//                       left: 0,
//                       textAlign: 'center',
//                       color: 'grey',
//                       fontSize: 36
//                   }}>
//                       {/* <div>drop here :)</div> */}
//                   </div>
//               </div>}
//               {/* Children Div with file list */}
//               {this.props.children}
//           </div>
//       )
//       }
// }

// function FileUpload () {
//     const [rawFiles, setRawFiles] = React.useState([])
//     const [fileNames, setFileNames] = React.useState([])
//     const [loading, setLoading] = React.useState(false)

//     const onFilesSelected = (e) => {
//         console.log(e.target.files)
//         const selectedFiles = e.target.files
//         let fileList = fileNames
//         let rawFileList = rawFiles
//         for (let i = 0; i < selectedFiles.length; i++) {
//             fileList.push(selectedFiles[i].name) 
//             rawFileList.push(selectedFiles[i])
//         }
//         setFileNames([...fileList])
//         setRawFiles([...rawFileList])
//     }
//     const onDrop = (files) => {
//         let fileList = fileNames
//         let rawFileList = rawFiles
//         for (let i = 0; i < files.length; i++) {
//             fileList.push(files[i].name) 
//             rawFileList.push(files[i])
//         }
//         setFileNames([...fileList])
//         setRawFiles([...rawFileList])
//     }

//     const handleUpload = () => {
//         let request = new XMLHttpRequest()
//         const checkStatus = () => {
//             if (request.readyState < 4) {
//                 setLoading(true)
//             } else if (request.readyState == 4) {
//                 setFileNames([])
//                 setRawFiles([])
//                 setLoading(false)
//             }
//         }
//         let form = new FormData()
//         for (let i = 0; i < rawFiles.length; i++) {
//             form.append(i.toString(), rawFiles[i])
//         }
//         request.onreadystatechange = checkStatus
//         request.open("POST", ROOT_URL + "api/uploadFile")
//         request.send(form)
//     }
//     if (loading) {
//         return <Loading/>
//     } else {
//         return (<React.Fragment>
//             <div id="file-select">
//                 <button className="btn btn-outline-info">Select files</button>
//                 <input type="file" multiple onChange={onFilesSelected}/>
//             </div>
//             <button className='btn btn-info' onClick={handleUpload}>Upload Files</button>
//             <h1>(or drag files here below)</h1>
//             <div>
//                 <DragAndDrop handleDrop={onDrop}>
//                     <div id="DropZone" style={{height: 300, width: 600}}>
//                         {fileNames.map((file, i) => {return <div key={i}>{file}</div>})}
//                     </div>
//                 </DragAndDrop>
//             </div>
//         </React.Fragment>)
//     }
// }

// class Upload extends Component {
//   render() {
//     return (
//       <div className="Upload">
//         <FileUpload />
//       </div>
//     )
//   }
// }

const DropZone = ({onDrop}) => {
    const showDropZone = () => {
        // target dropzone, extend width and height
        let dropZone = document.querySelector(".dropZone")
        dropZone.style.width = "100%"
        dropZone.style.height = "100%"
    }
    const hideDropZone = () => {
        // target dropzone, reduce width and height
        let dropZone = document.querySelector(".dropZone")
        dropZone.style.width = "0px"
        dropZone.style.height = "0px"
    }
    const handleOver = (e) => {
        // Don't really know why this function, but actually needed for well working
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDragOut = (e) => {
        // On drag out, hide dropzone, changing state and calling back related useEffect Hook
        e.preventDefault()
        e.stopPropagation()
        hideDropZone();
    }
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // On drop, hide drop zone and send data to "onDrop" Callback
        hideDropZone()
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop(e.dataTransfer.files)
            // why clear dataTransfert ?
            e.dataTransfer.clearData()  
        }
    }
    React.useEffect(() => {
        // On window dragEnter, show dropzone
        window.addEventListener('dragenter', showDropZone)
        // Target drop zone and add listeners
        let dropZone = document.querySelector(".dropZone")
        dropZone.addEventListener('dragover', handleOver);
        dropZone.addEventListener('dragleave', handleDragOut);
        dropZone.addEventListener('drop', handleDrop);
    }, [])

    return <div className="dropZone"></div>
}

const Upload = () => {
    const [rejectedFiles, setRejectedFiles] = React.useState([])
    const [rawFiles, setRawFiles] = React.useState([])
    const [fileNames, setFileNames] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    const validateFiles = (files) => {
        // build empty lists
        let validFiles = []
        let invalidFiles = []
        // loop on files received
        for (let i = 0; i < files.length; i++) {
            // if image type, push to validFiles list 
            if (files[i].type === "image/png" || files[i].type === "image/jpeg") {
                validFiles.push(files[i])
            // other types, push to invalidFiles list
            } else {
                invalidFiles.push(files[i])
            }
        }
        // Return the to lists
        return [validFiles, invalidFiles]
    }

    const handleFilesSelected = (e) => {
        // Same process as FilesDropped. Let's use it
        handleFilesDropped(e.target.files)
    }

    const handleFilesDropped = (files) => {
        // Clean rejectedFiles state
        setRejectedFiles([])
        // Validate received files
        const fileValidation = validateFiles(files)
        const validFiles = fileValidation[0]
        const invalidFiles = fileValidation[1]
        // Get back in local vars the files states
        let fileList = fileNames
        let rawFileList = rawFiles
        // Loop on files dropped
        for (let i = 0; i < validFiles.length; i++) {
            // Push filenames for rendering
            fileList.push(validFiles[i].name) 
            // push validFiles for form processing
            rawFileList.push(validFiles[i])
        }
        // Update files states
        setFileNames([...fileList])
        setRawFiles([...rawFileList])
        // If some rejected files, get back its names and update state too
        if (invalidFiles.length > 0) {
            let badFiles = []
            for (let i = 0; i < invalidFiles.length; i++) {
                badFiles.push(invalidFiles[i].name)
            }
            setRejectedFiles(badFiles)
        }
    }
    const handleUpload = () => {
        // Clean rejectedFiles state
        setRejectedFiles([])
        // Build request
        let request = new XMLHttpRequest()
        // callback function to monitor response from API
        const checkStatus = () => {
            if (request.readyState < 4) {
                // while readystate < 4, change loading to true
                setLoading(true)
            } else if (request.readyState == 4) {
                // when response back, clean file lists states, change loading to false
                setFileNames([])
                setRawFiles([])
                setLoading(false)
            }
        }
        // Build new form
        let form = new FormData()
        // Append data to form
        for (let i = 0; i < rawFiles.length; i++) {
            form.append(i.toString(), rawFiles[i])
        }
        // prepare listening for response with checkstatus callback
        request.onreadystatechange = checkStatus
        // setup the request and send form through it
        request.open("POST", ROOT_URL + "api/uploadFile")
        request.send(form)
    }

    if (loading) {
        return <Loading/>
    } else {
        return <div className="Upload">
        <DropZone onDrop={handleFilesDropped}/>
        <h1>Upload images</h1>
        <h2>(select or drag files to add)</h2>
        {/* Dropped file list */}
        <div className="Upload_fileList">
            {fileNames.map((file, i) => {return <div key={i}>{file}</div>})}
        </div>
        {/* Rejected file list */}
        {(rejectedFiles.length > 0) ? 
        <div className="Upload_rejectedFileList">
            <p>Some files were not dropped  correctly : <br/>(only .jpg .jpeg and .png files accepted)</p>
            {rejectedFiles.map((file, i) => {return <div key={i}>{file}</div>})}
        </div> : null}
        {/* Button controls */}
        <div className="Upload_controls">
            <div className="Upload_fileSelectButton">
                <button className="btn btn-outline-info">Select files</button>
                <input type="file" multiple onChange={handleFilesSelected}/>
            </div>
            <div className="Upload_fileUploadButton">
                <button className='btn btn-info' onClick={handleUpload}>Upload Files</button>
            </div>
        </div>
    </div>
    }
}

export default Upload;
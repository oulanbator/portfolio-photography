import React, { Component } from 'react';
import {Loading, RootUrl} from './Utils'
import "../styles.css"

const ROOT_URL = RootUrl()

class DragAndDrop extends Component {
  dropRef = React.createRef()
  state = {
      drag: false
  }
  handleDrag = (e) => {
      e.preventDefault()
      e.stopPropagation()
  }
  handleDragIn = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.dragCounter++
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
          this.setState({drag: true})
      }
  }
  handleDragOut = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.dragCounter--
      if (this.dragCounter === 0) {
          this.setState({drag: false})
      }
  }
  handleDrop = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.setState({drag: false})
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.props.handleDrop(e.dataTransfer.files)
          e.dataTransfer.clearData()
          this.dragCounter = 0    
      }
  }
  componentDidMount() {
      this.dragCounter = 0
      let div = this.dropRef.current
      div.addEventListener('dragenter', this.handleDragIn)
      div.addEventListener('dragleave', this.handleDragOut)
      div.addEventListener('dragover', this.handleDrag)
      div.addEventListener('drop', this.handleDrop)
  }
  componentWillUnmount() {
      let div = this.dropRef.current
      div.removeEventListener('dragenter', this.handleDragIn)
      div.removeEventListener('dragleave', this.handleDragOut)
      div.removeEventListener('dragover', this.handleDrag)
      div.removeEventListener('drop', this.handleDrop)
  }
  render() {
      return (
          <div style={{display: 'inline-block', position: 'relative'}}
          ref={this.dropRef}>
              {/* DragHover */}
              {this.state.drag &&
              <div style={{
                  border: 'dashed grey 4px',
                  backgroundColor: 'rgba(0,0,0,.8)',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0, 
                  right: 0,
                  zIndex: 9999
                  }}>
                  <div style={{
                      position: 'absolute',
                      top: '50%',
                      right: 0,
                      left: 0,
                      textAlign: 'center',
                      color: 'grey',
                      fontSize: 36
                  }}>
                      {/* <div>drop here :)</div> */}
                  </div>
              </div>}
              {/* Children Div with file list */}
              {this.props.children}
          </div>
      )
      }
  }

function FileUpload () {
  const [rawFiles, setRawFiles] = React.useState([])
  const [fileNames, setFileNames] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  function onDrop (files) {
      let fileList = fileNames
      let rawFileList = rawFiles
      for (let i = 0; i < files.length; i++) {
          fileList.push(files[i].name) 
          rawFileList.push(files[i])
          // if (!files[i].name) {
          //     fileList.push(files[i].name) 
          //     rawFileList.push(files[i])
          // }
      }
      setFileNames([...fileList])
      setRawFiles([...rawFileList])
  }

  const handleUpload = () => {
    let request = new XMLHttpRequest()
    const checkStatus = () => {
        if (request.readyState < 4) {
            setLoading(true)
        } else if (request.readyState == 4) {
            setFileNames([])
            setRawFiles([])
            setLoading(false)
        }
    }
    let form = new FormData()
    for (let i = 0; i < rawFiles.length; i++) {
        form.append(i.toString(), rawFiles[i])
    }
    
    request.onreadystatechange = checkStatus
    request.open("POST", ROOT_URL + "api/uploadFile")
    request.send(form)
  }
  if (loading) {
      return <Loading/>
  } else {
    return (<React.Fragment>
        <div>
            <DragAndDrop handleDrop={onDrop}>
                <div id="DropZone" style={{height: 300, width: 600}}>
                    {fileNames.map((file, i) => {return <div key={i}>{file}</div>})}
                </div>
            </DragAndDrop>
        </div>
        <button className='btn btn-info' onClick={handleUpload}>Upload Files</button>
    </React.Fragment>)
  }
}


class Upload extends Component {
  render() {
    return (
      <div className="Upload">
        <h1>Drag Files Here</h1>
        <FileUpload />
      </div>
    )
  }
}
export default Upload;
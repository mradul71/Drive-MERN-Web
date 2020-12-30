import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function FolderScreen(props) {

    const parentId = props.match.params.id;
    const [subFolders, setSubFolders] = useState([]);
    const [subFolderss, setSubFolderss] = useState(["1"]);
    const [subFiles, setSubFiles] = useState([]);
    const [fileName, setFileName] = useState(null);
    const [folderName, setFolderName] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            const {data} = await axios.get("/folder/"+parentId);
            setSubFolders(data.folders);
            setSubFiles(data.files);
        }
        fetchData();
        return () => {
        }
    }, [subFolderss] || [])
    

    const submitFileHandler = async () => {
      const data = new FormData();
      
        data.append(
          "myfile", fileName
        ); 
      
        console.log(data);

        const result = await axios.post("/createfile/"+parentId, data);
      if(result){
        console.log("added");
        window.location.reload(false);
      }
      return <div>Hello</div>
    }
  
      const submitFolderHandler = async () => {
        const result = await axios.post("/createfolder", {name: folderName, parentId});
        if(result){
          console.log("added");
          window.location.reload(false);
        }
        return <div>Hello</div>
      }

    return (
        <div>
          <div className="forms">
          <div className="file-form">
              <h2 className="heading">Create File</h2>
              <input id="upload" type="file" onChange={(e) => setFileName(e.target.files[0])} />
              <button className="submit" type="submit" onClick={submitFileHandler}>Submit</button>
            </div>
            <br></br>

            <div className="folder-form">
              <h2 className="heading">Create Folder</h2>
              <input type="text" onChange={(e) => setFolderName(e.target.value)} />
              <button className="submit" type="submit" onClick={submitFolderHandler}>Submit</button>
            </div>
          </div>
          <div className="activities-grid">
          {
                  subFolders.map(item => (
                    <Link onClick={() => setSubFolderss([])} to={"/folder/" + item._id} >
                      <div className="folder" key={item._id}><img src="/images/folder.png" /><h2 key={item._id}>{item.name}</h2></div>
                    </Link>
                  ))
                }
            {
                subFiles.map((file) => (
                  <div className="file" key={file._id} id="link"><a href={file.downloadURL}><img src="/images/file.png" />{file.name}</a></div>
                ))
            }
            </div>
        </div>
    )
}

export default FolderScreen

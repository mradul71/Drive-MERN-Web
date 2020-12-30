import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function HomeScreen(props) {

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [folderName, setFolderName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
          const {data} = await axios.get("/data");
          setFolders(data.folders);
          setFiles(data.files);
        }
        fetchData();
      return () => {
        
      }
    }, []);

    const submitFileHandler = async () => {
      const data = new FormData(); 
      
        data.append(
          "myfile", fileName
        ); 

        const result = await axios.post("/createfile", data);
      if(result){
        console.log("added");
        window.location.reload(false);
      }
      return <div>Hello</div>
    }

    const submitFolderHandler = async () => {
      const result = await axios.post("/createfolder", {name: folderName});
      if(result){
        console.log("added");
        window.location.reload(false);
      }
      return <div>Hello</div>
    }

    return (
        <div>
        <h1 className="welcome"><u>Welcome to Own Drive</u></h1>
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
                  folders.map(item => (
                    <Link to={"/folder/" + item._id}>
                      <div className="folder" key={item._id}><img src="/images/folder.png" /><h2>{item.name}</h2></div>
                    </Link>
                  ))
                }
                {
                  files.map(item => (
                      <div className="file" key={item._id} id="link"><a href={`http://localhost:8080/download/` + item.uuid}><img src="/images/file.png" />{item.name}</a></div>
                  ))
                }
            </div>
        </div>
    )
}

export default HomeScreen

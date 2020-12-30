
import HomeScreen from "./HomeScreen";
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import FolderScreen from "./FolderScreen";
import Header from "./Header";

function App() {
  return (
  <BrowserRouter> 
    <Switch>
    <div className="App">
      {/* <Header /> */}
      <Route exact path="/" component={HomeScreen} />
      <Route exact path="/folder/:id" component={FolderScreen} />
    </div>
    </Switch>
  </BrowserRouter>
  );
}

export default App;

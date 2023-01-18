import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import { ThemeProvider } from '@mui/material/styles';
import  theme  from './theme';
import Thanks from './components/Thanks'
import Checkout from './components/Checkout'
export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};


function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      <Switch>
         <Route exact path="/" component={Products} />
         <Route path="/login" component={Login} />
         <Route path="/register" component={Register} />
         <Route path='/checkout' component={Checkout}/>
         <Route path='/thanks' component={Thanks}/>
       </Switch>
      </ThemeProvider>
    </div>
  );
}

export default App;

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack , TextField,Typography,InputAdornment} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import {useHistory} from 'react-router-dom'
import { Search, SentimentDissatisfied } from "@mui/icons-material";

const Header = ({ children, hasHiddenAuthButtons,value }) => {
  const history = useHistory()
  const logOuthandle = () => {
    localStorage.clear()
    window.location.reload()
  }
  var token = !localStorage.getItem('token')
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children ? <TextField
        className="search-desktop "
        size="small"
        sx={{
          width: { sm: 200, md: 300 }
      }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => value(e.target.value) }
      /> : ""}
        { hasHiddenAuthButtons ? (
        <Button className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=> history.push('/')}
        >
          Back to explore
        </Button>) : token ? (<Box>
              <Button onClick={()=>history.push('/login')} variant="text">Login</Button>
              <Button onClick={()=>history.push('/register')} variant="contained">Register</Button>
            </Box>) : <Box display="flex">
            <Stack  direction="row" justifyContent="center"
  alignItems="center" spacing={1}>
              <img  src="avatar.png" alt={localStorage.getItem("username")}/>
              <p>{localStorage.getItem("username")}</p>
              <Button onClick={()=> {logOuthandle() } }  variant="text">Logout</Button>
            </Stack>
            </Box>
        }
      </Box>
    );
};

export default Header;

import { CreditCard, Delete } from "@mui/icons-material";
// import MenuItem from "@material-ui/core/MenuItem";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Menu, MenuItem,
  ListItemText,
  List,
  ListItem
} from "@mui/material";
// import { withStyles } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles';
import MuiListItem from "@mui/material/ListItem";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory   } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/*
 * Return if the request validation passed. If it fails, display appropriate warning message.
 *
 * Validation checks - show warning message with given text if any of these validation fails
 *
 *  1. Not enough balance available to checkout cart items
 *    "You do not have enough balance in your wallet for this purchase"
 *
 *  2. No addresses added for user
 *    "Please add a new address before proceeding."
 *
 *  3. No address selected for checkout
 *    "Please select one shipping address to proceed."
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @param { Addresses } addresses
 *    Contains data on array of addresses and selected address id
 *
 * @returns { Boolean }
 *    Whether validation passed or not
 *
 */


 
 const AdressFound =({address,index,handleClick,selected,deleteAddress})=>{
  return (
    
        // <ListItem
        //   button
        //   selected={selected === index}
        //   onClick={(event) => handleClick(address, index)}
         
        // >
        <Box onClick={(event)=>handleClick(address,index)} m={2}   display= 'flex'
          align-items= 'center'
          justify-content= 'space-between' >
        <ListItemText primary={address.address} />
        <Button
            name='delete'
            startIcon={<Delete />}
            variant="text"
            onClick={()=>deleteAddress(address._id)}
            type='button'

          >
            delete
          </Button>
        
      </Box>
  )
}

const Checkout =  () => {
  const { enqueueSnackbar } = useSnackbar();
  const [items,setItems] = useState([])
  const [products,setProducts] = useState([])
  const [address,setAddress] = useState(null)
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [selectedAddress,setSelectedAddress] = useState('')
  const [showNewAdd,setShownewadd] = useState(false)
  const [newAddress ,setNewaddress] = useState('')
  const history = useHistory()
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setSelectedAddress(event._id)
    // console.log(selectedAddress)
  };
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/");
      enqueueSnackbar('You must be logged in to access checkout page', { variant:"warning" , autoHideDuration: 3000})
    }
    fetch()
    getAddresses()
  },[])
  
  const fetchCart=async(data)=>{
    await axios.get(`${config.endpoint}/cart`,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
    .then((responce)=>{
          var cartInclude=generateCartItemsFrom(responce.data,data)
          setItems(cartInclude)})
  }
  const fetch =async () =>{
    await axios.get(`${config.endpoint}/products`)
    .then((res)=>{
      var data = res.data
      fetchCart(data)
    })
  }
  const getAddresses =async ()=>{
    await axios.get(`${config.endpoint}/user/addresses`,{headers:{"Authorization": `Bearer ${localStorage.getItem('token')}`}})
    .then(res=>{
      setAddress(res.data)
      // console.log(res.data)
    })
  }
  const handler = (e) =>{
    setNewaddress(e.target.value)
    // console.log(newAddress)
  }
  const addAddress = async () =>{
    await axios({
      method: 'post',     //put
      url: `${config.endpoint}/user/addresses`,
      headers: {'Authorization': 'Bearer '+localStorage.getItem('token')}, 
      data: {
        address:newAddress
      }
    }).then(res=>{
      setAddress(res.data)
      setNewaddress('')
      setShownewadd(false)
    }).catch((error)=>{
      enqueueSnackbar(error.response.data.message, { variant:"warning" , autoHideDuration: 3000})
    })
  }
  const deleteAddress= async (id) =>{
    await axios.delete(`${config.endpoint}/user/addresses/${id}`, {
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': 'Bearer '+localStorage.getItem('token')
    }
  }).then((res)=>{
    setAddress(res.data)
    
  }).catch((error)=>{
    enqueueSnackbar(error.response.data.message, { variant:"warning" , autoHideDuration: 3000})
  })
  }
  const validateRequest = (items, addresses,id) => {
    // console.log(id)
    if(getTotalCartValue(items) > localStorage.getItem('balance')){
      enqueueSnackbar('You do not have enough balance in your wallet for this purchase', { variant:"warning" , autoHideDuration: 3000})
      return false
    }
    else if(addresses.length===0){
      enqueueSnackbar('Please add a new address before proceeding.', { variant:"warning" , autoHideDuration: 3000})
      return false
    }
    else if(!id){
      enqueueSnackbar('Please select one shipping address to proceed.', { variant:"warning" , autoHideDuration: 3000})
      return false
    }
    return true
  };
    /**
   * Handler function to perform checkout operation for items added to the cart for the selected address
   *
   * @param { String } token
   *    Login token
   *
   * @param { Array.<CartItem } items
   *    Array of objects with complete data on products added to the cart
   *
   * @param { Addresses } addresses
   *    Contains data on array of addresses and selected address id
   *
   * @returns { Boolean }
   *    If checkout operation was successful
   *
   * API endpoint - "POST /cart/checkout"
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *  "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *  "success": false,
   *  "message": "Wallet balance not sufficient to place order"
   * }
   *
   */
  const performCheckout = async (items, addresses,id) => {
    if(validateRequest(items, addresses,id))
    {await axios({
      method: 'post',     //put
      url: `${config.endpoint}/cart/checkout`,
      headers: {'Authorization': 'Bearer '+localStorage.getItem('token')}, 
      data: {
        addressId:id
      }
    }).then(()=>{
      enqueueSnackbar('Order placed successfully!', { variant:"success" , autoHideDuration: 3000})
      localStorage.setItem('balance', localStorage.getItem('balance')-getTotalCartValue(items) );
      history.push('/thanks')

    }).catch((err)=>{
      enqueueSnackbar(err.response.data.message, { variant:"warning" , autoHideDuration: 3000})
    })
  }
  };
  
  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <List component="nav" aria-label="main mailbox folders" width= "100%">
              {address && !address ? 
              <><Typography>No address found for this account. Please add one to proceed</Typography></>:
                (address && address.map ((ele,ind)=>
                <Box mb='10px' border={selectedIndex === ind ? "1px solid #2ADC0E" : "1px solid #DEDEDE"} bgcolor={selectedIndex===ind ? '#B5FFAA': 'white'} key={ind}>
                  <AdressFound address={ele} index={ind} handleClick ={handleListItemClick} selected={selectedIndex} deleteAddress={deleteAddress}/>
                </Box>))
              }
            </List>
           {showNewAdd ? <Box>
              <TextField
                placeholder="Enter your complete address"
                multiline
                rows={4}
                sx={{width:'100%'}}
                value={newAddress}
                onChange={handler}
              />
              <Box mt={1}>
              <Button variant='contained' role='button' name='add' onClick={addAddress}>Add</Button>
              <Button variant='text' onClick={()=>setShownewadd(false)} >Cancel</Button>
              </Box>
            </Box> : <>
            <Button
              variant="contained"
              name='add'
              onClick={()=>setShownewadd(true)}
              sx={{ textTransform: 'none' }}
            >
              Add new address
            </Button></>}

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={()=> performCheckout(items,address,selectedAddress)}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;

import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, {useCallback, useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import {ProductCard} from './ProductCard'
import Cart from './Cart'
import {generateCartItemsFrom} from './Cart'
/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const {enqueueSnackbar} = useSnackbar()
  const [products,setProduct] = useState(null)
  const [loading,setLoading] = useState(true)
  const [all,setAll] = useState(null)
  const [found,setFound] = useState(true)
  const [cartItem,setCartitem] = useState([])
  const [allproduct,setAllproduct] = useState([])
  useEffect(()=>{
    // if(localStorage.getItem('token')){
    // }else{
      performAPICall ()
      callAll()
      
    // }
  },[])
  const callAll = async ()=>{
    await axios.get(`${config.endpoint}/products`)
    .then((res)=>{
      var dataData = res.data
      setAllproduct(res.data)
      fetchCart(localStorage.getItem('token'),dataData)
    })
  }
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    await axios.get(`${config.endpoint}/products`)
    .then((res)=>{
      // console.log(res.data[0]._id)
      setProduct(res.data)
      // console.log(products)
      setLoading(false)
    }).catch(err=>{
      if(err.response.status >= 400 ){
        enqueueSnackbar(err.response.data.message,{ variant:"error" , autoHideDuration: 3000})
      }
      else{
        enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON',{ variant:"error" , autoHideDuration: 3000})
      }
    })
    
    
  };
  

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    await axios.get(`${config.endpoint}/products/search?value=${text}`)
    .then((res)=>{
      setProduct(res.data)
      setFound(true)
      // console.log(search)
    }).catch(err=>{
      setFound(false)
      setProduct([])
      // console.log(products.length)
    })
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  

  const fetchCart = async (token,data) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      await axios.get(`${config.endpoint}/cart`,{ headers: {"Authorization" : `Bearer ${token}`}})
      .then((res)=>{
        // console.log(data)
        // console.log(res.data)
        setCartitem(res.data)
        var cartInclude=generateCartItemsFrom(res.data,data)
        setAll(cartInclude)
      })
    } catch (e) {
      // console.log(e)
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }

  };



  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return items.find((item)=>item.productId === productId)
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token=localStorage.getItem('token'),
    productId,
    qty,
    items=cartItem,
    products=allproduct,
    options = { preventDuplicate: false }
  ) => {
    var product = all.find((item)=>item._id === productId )
    if(token === null){
      enqueueSnackbar('Login to add an item to the Cart', { variant: "warning" });
    }
    else{
      if(isItemInCart(items,productId)){
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:'warning',autoHideDuration: 2000})
      }else{
        var uppend = products.find((item) => item._id===productId)
        uppend.qty=1
        // console.log(uppend)
        all.push(uppend)
        await axios({
          method: 'post',     //put
          url: `${config.endpoint}/cart`,
          headers: {'Authorization': 'Bearer '+localStorage.getItem('token')}, 
          data: {
            productId: productId, // This is the body part
            qty: 1
          }
        }).then((res)=>{
          // console.log(res.data)
          setCartitem(res.data)
        })
      }
    }
    // console.log(all)
  };
  
  const handleAdd = async  (value) => {
    var product = all.find((item)=>item._id === value._id )
    if(product){
      setAll(
        all.map((item)=>
          item._id===value._id ? 
          {...product , qty:product.qty+1}
          : item
        )
      )
      await axios({
        method: 'post',     //put
        url: `${config.endpoint}/cart`,
        headers: {'Authorization': 'Bearer '+localStorage.getItem('token')}, 
        data: {
          productId: product._id, // This is the body part
          qty: product.qty+1
        }
      }).then((res)=>{
        // console.log(res.data)
        setCartitem(res.data)
      })
    }else{
      
  }
  }
  const handleDelete = async (value) =>{
    var product = all.find((item)=>item._id === value._id )
    if(product.qty === 1){
      setAll(all.filter((item) => item._id !== value._id))
    }
    else{
      setAll(all.map((item)=> item._id===value._id ? {...product,qty:product.qty-1} : item))
    }
    await axios({
      method: 'post',     //put
      url: `${config.endpoint}/cart`,
      headers: {'Authorization': 'Bearer '+localStorage.getItem('token')}, 
      data: {
        productId: product._id, // This is the body part
        qty: product.qty-1
      }
    }).then((res)=>{
      // console.log(res.data)
      setCartitem(res.data)
    })
  }

  const debounceSearch = (event, debounceTimeout) => {
        let timer;
        return function(...args){
          if(timer) clearTimeout(timer)
          timer = setTimeout(()=>{
            timer = null
            event(...args)
          },debounceTimeout)
        }
      };
      
      // console.log(products)
      var token = !localStorage.getItem("token")
      // console.log(localStorage.getItem(token))
      // console.log(token)
      const optimize = useCallback(debounceSearch(performSearch,500),[])
    
      return (
        <div>
          <Header children value={optimize}>
            {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
            
          </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        // value={search}
        onChange={(e) =>optimize(e.target.value) }
      />
       <Grid container direction="row" display='flex'>
         <Grid item className="product-grid" md={!token ?9:12 } xs={!token?12:0}>
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         <Grid container rowSpacing={2} columnSpacing={2} padding={2} display='row'> 
         {
         loading ? (<Grid container margin={2} alignItems="center" justifyContent="center" direction="column">
            <Grid item>
            <Typography><CircularProgress /></Typography>
            </Grid>
            <Grid item>
            <Typography>Loading Products</Typography>
            </Grid>
            </Grid>):<>{found ? 
            (products &&
            products.map((element,index) => (
              <Grid item xs={6} md={3} key={index}>
              <ProductCard product={element} handleAddToCart={addToCart}/>
              </Grid>))) : (<Grid container margin={2} alignItems="center" justifyContent="center" direction="column">
            <Grid item>
            <Typography><SentimentDissatisfied /></Typography>
            </Grid>
            <Grid item>
            <Typography>No products found</Typography>
            </Grid>
            </Grid>)
            }</>
        }
          </Grid>
        </Grid>
        {localStorage.getItem('token')?<Grid item md={3} xs={12} padding={0.5} style={{ backgroundColor: '#E9F5E1' }}>
         {all && <>
         <Cart items={all} handleAdd={handleAdd} handleDelet={handleDelete}/>
         </>}
         
        </Grid> : <></>}
       </Grid>
      <Footer />
    </div>
  );
};

export default Products;

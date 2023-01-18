import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React,{useEffect} from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (arr1, arr2) => {
  // console.log("function called")
  let res = [];
  res = arr2.filter(el => {
    return arr1.find(element => {
       if(element.productId === el._id){
        el.qty=element.qty
       }
       return element.productId === el._id
    });
 });
  return res;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items) => {
  var total = 0
  items.forEach((ele)=>{
    total += ele.cost * ele.qty
  })
  return total
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
}) => {
  

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary"  onClick={e=>handleDelete(value)}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value.qty}
      </Box>
      <IconButton size="small" color="primary"  onClick={e=>handleAdd(value)}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */
const Cart = ({products,items,handleAdd,handleDelet,isReadOnly}) => {
  const history = useHistory()
  const totalQty = (items)=>{
    var total = 0
    if(items.length>0){
      items.map((item)=>{
        total += item.qty
        return total
      })
    }
    return total
  }
  if (items.length===0) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
                
        {items.map((item,index)=>{
          return (<Box display="flex" alignItems="flex-start" padding="1rem" key={index}>
          <Box className="image-container">
              <img
                  // Add product image
                  src={item.image}
                  // Add product name as alt eext
                  alt={item.name}
                  width="100%"
                  height="100%"
              />
          </Box>
          <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
          >
              <div>{item.name}</div>
              <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
              >
              {isReadOnly ? <>
              <Box>
                  <div>Qty:{item.qty}</div>
              </Box>
              </> : <ItemQuantity value={item} handleAdd={handleAdd} handleDelete={handleDelet}/>}
              
              <Box padding="0.5rem" fontWeight="700">
                  <div>${item.cost}</div>
              </Box>
              </Box>
          </Box>
      </Box>)
        })}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {isReadOnly ? <></> : <><Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={()=>history.push('/checkout')}
          >
            Checkout
          </Button>
        </Box></>}
      </Box>
      {isReadOnly ? <Box className="cart" padding="1rem">
      <Box><h3>Order Details</h3></Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" pb='10px'>
          <Box alignSelf="center">
            Products
          </Box>
          <Box
            alignSelf="center"
            data-testid="cart-total"
          >
            {totalQty(items)}
          </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center"pb='10px' >
          <Box alignSelf="center">
            Subtotal
          </Box>
          <Box
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" pb='10px'>
          <Box alignSelf="center">
            Shipping Charges
          </Box>
          <Box
            alignSelf="center"
            data-testid="cart-total"
          >
            $0
          </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" pb='10px' fontWeight="700" fontSize="1.2rem">
          <Box alignSelf="center">
            Total
          </Box>
          <Box
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
      </Box>
      </Box> : <></>}
    </>
  );
};

export default Cart;

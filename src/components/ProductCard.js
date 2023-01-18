import { AddShoppingCartOutlined } from "@mui/icons-material";
import {useState} from 'react'
import {
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import { useSnackbar } from "notistack";


const ProductCard = ({ product, handleAddToCart }) => {
  const {enqueueSnackbar} = useSnackbar()
  // console.log(product.image)
  return (
    <Card className="card" >
        <CardMedia
          component="img"
          height="140"
          image={product.image}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {product.name}
          </Typography>
          <Typography variant="h6" fontWeight='bold'>
            ${product.cost}
          </Typography>
          <Typography><Rating name="read-only" value={product.rating} readOnly /></Typography>
          <Button variant="contained" fullWidth onClick={()=>handleAddToCart(localStorage.getItem('token'),product._id,1)}>ADD TO CART</Button>
        </CardContent>
    </Card>
  );
};

export  {ProductCard};

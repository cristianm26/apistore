import React,{useState} from 'react'
import {useQuery} from 'react-query';
//Componentes
import { Drawer,
  LinearProgress,
  Grid,
  Badge
 } from '@material-ui/core';
import  AddShoppingCartIcon  from '@material-ui/icons/AddShoppingCart';
//Styles
import { Wrapper, StyledButton } from './App.styles';
import Item from './Item/Item';
import Cart from './Cart/Cart'
//Types
export type CartItemType={
        id: number;
        title: string;
        price: number;
        description: string;
        category: string;
        image: string;
        amount: number
}


const getProducts = async ():Promise <CartItemType[]> => 
  await (await fetch('https://fakestoreapi.com/products')).json();


const App = () => {
 const [cartOpen, setCartOpen] = useState(false);
 const [cartItems, setCartItems] = useState([] as CartItemType[])
  const {data, isLoading, error} = useQuery<CartItemType[]>(
    'products', 
    getProducts
    );

  const getTotalItems =(items: CartItemType[])=> 
    items.reduce((ack: number, item)=> ack + item.amount,0);

  const handleAddToCart =(clickedItem: CartItemType)=> {
    setCartItems(prev=> {
      //es el artículo ya agregado en el carrito
      const isItemInCart = prev.find(item=> item.id === clickedItem.id);

      if (isItemInCart) {
          return prev.map(item=> (
            item.id === clickedItem.id ? 
            {...item, amount: item.amount +1} 
            : item
          ))
      } 
      //primera vez que se agrega el artículo
      return [...prev, {...clickedItem, amount: 1}]
    })
  };

  const handleRemoveFromCart =(id: number)=>{
    setCartItems(prev=> (
      prev.reduce((ack, item)=> {
          if (item.id === id)  {
            if (item.amount === 1) return ack;
            return [...ack, {...item, amount: item.amount -1}] 
          }else{
            return [...ack, item]
          }
          
      }, [] as CartItemType[]
      )
    ))
  };

  if (isLoading) return <LinearProgress/>

  if (error) return <div>Algo Salió Mal  </div>
    
  
  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={()=> setCartOpen(false)}>
        <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart} />
      </Drawer>
      <StyledButton onClick={()=> setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
        <AddShoppingCartIcon/>
        </Badge>
      </StyledButton>
      <Grid container spacing={3} >
    {data?.map(item=> (
        <Grid item key={item.id} xs={12} sm={4}  >
            <Item item={item} handleAddToCart={handleAddToCart} />
        </Grid>
    ))}
      </Grid>
    </Wrapper>
  )
}

export default App

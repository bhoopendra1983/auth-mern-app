import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {ToastContainer } from "react-toastify";
import { handleError } from './utils';


function Home(){
        const [loggedInUser,setLoggedInUser]=useState('');
        const navigate =useNavigate();
        const [products,setProducts]=useState('');
        useEffect(()=>{

          setLoggedInUser(localStorage.getItem('loggedInUser'))  
        },[])

     const handleLogout=(e)=>{
          localStorage.removeItem('token');
          localStorage.removeItem('loggedInUser');
          setTimeout(() =>{
            navigate('/login');

          }, 1000)
        }

        const fetchProducts = async() =>{
            try{

                const url = "http://localhost:8080/products";
                const headers ={
                  headers:{
                              'Authorization':localStorage.getItem('token')
                  }
                }
                const response = await fetch(url,headers);
                const result=await response.json();
                console.log(result);
                setProducts(result);
            }catch(err){
                  handleError(err);
            }
        }

              useEffect(()=>{
                  fetchProducts()
              },[])

    return (

        <div>
            <h1>Welcome {loggedInUser}</h1>
            <button className="logoutBtn" onClick={handleLogout}>Logout</button>

            <div>
                {
                   products && products?.map((item)=> (
                    <ul>
                     <span>{item.name}:{item.price}</span>
                    </ul>

                   ))
                    
                }

            </div>
            <ToastContainer/>
        </div>
    )
}

export default Home
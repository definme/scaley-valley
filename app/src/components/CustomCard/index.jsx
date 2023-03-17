import React from 'react';
import Box from '@mui/material/Box'
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import './CustomCard.css';

function CustomCard({kind, description, price}){
    return(
        <Box className="card">
            <img className="card__img" src={kind.image_uri} alt="character image"/>
            <Box className="description">
                <div className="description__text">{description}</div>
            </Box>
            <Box className="card__inner">
                <Typography align="center" sx={{
                    color: "white",
                    fontSize: "20px",
                    borderBottom: " 1px solid #49494B",
                    paddingBottom: "8px",
                    marginBottom: "10px"
                }}>{kind.name}</Typography>
                <Box sx={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center"
                }}>
                    <Box>
                        <Typography variant="caption" color="#616572">Price</Typography>
                        <Typography color="white" fontWeight="bold">{price} {kind.payment_resource.resource_token_name}</Typography>
                    </Box>
                    <button className="card__inner-btn">BUY</button>
                </Box>

            </Box>
        </Box>
    )
}

export default CustomCard;
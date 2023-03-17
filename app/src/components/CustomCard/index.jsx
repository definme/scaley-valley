import React from 'react';
import Box from '@mui/material/Box'
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import './CustomCard.css';

function CustomCard({image, title, description, price}){
    return(
        <Box className="card">
            <img src={image} alt="character image"/>
            <Box className="card__inner">
                <Typography align="center" color={"white"}>{title}</Typography>
                <Typography color={"white"} fontWeight="bold">Price: {price}</Typography>
                {/*<div className="input-wrapper">*/}
                {/*    <Typography color={"white"} fontWeight="bold">I need</Typography>*/}
                {/*    <input className="input-wrapper__input" type="number" min="0"/>*/}
                {/*</div>*/}
                <Button variant="contained" className="card__inner-btn">BUY</Button>
            </Box>
            <Box className="description">
                <div className="description__text">{description}</div>
            </Box>
        </Box>
    )
}

export default CustomCard;
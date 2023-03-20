import React from 'react';
import Box from '@mui/material/Box'
import Typography from "@mui/material/Typography";
// import './CustomCard.css';

function TokenCard({kind}){
    return(
        <Box className="card">
            <img className="card__img" src={kind.image_uri} alt="character image"/>
            <img className="chain__img" src={kind.payment_resource?.spend_resource_chain?.image_uri} alt="chain img"/>
            <Box className="description">
                <div className="description__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consequatur dignissimos dolore dolorem, earum eum ipsa laboriosam,
                    modi neque, odit quibusdam quis voluptatem voluptates?
                    Accusamus aperiam commodi pariatur quos temporibus? Illum.</div>
            </Box>
            <Box className="card__inner">
                <Typography align="center" sx={{
                    color: "white",
                    fontSize: "20px",
                    borderBottom: " 1px solid #49494B",
                    paddingBottom: "8px",
                    marginBottom: "10px"
                }}>Illuminator</Typography>
                <Box>
                    <Box>
                        <Typography variant="caption" color="#616572">Attributes:</Typography>
                        <Typography color="white" marginBottom="20px">20% boost for NFT's level and corresponding area(valley)</Typography>
                    </Box>
                    <button className="card__inner-btn" style={{width: "100%"}}>Travel</button>
                </Box>

            </Box>
        </Box>
    )
}

export default TokenCard;
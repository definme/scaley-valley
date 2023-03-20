import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Resource(){
    return(
        <Box
            sx={{
                width: "282px",
                height: "179px",
                backgroundColor: "#222020",
                borderRadius: "16px"
            }}
        >
            <Typography sx={{
                color: "white",
                fontSize: "32px",
                textAlign: "center"
            }}>

            </Typography>
        </Box>
    )
}
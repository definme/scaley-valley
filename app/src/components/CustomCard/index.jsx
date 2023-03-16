import React from 'react';
import Box from '@mui/material/Box'
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function CustomCard({title, description, price}){

    return(
        <Box sx={{
            border: `1px solid #afafaf`,
            borderRadius: "20px",
            width: "268px",
            height: "600px",
            position: "relative"
        }}>
            <Box p="10px">
                <Typography align="center" textTransform="uppercase">{title}</Typography>
            </Box>

            <Box sx={{
                width: "100%",
                height: "300px",
                bgcolor: "#afafaf"
            }}>
                Img
            </Box>

            <Box sx={{
                p: "15px",
            }}>
                <Typography>{description}</Typography>

                <Box sx={{
                    position: "absolute",
                    bottom: "20px",
                    left: "15px",
                    right: "15px"
                }}>
                    <Typography>Price: {price}</Typography>
                    <Button variant="contained"
                            sx={{
                                fontWeight: "bold",
                                width: "100%"
                            }}
                    >
                        BUY
                    </Button>
                </Box>
            </Box>

        </Box>
    )
}

export default CustomCard;
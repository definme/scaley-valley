import Typography from '@mui/material/Typography'
import Box from "@mui/material/Box";
import Resource from "../../components/Resource";
import TokenCard from "../../components/TokenCard";
import React, {useEffect, useState} from "react";
import {getTokens} from "../../api";
import {ConnectionContext} from "../../contexts/ConnectionContext";

function MyTokens() {
    const [tokens, setTokens] = useState([]);

    const { userAddress } = React.useContext(ConnectionContext);

    function getAllTokens() {
        if(userAddress){
            getTokens(userAddress)
                .then(res => {
                    setTokens(res)
                })
                .catch(e => console.log(e))
        }
    }

    useEffect(() => {
        getAllTokens()
    }, [])

    return (
      <>
          <Typography variant='h4' component='h1' gutterBottom>
              My Tokens
          </Typography>

          <Typography variant='h6'>My Resources</Typography>

          <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "30px"
          }}>
              <Resource/>
              <Resource/>
              <Resource/>
              <Resource/>
          </Box>

          <Typography variant='h6'>My Characters</Typography>

          <Box sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between"
          }}>
              {tokens.map((token, index) => (
                  <TokenCard
                      key={index}
                      {...token}
                  />
              ))}

          </Box>
      </>
  )
}

export default MyTokens

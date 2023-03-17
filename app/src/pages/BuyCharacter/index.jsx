import CustomCard from "../../components/CustomCard";
import Box from "@mui/material/Box";
import {useState, useEffect} from "react";
import {getCharacters} from "../../api";

function BuyCharacter() {
    const [characters, setCharacters] = useState([]);

    function getAllCharacters() {
        getCharacters()
            .then(res => {
                setCharacters(res)
            })
            .catch(e => console.log(e))
    }

    useEffect(() => {
        getAllCharacters()
    }, [])

    return (
      <Box sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px"
      }}>
          {characters.map((character,index) => (
              <CustomCard
                  key={index}
                  // image={'https://scaley-valley.definme.com/images/hermes.png'}
                  // title="Aquatique"
                  description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consequatur dignissimos dolore dolorem, earum eum ipsa laboriosam,
                    modi neque, odit quibusdam quis voluptatem voluptates?
                    Accusamus aperiam commodi pariatur quos temporibus? Illum."
                  // price="100"
                  {...character}
              />
          ))}
      </Box>
  )
}

export default BuyCharacter

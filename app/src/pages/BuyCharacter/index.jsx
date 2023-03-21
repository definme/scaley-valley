import CustomCard from "../../components/CustomCard";
import Box from "@mui/material/Box";
import {useState, useEffect} from "react";
import {getCharacters} from "../../api";
import Typography from "@mui/material/Typography";

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
        <Box>
            <Typography
                sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontStyle: "normal",
                    fontWeight: "600",
                    fontSize: "40px",
                    lineHeight: "48px",
                    textAlign:"center",
                    letterSpacing: "0.01em",
                    color: "white",
                    marginTop: "135px"
                }}
            >
                Buy character
            </Typography>
            <Typography sx={{
                fontFamily: "'Inter', sans-serif",
                fontStyle: "normal",
                fontWeight: "500",
                fontSize: "15px",
                lineHeight: "18px",
                textAlign:"center",
                letterSpacing: "0.01em",
                margin: "12px 0 68px 0",
                color: "#616572"
            }}>
                You can buy one character for 1 network.
            </Typography>

            <Box sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between"
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
                        price="0"
                        {...character}
                    />
                ))}
            </Box>
        </Box>

  )
}

export default BuyCharacter

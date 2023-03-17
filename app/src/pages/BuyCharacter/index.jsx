import CustomCard from "../../components/CustomCard";
import Box from "@mui/material/Box";

function BuyCharacter() {
    return (
      <Box sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px"
      }}>
          {Array.from(Array(4)).map((_,index) => (
              <CustomCard
                  key={index}
                  image={'https://scaley-valley.definme.com/images/hermes.png'}
                  title="Aquatique"
                  description="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consequatur dignissimos dolore dolorem, earum eum ipsa laboriosam,
                    modi neque, odit quibusdam quis voluptatem voluptates?
                    Accusamus aperiam commodi pariatur quos temporibus? Illum."
                  price="100"
              />
          ))}
      </Box>
  )
}

export default BuyCharacter

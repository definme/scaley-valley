import Typography from '@mui/material/Typography'
import CustomCard from "../../components/CustomCard";
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";

function BuyCharacter() {
  return (
      <Box sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px"
      }}>
          {Array.from(Array(8)).map((index) => (
              <CustomCard
                  key={index}
                  title="Aquatique"
                  description="Description"
                  price="100"
              />
          ))}
      </Box>
  )
}

export default BuyCharacter

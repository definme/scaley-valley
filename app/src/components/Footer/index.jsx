import logo from '../../assets/img/definmeLogo.svg';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


export default function Footer(){
    return(
        <>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    bottom: '0'
                }}
            >
                <img src={logo} alt='definmeLogo' style={{
                    margin: '55px 0 16px',
                }}/>
                <Typography sx={{
                    mb: '40px',
                    fontFamily: '"Inter", sans-serif',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '18px',
                    lineHeight: '22px',
                    letterSpacing: '0.01em',
                    color: 'white'
                }}>
                    The project was developed with love by Definme.
                </Typography>
            </Box>
        </>
    )
}
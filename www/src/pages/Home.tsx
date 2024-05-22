import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { Circle } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { route } from "../constant/route"

const Home = () => {
  const navigate = useNavigate()

  return (
    <Box display={"flex"} width={"100%"} flexDirection={"column"} alignItems={"center"}>
      <Box height={"100vh"} width={"100%"} justifyContent={"space-around"} display={"flex"} alignItems={"center"} bgcolor={"#f5ffaa"}>
        <Box width={"40%"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
          <Typography fontWeight={"bold"} fontSize={"30px"}>Welcome to paymentku - Your Best Solution for Digital Transactions!</Typography>
          <Typography fontSize={"14px"}>Enjoy the convenience of handling all your financial transactions in one place. At paymentku, we offer quick, secure, and reliable services for money top-ups, game top-ups, and bill payments.</Typography>
        </Box>
        <Box width={"40%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <img src={"https://res.cloudinary.com/dktwq4f3f/image/upload/v1716381412/transaction-illustration1_wswxgb.png"} width={500} />
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} width={"80%"} alignItems={"center"} p={5} height={"100vh"}>
        <Box width={"30%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <img src="https://res.cloudinary.com/dktwq4f3f/image/upload/v1716382048/easypayment_ndllea.png" width={400} />
        </Box>
        <Box width={"50%"}>
          <Typography fontWeight={"bold"} fontSize={"25px"}>Our Key Features:</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Circle fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText>
                <span style={{ fontWeight: "bold" }}>Money Top-Ups:</span> Easily and instantly top up your digital account balance.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Circle fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText>
                <span style={{ fontWeight: "bold" }}>Game Top-Ups:</span> Get your favorite game credits anytime, anywhere.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Circle fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText>
                <span style={{ fontWeight: "bold" }}>Bill Payments:</span> Pay your electricity, water, internet, and other bills with just a few clicks.
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"space-around"} width={"100%"} mx={10} alignItems={"center"} p={5} height={"100vh"} bgcolor={"#f5ffaa"}>
        <Box width={"50%"}>
          <Typography fontWeight={"bold"} fontSize={"25px"}>Why Choose Us?</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Circle fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText>
                <span style={{ fontWeight: "bold" }}>Guaranteed Security:</span>Our system is equipped with the latest security technology to protect all your transactions.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Circle fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText>
                <span style={{ fontWeight: "bold" }}>Fast and Easy: </span> Quick transaction processes and a user-friendly interface make it easy for you to complete various payments.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Circle fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText>
                <span style={{ fontWeight: "bold" }}>24/7 Customer Service:</span>Our support team is ready to assist you whenever you need it.
              </ListItemText>
            </ListItem>
          </List>
        </Box>
        <Box width={"30%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <img src={"https://res.cloudinary.com/dktwq4f3f/image/upload/v1716342319/chooseus_fac0xl.png"} width={400} />
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"space-around"} width={"80%"} alignItems={"center"} p={5} height={"100vh"}>
        <Box width={"30%"}>
          {/* <img src="https://res.cloudinary.com/dktwq4f3f/image/upload/v1716381830/1307837_etmmv7.jpg" width={400}/> */}
        </Box>
        <Box width={"50%"}>
          <Typography fontWeight={"bold"} fontSize={"25px"}>How it works ?</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Circle fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText>
                <span style={{ fontWeight: "bold" }}>Register or Log In:</span>Create an account or log in to your existing account.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Circle fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText>
                <span style={{ fontWeight: "bold" }}>Select Service:</span> Choose the type of transaction you want to perform, such as money top-up, game top-up, or bill payment.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Circle fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText>
                <span style={{ fontWeight: "bold" }}>Process Payment:</span>Follow the simple and quick payment steps.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Circle fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText>
                <span style={{ fontWeight: "bold" }}>Done :</span>Your transaction will be processed immediately, and you will receive a notification once it's completed.
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </Box>
      <Box display={"flex"} width={"100%"} justifyContent={"center"} height={"80vh"} flexDirection={"column"} alignItems={"center"} bgcolor={"#f5ffaa"}>
        <Box display={"flex"} width={"80%"} textAlign={"center"} p={4} flexDirection={"column"}>
          <Typography fontWeight={"bold"} fontSize={"20px"}>Don't wait any longer, join thousands of other users who have experienced the convenience of digital transactions with paymentku. Enjoy convenience, speed, and security all in one place.</Typography>
        </Box>
        <Box width={"30%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Button variant="contained" color="secondary" sx={{ fontWeight: "bold" }} onClick={() => navigate(route["dashboard"])}>See our product</Button>

        </Box>
      </Box>
    </Box>
  )
}

export default Home
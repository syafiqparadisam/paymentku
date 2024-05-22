import { Box, Typography } from '@mui/material'
import { AccountBalance, CurrencyExchange, Wifi } from '@mui/icons-material'
import CardItemDashboard from '../component/CardItemDashboard'
import Category from '../component/Category';
import toRupiah from '@develoka/angka-rupiah-js';
import mlbbImg from "../assets/ml.jpg"
import freeFireBg from "../assets/ff.jpg"
import pubgImg from "../assets/pubg.png"
import minecraftImg from "../assets/minecraft.webp"
import growtopiaImg from "../assets/growtopia.jpg"
import codmImg from "../assets/codm.jpg"
import smartfrenImg from "../assets/smartfren.jpg"
import plnImg from "../assets/pln.jpg"
import { route } from '../constant/route'

const Dashboard = () => {

  return (
    <>
      <Box display={"flex"} width={"100%"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} mb={10}>

        <Box display={"flex"} width={"100%"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} mt={2}>
          <Box pl={2} pb={2}>
            <Typography fontSize={"30px"} fontWeight={"bold"}>Transaction</Typography>
          </Box>
          <CardItemDashboard card={[
            {
              title: "Topup",
              redirect: route["topup"],
              icon: <AccountBalance style={{ fontSize: "100px" }} color="primary" />,
              desc: `${toRupiah(0, { dot: ",", floatingPoint: 0 })} - ${toRupiah(100000000, { dot: ",", floatingPoint: 0 })}`
            }, {
              title: "Transfer",
              icon: <CurrencyExchange style={{ fontSize: "90px" }} color="warning" />,
              redirect: route["transfer"],
              desc: "Unlimited transfer"
            }]} content='center' />
        </Box>
        <Box width={"100%"} ml={5} mt={5}>
          <Box width={"10%"}>
            <Category menuItem={[{ redirect: route["dashboard"], categories: "All" }, { redirect: route["dashboard"], categories: "Games" }, { redirect: route["dashboard"], categories: "Quota" }]} firstItem="All" />
          </Box>
        </Box>

        <Box display={"flex"} width={"100%"} flexDirection={"column"}>
          <Box p={2}>
            <Typography fontSize={"20px"} fontWeight={"bold"}>Games</Typography>
          </Box>
          <CardItemDashboard
            card={[
              {
                bgImg: "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716341251/ml_og50uc.jpg",
              },
              {
                bgImg: "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716340604/ff_b08hl6.jpg",
              },
              {
                bgImg: "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716340656/pubg_l9dko2.png",
              },
              {
                bgImg: "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716105033/hwseyeswegkwwloth7up.webp"
              },
              {
                bgImg: "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716340610/growtopia_j5rviy.jpg",
              },
              {
                bgImg: "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716340437/codm_pm6ibk.jpg"
              }
            ]}
          />

        </Box>
        <Box display={"flex"} width={"100%"} flexDirection={"column"} mt={5}>
          <Box p={2}>
            <Typography fontSize={"20px"} fontWeight={"bold"}>Pay your bill</Typography>
          </Box>
          <CardItemDashboard
            card={[
              {
                bgImg: "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716341057/pln_pl49n2.jpg"
              },
              {
                title: "Internet quota",
                bgImg: "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716341093/smartfren_fvelte.jpg"
              },
              {
                title: "Wifi",
                icon: <Wifi style={{ fontSize: "120px" }} />
              }
            ]}
          />
        </Box>
      </Box>
    </>
  )
}

export default Dashboard
import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

type Card = {
    img?: string,
    icon?: React.ReactNode,
    alt?: string,
    title?: string,
    desc?: string
    redirect?: string,
    bgImg?: string,
    color?: string
}

const CardItemDashboard: React.FC<{ card: Card[], content?: string }> = ({ card, content }) => {
    const navigate = useNavigate()
    return (
        <>
            <Box width={"100%"} gap={2} mx={2} display={"flex"} justifyContent={content ? content : "flex-start"}>
                {card.map((c: Card) => (
                    <Box flexDirection={"column"} alignItems={"center"} display={"flex"} sx={{ backgroundImage: `url(${c.bgImg})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer" }} borderRadius={"8px"} p={3} width={"15%"} height={"200px"} onClick={() => navigate(c.redirect ? c.redirect : "/dashboard")}>
                        <Typography fontWeight={"bold"} color={c.color ? c.color : "black"} fontSize={"20px"} textAlign={"center"}>{c.title}</Typography>
                        <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} height={"100%"} alignItems={"center"}>
                            {c.img ? <img src={c.img} width={"70%"} alt={c.alt} /> : c.icon}
                        </Box>
                        {c.desc && <Typography fontSize={"15px"} color={c.color ? c.color : "black"} fontWeight={"bold"}>{c.desc}</Typography>}
                    </Box>
                ))}
            </Box>
        </>
    )
}

export default CardItemDashboard
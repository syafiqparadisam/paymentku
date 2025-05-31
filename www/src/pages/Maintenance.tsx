import { ArrowBack } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../services/profileApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../features/user/userSlice";

const Maintenance = () => {
  const navigate = useNavigate();
  const { data, isSuccess: successUser } = useGetUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    (data?.data);
    if (successUser && data?.data) {
      dispatch(setUser(data?.data));
    }
  }, [successUser, data]);
  return (
    <Box
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <img
        src={
          "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716341297/servererror_ol5gkf.jpg"
        }
        width={"500px"}
      />
      <Box
        display={"flex"}
        sx={{ marginTop: "-40px" }}
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Box width={"80%"} mb={2}>
          <Typography
            fontWeight={"bold"}
            fontSize={"30px"}
            textAlign={"center"}
          >
            Sorry something went wrong in our server, we will be recover as soon
            as possible
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate(-2)}
        >
          <ArrowBack style={{ marginRight: "5px" }} />
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default Maintenance;

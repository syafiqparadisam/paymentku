import { ArrowBack } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { TextareaAutosize } from "@mui/base";
import { useState, useEffect } from "react";
import * as yup from "yup";
import {
  Box,
  Button,
  Input,
  Dialog,
  DialogTitle,
  Typography,
  Badge,
  Avatar,
  TextField,
  InputLabel,
  DialogActions,
  DialogContent,
} from "@mui/material";
import {
  useUpdateNameMutation,
  useUpdatePhoneMutation,
  useGetUserQuery,
  useUpdateBioMutation,
} from "../services/profileApi";
import { useLogoutMutation } from "../services/authApi";
import timeStampToLocaleString from "../utils/timeStampToClient";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import toRupiah from "@develoka/angka-rupiah-js";
import UploadFileDialog from "../component/UploadFileDialog";
import Alert from "../component/Alert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  setBio,
  setName,
  setPhoneNumber,
  setUser,
} from "../features/user/userSlice";
import {
  updateBioSchema,
  updateNameSchema,
  updatePhoneSchema,
} from "../utils/validationSchema";

const UserProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  const [updateName, { isSuccess: successUpdateName }] =
    useUpdateNameMutation();
  const [updateBio, { isSuccess: successUpdateBio }] = useUpdateBioMutation();
  const [updatePhone, { isSuccess: successUpdatePhone }] =
    useUpdatePhoneMutation();
  const [logout, { isSuccess: successLogout }] = useLogoutMutation();
  const { data, isSuccess } = useGetUserQuery();

  const [val, setValue] = useState({
    bio: "",
    phoneNumber: "",
    name: "",
  });
  const dispatch = useDispatch();
  const [ui, setUI] = useState({
    alert: false,
    dialog: false,
    uploadFile: false,
  });

  const [err, setErr] = useState({
    bio: "",
    phoneNumber: "",
    name: "",
  });
  
  useEffect(() => {
    console.log(data?.data);
    if (isSuccess && data?.data) {
      dispatch(setUser(data?.data));
      setValue({
        bio: data?.data.bio,
        phoneNumber: data?.data.phone_number,
        name: data?.data.name,
      });
    }
  }, [isSuccess]);

  const navigate = useNavigate();
  useEffect(() => {
    if (successUpdateBio) {
      setErr((prev) => ({ ...prev, bio: "" }));
      dispatch(setBio({ bio: val.bio }));
    }

    if (successUpdatePhone) {
      setErr((prev) => ({ ...prev, phoneNumber: "" }));
      dispatch(setPhoneNumber({ phone_number: val.phoneNumber }));
    }
    if (successUpdateName) {
      setErr((prev) => ({ ...prev, name: "" }));
      dispatch(setName({ name: val.name }));
    }
  }, [successUpdateBio, successUpdateName, successUpdatePhone]);

  return (
    <>
      <UploadFileDialog open={ui.uploadFile} setOpen={setUI} />

      <Alert
        open={ui.alert}
        handleClose={() => setUI((prev) => ({ ...prev, alert: false }))}
        actions={async () => {
          await logout().unwrap();
          if (successLogout) {
            navigate("/signin");
          }
        }}
        title="Logout"
        desc="Are you sure you want to logout ?"
      />

      <Dialog
        open={ui.dialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
          Update
        </DialogTitle>
        <DialogContent>
          <Box display={"flex"} width={"100%"} justifyContent={"center"}></Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
          >
            <Typography fontWeight={"bold"}></Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            type="submit"
            onClick={() => {
              setUI((prev) => ({ ...prev, dialog: false }));
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="success"
            onClick={() => {}}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        display={"flex"}
        width={"100%"}
        position={"relative"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        ml={2}
      >
        <Box
          display={"flex"}
          position={"absolute"}
          top={"20px"}
          gap={1}
          width={"100%"}
          alignItems={"center"}
          onClick={() => navigate(-1)}
        >
          <ArrowBack style={{ marginLeft: "10px", cursor: "pointer" }} />
        </Box>
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"space-around"}
          alignItems={"center"}
        >
          <Box onClick={() => setUI((prev) => ({ ...prev, uploadFile: true }))}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <EditIcon
                  fontSize="large"
                  sx={{
                    borderRadius: "50%",
                    background: "black",
                    color: "white",
                    padding: "5px",
                  }}
                />
              }
            >
              <Avatar
                alt="Travis Howard"
                sx={{ width: "300px", height: "300px" }}
                src={user?.photo_profile}
              />
            </Badge>
          </Box>

          <Box display={"flex"} flexDirection={"column"} width={"30%"}>
            <InputLabel>Username: </InputLabel>
            <Input
              sx={{ marginBottom: "20px" }}
              fullWidth
              value={user?.user}
              // onClick={handleUpdateUsername}
            />
            <InputLabel>Nickname: </InputLabel>
            {err?.name && <Typography color={"red"}>{err.name}</Typography>}
            <Input
              value={val.name}
              onChange={(e) => {
                try {
                  setValue((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                  setErr((prev) => ({ ...prev, name: "" }));
                  updateNameSchema.validateSync({
                    name: e.target.value,
                  });
                } catch (error: any) {
                  if (error instanceof yup.ValidationError) {
                    setErr((prev) => ({ ...prev, name: error.message }));
                    return;
                  }
                }
              }}
              onBlur={async (e) => {
                try {
                  setErr((prev) => ({ ...prev, name: "" }));
                  await updateNameSchema.validate({
                    name: e.target.value,
                  });
                  await updateName({ name: e.target.value });
                } catch (error: any) {
                  if (error instanceof yup.ValidationError) {
                    setErr((prev) => ({ ...prev, name: error.message }));
                    return;
                  }
                }
              }}
            />
          </Box>
        </Box>
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
          py={5}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            width={"30%"}
            pt={3}
          >
            <Typography fontWeight={"bold"}>
              Your balance is{" "}
              {toRupiah(user?.balance, { dot: ",", floatingPoint: 0 })}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            width={"50%"}
            pt={3}
          >
            <label>Account number :</label>
            <TextField
              size="small"
              disabled
              value={user?.accountNumber}
            ></TextField>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            width={"50%"}
            pt={3}
          >
            <label>Email :</label>
            <TextField size="small" disabled value={user?.email}></TextField>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            width={"50%"}
            pt={3}
          >
            <label>Phone number :</label>
            {err?.phoneNumber && (
              <Typography color={"red"}>{err.phoneNumber}</Typography>
            )}
            <TextField
              size="small"
              value={val.phoneNumber}
              placeholder={
                user?.phone_number == null
                  ? "You haven't yet set your phone number"
                  : ""
              }
              onChange={(e) => {
                try {
                  setValue((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }));
                  setErr((prev) => ({ ...prev, phoneNumber: "" }));
                  updatePhoneSchema.validateSync({
                    phoneNumber: e.target.value,
                  });
                } catch (error: any) {
                  if (error instanceof yup.ValidationError) {
                    setErr((prev) => ({ ...prev, phoneNumber: error.message }));
                    return;
                  }
                }
              }}
              onBlur={async (e) => {
                try {
                  setErr((prev) => ({ ...prev, phoneNumber: "" }));
                  await updatePhoneSchema.validate({
                    phoneNumber: e.target.value,
                  });
                  await updatePhone({ phoneNumber: e.target.value });
                } catch (error: any) {
                  if (error instanceof yup.ValidationError) {
                    setErr((prev) => ({ ...prev, phoneNumber: error.message }));
                    return;
                  }
                }
              }}
            ></TextField>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            width={"50%"}
            pt={3}
          >
            <label>Bio :</label>
            {err?.bio && <Typography color={"red"}>{err.bio}</Typography>}
            <TextareaAutosize
              style={{ border: "1px solid black", fontFamily: "sans-serif" }}
              onChange={(e) => {
                try {
                  setValue((prev) => ({ ...prev, bio: e.target.value }));
                  setErr((prev) => ({ ...prev, bio: "" }));
                  const bio = updateBioSchema.validateSync({
                    bio: e.target.value,
                  });
                  console.log(bio);
                } catch (error: any) {
                  if (error instanceof yup.ValidationError) {
                    setErr((prev) => ({ ...prev, bio: error.message }));
                    return;
                  }
                }
              }}
              onBlur={async (e) => {
                try {
                  setErr((prev) => ({ ...prev, bio: "" }));
                  await updateBioSchema.validate({
                    bio: e.target.value,
                  });
                  await updateBio({ bio: e.target.value });
                } catch (error: any) {
                  if (error instanceof yup.ValidationError) {
                    setErr((prev) => ({ ...prev, bio: error.message }));
                    return;
                  }
                }
              }}
              minRows={5}
              value={val.bio}
            ></TextareaAutosize>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-start"}
            width={"100%"}
            pt={3}
          >
            <Typography fontWeight={"bold"}>
              This account was created at{" "}
              {timeStampToLocaleString(user?.created_at || new Date())}
            </Typography>
          </Box>
          <Box display={"flex"} flexDirection={"row"} mt={7} gap={2}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setUI((prev) => ({ ...prev, alert: true }));
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UserProfile;

import { ArrowBack } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { TextareaAutosize } from "@mui/base";
import { useState, useEffect } from "react";
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
  // useUpdateNameMutation,
  // useUpdateBioMutation,
  // useUpdatePhoneMutation,
  useGetUserQuery,
} from "../services/profileApi";
import {
  //   useDeleteAccountMutation,
  useLogoutMutation,
  //   useUpdateUsernameMutation,
} from "../services/authApi";
import timeStampToLocaleString from "../utils/timeStampToClient";
// import { useValidation } from "../hooks/useValidation";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import toRupiah from "@develoka/angka-rupiah-js";
import UploadFileDialog from "../component/UploadFileDialog";
// import useAlert from "../hooks/useAlert";
import Alert from "../component/Alert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setUser } from "../features/user/userSlice";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  updateUsernameSchema,
} from "../utils/validationSchema";

const UserProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  // const [updateName, { isSuccess: successUpdateName }] =
  //   useUpdateNameMutation();
  // const [updateBio, { isSuccess: successUpdateBio }] = useUpdateBioMutation();
  // const [updatePhone, { isSuccess: successUpdatePhone }] =
  //   useUpdatePhoneMutation();
  // const [updateUser, { isSuccess: successUpdateUser }] =
  //   useUpdateUsernameMutation();
  const [logout, { isSuccess: successLogout }] = useLogoutMutation();
  // const [deleteAccount, { isSuccess: successDeleteAccount }] =
  //   useDeleteAccountMutation();
  // const [label, setLabel] = useState("");
  // const [valueInput, setValue] = useState("");
  const { data, isSuccess } = useGetUserQuery();
  const dispatch = useDispatch();
  const [ui, setUI] = useState({
    alert: false,
    dialog: false,
    uploadFile: false,
  });

  
  const resolver = yupResolver(updateUsernameSchema);
  const { handleSubmit} = useForm({ resolver });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setUser(data?.data));
    }
  }, [isSuccess]);
  // const {
  //   handleUpdateUsername,
  //   setValueForUsername,
  //   validateInput,
  //   cleanUp,
  //   label,
  //   open,
  //   value,
  //   valueForUsername,
  //   updateVal,
  //   totalInput,
  //   openModal,
  //   validatePhoneNumber,
  //   valueForPassword,
  //   setValueForPassword,
  // } = useValidation();

  const navigate = useNavigate();
  // useEffect(() => {
  //   cleanUp();
  //   setErr("");

  //   if (successUpdateBio) {
  //     dispatch(setBio());
  //   }
  // }, [
  //   successUpdateBio,
  //   successUpdateName,
  //   successUpdatePhone,
  //   successUpdateUser,
  // ]);

  // // Memilih schema validasi berdasarkan currentLabel
  // const currentSchema = useMemo(() => {
  //   switch (currentLabel) {
  //     case "username":
  //       return updateUsernameSchema;
  //     case "name":
  //       return updateNameSchema;
  //     case "Bio":
  //       return updateBioSchema;
  //     case "Phone number":
  //       return updatePhoneSchema;

  //     default:
  //       return z.object({}); // Schema kosong jika tidak ada label yang cocok
  //   }
  // }, [currentLabel]);

  // async function handleSubmit() {
  //   try {
  //     switch (label) {
  //       case "username":
  //         const {
  //           success: successUsername,
  //           error: errUsername,
  //           trimmedval,
  //         } = validateInput(valueForUsername);
  //         if (!successUsername) {
  //           throw { data: { message: errUsername } };
  //         }
  //         await updateUser({
  //           username: trimmedval,
  //           password: valueForPassword,
  //         }).unwrap();
  //         break;
  //       case "name":
  //         const {
  //           success: successName,
  //           error: errName,
  //           trimmedval: nameVal,
  //         } = validateInput(value);

  //         if (!successName) {
  //           throw { data: { message: errName } };
  //         }
  //         await updateName({ name: nameVal }).unwrap();
  //         break;
  //       case "Bio":
  //         await updateBio({ bio: value }).unwrap();

  //         break;
  //       case "Phone number":
  //         const {
  //           success: successPhone,
  //           error: errPhone,
  //           trimmedval: phoneVal,
  //         } = validatePhoneNumber(value);
  //         if (!successPhone) {
  //           throw { data: { message: errPhone } };
  //         }
  //         await updatePhone({ phoneNumber: phoneVal }).unwrap();
  //         break;
  //       case "delete account":
  //         await deleteAccount({ password: value }).unwrap();
  //         break;
  //       default:
  //         throw new Error("Something went wrong");
  //     }
  //   } catch (e) {
  //     setErr(e);
  //   }
  // }

  const onSubmits = async (data: FieldValues) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <>
      <UploadFileDialog
        open={ui.uploadFile}
        setOpen={() => setUI((prev) => ({ ...prev, uploadFile: true }))}
      />

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
        <form onSubmit={handleSubmit(onSubmits)}>
          <DialogContent>
            <Box display={"flex"} width={"100%"} justifyContent={"center"}>
              {/* {err && (
              <Typography
                color={"red"}
                textAlign={"center"}
                fontWeight={"bold"}
                fontSize={"15px"}
              >
                {err?.data?.message}
              </Typography>
            )} */}
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
              <Typography fontWeight={"bold"}>
                {/* {label === "username" || label === "delete account"
                ? "If you're login with google, Please don't fill password field"
                : ""} */}
              </Typography>
              {/* <InputLabel htmlFor={label}>{label} :</InputLabel>
            {label != "Bio" ? (
              <TextField
                sx={{ fontWeight: "bold", fontSize: "15px" }}
                defaultValue={label === "username" ? valueForUsername : value}
                onChange={(e) => {
                  if (label === "username") {
                    setValueForUsername(e.target.value);
                  } else {
                    updateVal(e.target.value);
                  }
                }}
              />
            ) : (
              <>
                <TextareaAutosize
                  id={label}
                  style={{
                    border: "1px solid black",
                    fontFamily: "sans-serif",
                  }}
                  minRows={5}
                  defaultValue={user?.bio}
                  onChange={(e) => {
                    updateVal(e.target.value);
                  }}
                ></TextareaAutosize>
              </>
            )} */}
            </Box>
            {/* {totalInput > 1 && (
            <Box display={"flex"} flexDirection={"column"} width={"100%"}>
              <InputLabel
                sx={{ fontWeight: "bold", fontSize: "15px" }}
                htmlFor="pass"
              >
                Password :
              </InputLabel>
              <TextField
                id="pass"
                type="password"
                onChange={(e) => {
                  setValueForPassword(e.target.value);
                }}
              />
            </Box>
          )} */}
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
        </form>
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
            <InputLabel>Name: </InputLabel>
            <Input
              value={user?.name}
              // onClick={(e: MouseEvent<HTMLDivElement, MouseEvent> | any) => {
              //   openModal(e.target.value, "name");
              // }}
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
            <TextField
              size="small"
              value={user?.phone_number}
              placeholder={
                user?.phone_number == null
                  ? "You haven't yet set your phone number"
                  : ""
              }
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
            <TextareaAutosize
              style={{ border: "1px solid black", fontFamily: "sans-serif" }}
              onChange={() => {}}
              minRows={5}
              value={user?.bio ? user?.bio : "You don't have a bio"}
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
              Logout aja
            </Button>
            <Button
              variant="contained"
              color="error"
              // onClick={(e: MouseEvent<HTMLButtonElement, MouseEvent> | any) => {
              //   openModal(e.target.value + "", "delete account");
              // }}
            >
              Delete account
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UserProfile;

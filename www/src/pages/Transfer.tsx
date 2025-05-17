import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  InputLabel,
  TextField,
  TextareaAutosize,
  Typography,
  DialogTitle,
  Backdrop,
  Snackbar,
} from "@mui/material";
import { useFindAccountMutation } from "../services/profileApi";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import timeStampToLocaleString from "../utils/timeStampToClient";
import { useSelector } from "react-redux";
// @ts-ignore
import toRupiah from "@develoka/angka-rupiah-js";
import { useTransferMutation } from "../services/transactionApi";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import { User } from "../types/response";

const Transfer = () => {
  const [accNum, setAccNum] = useState<string>("");
  const user: User = useSelector((state: RootState) => state.user);
  const [err, setErr] = useState<any>({ data: { message: "" } });
  const [errAmount, setErrAmount] = useState<any>();
  const [amount, setAmount] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [
    transfer,
    {
      data: dataTransfer,
      error: errTransfer,
      isSuccess: successTransfer,
      isLoading,
    },
  ] = useTransferMutation();
  const [accountNumber, { data, isSuccess }] = useFindAccountMutation();
  useEffect(() => {
    if (accNum.length == 0) return;
    if (!/^\d+$/.test(accNum)) {
      setErr({ data: { message: "Please fill right account number" } });
      return;
    }
    setErr({ data: { message: " " } });
    accountNumber({accNum: Number(accNum)}).unwrap()
  }, [accNum]);

  const navigate = useNavigate();

  useEffect(() => {
    if (amount.length == 0) return;
    if (!/^\d+$/.test(amount)) {
      setErrAmount({ data: { message: "Please enter right amount" } });
      return;
    }
    if (amount.length > 9) {
      setErrAmount({
        data: { message: "Cannot transfer larger than billion" },
      });
      return;
    }
    setErrAmount({ data: { message: "" } });
  }, [amount]);

  useEffect(() => {
    if (successTransfer) {
      setOpenSnackbar(true);
    }
  }, [errTransfer, successTransfer]);

  return (
    <>
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          key={"top" + "center"}
          autoHideDuration={3000}
          color="success"
          message={dataTransfer?.message}
        />
      )}
      {/* {errTransfer?.} */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={() => setOpen(false)}
      ></Backdrop>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontWeight={"bold"}>
          Confirm payment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" fontWeight={"bold"}>
            Do you really want to transfer{" "}
            {toRupiah(Number(amount), { dot: ",", floatingPoint: 0 })} from{" "}
            {data?.data?.user} ??
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="error"
          >
            No
          </Button>
          <Button
            variant="contained"
            disabled={isLoading == false ? false : true}
            color="success"
            onClick={() => {
              transfer({
                accountNumber: Number(accNum),
                notes,
                amount: Number(amount),
              });
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Box
          display={"flex"}
          gap={1}
          alignItems={"center"}
          onClick={() => navigate(-1)}
          width={"100%"}
          pt={2}
        >
          <ArrowBack style={{ marginLeft: "10px", cursor: "pointer" }} />
        </Box>
        <Box
          width={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          p={3}
          display={"flex"}
          flexDirection={"column"}
        >
          <Typography fontWeight={"bold"} fontSize={"30px"}>
            Transfer
          </Typography>
          {errTransfer && (
            <Typography color={"red"} fontSize={"20px"} fontWeight={"bold"}>
              {(errTransfer as any).data.message}
            </Typography>
          )}
        </Box>
        <Box
          width={"100%"}
          p={3}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"flex-start"}
        >
          <Box
            width={"50%"}
            flexDirection={"column"}
            display={"flex"}
            justifyContent={"center"}
          >
            <InputLabel sx={{ fontWeight: "bold" }}>Find account :</InputLabel>
            <Box display={"flex"} width={"100%"} flexDirection={"column"}>
              <Box display={"flex"} gap={2} width={"100%"}>
                <TextField
                  placeholder="0123456789"
                  fullWidth
                  onChange={(e) => setAccNum(e.target.value)}
                />
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    try {
                      accNum.length == 0
                        ? null
                        : await accountNumber({
                            accNum: Number(accNum),
                          }).unwrap();
                    } catch (error) {
                      setErr(error);
                    }
                  }}
                >
                  Find
                </Button> */}
              </Box>
              <Box>
                {err?.data?.message !== "" && (
                  <Typography color={"red"}>{err?.data?.message}</Typography>
                )}
              </Box>
            </Box>
            {err?.data?.statusCode === 404 && (
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                p={8}
              >
                <Typography color={"red"} fontWeight={"bold"} fontSize={"20px"}>
                  {err.data.message}
                </Typography>
              </Box>
            )}
            {isSuccess && data?.data != null ? (
              <>
                <Box
                  width={"100%"}
                  p={2}
                  height={"200px"}
                  borderRadius={"20px"}
                  border={"1px solid #333"}
                  my={5}
                  flexDirection={"column"}
                  display={"flex"}
                >
                  <img
                    src={data.data.photo_profile}
                    style={{ borderRadius: "100%" }}
                    width={"40px"}
                    height={"40px"}
                  />
                  <Typography mt={1} fontWeight={"bold"}>
                    User :{" "}
                    <span style={{ fontWeight: "" }}>{data.data.user}</span>
                  </Typography>
                  <Typography>Name : {data.data.name}</Typography>
                  <Typography>
                    Account number : {data.data.accountNumber}
                  </Typography>
                  <Typography>
                    Created at : {timeStampToLocaleString(data.data.created_at)}
                  </Typography>
                </Box>
              </>
            ) : null}
          </Box>
          <Box
            width={"50%"}
            flexDirection={"column"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Box
              width={"70%"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"flex-start"}
              justifyContent={"center"}
            >
              <Box width={"100%"}>
                <InputLabel>Amount : </InputLabel>
                <TextField
                  placeholder="Rp. 0"
                  value={amount}
                  fullWidth
                  onChange={(e: any) => {
                    setAmount(e.target.value);
                  }}
                />
              </Box>
              {errAmount?.data?.message !== "" && (
                <Typography color={"red"}>
                  {errAmount?.data?.message}
                </Typography>
              )}
              <Box width={"100%"} pt={3}>
                <InputLabel>Notes : </InputLabel>
                <TextareaAutosize
                  placeholder={`example: Hello ${
                    data?.data?.user == null ? "" : data.data.user
                  }`}
                  style={{ width: "100%" }}
                  value={notes}
                  minRows={7}
                  onChange={(e: any) => {
                    setNotes(e.target.value);
                  }}
                />
              </Box>
            </Box>
            <Box
              width={"70%"}
              mt={2}
              p={2}
              display={"flex"}
              flexDirection={"column"}
              border={"1px solid black"}
              borderRadius={"10px"}
            >
              <Typography fontWeight={"bold"} color={"green"}>
                Information :
              </Typography>
              <Typography>To : {data?.data?.user}</Typography>
              <Typography>To Account : {data?.data?.accountNumber}</Typography>
              <Typography>From : {user.user}</Typography>
              <Typography>
                Current balance :{" "}
                {toRupiah(user.balance, { dot: ",", floatingPoint: 0 })}
              </Typography>
              <Typography>
                Amount :{" "}
                {toRupiah(amount == "" ? 0 : amount, {
                  dot: ",",
                  floatingPoint: 0,
                })}
              </Typography>
              <Typography>Notes : {notes}</Typography>
            </Box>
            <Box
              width="70%"
              display={"flex"}
              py={2}
              justifyContent={"flex-end"}
            >
              <Button
                variant="contained"
                disabled={isSuccess ? false : true}
                color="success"
                onClick={() => {
                  if (errAmount.data.message === "") {
                    setOpen(true);
                  }
                }}
              >
                Transfer
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Transfer;

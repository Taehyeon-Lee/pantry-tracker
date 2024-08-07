"use client";
import {
  Box,
  Stack,
  Typography,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  setDoc,
  doc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  /*
  a function that get all vegetables from vegetables table when loading
  the page first
  */
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "Vegetables"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    // get all inventory items
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    // set inventory with retrieved data from firebase
    setInventory(inventoryList);
  };

  /*
  a function that add item to the database. If not exits then create
  if exists, update the count
  */
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "Vegetables"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      setDoc(docRef, { count: 1 });
    }
    console.log("Successfully add itme");

    await updateInventory();
  };

  /*
  a function that removes item from the database. If the count is equal
  to 1 then delete if not then decrement the count
  */
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "Vegetables"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();

      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    console.log("no itme exist in the db");

    await updateInventory();
  };

  // call updateInventory function when page load
  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      padding-bottom={5}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} fontFamily={"Courier New, monospace"}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"column"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />

            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h1" padding={5}>
        Pantry Tracker
      </Typography>
      <Box border={"1px solid #333"}>
        {/* Header pantry items */}
        <Box
          width={"800px"}
          height={"100px"}
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          padding={5}
        >
          <Box flexGrow={1} display="flex" justifyContent="center">
            <Typography variant="h2" color="#333" textAlign="center">
              Pantry Items
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              textTransform: "capitalize",
              backgroundColor: "#FFB6C1",
              color: "black",
              "&:hover": {
                backgroundColor: "#F33A6A",
              },
              "&:active": {
                backgroundColor: "#F33A6A",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Add New Item
          </Button>
        </Box>

        {/* list of items in the pantry */}
        <Stack width="800px" height="400px" overflow={"auto"}>
          {inventory.map(({ name, count }) => (
            <Box
              key={name}
              width="100%"
              height="100px"
              bgcolor="#FFFDD0"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding={5}
              borderBottom="1px solid #000000"
            >
              <Box width="50%" display="flex" justifyContent="flex-start">
                <Typography variant={"h4"} color={"#333"} textAlign={"center"}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
              </Box>
              <Typography
                variant={"h4"}
                color={"#333"}
                textAlign={"center"}
                width="10%"
              >
                {count}
              </Typography>

              <Stack spacing={2} direction="column">
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                  sx={{
                    textTransform: "capitalize",
                    backgroundColor: "#FFB6C1",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#F33A6A",
                    },
                    "&:active": {
                      backgroundColor: "#F33A6A",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  Add
                </Button>

                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{
                    textTransform: "capitalize",
                    backgroundColor: "#FFB6C1",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#F33A6A",
                    },
                    "&:active": {
                      backgroundColor: "#F33A6A",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

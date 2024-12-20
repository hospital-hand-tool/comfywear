import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Table2 from "../../components/Table/MaterialTable";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function Orderdetail() {
  const order = useSelector((state) => state.order.orders);
  const [orderProducts, setorderProducts] = useState([]);
  const [allOrders, setallOrders] = useState([]);

  useEffect(() => {
    if (order) {
      setallOrders(order);
    }
  }, [order]);

  const [loading, setloading] = useState(false);
  const router = useRouter();

  const TAX_RATE = 0.07;

  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }

  function priceRow(qty, unit) {
    return qty * unit;
  }

  function createRow(desc, qty, unit) {
    const price = priceRow(qty, unit);
    return { desc, qty, unit, price };
  }

  function subtotal(items) {
    let sum = 0;
    items.map((items) => {
      sum += items.rate * items.qty;
    });
    return sum;
  }

  const invoiceSubtotal = subtotal(orderProducts);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "1px solid #153A5B",
    boxShadow: 24,

    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setloading(true);
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      router.push("/");
    } else {
      setloading(false);
    }
  }, []);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      size: 40,
    },
    {
      accessorKey: "contact",
      header: "client number",
      size: 120,
    },
    {
      accessorKey: "totalItems",
      header: "Total items",
      size: 120,
    },
    {
      accessorKey: "subTotal",
      header: "Sub Total",
      size: 120,
    },
    {
      accessorKey: "type",
      header: "Payment Type",
      size: 120,
    },
    {
      accessorKey: "time",
      header: "Time",
      Cell: ({ row }) => {
       console.log('row', row.original);
       return(
       <Typography >
          {row && row.original && row.original?.time}
        </Typography>)
      },
    },
    {
      accessorKey: "mesage",
      header: "Message",
      size: 120,
    },

    {
      accessorKey: "total",
      header: "Total",
      size: 120,
    },
    {
      accessorKey: "show",
      header: "action",
      Cell: ({ row }) => (
        <Button variant="contained" onClick={() => handleAction(row.original)}>
          List Product
        </Button>
      ),
    },
  ];

  const handleAction = (id) => {
    setorderProducts(id.products);
    handleOpen();
  };

  console.log(allOrders);

  return (
    <>
      {order && order.orders ? (
        // loading ? (
        //   <CircularProgress />
        // ) : (
        <>
          <Box
            display={"flex"}
            justifyContent={"center"}
            gap={"5rem"}
            flexWrap={"wrap"}
            py={"1.5rem"}
          >
            <Typography fontSize={"2rem"} fontWeight={"semibold"}>
              Branch : {allOrders ? allOrders.branch : "no"}
            </Typography>
            <Typography fontSize={"2rem"} fontWeight={"semibold"}>
              Date : {allOrders ? allOrders.date : "yes"}
            </Typography>
          </Box>
          {allOrders.orders ? (
            <>
              <Table2 data={allOrders.orders} columns={columns} />
            </>
          ) : null}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        Details
                      </TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Desc</TableCell>
                      <TableCell align="right">Qty.</TableCell>
                      <TableCell align="right">Unit</TableCell>
                      <TableCell align="right">Sum</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderProducts.map((row) => (
                      <TableRow key={row.desc}>
                        <TableCell>{row.title}</TableCell>
                        <TableCell align="right">{row.qty}</TableCell>
                        <TableCell align="right">{row.rate}</TableCell>
                        <TableCell align="right">
                          {/* {ccyFormat(row.price)} */}
                          {row.qty * row.rate}
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell rowSpan={3} />
                      <TableCell colSpan={2}>Subtotal</TableCell>
                      <TableCell align="right">
                        {/* {ccyFormat(invoiceSubtotal)} */}
                        {invoiceSubtotal}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell align="right">{invoiceSubtotal}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Modal>
        </>
      ) : (
        // )
        ""
      )}
    </>
  );
}

export default Orderdetail;

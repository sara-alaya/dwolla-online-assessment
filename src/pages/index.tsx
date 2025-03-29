import Head from 'next/head';
import useSWR from 'swr';
import { Box, Typography } from '@mui/material';
// Icon for Add Customer button
import { AddRounded } from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useState } from 'react';


export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  businessName?: string;
};

export type Customers = Customer[];

export type ApiError = {
  code: string;
  message: string;
};

const Home = () => {
  // SWR is a great library for geting data, but is not really a solution
  // for POST requests. You'll want to use either another library or
  // the Fetch API for adding new customers.
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) throw body;
    return body;
  };
  const { data, error, isLoading, mutate } = useSWR<Customers, ApiError>(
    '/api/customers',
    fetcher
  );
  //Dialog open/close state
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');

  const handleCreate = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert('Please fill out all required fields.');
      return;
    }
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ firstName, lastName, businessName, email })
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }
      mutate();
      handleClose();
      setFirstName('');
      setLastName('');
      setBusinessName('');
      setEmail('');
    } catch (err){
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
        <Box sx={{ p: 2 }}>
          <Box
            sx ={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography variant="h6">
              {data?.length} Customers
            </Typography>
            <Button
              variant="contained"
              endIcon={<AddRounded />}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                ':hover': {
                  backgroundColor: '#333'
                }
              }}
              onClick={handleOpen}
            >
              Add Customer
            </Button>
          </Box>

          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {data && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((customer: any) => (
                    <TableRow key={customer.email}>
                      <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1}}>
              {/* Row of three fields */}
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  label="First Name"
                  required
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                  label="Last Name"
                  required
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <TextField
                  label="Business Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </Box>
              {/* Email on its own line */}
              <TextField
                label="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained" onClick={handleCreate}>
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </main>
    </>
  );
};

export default Home;

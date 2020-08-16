import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { selectPartners, deletePartner } from '../features/homeSlice';

import CustomDialog from './CustomDialog';

const newEmptyPartner = {
  address: '',
  bankAccount: '',
  cityId: '',
  cityName: '',
  comment: '',
  companyFormId: '',
  companyFormName: '',
  companyNumber: '',
  name: '',
  partnerId: '',
  phone: '',
  taxNumber: '',
  partnerIsNew: true,
};

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const CustomTable = ({ filter }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const partners = useSelector(selectPartners);
  const [open, setOpen] = useState(false);
  const [partnerToSave, setPartnerToSave] = useState(newEmptyPartner);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Form</TableCell>
            <TableCell>Tax number</TableCell>
            <TableCell>Company number</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Bank account</TableCell>
            <TableCell>Comment</TableCell>
            <TableCell align="center">Delete</TableCell>
            <TableCell align="center">Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {partners.map((row) => {
            if (
              !row.name.toLowerCase().includes(filter.name.toLowerCase()) ||
              !row.companyFormName
                .toLowerCase()
                .includes(filter.companyFormName.toLowerCase()) ||
              !row.cityName
                .toLowerCase()
                .includes(filter.cityName.toLowerCase())
            ) {
              return;
            }

            return (
              <TableRow key={row.partnerId}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.companyFormName}</TableCell>
                <TableCell>{row.taxNumber}</TableCell>
                <TableCell>{row.companyNumber}</TableCell>
                <TableCell>{row.cityName}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.bankAccount}</TableCell>
                <TableCell>{row.comment}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      dispatch(deletePartner(row.partnerId));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      setOpen(true);
                      setPartnerToSave({ ...row, partnerIsNew: false });
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Button
          onClick={() => {
            setPartnerToSave({ ...newEmptyPartner });
            setOpen(true);
          }}
        >
          New partner
        </Button>
      </div>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        partnerToSave={partnerToSave}
      />
    </React.Fragment>
  );
};

export default CustomTable;

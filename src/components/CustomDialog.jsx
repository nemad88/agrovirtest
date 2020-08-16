import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import {
  selectEditablePartner,
  selectCompanyForms,
  selectCities,
  resetEditablePartner,
  savePartner,
} from '../features/homeSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const CustomDialog = ({ open, handleClose, partnerToSave }) => {
  const classes = useStyles();
  const cities = useSelector(selectCities);
  const companyForms = useSelector(selectCompanyForms);
  const partnerToEdit = useSelector(selectEditablePartner);
  const [editedPartner, setEditedPartner] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    setEditedPartner(partnerToSave);
  }, [partnerToSave]);

  const handleInputChange = (e) => {
    const propertyName = e.target.name;
    const newValue = e.target.value;
    setEditedPartner((partner) => {
      return { ...partner, [propertyName]: newValue };
    });
  };

  const cityIsNew = () => {
    return cities.find((city) => city.cityName === editedPartner.cityName);
  };

  const companyFormIsNew = () => {
    return companyForms.find(
      (companyForm) =>
        companyForm.companyFormName === editedPartner.companyFormName
    );
  };

  const handleSave = async () => {
    console.log('to SAVE:', {
      ...editedPartner,
      ...cityIsNew(),
      ...companyFormIsNew(),
      cityIsNew: !Boolean(cityIsNew()),
      companyFormIsNew: !Boolean(companyFormIsNew()),
    });
    dispatch(
      savePartner({
        ...editedPartner,
        ...cityIsNew(),
        ...companyFormIsNew(),
        cityIsNew: !Boolean(cityIsNew()),
        companyFormIsNew: !Boolean(companyFormIsNew()),
      })
    );
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle id="edit-partner" align="center">
          {'EDIT PARTNER'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <TextField
                required
                value={editedPartner.name}
                onChange={(e) => handleInputChange(e)}
                id="name"
                name="name"
                label="Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                value={editedPartner.companyFormName}
                onChange={(e) => handleInputChange(e)}
                id="companyFormName"
                name="companyFormName"
                label="Company form"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                required
                value={editedPartner.taxNumber}
                onChange={(e) => handleInputChange(e)}
                id="taxNumber"
                name="taxNumber"
                label="Tax number"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                value={editedPartner.companyNumber}
                onChange={(e) => handleInputChange(e)}
                id="companyNumber"
                name="companyNumber"
                label="Company number"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                value={editedPartner.cityName}
                onChange={(e) => handleInputChange(e)}
                required
                id="cityName"
                name="cityName"
                label="City"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                value={editedPartner.address}
                onChange={(e) => handleInputChange(e)}
                id="address"
                name="address"
                label="Address"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                value={editedPartner.phone}
                onChange={(e) => handleInputChange(e)}
                id="phone"
                name="phone"
                label="Phone number"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={editedPartner.bankAccount}
                onChange={(e) => handleInputChange(e)}
                id="bankAccount"
                name="bankAccount"
                label="Bank account"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                value={editedPartner.comment}
                onChange={(e) => handleInputChange(e)}
                id="comment"
                name="comment"
                label="Comment"
                fullWidth
                autoComplete="shipping postal-code"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomDialog;

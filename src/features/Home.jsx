import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CustomTable from '../components/CustomTable';
import {
  fetchCities,
  fetchCompanyForms,
  fetchPartners,
  selectPartners,
} from './homeSlice';
import TextField from '@material-ui/core/TextField';
import { filterPartners } from './utils';
import XLSX from 'xlsx';

const filterDefault = {
  name: '',
  companyFormName: '',
  cityName: '',
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const Home = () => {
  const classes = useStyles();
  const [filter, setFilter] = useState(filterDefault);
  const dispatch = useDispatch();
  const partners = useSelector(selectPartners);

  useEffect(() => {
    dispatch(fetchPartners());
    dispatch(fetchCities());
    dispatch(fetchCompanyForms());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const propertyName = e.target.name;
    const newValue = e.target.value;
    setFilter((partner) => {
      return { ...partner, [propertyName]: newValue };
    });
  };

  const exportToXls = () => {
    const toExport = filterPartners(partners, filter);
    let binaryWS = XLSX.utils.json_to_sheet(toExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Partners');
    XLSX.writeFile(wb, 'Partners.xlsx');
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      value={filter.name}
                      onChange={(e) => handleInputChange(e)}
                      required
                      id="name"
                      name="name"
                      label="Name"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      value={filter.companyFormName}
                      onChange={(e) => handleInputChange(e)}
                      required
                      id="companyFormName"
                      name="companyFormName"
                      label="Company form"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      value={filter.cityName}
                      onChange={(e) => handleInputChange(e)}
                      required
                      id="cityName"
                      name="cityName"
                      label="City"
                      fullWidth
                    />
                  </Grid>

                  <Grid container spacing={1} item xs={4}>
                    <Grid item xs={12} sm={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setFilter(filterDefault)}
                      >
                        Reset
                      </Button>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={exportToXls}
                      >
                        Export to excel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <CustomTable filter={filter} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Home;

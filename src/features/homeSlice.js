import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  partners: [],
  cities: [],
  companyForms: [],
  partnerToSave: {
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
  },
};

// FETCH PARTNERS
export const fetchPartners = createAsyncThunk('fetchPartners', async () => {
  let response = await fetch('/partners', {
    method: 'GET',
  });
  let result = await response.json();
  return [...result.rows];
});

// FETCH CITIES
export const fetchCities = createAsyncThunk('fetchCities', async () => {
  let response = await fetch('/cities', {
    method: 'GET',
  });
  let result = await response.json();
  return [...result.rows];
});

// FETCH COMPANIES
export const fetchCompanyForms = createAsyncThunk(
  'fetchCompanyForms',
  async () => {
    let response = await fetch('/company-form', {
      method: 'GET',
    });
    let result = await response.json();
    return [...result.rows];
  }
);

// SAVE PARTNER
export const savePartner = createAsyncThunk(
  'savePartner',
  async (newPartner) => {
    let partnerToSave = { ...newPartner };

    if (newPartner.cityIsNew) {
      console.log('city is new try to save');
      let response = await fetch('/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ cityName: newPartner.cityName }),
      });
      let newCityId = await response.json();
      partnerToSave = { ...partnerToSave, ...newCityId };
    }

    if (newPartner.companyFormIsNew) {
      console.log('company form is new try to save');
      let responseCompanyForm = await fetch('/company-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          companyFormName: newPartner.companyFormName,
        }),
      });
      let newCompanyFormId = await responseCompanyForm.json();
      partnerToSave = { ...partnerToSave, ...newCompanyFormId };
    }

    if (newPartner.partnerIsNew) {
      console.log('partner is new try to save');
      let newPartnerResponse = await fetch('/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(partnerToSave),
      });
      let newPartnerResult = await newPartnerResponse.json();
      partnerToSave = { ...partnerToSave, ...newPartnerResult };
    } else {
      await fetch('/partners', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          ...partnerToSave,
        }),
      });
    }
    return partnerToSave;
  }
);

// FETCH COMPANIES
export const deletePartner = createAsyncThunk(
  'deletePartner',
  async (partnerId) => {
    let response = await fetch(`/partners/${partnerId}`, {
      method: 'DELETE',
    });
    let result = await response.json();
    console.log(result);
    return Number(result.deletedID);
  }
);

const homeSlice = createSlice({
  name: 'homeSlice',
  initialState,
  reducers: {},
  extraReducers: {
    // PARTNERS
    [fetchPartners.pending]: (state, action) => {},
    [fetchPartners.fulfilled]: (state, action) => {
      state.partners = action.payload;
    },
    [fetchPartners.rejected]: (state, action) => {
      state.partners = [];
      console.log(action.payload);
    },
    [savePartner.pending]: (state, action) => {},
    [savePartner.fulfilled]: (state, action) => {
      console.log(state.partners);
      if (action.payload.companyFormIsNew) {
        state.companyForms.push({
          companyFormId: action.payload.companyFormId,
          companyFormName: action.payload.companyFormName,
        });
      }

      if (action.payload.cityIsNew) {
        state.cities.push({
          cityId: action.payload.cityId,
          cityName: action.payload.cityName,
        });
      }

      if (action.payload.partnerIsNew) {
        state.partners.push(action.payload);
      } else {
        const newsPartnersState = state.partners.map((partner) => {
          if (partner.partnerId === action.payload.partnerId) {
            console.log('newsPartnersState');
            return action.payload;
          } else return partner;
        });
        state.partners = newsPartnersState;
      }
    },
    [savePartner.rejected]: (state, action) => {
      console.log(action.payload);
    },
    [deletePartner.pending]: (state, action) => {},
    [deletePartner.fulfilled]: (state, action) => {
      state.partners = state.partners.filter(
        (partner) => partner.partnerId !== action.payload
      );
    },
    [deletePartner.rejected]: (state, action) => {},
    // CITIES
    [fetchCities.pending]: (state, action) => {},
    [fetchCities.fulfilled]: (state, action) => {
      state.cities = action.payload;
    },
    [fetchCities.rejected]: (state, action) => {
      state.cities = [];
      console.log(action.payload);
    },
    // CITIES
    [fetchCompanyForms.pending]: (state, action) => {},
    [fetchCompanyForms.fulfilled]: (state, action) => {
      state.companyForms = action.payload;
    },
    [fetchCompanyForms.rejected]: (state, action) => {
      state.companyForms = [];
      console.log(action.payload);
    },
  },
});

export const selectPartners = (state) => state.home.partners;
export const selectCities = (state) => state.home.cities;
export const selectCompanyForms = (state) => state.home.companyForms;
export const selectEditablePartner = (state) => state.home.editablePartner;
export default homeSlice.reducer;

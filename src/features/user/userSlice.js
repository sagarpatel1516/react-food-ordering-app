import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function getAddress(position) {
  return fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.latitude}&longitude=${position.longitude}`,
  ).then((res) => res.json());
}

// CREATE ASYNC THUNK
export const fetchAddress = createAsyncThunk(
  'user/fetchAddress',
  async function () {
    // 1) Get user position
    const positionObj = await getPosition();

    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Reverse geocoding
    const addressObj = await getAddress(position);

    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Return data
    return { position, address };
  },
);

const initialState = {
  userName: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',

  initialState,

  reducers: {
    updateName(state, action) {
      state.userName = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = 'idle';
      })

      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = 'error';
        state.error =
          'There was a problem getting your address. Make sure to fill this field!';
      });
  },
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;

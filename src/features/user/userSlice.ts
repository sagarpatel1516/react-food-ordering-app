import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface Position {
  latitude: number;
  longitude: number;
}

interface AddressResponse {
  locality?: string;
  city?: string;
  postcode?: string;
  countryName?: string;
}

interface UserState {
  userName: string;
  status: "idle" | "loading" | "error";
  position: Partial<Position>;
  address: string;
  error: string;
}

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getAddress(
  position: Position,
): Promise<AddressResponse> {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.latitude}&longitude=${position.longitude}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch address");
  }

  return res.json();
}

// =========================
// Async Thunk
// =========================

export const fetchAddress = createAsyncThunk<
  {
    position: Position;
    address: string;
  },
  void,
  {
    rejectValue: string;
  }
>("user/fetchAddress", async (_, { rejectWithValue }) => {
  try {
    // 1. Get current position
    const positionObj = await getPosition();

    const position: Position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2. Reverse geocode
    const addressObj = await getAddress(position);

    const address = `${addressObj.locality ?? ""}, ${
      addressObj.city ?? ""
    } ${addressObj.postcode ?? ""}, ${
      addressObj.countryName ?? ""
    }`;

    return {
      position,
      address,
    };
  } catch {
    return rejectWithValue(
      "There was a problem getting your address. Make sure to fill this field!",
    );
  }
});

// =========================
// Initial State
// =========================

const initialState: UserState = {
  userName: "",
  status: "idle",
  position: {},
  address: "",
  error: "",
};

// =========================
// Slice
// =========================

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    updateName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })

      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      })

      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = "error";

        state.error =
          action.payload ??
          "There was a problem getting your address. Make sure to fill this field!";
      });
  },
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;
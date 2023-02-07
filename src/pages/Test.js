import { useLoadScript } from '@react-google-maps/api'
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'
import '@reach/combobox/styles.css'
import { useState } from 'react'

// This is outcome from address
const initialState = {
  houseNo: '',
  street: '',
  city: '',
  region: '',
  province: '',
  country: '',
  postalCode: '',
  addressArray: [],
  formatted_address: '',
  place_id: '',
}

const GooglePlaces = () => {
  const [state, setState] = useState(initialState)
  // Load your script first
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // library is must
    libraries: ['places'],
  })

  if (!isLoaded) {
    return (
      <div>
        <h1 className='title'>Loading...</h1>
        <div className='loading'></div>
      </div>
    )
  }
  return (
    <>
      <div className='places-container'>
        <PlacesAutocomplete setState={setState} state={state} />
      </div>
    </>
  )
}
// We have this approach because this component must load after isLoaded useLoadScript
const PlacesAutocomplete = ({ setState, state }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
      componentRestrictions: { country: ['ca'] },
    },
    debounce: 300,
  })

  const handleSelect = async (address) => {
    setValue(address, false)
    clearSuggestions()

    const results = await getGeocode({ address })
    // This code below is only get useful values and put in state it has nothing to do with functionality.

    // state code=======Start
    const addressDetails = results[0]
    const { formatted_address, place_id, address_components } = addressDetails
    const length = address_components.length
    const startLength = address_components.length - 5
    // We Slice because last 5 values are important also some times array is not returning same values.
    const lastAddress = address_components.slice(startLength, length)

    const houseNo = address_components[0]?.long_name
    const street = address_components[1]?.long_name
    const city = lastAddress[0]?.long_name
    const region = lastAddress[1]?.long_name
    const province = lastAddress[2]?.long_name
    const country = lastAddress[3]?.long_name
    const postalCode = lastAddress[4]?.long_name

    setState({
      ...state,
      addressArray: results,
      place_id,
      formatted_address,
      houseNo,
      street,
      city,
      region,
      province,
      country,
      postalCode,
    })
  }
  // state code=======End
  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className='combobox-input'
        placeholder='Search an address'
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
}

export default GooglePlaces

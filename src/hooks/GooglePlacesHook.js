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

import { useDispatch } from 'react-redux'
import { getAddressValues } from '../features/user/userSlice'

// This is outcome from address

const GooglePlacesHook = () => {
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
        <PlacesAutocomplete />
      </div>
    </>
  )
}
// We have this approach because this component must load after isLoaded useLoadScript
const PlacesAutocomplete = () => {
  const dispatch = useDispatch()
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
    const { address_components } = addressDetails
    const length = address_components.length
    const startLength = address_components.length - 5
    // We Slice because last 5 values are important also some times array is not returning same values.
    const lastAddress = address_components.slice(startLength, length)

    dispatch(
      getAddressValues({
        house: address_components[0]?.long_name,
        street: address_components[1]?.long_name,
        city: lastAddress[0]?.long_name,
        region: lastAddress[1]?.long_name,
        province: lastAddress[2]?.long_name,
        country: lastAddress[3]?.long_name,
        postalCode: lastAddress[4]?.long_name,
      })
    )
  }
  // state code=======End
  return (
    <Combobox onSelect={handleSelect}>
      <label htmlFor='form-label'>Search your address</label>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className='form-input'
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

export default GooglePlacesHook

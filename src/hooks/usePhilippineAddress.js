import { useEffect, useState } from 'react'

import { barangays, cities, provinces, regions } from 'select-philippines-address'

export function usePhilippineAddress() {
  const [regionCode, setRegionCodeState] = useState('')
  const [provinceCode, setProvinceCodeState] = useState('')
  const [cityCode, setCityCodeState] = useState('')
  const [barangayCode, setBarangayCodeState] = useState('')

  const [regionOptions, setRegionOptions] = useState([])
  const [provinceOptions, setProvinceOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [barangayOptions, setBarangayOptions] = useState([])

  const [addressError, setAddressError] = useState(null)

  function setRegionCode(nextCode) {
    setRegionCodeState(nextCode)
    setProvinceCodeState('')
    setCityCodeState('')
    setBarangayCodeState('')
    setProvinceOptions([])
    setCityOptions([])
    setBarangayOptions([])
    setAddressError(null)
  }

  function setProvinceCode(nextCode) {
    setProvinceCodeState(nextCode)
    setCityCodeState('')
    setBarangayCodeState('')
    setCityOptions([])
    setBarangayOptions([])
    setAddressError(null)
  }

  function setCityCode(nextCode) {
    setCityCodeState(nextCode)
    setBarangayCodeState('')
    setBarangayOptions([])
    setAddressError(null)
  }

  function setBarangayCode(nextCode) {
    setBarangayCodeState(nextCode)
    setAddressError(null)
  }

  // Regions (top-level, loaded once)
  useEffect(() => {
    let cancelled = false

    regions()
      .then((list) => {
        if (cancelled) return
        setRegionOptions(Array.isArray(list) ? list : [])
        setAddressError(null)
      })
      .catch((error) => {
        if (cancelled) return
        setRegionOptions([])
        setAddressError('Could not load region data. Please try again later.')
        console.error('Failed to fetch regions:', error)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Provinces (depends on region)
  useEffect(() => {
    let cancelled = false

    if (!regionCode) return () => {}

    provinces(regionCode)
      .then((list) => {
        if (cancelled) return
        setProvinceOptions(Array.isArray(list) ? list : [])
        setAddressError(null)
      })
      .catch((error) => {
        if (cancelled) return
        setProvinceOptions([])
        setAddressError('Could not load province data. Please try again later.')
        console.error('Failed to fetch provinces:', error)
      })

    return () => {
      cancelled = true
    }
  }, [regionCode])

  // Cities (depends on province)
  useEffect(() => {
    let cancelled = false

    if (!provinceCode) return () => {}

    cities(provinceCode)
      .then((list) => {
        if (cancelled) return
        setCityOptions(Array.isArray(list) ? list : [])
        setAddressError(null)
      })
      .catch((error) => {
        if (cancelled) return
        setCityOptions([])
        setAddressError('Could not load city data. Please try again later.')
        console.error('Failed to fetch cities:', error)
      })

    return () => {
      cancelled = true
    }
  }, [provinceCode])

  // Barangays (depends on city)
  useEffect(() => {
    let cancelled = false

    if (!cityCode) return () => {}

    barangays(cityCode)
      .then((list) => {
        if (cancelled) return
        setBarangayOptions(Array.isArray(list) ? list : [])
        setAddressError(null)
      })
      .catch((error) => {
        if (cancelled) return
        setBarangayOptions([])
        setAddressError('Could not load barangay data. Please try again later.')
        console.error('Failed to fetch barangays:', error)
      })

    return () => {
      cancelled = true
    }
  }, [cityCode])

  return {
    regionCode,
    setRegionCode,
    provinceCode,
    setProvinceCode,
    cityCode,
    setCityCode,
    barangayCode,
    setBarangayCode,
    regionOptions,
    provinceOptions,
    cityOptions,
    barangayOptions,
    addressError,
  }
}
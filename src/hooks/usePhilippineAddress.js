import { useEffect, useState } from 'react'

import { barangays, cities, provinces, regions } from 'select-philippines-address'

export function usePhilippineAddress() {
  const [regionCode, setRegionCodeState] = useState('')
  const [cityCode, setCityCodeState] = useState('')
  const [barangayCode, setBarangayCodeState] = useState('')

  const [regionOptions, setRegionOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [barangayOptions, setBarangayOptions] = useState([])

  const [addressError, setAddressError] = useState(null)

  function setRegionCode(nextCode) {
    setRegionCodeState(nextCode)
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

  useEffect(() => {
    let cancelled = false

    if (!regionCode) return () => {}

    provinces(regionCode)
      .then(async (provinceList) => {
        if (cancelled) return

        const provinceArray = Array.isArray(provinceList) ? provinceList : []
        const cityLists = await Promise.all(
          provinceArray.map(async (province) => {
            const cityList = await cities(province.province_code)
            const cityArray = Array.isArray(cityList) ? cityList : []
            return cityArray.map((city) => ({
              ...city,
              province_code: province.province_code,
              province_name: province.province_name,
            }))
          }),
        )

        if (cancelled) return
        setCityOptions(cityLists.flat())
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
  }, [regionCode])

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
    cityCode,
    setCityCode,
    barangayCode,
    setBarangayCode,
    regionOptions,
    cityOptions,
    barangayOptions,
    addressError,
  }
}

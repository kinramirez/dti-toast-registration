import { useEffect, useMemo, useState } from 'react'

import psgc from '@dctsph/psgc'
import regionsData from '@dctsph/psgc/json/regions.json'
import provincesData from '@dctsph/psgc/json/provinces.json'
import municipalitiesData from '@dctsph/psgc/json/municipalities.json'

const REGION_OPTIONS = regionsData.map((r) => ({
  region_code: r.reg_code,
  region_name: r.name,
}))

const PROVINCE_OPTIONS = provincesData.map((p) => ({
  province_code: p.prv_code,
  province_name: p.name,
  region_code: p.reg_code,
}))

const PROVINCE_BY_CODE = new Map(PROVINCE_OPTIONS.map((p) => [p.province_code, p]))

// PSGC codes are hierarchical: the first 2 digits always identify the
// region, regardless of whether the entity underneath has a real
// province. This lets us resolve a city's region directly from its own
// code, instead of routing through province — which fails for cities
// that ARE the top-level administrative unit (all of NCR's cities, plus
// standalone HUCs elsewhere like Isabela City in Basilan). Those cities
// either have no real province row, or a province_code that's just a
// placeholder equal to their own city_code.
const REGION_BY_PREFIX = new Map(
  regionsData.map((r) => [String(r.reg_code).slice(0, 2), r.reg_code]),
)

function resolveCityRegionCode(m) {
  const prefix = String(m.mun_code).slice(0, 2)
  return REGION_BY_PREFIX.get(prefix) ?? null
}

const ALL_CITY_OPTIONS = municipalitiesData.map((m) => {
  const region_code = resolveCityRegionCode(m)
  // A city only "has" a province if that province_code resolves to an
  // actual row in provincesData. Self-referential codes (Manila) or
  // placeholder codes with no matching province row (Isabela City) mean
  // this city has no real containing province — leave it null so the
  // UI correctly skips/blanks Province for these.
  const hasRealProvince =
    m.prv_code && m.prv_code !== m.mun_code && PROVINCE_BY_CODE.has(m.prv_code)

  return {
    city_code: m.mun_code,
    city_name: m.name,
    province_code: hasRealProvince ? m.prv_code : null,
    region_code,
  }
})

const CITY_BY_CODE = new Map(ALL_CITY_OPTIONS.map((c) => [c.city_code, c]))

if (import.meta.env?.DEV) {
  const unresolved = ALL_CITY_OPTIONS.filter((c) => !c.region_code)
  if (unresolved.length > 0) {
    console.warn(
      `[usePhilippineAddress] ${unresolved.length} cities have no resolvable region_code. ` +
        `Address cascade will be incomplete for these. Example:`,
      unresolved.slice(0, 3),
    )
  }
}

// Manila is split into administrative districts at the barangay level —
// its barangay rows are parented to district codes, not to the city
// code "133900000" itself. getBarangaysByMunicipality("133900000")
// returns [] as a result. Confirmed via
// node_modules/@dctsph/psgc/json/barangays.json.
const MANILA_CITY_CODE = '133900000'
const MANILA_DISTRICT_CODES = [
  '133901000',
  '133902000',
  '133903000',
  '133904000',
  '133905000',
  '133906000',
  '133907000',
  '133908000',
  '133909000',
  '133910000',
  '133911000',
  '133912000',
  '133913000',
  '133914000',
]

function getBarangaysForCity(cityCode) {
  if (cityCode === MANILA_CITY_CODE) {
    return MANILA_DISTRICT_CODES.flatMap(
      (districtCode) => psgc.getBarangaysByMunicipality(districtCode) ?? [],
    )
  }
  return psgc.getBarangaysByMunicipality(cityCode)
}

export function usePhilippineAddress() {
  const [regionCode, setRegionCodeState] = useState('')
  const [provinceCode, setProvinceCodeState] = useState('')
  const [cityCode, setCityCodeState] = useState('')
  const [barangayCode, setBarangayCodeState] = useState('')

  const [barangayOptions, setBarangayOptions] = useState([])
  const [addressError, setAddressError] = useState(null)

  const regionOptions = REGION_OPTIONS

  const provinceOptions = useMemo(
    () =>
      regionCode
        ? PROVINCE_OPTIONS.filter((p) => p.region_code === regionCode)
        : [],
    [regionCode],
  )

  // City list:
  //  - provinceCode set → cities in that province only (normal cascade)
  //  - only regionCode set → every city whose own region_code matches,
  //    including independent cities that have no province at all (NCR,
  //    Isabela City, etc.) — this is what lets a user pick City without
  //    knowing Province, in every region including NCR.
  //  - neither set → empty
  const cityOptions = useMemo(() => {
    if (provinceCode) {
      return ALL_CITY_OPTIONS.filter((c) => c.province_code === provinceCode)
    }
    if (regionCode) {
      return ALL_CITY_OPTIONS.filter((c) => c.region_code === regionCode)
    }
    return []
  }, [provinceCode, regionCode])

  function setRegionCode(nextCode) {
    setRegionCodeState(nextCode)
    setProvinceCodeState('')
    setCityCodeState('')
    setBarangayCodeState('')
    setBarangayOptions([])
    setAddressError(null)
  }

  function setProvinceCode(nextCode) {
    setProvinceCodeState(nextCode)
    setCityCodeState('')
    setBarangayCodeState('')
    setBarangayOptions([])
    setAddressError(null)
  }

  // Always derives region/province from the chosen city itself.
  //  - Independent city (NCR, Isabela City, etc.) → province_code is
  //    already null on the option, so provinceCode correctly clears.
  //  - Normal city → back-fills province_code from the option.
  //  - Region always comes from the city's own resolved region_code.
  function setCityCode(nextCityCode) {
    if (!nextCityCode) {
      setCityCodeState('')
      setBarangayCodeState('')
      setAddressError(null)
      return
    }

    const city = CITY_BY_CODE.get(nextCityCode)
    if (!city) {
      setAddressError('Could not find the selected city.')
      return
    }

    setRegionCodeState((prev) => city.region_code ?? prev)
    setProvinceCodeState(city.province_code ?? '')
    setCityCodeState(nextCityCode)
    setBarangayCodeState('')
    setAddressError(null)
  }

  function setBarangayCode(nextCode) {
    setBarangayCodeState(nextCode)
    setAddressError(null)
  }

  useEffect(() => {
    if (!cityCode) {
      setBarangayOptions([])
      return
    }

    try {
      const list = getBarangaysForCity(cityCode)
      setBarangayOptions(
        Array.isArray(list)
          ? list.map((b) => ({ brgy_code: b.bgy_code, brgy_name: b.name }))
          : [],
      )
      setAddressError(null)
    } catch (error) {
      setBarangayOptions([])
      setAddressError('Could not load barangay data. Please try again later.')
      console.error('Failed to fetch barangays:', error)
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
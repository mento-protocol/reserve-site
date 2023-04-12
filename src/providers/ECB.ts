import xml2js from "xml2js"
import { Providers } from "./Providers"
import { ProviderResult, providerOk, providerError } from "src/utils/ProviderResult"

const xmlParser = new xml2js.Parser()

interface RateCube {
  $: {
    currency: string
    rate: "string"
  }
}

export async function euroToUSD(): Promise<ProviderResult<number>> {
  try {
    const response = await fetch("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml")
    const xml = await response.text()
    const data = await xmlParser.parseStringPromise(xml)
    const cube = data["gesmes:Envelope"].Cube[0].Cube[0]
    const date = cube["$"].time
    const rate = cube.Cube.find((c: RateCube) => c["$"].currency === "USD")["$"].rate
    return providerOk(Number(rate), Providers.ecb, new Date(date).valueOf())
  } catch (error) {
    return providerError(error, Providers.ecb)
  }
}

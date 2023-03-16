import { Providers } from "src/providers/Providers"
import { providerError, providerOk, ProviderResult } from "src/utils/ProviderResult"
import { duel } from "./duel"

async function Alfie() {
  return providerOk(100, Providers.etherscan, 1614121843624)
}

async function Bormier() {
  return providerOk(100, Providers.blockstream, 1614121843634)
}

async function Cerci() {
  return providerOk(102, Providers.coinbase, 1614121843684)
}

async function Erros() {
  return providerError(new Error("Error"), Providers.ecb)
}

describe(`duel()`, () => {
  describe("when both parties agree", () => {
    it("returns value and indicts the agreement", async () => {
      const result = await duel(Alfie(), Bormier())
      expect(result).toEqual({
        hasError: false,
        metadata: { sources: ["etherscan", "blockstream"] },
        time: 1614121843634,
        value: 100,
      })
    })
  })
  describe("when both parties return but results differ", () => {
    let info
    beforeEach(() => {
      info = global.console.info
      global.console.info = jest.fn()
    })

    afterEach(() => {
      global.console.info = info
    })
    it("most recent wins", async () => {
      const result = await duel(Alfie(), Cerci())
      expect(global.console.info).toHaveBeenCalledWith(
        "Sources: etherscan (100) differs from coinbase (102) 1.9608%"
      )
      expect(result).toEqual({
        hasError: false,
        metadata: { sources: ["coinbase"] },
        time: 1614121843684,
        value: 102,
      })
    })
  })
  describe("with errors", () => {
    let warn
    beforeEach(() => {
      warn = global.console.warn
      global.console.warn = jest.fn()
    })

    afterEach(() => {
      global.console.warn = warn
    })

    describe("when one party doesnt respond or has error", () => {
      it("use the other one and indicates so", async () => {
        const result = await duel(Bormier(), Erros())
        expect(result).toEqual({
          hasError: false,
          metadata: {
            sources: ["blockstream"],
          },
          time: 1614121843634,
          value: 100,
        })
        expect(global.console.warn).toHaveBeenCalledWith("Error with: ecb.europa.eu")
      })
    })
    describe("when neither party responds", () => {
      it("returns invalid", async () => {
        const result = await duel(Erros(), Erros())
        expect(global.console.warn).toHaveBeenCalledWith(
          "Error ecb.europa.eu & ecb.europa.eu could not get new data"
        )
        expect(result).toEqual({
          error: new Error("Error"),
          hasError: true,
          metadata: { sources: [] },
        })
      })
    })
  })
})

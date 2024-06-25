import { getEthPrice } from "./Etherscan";

describe("getEthPrice", () => {
  it("returns current price of Eth", async () => {
    const price = await getEthPrice();
    expect(price).toEqual({
      hasError: false,
      source: "etherscan",
      time: 1613763975,
      value: 1400,
    });
  });
});

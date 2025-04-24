export const getModePricePerDrinkPerPub = (pintData) => {
    const result = {};
  
    // Group all prices by their respective pubId and drink name
    for (const { id: pubId, drink, price } of pintData) {
      if (!result[pubId]) result[pubId] = {};
      if (!result[pubId][drink]) result[pubId][drink] = [];
  
      result[pubId][drink].push(price);
    }
  
    // Compute mode per drink per pub
    const modePerPub = {};
  
    for (const pubId in result) {
      modePerPub[pubId] = {};
      for (const drink in result[pubId]) {
        const prices = result[pubId][drink];
        const freq = {};
  
        for (const price of prices) {
          freq[price] = (freq[price] || 0) + 1;
        }
  
        let mode = null;
        let maxCount = 0;
  
        for (const price in freq) {
          if (freq[price] > maxCount) {
            maxCount = freq[price];
            mode = parseFloat(price);
          }
        }
  
        modePerPub[pubId][drink] = mode;
      }
    }
  
    return modePerPub;
  };
  
  export const updatePubsWithAveragePrice = (pubs, modePrices) => {
    return pubs.map((pub) => {
      const pubModePrices = modePrices[pub.id];
      if (pubModePrices) {
        const drinkPrices = Object.values(pubModePrices);
        const totalPrice = drinkPrices.reduce((sum, price) => sum + price, 0);
        const averagePrice = drinkPrices.length > 0 ? totalPrice / drinkPrices.length : 0;
        return { ...pub, average_pint_price: averagePrice.toFixed(2) };
      }
      return { ...pub, average_pint_price: "N/A" }; // If no mode prices, set to "N/A"
    });
  };
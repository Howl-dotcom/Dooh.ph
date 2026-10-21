/* ==========================================================================
   DOOH.ph — Site inventory (source: "DOOH Digital Billboard Inventory 2025")
   One entry per billboard. The Booking page renders whichever one is picked.

   Fields
     code     Site code (also the deep-link:  booking.html#BMND6N)
     name     Title shown on the page
     photo    Image in assets/booking/
     w, h     Photo pixel size (keeps the frame the right shape)
     feet     Panel size in feet, exactly as printed
     pixels   Panel size in pixels, exactly as printed
     orient   Vertical / Horizontal
     loc      Location line
     rates    Three prices, left to right: [PHP, USD] — leave USD "" if unknown
     labels   (optional) Replaces "Regular Time / Prime Time / Block Time"
   ========================================================================== */

const RATE_LABELS = ["Regular Time", "Prime Time", "Block Time"];

const SITES = [
  { code: "BMND6N", name: "One EDSA NB", photo: "bmnd6n.jpg", w: 730, h: 1199,
    feet: "282h x 78w", pixels: "2256h x 624w", orient: "Vertical",
    loc: "G.A. Tower, EDSA Boni Ave., Mandaluyong",
    rates: [["286.60", "5.10"], ["572.00", "10.20"], ["1,200", "21.50"]] },

  { code: "BMKT1S", name: "EDSA Magallanes", photo: "bmkt1s.jpg", w: 730, h: 1199,
    feet: "54.62h x 73.50w", pixels: "833h x 1130w", orient: "Horizontal",
    loc: "67 Epifanio de los Santos Ave.",
    rates: [["114.00", "2.50"], ["228.00", "4.10"], ["343.20", "6.10"]] },

  { code: "BMND5B", name: "EDSA Boni Apo", photo: "bmnd5b.jpg", w: 730, h: 1199,
    feet: "27h x 15w", pixels: "767h x 432w", orient: "Vertical",
    loc: "EDSA Boni Ave., Mandaluyong City, SB",
    /* TODO: the PDF prints Block Time as "P85.80 / $128.70" (looks swapped).
       Peso value below is 3 x Regular; USD left blank until confirmed. */
    rates: [["42.90", "0.50"], ["85.80", "1"], ["128.70", ""]] },

  { code: "BPAS1C", name: "C5 Bridge SB", photo: "bpas1c.jpg", w: 730, h: 1199,
    feet: "22.64h x 16.8w", pixels: "864h x 640w", orient: "Vertical",
    loc: "C5 Bridge, West Rembo, Taguig City",
    rates: [["28.60", "0.50"], ["57.20", "1"], ["85.80", "1.50"]] },

  { code: "BTAG1E", name: "32nd Avenue, BGC", photo: "btag1e.jpg", w: 900, h: 930,
    feet: "6.30h x 22w", pixels: "102h x 672w", orient: "Horizontal",
    loc: "32nd Avenue, BGC, Taguig City",
    rates: [["28.60", "0.50"], ["57.20", "1"], ["85.80", "1.50"]] },

  { code: "BSHW1E", name: "EDSA Shaw EB", photo: "bshw1e.jpg", w: 730, h: 1199,
    feet: "15h x 8w", pixels: "768h x 384w", orient: "Vertical",
    loc: "EDSA Shaw, Mandaluyong City, EB",
    rates: [["35.00", "0.60"], ["70.00", "1.20"], ["105.00", "1.79"]] },

  { code: "BMND7N", name: "UD Tower", photo: "bmnd7n.jpg", w: 730, h: 1199,
    feet: "200h x 33w (per panel)", pixels: "1952h x 320w (per panel)", orient: "Vertical",
    loc: "69 Sierra Madre, Mandaluyong",
    rates: [["143.00", "2.55"], ["286.00", "5.10"], ["429", "7.60"]] },

  { code: "BANT1W", name: "XentroMall Antipolo WB", photo: "bant1w.jpg", w: 900, h: 930,
    feet: "10h x 30w", pixels: "288h x 864w", orient: "Horizontal",
    loc: "Xentro Mall, Mambugan, Antipolo City, WB",
    rates: [["28.60", "0.50"], ["57.20", "1"], ["85.80", "1.50"]] },

  { code: "BANT1E", name: "XentroMall Antipolo EB", photo: "bant1e.jpg", w: 900, h: 930,
    feet: "10h x 35w", pixels: "288h x 1056w", orient: "Horizontal",
    loc: "Xentro Mall, Mambugan, Antipolo City, EB",
    rates: [["28.60", "0.50"], ["57.20", "1"], ["85.80", "1.50"]] },

  { code: "BMND1E", name: "Ortigas La Salle EB", photo: "bmnd1e.jpg", w: 900, h: 930,
    feet: "6.50h x 22.90w", pixels: "288h x 1055w", orient: "Horizontal",
    loc: "Ortigas La Salle, Mandaluyong City, EB",
    rates: [["35.00", "0.60"], ["70.00", "1.20"], ["105.00", "1.79"]] },

  { code: "BMND1W", name: "Ortigas La Salle WB", photo: "bmnd1w.jpg", w: 900, h: 930,
    feet: "6.50h x 22.90w", pixels: "288h x 1055w", orient: "Horizontal",
    loc: "Ortigas La Salle, Mandaluyong City, WB",
    rates: [["35.00", "0.60"], ["70.00", "1.20"], ["105.00", "1.79"]] },

  { code: "BLIP1N", name: "La Salle Lipa City NB", photo: "blip1n.jpg", w: 900, h: 930,
    feet: "10h x 30w", pixels: "288h x 864w", orient: "Horizontal",
    loc: "La Salle, Lipa City, Batangas, NB",
    rates: [["28.60", "0.50"], ["57.20", "1"], ["85.80", "1.50"]] },

  { code: "BTAR1N", name: "McArthur Hwy. NB", photo: "btar1n.jpg", w: 900, h: 930,
    feet: "10h x 30w", pixels: "288h x 864w", orient: "Horizontal",
    loc: "McArthur Hwy., Tarlac, NB",
    rates: [["28.60", "0.50"], ["57.20", "1"], ["85.80", "1.50"]] },

  { code: "BPAS2N", name: "Sta. Monica NB", photo: "bpas2n.jpg", w: 900, h: 930,
    feet: "32h x 30w", pixels: "1152h x 960w", orient: "Vertical",
    loc: "Kalayaan Bridge, BGC - Ortigas Link",
    rates: [["71.50", "1.25"], ["143.00", "2.55"], ["178.75", "3.20"]] },

  { code: "BDUM1", name: "Dumaguete City Baywalk", photo: "bdum1.jpg", w: 900, h: 930,
    feet: "8h x 20w", pixels: "420h x 1280w", orient: "Horizontal",
    loc: "Dumaguete City Baywalk, Rizal Blvd.",
    rates: [["28.60", "0.50"], ["57.20", "1"], ["85.80", "1.50"]] },

  { code: "BNAG1N", name: "Plaza Rizal Naga", photo: "bnag1n.jpg", w: 900, h: 930,
    feet: "13h x 20w", pixels: "384h x 576w", orient: "Horizontal",
    loc: "General Luna Street, Plaza Rizal, Naga",
    rates: [["28.60", "0.50"], ["57.20", "1"], ["85.80", "1.50"]] },

  { code: "BFES1S", name: "Festival Mall, Alabang", photo: "bfes1s.jpg", w: 900, h: 930,
    feet: "21h x 25.2w", pixels: "1920h x 2280w", orient: "Horizontal",
    loc: "Festival Mall Commerce, Alabang, Muntinlupa City",
    rates: [["30.00", "0.51"], ["40.00", "0.68"], ["50.00", "0.85"]] },

  { code: "BMND8S", name: "EDSA Boni 3D", photo: "bmnd8s.jpg", w: 730, h: 1199,
    feet: "75.46h x 71.39w", pixels: "2304h x 2176w", orient: "Vertical",
    loc: "EDSA Boni Ave., cor. Apo, Mandaluyong, SB",
    rates: [["150.00", "2.55"], ["300.00", "5.10"], ["450.00", "7.64"]] },

  { code: "BMKT2N", name: "EDSA Guadalupe 3D", photo: "bmkt2n.jpg", w: 730, h: 1199,
    feet: "107.09h x 78.74w", pixels: "3264h x 2400w", orient: "Vertical",
    loc: "EDSA Guadalupe, Makati City, NB",
    rates: [["180.00", "3.06"], ["360.00", "6.11"], ["540.00", "9.17"]] },

  { code: "BMON1W", name: "Rodriguez Highway WB", photo: "bmon1w.jpg", w: 900, h: 930,
    /* PDF lists pixels as "320 X 1156" with no h/w letters */
    feet: "13h x 30w", pixels: "320 x 1156", orient: "Horizontal",
    loc: "Rodriguez Highway, Montalban, Rizal Province",
    rates: [["28.60", "0.50"], ["57.20", "1"], ["85.80", "1.50"]] },

  { code: "BAUR1", name: "Aurora Boulevard EB", photo: "baur1.jpg", w: 900, h: 930,
    feet: "", pixels: "576h x 1920w", orient: "Horizontal",
    loc: "Aurora Boulevard, corner Pinatubo Street, Cubao, Quezon City",
    labels: ["160 Spots/Day", "320 Spots/Day", "640 Spots/Day"],
    rates: [["25.00", "0.43"], ["20.00", "0.34"], ["15.00", "0.26"]] }
];

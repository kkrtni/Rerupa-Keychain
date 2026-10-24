// Product data for Rerupa Keychain
const products = [
  {
    id: 1,
    name: "Keychain Bunga",
    price: 7000,
    category: "bunga",
    description: "Keychain lucu berbentuk bunga dengan varian warna yang menarik.",
    image: "img/keychain-bunga.jpg",
    variants: ["Bunga 1 Warna", "Bunga Wavy", "Bunga 2 Warna"],
    labels: ["Terlaris"],
    links: {
      shopee: "#", // Replace with actual Shopee link
      tokopedia: "#" // Replace with actual Tokopedia link
    }
  },
  {
    id: 2,
    name: "Keychain Inisial",
    price: 7000,
    category: "inisial",
    description: "Keychain personalisasi dengan huruf pilihan A-Z.",
    image: "img/keychain-inisial.jpg",
    variants: [], // Will be generated A-Z
    labels: [],
    links: {
      shopee: "#",
      tokopedia: "#"
    }
  },
  {
    id: 3,
    name: "Keychain Karakter",
    price: 15000,
    category: "karakter",
    description: "Keychain karakter custom sesuai desain pembeli.",
    image: "img/keychain-karakter.jpg",
    variants: [],
    labels: ["Custom"],
    links: {
      shopee: "#",
      tokopedia: "#"
    }
  },
  {
    id: 4,
    name: "Keychain Cermin",
    price: 12000,
    category: "cermin",
    description: "Keychain dengan cermin mini, lucu dan praktis.",
    image: "img/keychain-cermin.jpg",
    variants: ["Cermin Bunga", "Cermin Beruang", "Cermin Bunny"],
    labels: [],
    links: {
      shopee: "#",
      tokopedia: "#"
    }
  }
];

// Generate A-Z variants for Inisial product
products[1].variants = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)); // A-Z

// Export for use in other scripts (if using modules, but we'll attach to window)
window.products = products;
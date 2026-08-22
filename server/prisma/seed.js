require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const cities = [
  {
    name: "Mumbai",
    country: "India",
    region: "Maharashtra",
    costIndex: 65,
    popularity: 92,
    description: "India's vibrant financial and entertainment capital.",
  },
  {
    name: "Goa",
    country: "India",
    region: "Goa",
    costIndex: 55,
    popularity: 96,
    description: "Beaches, nightlife, food and relaxed coastal experiences.",
  },
  {
    name: "Delhi",
    country: "India",
    region: "Delhi",
    costIndex: 50,
    popularity: 90,
    description: "A historic capital filled with culture, food and monuments.",
  },
  {
    name: "Jaipur",
    country: "India",
    region: "Rajasthan",
    costIndex: 45,
    popularity: 88,
    description: "The Pink City known for forts, palaces and rich heritage.",
  },
  {
    name: "Udaipur",
    country: "India",
    region: "Rajasthan",
    costIndex: 48,
    popularity: 84,
    description: "A romantic city of lakes, palaces and beautiful sunsets.",
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Dubai",
    costIndex: 82,
    popularity: 95,
    description: "Modern architecture, luxury experiences and desert adventures.",
  },
  {
    name: "Bali",
    country: "Indonesia",
    region: "Bali",
    costIndex: 58,
    popularity: 94,
    description: "Tropical beaches, temples, nature and adventure.",
  },
  {
    name: "Paris",
    country: "France",
    region: "Île-de-France",
    costIndex: 88,
    popularity: 98,
    description: "Art, architecture, cuisine and iconic landmarks.",
  },
  {
    name: "Tokyo",
    country: "Japan",
    region: "Kanto",
    costIndex: 86,
    popularity: 97,
    description: "A fascinating blend of technology, tradition and culture.",
  },
  {
    name: "London",
    country: "United Kingdom",
    region: "England",
    costIndex: 90,
    popularity: 96,
    description: "Historic landmarks, museums, culture and modern city life.",
  },
];

const activities = {
  Mumbai: [
    {
      name: "Gateway of India",
      category: "Sightseeing",
      duration: 2,
      estimatedCost: 0,
      description: "Explore one of Mumbai's most iconic waterfront landmarks.",
    },
    {
      name: "Marine Drive",
      category: "Sightseeing",
      duration: 2,
      estimatedCost: 0,
      description: "Enjoy the famous Queen's Necklace and sunset views.",
    },
    {
      name: "Colaba Food Walk",
      category: "Food",
      duration: 3,
      estimatedCost: 900,
      description: "Discover local street food and popular Colaba eateries.",
    },
  ],

  Goa: [
    {
      name: "Baga Beach",
      category: "Beach",
      duration: 3,
      estimatedCost: 500,
      description: "Relax on one of Goa's most popular beaches.",
    },
    {
      name: "Scuba Diving",
      category: "Adventure",
      duration: 3,
      estimatedCost: 2500,
      description: "Experience underwater marine life with a guided dive.",
    },
    {
      name: "Fort Aguada",
      category: "Sightseeing",
      duration: 2,
      estimatedCost: 100,
      description: "Visit a historic Portuguese fort overlooking the sea.",
    },
  ],

  Delhi: [
    {
      name: "India Gate",
      category: "Sightseeing",
      duration: 2,
      estimatedCost: 0,
      description: "Visit the iconic war memorial in central Delhi.",
    },
    {
      name: "Red Fort",
      category: "History",
      duration: 3,
      estimatedCost: 500,
      description: "Explore the historic Mughal-era Red Fort.",
    },
    {
      name: "Old Delhi Food Tour",
      category: "Food",
      duration: 3,
      estimatedCost: 800,
      description: "Taste famous street food around Old Delhi.",
    },
  ],

  Jaipur: [
    {
      name: "Amber Fort",
      category: "History",
      duration: 3,
      estimatedCost: 550,
      description: "Explore the spectacular hilltop fort.",
    },
    {
      name: "Hawa Mahal",
      category: "Sightseeing",
      duration: 2,
      estimatedCost: 200,
      description: "Visit Jaipur's iconic Palace of Winds.",
    },
    {
      name: "Jaipur Food Walk",
      category: "Food",
      duration: 3,
      estimatedCost: 700,
      description: "Experience authentic Rajasthani cuisine.",
    },
  ],

  Udaipur: [
    {
      name: "City Palace",
      category: "History",
      duration: 3,
      estimatedCost: 500,
      description: "Explore the grand palace complex overlooking Lake Pichola.",
    },
    {
      name: "Lake Pichola Boat Ride",
      category: "Nature",
      duration: 2,
      estimatedCost: 800,
      description: "Enjoy a scenic boat ride across Lake Pichola.",
    },
  ],

  Dubai: [
    {
      name: "Burj Khalifa",
      category: "Sightseeing",
      duration: 3,
      estimatedCost: 3500,
      description: "Experience spectacular views from the world's famous skyscraper.",
    },
    {
      name: "Desert Safari",
      category: "Adventure",
      duration: 6,
      estimatedCost: 4500,
      description: "Enjoy dune bashing, desert views and traditional experiences.",
    },
    {
      name: "Dubai Marina",
      category: "Sightseeing",
      duration: 2,
      estimatedCost: 0,
      description: "Explore the spectacular waterfront district.",
    },
  ],

  Bali: [
    {
      name: "Uluwatu Temple",
      category: "Culture",
      duration: 3,
      estimatedCost: 500,
      description: "Visit a dramatic temple overlooking the Indian Ocean.",
    },
    {
      name: "Bali Water Sports",
      category: "Adventure",
      duration: 4,
      estimatedCost: 2500,
      description: "Enjoy a range of exciting water activities.",
    },
    {
      name: "Ubud Rice Terraces",
      category: "Nature",
      duration: 3,
      estimatedCost: 300,
      description: "Explore Bali's famous green rice terraces.",
    },
  ],

  Paris: [
    {
      name: "Eiffel Tower",
      category: "Sightseeing",
      duration: 3,
      estimatedCost: 2500,
      description: "Visit Paris's most iconic landmark.",
    },
    {
      name: "Louvre Museum",
      category: "Culture",
      duration: 4,
      estimatedCost: 1800,
      description: "Explore one of the world's most famous museums.",
    },
    {
      name: "Seine River Cruise",
      category: "Experience",
      duration: 2,
      estimatedCost: 1500,
      description: "See Paris from the Seine River.",
    },
  ],

  Tokyo: [
    {
      name: "Shibuya Crossing",
      category: "Sightseeing",
      duration: 2,
      estimatedCost: 0,
      description: "Experience one of Tokyo's most famous intersections.",
    },
    {
      name: "Tokyo Skytree",
      category: "Sightseeing",
      duration: 3,
      estimatedCost: 1800,
      description: "Enjoy panoramic views across Tokyo.",
    },
    {
      name: "Tsukiji Food Experience",
      category: "Food",
      duration: 3,
      estimatedCost: 2000,
      description: "Explore Tokyo's famous food culture.",
    },
  ],

  London: [
    {
      name: "Tower of London",
      category: "History",
      duration: 3,
      estimatedCost: 3200,
      description: "Explore one of London's most historic landmarks.",
    },
    {
      name: "London Eye",
      category: "Sightseeing",
      duration: 2,
      estimatedCost: 3000,
      description: "Enjoy panoramic views over central London.",
    },
    {
      name: "Thames River Cruise",
      category: "Experience",
      duration: 2,
      estimatedCost: 1800,
      description: "See London's landmarks from the River Thames.",
    },
  ],
};

async function main() {
  console.log("🌍 Seeding GlobeTrotter database...");

  for (const cityData of cities) {
    const city = await prisma.city.upsert({
      where: {
        id: cityData.name.toLowerCase().replaceAll(" ", "-"),
      },
      update: cityData,
      create: {
        id: cityData.name.toLowerCase().replaceAll(" ", "-"),
        ...cityData,
      },
    });

    console.log(`✓ City: ${city.name}`);

    const cityActivities = activities[city.name] || [];

    for (const activity of cityActivities) {
      await prisma.activity.create({
        data: {
          cityId: city.id,
          ...activity,
        },
      });

      console.log(`  → Activity: ${activity.name}`);
    }
  }

  console.log("🌍 GlobeTrotter seed completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
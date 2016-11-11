if (process.env.NODE_ENV !== 'production')
  require('dotenv').config();
const db = require('./');
const chalk = require('chalk');

const tables = {
  category: [
    { category: 'Travel' },
    { category: 'Education' }
  ],
  goal: [
    { name: 'Berlin', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/U7tCoW7VKN/original_BERLIN_banner.jpg?1473269740?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '3', location: 'Berlin, Germany', lat: 52.5200, lon: 13.4049},
    { name: 'Seoul', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/2Gie8bY8Z4/original_SEOUL_banner.jpg?1473270668?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '2', location: 'Seoul, South Korea', lat: 37.5665, lon: 126.9779},
    { name: 'Spanish', banner_pic_url: 'http://67.media.tumblr.com/f617ba026af2853a6ac08b2f584bbd3c/tumblr_ndwknxHifW1t5njdho1_1280.jpg',
      category_id: 2, price_range: '1'}
  ],
  user: [
    { first_name: 'John', last_name: 'Doe', email: 'johndoe@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'Austin, TX' },
    { first_name: 'Jane', last_name: 'Doe', email: 'janedoe@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'New York, NY' }
  ],
  snippet: [
    { goal_id: 1, title: 'Overview', description: 'Berlin—mecca of artists, bohemians, and Europe’s creative class—is an old, historic city made new again thanks to a torn-down wall, a reunified country, and an influx of young, trendsetting individuals from around the world. What was once a divided city is now a cultural capital of Europe. Maybe it\'s the up-all-night clubs or wealth of provocative art, but visitors often stay longer than expected and return frequently.' },
    { goal_id: 1, title: 'When to Go', description: 'Berlin is famous for its summers—not that they’re especially warm, but there is just so much to do. The summer season can be wet, so it’s best to pack an umbrella—though rain doesn’t stop Berliners from enjoying their city. May is often considered the best time to visit, with good weather and plenty of festivals and events. Winters in Berlin are cold (below freezing in January and February), but the cultural events don’t disappear. Locals stay busy with seasonal festivities and quirky adventures like skiing on the grounds of the former Tempelhof Airport, which is now a giant city park.' },
    { goal_id: 1, title: 'Can\'t Miss', description: 'To really get a feel for Berlin\'s cultural life, it’s best to visit one of the many parks and public spaces on a sunny afternoon or early in the evening. Görlitzer Park is one of the most popular hangouts, but you’ll find more locals at the Volkspark Friedrichshain. There’s a beer garden, a small hill for hiking, and even a fairy-tale fountain (the Märchenbrunnen).' },
    { goal_id: 2, title: 'Overview', description: 'South Korea\'s capital city is a living, breathing mashup of history and modernity. Centuries-old courtyards hug the roots of brand-new high-rises, and traditional teashops vie with Starbucks for customers. You\'ll find this contrast everywhere: from the glitz and glamour of the Gangnam district (which the world now knows thanks to Korean pop star Psy\'s massive hit song "Gangnam Style") to the grand, tranquil palaces of the Jongno area. The dynamic capital burgeons with inventive restaurants, galleries, and boutiques. Having rebuilt after the Korean War and hosted the world for the 1988 Summer Olympics, Seoul has now emerged as one of eastern Asia’s most vibrant cities.' },
    { goal_id: 2, title: 'When to Go', description: 'Seoul\'s humid subtropical climate has four distinct seasons, and there is no official “off season.” Some say that the city is at its best in the spring when cherry blossoms bloom, while others prefer fall, when leaves turn into a fiery mass of red, gold, and brown. Winters can be brutal, but they lend the capital city a whitewashed beauty. Summer temperatures often rise into the 90s, with rain falling during the late-summer typhoon period. No matter when you visit, however, there’s plenty to do both indoors and out.' },
    { goal_id: 3, title: 'Overview', description: 'No matter what those other companies say, in your heart you know that if you want to learn how to speak Spanish, you’re going to have to work at it. Anybody can do it, but you have to be willing to practice. So if you\’re serious, read on . . .' }
  ]
}

db.didSync
  .then(() => db.sync({ force: true }))
  .then(() => {
    return Promise.all(Object.keys(tables).map(table =>
      db.Promise.map(tables[table], result => db.model(table).create(result))))
  })
  .then(() => console.log(chalk.green('Database seeded')))
  .catch(error => console.log(chalk.red(error)))
  .finally(() => db.close())

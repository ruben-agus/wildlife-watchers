// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Animal = require("../models/Animal");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Random = require("../models/Random");

const bcryptSalt = 10;

mongoose
  .connect(process.env.BBDD_URL, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

let exampleUsers = [
  {
    username: "Alice",
    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(bcryptSalt)),
    picture: {
      url:
        "https://pickaface.net/gallery/avatar/MackennaMeadows542e92aa07839.png",
      originalName: "loquesea"
    },
    skill: "Novato",
    postNum: 0
  },
  {
    username: "Bob",
    password: bcrypt.hashSync("4444", bcrypt.genSaltSync(bcryptSalt)),
    picture: {
      url:
        "https://pickaface.net/gallery/avatar/unr_mrsbob_180716_0154_16ff.png",
      originalName: "whatever"
    },
    skill: "Experto",
    postNum: 0
  }
];

let exampleAnimal = [
  {
    name: "Coyote",
    description: "Similar a un lobo pero adepto a arrancarte la cara",
    animalImg: {
      url: "https://i.ytimg.com/vi/XOj6xGKEsUw/maxresdefault.jpg",
      originalName: "coyotaco.jpg"
    },
    location: { type: "Point", coordinates: [24, 24] }
  },
  {
    name: "Coyote",
    description: "Similar a un lobo pero adepto a arrancarte la cara",
    animalImg: {
      url: "https://i.ytimg.com/vi/XOj6xGKEsUw/maxresdefault.jpg",
      originalName: "coyotaco.jpg"
    },
    location: { type: "Point", coordinates: [4, 40] }
  }
];

let RandomAnimals = [
  {
    name: "Tetrao urogallus cantabricus",
    description: `<p>El urogallo cantábrico (Tetrao urogallus cantabricus) es una subespecie del urogallo occidental (Tetrao urogallus), un ave galliforme de la familia Phasianidae endémica de los montes Cantábricos. Actualmente las poblaciones están restringidas a las zonas montañosas de Asturias, algunas zonas del norte de Castilla y León (especialmente en la provincia de León) y a áreas de montaña del occidente de Cantabria. En Galicia ocupaba la comarca de Os Ancares, pero no hay constancias de cantaderos ocupados desde el año 2005.</p>`,
    animalImg:
      "https://res.cloudinary.com/rubvaldev/image/upload/v1562892116/tumblrapp/urogallo_qarahh.jpg"
  },
  {
    name: "Ursus arctos arctos",
    description: `<p>El oso pardo europeo (Ursus arctos arctos) es una subespecie del oso pardo (Ursus arctos) propia de Europa, desde la península ibérica hasta Escandinavia y Rusia. Es un habitante característico de bosques maduros de Europa, en hábitats boscosos en la zona occidental y en la oriental en hábitats de tundra. Su longevidad es de veinticinco a treinta años. Los máximos conocido son de treinta y cuatro años en estado silvestre y de cuarenta y siete en cautividad. En los Pirineos se constató que un oso al que se le denominaba «Papillón» contaba con veintinueve años cuando murió</p>.`,
    animalImg:
      "https://res.cloudinary.com/rubvaldev/image/upload/v1562892109/tumblrapp/Oso_pardo_srplko.jpg"
  },
  {
    name: "Lynx Pardinus",
    description: `<p>El lince ibérico (Lynx pardinus) es una especie de mamífero carnívoro de la familia Felidae, endémico de la
      península ibérica.</p>

    <p>En 2013 se calculaba que solo quedaban dos poblaciones en Andalucía aisladas entre sí con un total de algo
      más
      de trescientos individuos en aumento,​ más otra en los Montes de Toledo de unos quince individuos y por ello
      escasamente viable, lo que lo convierte en la especie de felinos más amenazada del mundo.​ En el año 2018 se
      estimó una población de 686 ejemplares en libertad distribuidos principalmente por Andalucía (en Parque
      Nacional
      y Natural de Doñana, en Sierra de Andújar y Sierra de Cazorla), en Castilla-La Mancha (en los Montes de
      Toledo),
      Extremadura y Portugal (Parque natural del Valle del Guadiana).</p>

    <p>También parecen haber empezado a repoblar en la provincia de Alicante, donde no se avistaban ejemplares desde
      la
      década de 1950-60. También se han avistado ejemplares en el Altiplano de Yecla-Jumilla, Región de Murcia.</p>`,
    animalImg:
      "https://res.cloudinary.com/rubvaldev/image/upload/v1562892109/tumblrapp/lynx_cg42sz.jpg"
  },
  {
    name: "Testudo graeca",
    description: `<p>La tortuga mora es una de las ocho especies de tortuga clasificadas tradicionalmente dentro del género Testudo es la especie con la distribución más extensa del género y está presente en tres continentes (Europa, África y Asia). Se conocen diecisiete subespecies diferentes. Especie paleártica occidental, en Europa está presente en: Italia, Grecia oriental, España, Turquía europea, en algunas islas del Mar Mediterráneo, a lo largo de la costa búlgara y rumana del Mar Negro.</p>`,
    animalImg:
      "https://res.cloudinary.com/rubvaldev/image/upload/v1562892109/tumblrapp/tortuga_mora_vy2wwb.jpg"
  },
  {
    name: "Aquila adalberti",
    description: `<p>El águila imperial ibérica​ (Aquila adalberti) es una especie de ave accipitriforme de la familia Accipitridae. Es una de las aves endémicas de la península ibérica. Hasta no hace mucho se la consideraba una subespecie del águila imperial (Aquila heliaca), pero los estudios de ADN de ambas aves realizados por los investigadores Seibold, Helbig, Meyburg, Negro y Wink en 1996 demostraron que estaban lo suficientemente separadas como para constituir cada una de ellas una especie válida. El águila imperial ibérica es un ave amenazada; en 2013 se censaron cuatrocientas siete parejas en la península ibérica. Su nombre binomial conmemora al príncipe Adalberto de Baviera</p>`,
    animalImg:
      "https://res.cloudinary.com/rubvaldev/image/upload/v1562892112/tumblrapp/aguila_imperial_vlg5lk.jpg"
  }
];

// let examplePost = {
//   authorId: { type: Schema.Types.ObjectId, ref: "User" },
//   postImg: {
//     url: "https://i.ytimg.com/vi/XOj6xGKEsUw/maxresdefault.jpg",
//     originalName: "coyotaco.jpg"
//   },
//   title: "Esto es un coyote",
//   content: "Los coyotes os comen desde el cogote",
//   comments: { type: Schema.Types.ObjectId, ref: "Comment" }
// };

// let exampleComment = {
//   authorId: { type: Schema.Types.ObjectId, ref: "User" },
//   content: "QUE PEDASO DE COYOTE, CABESA"
// };

User.remove()
  .then(x => {
    return Comment.remove();
  })
  .then(x => {
    return Post.remove();
  })
  .then(x => {
    return Animal.remove();
  })
  .then(x => {
    return Random.remove();
  })
  .then(x => {
    Random.create(RandomAnimals)
    .then(x => {
      let userId;
      let userBId;
      let createdCommentPayload, createdCommentPayload2;

      User.create(exampleUsers)
        .then(createdUsers => {
          console.log(createdUsers);
          userId = createdUsers[0]._id;
          userBId = createdUsers[1]._id;
          return Comment.create([
            { content: '"QUE PEDASO DE COYOTE, CABESA"', authorId: userId }
          ]);
        })
        .then(createdComment => {
          createdCommentPayload = createdComment;

          return Comment.create([
            { content: '"Comment2 with Dani"', authorId: userId }
          ]);
        })
        .then(createdComment2 => {
          createdCommentPayload2 = createdComment2;

          return Post.create([
            {
              title: "Esto es un coyote",
              content: "Los coyotes os comen desde el cogote",
              authorId: userBId,
              postImg: "https://i.ytimg.com/vi/XOj6xGKEsUw/maxresdefault.jpg",
              comments: [
                createdCommentPayload[0]._id,
                createdCommentPayload2[0]._id
              ]
            }
          ]);
        })
        .then(createdPost => {
          Post.find()
            .populate("authorId")
            .populate({
              path: "comments",
              populate: {
                path: "authorId",
                model: "User"
              }
            })
            .then(popPost => {
              Animal.create(exampleAnimal).then(createdAnimal => {
                console.log(JSON.stringify(popPost));
                process.exit(0);
              });
            });
        });
    });
  });

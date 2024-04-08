import { NODE_ENV } from "../../env";
import PostModel from "./models/post";
import UserModel from "./models/user";
import UserPostModel from "./models/user_post";
import db from "./db";

const SEED_PW = "123456";
const imageUrl = "assets/medium.webp"

type LogType = "log" | "error";
function log(message: string, type: LogType = "log") {
  // Suppress logging in test code.
  if (NODE_ENV === "test") return;

  switch (type) {
    case "error":
      return console.error(message);
    default:
      return console.log(message);
  }
}

async function seed() {
  await db.sync({ force: true });
  log("db synced!");

  const user1 = await UserModel.create({
    username: "thomas",
    password: SEED_PW,
  });

  const user2 = await UserModel.create({
    username: "santiago",
    password: SEED_PW,
  });

  const user3 = await UserModel.create({
    username: "ashanti",
    password: SEED_PW,
  });

  const user4 = await UserModel.create({
    username: "julia",
    password: SEED_PW,
  });

  const user5 = await UserModel.create({
    username: "cheng",
    password: SEED_PW,
  });

  const post1 = await PostModel.create({
    text: "Excepteur occaecat minim reprehenderit cupidatat dolore voluptate velit labore pariatur culpa esse mollit. Veniam ipsum amet eu dolor reprehenderit quis tempor pariatur labore. Tempor excepteur velit dolor commodo aute. Proident aute cillum dolor sint laborum tempor cillum voluptate minim. Amet qui eiusmod duis est labore cupidatat excepteur occaecat nulla.",
    likes: 12,
    reads: 5,
    tags: "food,recipes,baking",
    popularity: 0.19,
    imageUrl
  });

  const post2 = await PostModel.create({
    text: "Ea cillum incididunt consequat ullamco nisi aute labore cupidatat exercitation et sunt nostrud. Occaecat elit tempor ex anim non nulla sit culpa ipsum aliquip. In amet in Lorem ut enim. Consectetur ea officia reprehenderit pariatur magna eiusmod voluptate. Nostrud labore id adipisicing culpa sunt veniam qui deserunt magna sint mollit. Cillum irure pariatur occaecat amet reprehenderit nisi qui proident aliqua.",
    likes: 104,
    reads: 200,
    tags: "travel,hotels",
    popularity: 0.7,
    imageUrl
  });

  const post3 = await PostModel.create({
    text: "Voluptate consequat minim commodo nisi minim ut. Exercitation incididunt eiusmod qui duis enim sunt dolor sit nisi laboris qui enim mollit. Proident pariatur elit est elit consectetur. Velit anim eu culpa adipisicing esse consequat magna. Id do aliquip pariatur laboris consequat cupidatat voluptate incididunt sint ea.",
    likes: 10,
    reads: 32,
    tags: "travel,airbnb,vacation",
    popularity: 0.7,
    imageUrl
  });

  const post4 = await PostModel.create({
    text: "This is post 4",
    likes: 50,
    reads: 300,
    tags: "vacation,spa",
    popularity: 0.4,
    imageUrl
  });

  const post5 = await PostModel.create({
    text: "Nulla minim irure duis cillum dolore minim enim officia nulla ut. Tempor magna pariatur velit ea cillum reprehenderit. Commodo laborum ullamco est dolore ea nostrud excepteur cupidatat esse. Esse cupidatat velit aliquip aliquip consectetur duis veniam excepteur anim deserunt. Do irure id aute culpa deserunt aute sit ad irure ullamco enim non cupidatat.",
    likes: 13,
    reads: 14,
    tags: "tech,music,spa",
    popularity: 0.64,
    imageUrl
  });

  const post6 = await PostModel.create({
    text: "Id nulla sunt ipsum consectetur commodo deserunt exercitation nostrud consectetur. Aliquip irure Lorem non aliqua. Anim do eu consectetur adipisicing sunt mollit non.",
    likes: 16,
    reads: 57,
    tags: "spa,art,fashion",
    popularity: 0.68,
    imageUrl
  });

  const post7 = await PostModel.create({
    text: "Ullamco deserunt et eu aliqua est et consequat fugiat sunt adipisicing ipsum. Incididunt fugiat esse amet dolore sunt quis officia minim minim. Esse ullamco duis eu qui enim in nulla enim eu aliquip nisi sunt laboris. Est commodo aliquip dolor nulla anim.",
    likes: 11,
    reads: 38,
    tags: "vacation,fashion,food",
    popularity: 0.2,
    imageUrl
  });

  const post8 = await PostModel.create({
    text: "Ex labore cillum aute in proident nostrud in. Adipisicing tempor Lorem occaecat ea quis ad ex velit sit cillum adipisicing. Adipisicing dolore velit aliqua in sunt duis ad adipisicing. Ut duis sit deserunt mollit velit cillum aute commodo ea nisi. Laboris enim ex cillum tempor amet do proident eu consectetur. Adipisicing elit ipsum et sit sunt esse laborum enim laborum.",
    likes: 0,
    reads: 17,
    tags: "art,hotel,beach",
    popularity: 0.06,
    imageUrl
  });

  const post9 = await PostModel.create({
    text: "Quis sint amet ex ea cillum. Cillum eiusmod sit dolor proident. Exercitation enim sunt tempor tempor laborum dolor enim esse irure. Labore ut sit culpa sunt nostrud laboris. Adipisicing proident ea amet duis cillum do quis ipsum nostrud elit occaecat qui veniam. Laborum eu nostrud laboris labore ipsum id non Lorem dolor.",
    likes: 0,
    reads: 71,
    tags: "art,spa,beach",
    popularity: 0.78,
    imageUrl
  });

  // Assigning posts to users
  await UserPostModel.create({
    userId: user1.id,
    postId: post1.id,
  });

  for (const post of [post1, post2, post3]) {
    await UserPostModel.create({
      userId: user2.id,
      postId: post.id,
    });
  }

  for (const post of [post3, post4, post5]) {
    await UserPostModel.create({
      userId: user3.id,
      postId: post.id,
    });
  }

  for (const post of [post4, post5, post6, post7]) {
    await UserPostModel.create({
      userId: user4.id,
      postId: post.id,
    });
  }

  for (const post of [post5, post6, post7, post8, post9]) {
    await UserPostModel.create({
      userId: user5.id,
      postId: post.id,
    });
  }

  log("seeded users and posts");
}

async function runSeed() {
  log("seeding...");
  try {
    await seed();
  } catch (err) {
    if (err instanceof Error) log(String(err), "error");
    process.exitCode = 1;
  } finally {
    log("closing db connection");
    await db.close();
    log("db connection closed");
  }
}

if (module === require.main) {
  runSeed();
}

export default seed;

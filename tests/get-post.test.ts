import globals from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { makeToken } from "./utils";

const { describe, it, expect } = globals;

describe("GET /api/post", () => {
  it("should return 401 unauthorized", async () => {
    const res = await request(app)
      .get("/api/posts")
      .query({ authorIds: "2" })
      .send();
    expect(res.status).toEqual(401);
    expect(res.body.error).toEqual("unauthorized");
  });

  it("should return 400 authorIds required", async () => {
    const token = makeToken(2);
    const res = await request(app)
      .get("/api/posts")
      .set("x-access-token", token)
      .send();
    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual("Invalid authorIds parameter");
  });

  it("should return  return all posts of author ID 2 in likes order desc.", async () => {
    const token = makeToken(2);
    const res = await request(app)
      .get("/api/posts")
      .set("x-access-token", token)
      .query({ authorIds: "2", sortBy: "likes", direction: "desc" })
      .send();
    expect(res.body).toEqual({
      posts: [
        {
          tags: ["travel", "hotels"],
          id: 2,
          text: "Ea cillum incididunt consequat ullamco nisi aute labore cupidatat exercitation et sunt nostrud. Occaecat elit tempor ex anim non nulla sit culpa ipsum aliquip. In amet in Lorem ut enim. Consectetur ea officia reprehenderit pariatur magna eiusmod voluptate. Nostrud labore id adipisicing culpa sunt veniam qui deserunt magna sint mollit. Cillum irure pariatur occaecat amet reprehenderit nisi qui proident aliqua.",
          likes: 104,
          reads: 200,
          imageUrl: "assets/medium.webp",
          popularity: 0.7,
        },
        {
          tags: ["food", "recipes", "baking"],
          id: 1,
          text: "Excepteur occaecat minim reprehenderit cupidatat dolore voluptate velit labore pariatur culpa esse mollit. Veniam ipsum amet eu dolor reprehenderit quis tempor pariatur labore. Tempor excepteur velit dolor commodo aute. Proident aute cillum dolor sint laborum tempor cillum voluptate minim. Amet qui eiusmod duis est labore cupidatat excepteur occaecat nulla.",
          likes: 12,
          imageUrl: "assets/medium.webp",
          reads: 5,
          popularity: 0.19,
        },
        {
          tags: ["travel", "airbnb", "vacation"],
          id: 3,
          text: "Voluptate consequat minim commodo nisi minim ut. Exercitation incididunt eiusmod qui duis enim sunt dolor sit nisi laboris qui enim mollit. Proident pariatur elit est elit consectetur. Velit anim eu culpa adipisicing esse consequat magna. Id do aliquip pariatur laboris consequat cupidatat voluptate incididunt sint ea.",
          likes: 10,
          reads: 32,
          imageUrl: "assets/medium.webp",
          popularity: 0.7,
        },
      ],
    });
    expect(res.status).toEqual(200);
  });
  it("should return return all posts of author ID 2 and 3 in reads order desc without redundancy.", async () => {
    const token = makeToken(2);
    const res = await request(app)
      .get("/api/posts")
      .set("x-access-token", token)
      .query({ authorIds: "2,3", sortBy: "reads", direction: "desc" })
      .send();
    expect(res.body).toEqual({
      posts: [
        {
          tags: ["vacation", "spa"],
          id: 4,
          text: "This is post 4",
          likes: 50,
          imageUrl: "assets/medium.webp",
          reads: 300,
          popularity: 0.4,
        },
        {
          tags: ["travel", "hotels"],
          id: 2,
          text: "Ea cillum incididunt consequat ullamco nisi aute labore cupidatat exercitation et sunt nostrud. Occaecat elit tempor ex anim non nulla sit culpa ipsum aliquip. In amet in Lorem ut enim. Consectetur ea officia reprehenderit pariatur magna eiusmod voluptate. Nostrud labore id adipisicing culpa sunt veniam qui deserunt magna sint mollit. Cillum irure pariatur occaecat amet reprehenderit nisi qui proident aliqua.",
          likes: 104,
          imageUrl: "assets/medium.webp",
          reads: 200,
          popularity: 0.7,
        },
        {
          tags: ["travel", "airbnb", "vacation"],
          id: 3,
          text: "Voluptate consequat minim commodo nisi minim ut. Exercitation incididunt eiusmod qui duis enim sunt dolor sit nisi laboris qui enim mollit. Proident pariatur elit est elit consectetur. Velit anim eu culpa adipisicing esse consequat magna. Id do aliquip pariatur laboris consequat cupidatat voluptate incididunt sint ea.",
          likes: 10,
          reads: 32,
          imageUrl: "assets/medium.webp",
          popularity: 0.7,
        },
        {
          tags: ["tech", "music", "spa"],
          id: 5,
          text: "Nulla minim irure duis cillum dolore minim enim officia nulla ut. Tempor magna pariatur velit ea cillum reprehenderit. Commodo laborum ullamco est dolore ea nostrud excepteur cupidatat esse. Esse cupidatat velit aliquip aliquip consectetur duis veniam excepteur anim deserunt. Do irure id aute culpa deserunt aute sit ad irure ullamco enim non cupidatat.",
          likes: 13,
          reads: 14,
          imageUrl: "assets/medium.webp",
          popularity: 0.64,
        },
        {
          tags: ["food", "recipes", "baking"],
          id: 1,
          text: "Excepteur occaecat minim reprehenderit cupidatat dolore voluptate velit labore pariatur culpa esse mollit. Veniam ipsum amet eu dolor reprehenderit quis tempor pariatur labore. Tempor excepteur velit dolor commodo aute. Proident aute cillum dolor sint laborum tempor cillum voluptate minim. Amet qui eiusmod duis est labore cupidatat excepteur occaecat nulla.",
          likes: 12,
          reads: 5,
          imageUrl: "assets/medium.webp",
          popularity: 0.19,
        },
      ],
    });
    expect(res.status).toEqual(200);
  });
});

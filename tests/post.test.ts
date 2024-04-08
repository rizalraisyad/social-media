import globals from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { makeToken } from "./utils";

const { describe, it, expect } = globals;

// ---------------------------------------------------------------- //
//                                                                  //
//                 PLEASE DO NOT MODIFY THIS FILE.                  //
//               Hatchways automation depends on it.                //
//                                                                  //
// ---------------------------------------------------------------- //

describe("GET /api/post", () => {
  it("should return all posts of author ID 2 in specific order.", async () => {
    const token = makeToken(2);
    const res = await request(app)
      .get("/api/posts")
      .set("x-access-token", token)
      .query({ authorIds: "2" })
      .send();
    expect(res.body).toEqual({
      posts: [
        {
          tags: ["food", "recipes", "baking"],
          id: 1,
          text: "Excepteur occaecat minim reprehenderit cupidatat dolore voluptate velit labore pariatur culpa esse mollit. Veniam ipsum amet eu dolor reprehenderit quis tempor pariatur labore. Tempor excepteur velit dolor commodo aute. Proident aute cillum dolor sint laborum tempor cillum voluptate minim. Amet qui eiusmod duis est labore cupidatat excepteur occaecat nulla.",
          likes: 12,
          reads: 5,
          popularity: 0.19,
        },
        {
          tags: ["travel", "hotels"],
          id: 2,
          text: "Ea cillum incididunt consequat ullamco nisi aute labore cupidatat exercitation et sunt nostrud. Occaecat elit tempor ex anim non nulla sit culpa ipsum aliquip. In amet in Lorem ut enim. Consectetur ea officia reprehenderit pariatur magna eiusmod voluptate. Nostrud labore id adipisicing culpa sunt veniam qui deserunt magna sint mollit. Cillum irure pariatur occaecat amet reprehenderit nisi qui proident aliqua.",
          likes: 104,
          reads: 200,
          popularity: 0.7,
        },
        {
          tags: ["travel", "airbnb", "vacation"],
          id: 3,
          text: "Voluptate consequat minim commodo nisi minim ut. Exercitation incididunt eiusmod qui duis enim sunt dolor sit nisi laboris qui enim mollit. Proident pariatur elit est elit consectetur. Velit anim eu culpa adipisicing esse consequat magna. Id do aliquip pariatur laboris consequat cupidatat voluptate incididunt sint ea.",
          likes: 10,
          reads: 32,
          popularity: 0.7,
        },
      ],
    });
    expect(res.status).toEqual(200);
  });
});

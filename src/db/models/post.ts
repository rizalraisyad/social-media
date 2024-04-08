import Sequelize, {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  STRING,
} from "sequelize";

import UserPost from "./user_post";
import UserPostModel from "./user_post";


export enum allowedSortBy {
  id = "id",
  reads = "reads",
  likes = "likes",
  popularity = "popularity",
}

export enum allowedDirection {
  asc = "asc",
  desc = "desc",
}

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare text: string;
  declare imageUrl: string;
  declare likes: CreationOptional<number>;
  declare reads: CreationOptional<number>;
  declare popularity: CreationOptional<number>;
  declare tags: CreationOptional<string>;

  public static async getPostsByUserIds(
    userId: number[],
    sortBy: allowedSortBy,
    direction: allowedDirection
  ) {
    let result = await Post.findAll({
      include: [
        {
          model: UserPost,
          attributes: [],
          where: {
            userId: {
              [Sequelize.Op.in]: userId,
            },
          },
        },
      ],
      order: [[sortBy, direction]],
    });

    return convertTagsToArray(result);
  }
  public static async insertPost(
    tags: string[],
    text: string,
    imageUrl: string,
    userId?: number,
  ) {
    let transaction;
    try {
      if (Post.sequelize) {
        transaction = await Post.sequelize.transaction();

        const post = await Post.create(
          {
            text,
            imageUrl,
            tags: tags?.join(","),
          },
          { transaction }
        );

        if (userId) {
          await UserPostModel.create(
            {
              userId: userId,
              postId: post.id,
            },
            { transaction }
          );
        }
        await transaction.commit();

        return post;
      } else {
        throw new Error("Sequelize is not initialized");
      }
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }

  public static async updatePost(
    postId: number,
    text: string,
    tags: string[],
    imageUrl: string,
  ) {
    let transaction;
    try {
      if (Post.sequelize) {
        transaction = await Post.sequelize.transaction();
  
        const postToUpdate = await Post.findByPk(postId);
  
        if (!postToUpdate) {
          throw new Error(`Post with id ${postId} not found.`);
        }
  
        postToUpdate.text = text;
        postToUpdate.imageUrl = imageUrl;
        postToUpdate.tags = tags.join(",");
  
        await postToUpdate.save({ transaction });
        await transaction.commit();
  
        return postToUpdate;
      } else {
        throw new Error("Sequelize is not initialized");
      }
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }

  public static async deletePost(id: number) {
    let transaction;
    try {
      if (Post.sequelize) {
        transaction = await Post.sequelize.transaction();
  
        // First, find the post to delete
        const postToDelete = await Post.findByPk(id);
  
        if (!postToDelete) {
          throw new Error(`Post with id ${id} not found.`);
        }
  
        await UserPostModel.destroy({
          where: {
            postId: id
          },
          transaction
        });
  
        await postToDelete.destroy({
          transaction
        });
  
        await transaction.commit();
  
        return postToDelete;
      } else {
        throw new Error("Sequelize is not initialized");
      }
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }

  public static initWithDatabase(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        text: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        likes: {
          type: Sequelize.NUMBER,
          allowNull: false,
          defaultValue: 0,
        },
        reads: {
          type: Sequelize.NUMBER,
          allowNull: false,
          defaultValue: 0,
        },
        imageUrl: {
          type: Sequelize.STRING,
        },
        popularity: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0.0,
          validate: {
            min: 0.0,
            max: 1.0,
          },
        },
        tags: {
          // note: comma separated string since sqlite does not support arrays
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "post",
        sequelize,
        timestamps: false,
        underscored: true,
        freezeTableName: true,
      }
    );
  }
}

// complexity o(n->n2)
function convertTagsToArray(posts: Post[]) {
  return posts.map((post) => ({
    id: post.id,
    text: post.text,
    likes: post.likes,
    reads: post.reads,
    popularity: post.popularity,
    imageUrl: post.imageUrl,
    tags: post.tags ? post.tags.split(",") : [],
  }));
}

export default Post;

import Sequelize, {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import bcrypt from "bcrypt";
import axios, { AxiosHeaders } from "axios";

const setSaltAndPassword = (user: User): void => {
  if (user.changed("password")) {
    user.salt = User.createSalt();
    user.password = User.encryptPassword(user.password, user.salt);
  }
};

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare password: string;
  declare salt: CreationOptional<string>;

  public static async getUser(
    userId: number,
  ) {
    let result = await User.findOne({
      where: {
        id: userId
      }
    });

    return result;
  }

  public static async getUserRandomQuote(
  ) {
    const headers = new AxiosHeaders({
      foo: '1',
      bar: '2',
      baz: '3'
    });
    const result = await axios.get("https://api.api-ninjas.com/v1/quotes?category=happiness", {
      headers:{
        "X-Api-Key": "W5bfR9zAkxT xmx3oKLtoQg==SvctVg5IwDygwFL7"
      }
    })

    return result.data;
  }

  public static async getUsersWithPosts() {
    try {
      const results = await User?.sequelize?.query("select user.id, username, post.id, post.text, post.tags from user left join user_post on user_post.user_id = user.id left join post on post.id = user_post.post_id");

      return results;
    } catch (error) {
      console.error('Error retrieving users with posts:', error);
      throw error;
    }
  }

  public static createSalt(): string {
    return bcrypt.genSaltSync(8);
  }

  public static encryptPassword(plainPassword: string, salt: string): string {
    return bcrypt.hashSync(plainPassword, salt);
  }

  public correctPassword(password: string) {
    return User.encryptPassword(password, this.salt) === this.password;
  }

  public static initWithDatabase(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          validate: {
            min: 6,
          },
          allowNull: false,
        },
        salt: {
          type: Sequelize.STRING,
        },
      },
      {
        tableName: "user",
        sequelize,
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        hooks: {
          beforeCreate: setSaltAndPassword,
          beforeUpdate: setSaltAndPassword,
          beforeBulkCreate: (users) => {
            users.forEach(setSaltAndPassword);
          },
        },
      }
    );
  }
}

export default User;

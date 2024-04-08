import Sequelize, {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Model,
  } from "sequelize";
  
  class Book extends Model<InferAttributes<Book>, InferCreationAttributes<Book>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare url: string;
  
    public static initWithDatabase(sequelize: Sequelize.Sequelize) {
      this.init(
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          url: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        },
        {
          tableName: "book",
          sequelize,
          timestamps: false,
          underscored: true,
          freezeTableName: true,
        }
      );
    }
  }
  
  export default Book;
  
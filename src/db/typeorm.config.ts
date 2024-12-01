import { TypeOrmModuleOptions } from "@nestjs/typeorm";
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: "postgres.gcp.corover.ai",
  port: 5432,
  username: "postgres",
  password: "PVc)4tWX$oMB",
  database: "postgres",
  schema: "test",
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  synchronize: false,
};
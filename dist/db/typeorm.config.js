"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
exports.typeOrmConfig = {
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
//# sourceMappingURL=typeorm.config.js.map
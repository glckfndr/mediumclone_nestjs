import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
const ormconfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  password: '123',
  database: 'mediumclone',
};
export default ormconfig;

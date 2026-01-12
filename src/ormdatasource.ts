import { DataSource } from 'typeorm';
import ormconfig from '@app/ormconfig';

const AppDataSource = new DataSource(ormconfig);
export default AppDataSource;

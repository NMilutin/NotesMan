import postgres from 'postgres';
import * as env from '$env/static/private';

let sql = postgres(env.POSTGRES_URL);
export default sql;

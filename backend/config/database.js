import { Sequelize } from 'sequelize';

// Support both connection string and individual parameters
let sequelize;

if (process.env.DATABASE_URL) {
  // Use connection string if provided
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Use individual parameters
  const isLocalhost = (process.env.DB_HOST || 'localhost') === 'localhost';
  const isTest = process.env.NODE_ENV === 'test';
  
  sequelize = new Sequelize(
    process.env.DB_NAME || 'neondb',
    process.env.DB_USER || 'neondb_owner',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      dialectOptions: isLocalhost || isTest ? {} : {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

const connectDB = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting to connect to PostgreSQL database... (Attempt ${i + 1}/${retries})`);
      if (process.env.DATABASE_URL) {
        console.log('Using connection string');
      } else {
        console.log('Host:', process.env.DB_HOST || 'localhost');
      }
      
      await sequelize.authenticate();
      console.log('✓ PostgreSQL connection established successfully.');
      
      // Sync models (in development, use { alter: true } or { force: true } carefully)
      if (process.env.NODE_ENV === 'development') {
        console.log('Synchronizing database models...');
        await sequelize.sync({ alter: false });
        console.log('✓ Database models synchronized.');
      }
      return; // Success, exit function
    } catch (error) {
      console.error(`✗ Connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('✗ Unable to connect to PostgreSQL database after', retries, 'attempts');
        console.error('Error details:', error.message);
        if (error.original) {
          console.error('Original error:', error.original.message);
        }
        throw error;
      }
    }
  }
};

export { sequelize };
export default connectDB;

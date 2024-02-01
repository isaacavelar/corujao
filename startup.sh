if [ $NODE_ENV = "prod" ]; then
  npm run start;
else
  npm run start:local
fi
module.exports = {
  apps: [
    {
      name: "papiro-frontend",
      cwd: "/home/catarina_ubuntu/app/frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

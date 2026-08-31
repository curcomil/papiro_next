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
        // Dirección del backend
        API_URL: "http://127.0.0.1:5000",
        // Servidor de pruebas sin TLS: permite guardar la cookie de sesión por HTTP.
        // Quitar esta línea cuando haya HTTPS.
        COOKIE_SECURE: "false",
      },
    },
  ],
};

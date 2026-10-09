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
        // Sin TLS (HTTP) el frontend deduce que la cookie NO debe ser `Secure`
        // leyendo el protocolo real de la petición (x-forwarded-proto), así que
        // ya no hace falta fijar COOKIE_SECURE aquí. Solo se usa como override
        // manual; con TLS terminado en un proxy se detecta automáticamente.
        // COOKIE_SECURE: "false",
      },
    },
  ],
};

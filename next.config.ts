import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

const nextConfig: NextConfig = {
  reactCompiler: true,

  /**
   * Los binarios (imágenes de los items) los sirve la API Flask en otro puerto.
   * Se proxean por el propio origen del frontend para que el navegador nunca
   * tenga que alcanzar `127.0.0.1:5000`:
   *
   *   - `127.0.0.1` es el loopback de la MÁQUINA DEL NAVEGADOR, no del servidor,
   *     así que si entras desde otra máquina por la IP de LAN la imagen no
   *     resuelve.
   *   - Chrome bloquea ese salto con Private Network Access ("not a secure
   *     context and the resource is in more-private address space `loopback`").
   *
   * Con el proxy, el navegador pide `/api/xmlibris/getfile/...` a su origen
   * (mismo origen → sin CORS y sin PNA) y el servidor de Next lo reenvía a la
   * API, que sí es local para él.
   */
  async rewrites() {
    return [
      {
        source: "/api/xmlibris/:path*",
        destination: `${API_URL}/api/xmlibris/:path*`,
      },
    ];
  },
};

export default nextConfig;

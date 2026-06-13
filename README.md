# UMBRAL: Archivo de Lectura Juridica

RPG educativo de comprension lectora juridica construido con Next.js, TypeScript,
Tailwind CSS, Framer Motion y React Three Fiber. Todo el progreso se guarda de
forma local y el contenido vive en JSON para facilitar una futura migracion a
Supabase o a un CMS.

## Desarrollo

```bash
npm install
npm run sounds
npm run dev
```

## Verificacion

```bash
npm test
npm run build
```

Los sonidos son tonos originales generados localmente. La escena 3D es
procedural y no utiliza modelos, texturas ni assets con licencias externas.

## Despliegue en Vercel

El proyecto no requiere variables de entorno ni servicios externos. Vercel
detecta automáticamente Next.js y usa el `package-lock.json` para instalar las
dependencias.

1. Importa el repositorio desde el panel de Vercel.
2. Conserva `Next.js` como Framework Preset.
3. Usa la raíz del repositorio como Root Directory.
4. Mantén `npm run build` como Build Command.
5. No configures Output Directory ni variables de entorno.
6. Pulsa Deploy.

La versión de ejecución queda fijada en Node.js 24.x mediante `engines.node`.

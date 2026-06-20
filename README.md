# Mis Tareas — Practica de Desarrollo Movil (Expo + SQLite)

Pequena aplicacion movil (React Native con Expo) que guarda una lista de tareas en una base de datos SQLite que corre completamente en el dispositivo/navegador, sin servidores ni cuentas externas.

Este proyecto es la base de la practica de **Desarrollo Movil**: generar tu propio repositorio en GitHub, abrirlo en GitHub Codespaces, configurarlo desde la terminal y previsualizar la app antes de entregarla.

## Tecnologias

- **React Native + Expo** — framework para apps moviles, con vista previa web integrada.
- **sql.js** — el motor real de SQLite compilado a WebAssembly, ejecutandose en el navegador. Es la pieza que actua como "la base de datos pequena" de este sistema.
- **localStorage del navegador** — para que los datos sobrevivan si recargas la pagina (la base de datos se exporta y se vuelve a cargar automaticamente).

> Nota tecnica: Expo tiene un paquete oficial llamado `expo-sqlite`, pero su soporte para **web** sigue marcado como alfa/inestable por el propio equipo de Expo (requiere configuracion especial de cabeceras HTTP que no siempre sobrevive el proxy de Codespaces). Por eso esta practica usa `sql.js` directamente: es SQLite real, compilado a WebAssembly, y funciona de forma estable en cualquier navegador sin configuracion adicional.

## Como ejecutar esto en GitHub Codespaces

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu_correo@ejemplo.com"

npm install
npx expo start --web
```

Cuando el servidor inicie, Codespaces detectara el puerto **8081** y te ofrecera abrir una vista previa en el navegador (o usa la pestana "PORTS" para abrirlo manualmente).

## Estructura del proyecto

```
practica-movil-sqlite/
├── .devcontainer/devcontainer.json   # Configuracion del entorno de Codespaces
├── App.js                            # Pantalla principal (lista de tareas)
├── app.json                          # Configuracion de la app Expo
├── index.js                          # Punto de entrada
├── public/sql-wasm.wasm              # Motor de SQLite compilado a WebAssembly
├── src/db.js                         # Toda la logica de la base de datos (CRUD)
└── package.json
```

## Funcionalidad de la app

- Agregar una tarea nueva.
- Marcarla como completada (toca el circulo).
- Eliminarla.
- Los datos persisten aunque recargues la pagina (se guardan en `localStorage`).

## Materia

Desarrollo Movil — Prof. Edgar Banos

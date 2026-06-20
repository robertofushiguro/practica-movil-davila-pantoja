import initSqlJs from "sql.js/dist/sql-wasm.js";

const STORAGE_KEY = "practica_tareas_db_v1";

let SQLEngine = null;
let dbInstance = null;
let initPromise = null;

function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return typeof btoa === "function" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
}

function base64ToBytes(base64) {
  const binary = typeof atob === "function" ? atob(base64) : Buffer.from(base64, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function persist() {
  if (!dbInstance || typeof window === "undefined" || !window.localStorage) return;
  try {
    const bytes = dbInstance.export();
    window.localStorage.setItem(STORAGE_KEY, bytesToBase64(bytes));
  } catch (err) {
    console.warn("No se pudo guardar la base de datos en localStorage:", err);
  }
}

async function initDb() {
  if (dbInstance) return dbInstance;
  if (!initPromise) {
    initPromise = (async () => {
      SQLEngine = await initSqlJs({ locateFile: (file) => "/" + file });

      let restored = null;
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            restored = new SQLEngine.Database(base64ToBytes(saved));
          } catch (err) {
            console.warn("Base de datos guardada estaba corrupta, se creara una nueva.", err);
          }
        }
      }

      dbInstance = restored || new SQLEngine.Database();

      dbInstance.run(`
        CREATE TABLE IF NOT EXISTS tareas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          hecha INTEGER NOT NULL DEFAULT 0,
          creada_en TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        );
      `);

      persist();
      return dbInstance;
    })();
  }
  return initPromise;
}

function statementToRows(stmt) {
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

export async function getTareas() {
  const db = await initDb();
  const stmt = db.prepare("SELECT * FROM tareas ORDER BY id DESC");
  return statementToRows(stmt);
}

export async function addTarea(titulo) {
  const db = await initDb();
  db.run("INSERT INTO tareas (titulo) VALUES (?)", [titulo]);
  persist();
  return getTareas();
}

export async function toggleTarea(id, hecha) {
  const db = await initDb();
  db.run("UPDATE tareas SET hecha = ? WHERE id = ?", [hecha ? 1 : 0, id]);
  persist();
  return getTareas();
}

export async function deleteTarea(id) {
  const db = await initDb();
  db.run("DELETE FROM tareas WHERE id = ?", [id]);
  persist();
  return getTareas();
}

export async function getSqliteVersion() {
  const db = await initDb();
  const stmt = db.prepare("SELECT sqlite_version() as v");
  const rows = statementToRows(stmt);
  return rows[0]?.v || "desconocida";
}

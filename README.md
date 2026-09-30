# Altura — web de turismo

Proyecto demostrativo de agencia de turismo en Bolivia, creado con **React + Vite**. Incluye diseño adaptable a móvil, catálogo de destinos, filtros, búsqueda, fichas de experiencias y generación local de una solicitud de viaje en `.txt`.

> El formulario no envía datos a un servidor ni confirma reservas. Los itinerarios son ilustrativos. Las fotografías y tipografías se cargan desde servicios externos y requieren conexión a Internet.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

En Windows PowerShell usa `npm.cmd` si `npm` está bloqueado por la política de ejecución.

## Ejecutar en tu equipo

Desde esta carpeta:

```powershell
npm.cmd install
npm.cmd run dev
```

Abre la dirección local que muestre Vite (normalmente `http://localhost:5173`). Para generar los archivos de publicación:

```powershell
npm.cmd run build
```

El resultado estará en `dist/`. **No subas** `node_modules/` ni las claves privadas `.key` a la VM ni a un repositorio.

## ¿Es obligatorio usar GitHub?

**No.** Para esta web puedes compilar en tu equipo y copiar `dist/` directamente a la VM con `scp`, como se explica abajo. GitHub es opcional para guardar el historial, colaborar o respaldar el código.

Si decides crear un repositorio, hazlo **dentro de `turismo-altura/`**, no en la carpeta padre donde están tus claves SSH. La `.gitignore` del proyecto excluye `node_modules/`, `dist/`, `.env` y archivos `.key`/`.pem`. Antes de publicar, revisa los archivos que vas a incluir y nunca subas una clave privada. No es necesario instalar Git ni Node.js en la VM si usas el método `scp` de esta guía.

## Publicar en Oracle Cloud (Ubuntu 22.04 + Nginx)

Necesitas la IP pública de tu VM Ubuntu 22.04 y la clave SSH privada correspondiente. Usa la clave solo desde tu equipo. Para este despliegue bastan los puertos TCP **22** (SSH) y **80** (HTTP). Abrir **443** no activa HTTPS por sí solo.

### 1. Comprobar la red en OCI

Comprueba que la VM tenga reglas de entrada para **SSH (22)** y **HTTP (80)**. Puedes habilitar **HTTPS (443)** cuando configures un dominio y certificado TLS.

### 2. Entrar a la VM

En PowerShell, desde la carpeta padre de `turismo-altura`:

```powershell
$key = '.\TU_CLAVE_PRIVADA.key'
$ip = 'IP_PUBLICA_DE_TU_VM'
ssh -i $key "ubuntu@$ip"
```

Si SSH indica permisos inseguros de la clave en Windows, ajusta los permisos del archivo para que solo tu usuario tenga acceso de lectura.

### 3. Instalar Nginx en Ubuntu

Dentro de la VM:

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable --now nginx
mkdir -p ~/altura-dist
```

Deja esa sesión SSH abierta. En **otra terminal PowerShell**, desde la carpeta `turismo-altura`, copia únicamente el resultado de `npm.cmd run build`:

```powershell
$key = '..\TU_CLAVE_PRIVADA.key'
$ip = 'IP_PUBLICA_DE_TU_VM'
scp -i $key -r .\dist\* "ubuntu@${ip}:~/altura-dist/"
```

### 4. Configurar el sitio

Vuelve a la sesión SSH de Ubuntu:

```bash
sudo mkdir -p /var/www/altura
sudo cp -a ~/altura-dist/. /var/www/altura/
sudo nano /etc/nginx/sites-available/altura
```

Pega este bloque en `nano` y guarda con **Ctrl+O**, Enter, **Ctrl+X**:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name _;
    root /var/www/altura;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Activa la configuración y verifica Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/altura /etc/nginx/sites-enabled/altura
sudo unlink /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Si `ufw` está activo, permite HTTP antes de probar desde fuera:

```bash
sudo ufw status
sudo ufw allow 80/tcp
```

Abre **http://IP_PUBLICA_DE_TU_VM** en tu navegador, reemplazando el marcador por tu IP real. Si ves la página predeterminada de Nginx, revisa que `default` se haya desactivado y que la configuración de Altura esté habilitada. Si la conexión expira, comprueba la regla de entrada de OCI y el cortafuegos de la VM.

### Actualizaciones

Después de cambiar el código, vuelve a ejecutar `npm.cmd run build` en tu equipo, copia `dist/*` con `scp` y en la VM ejecuta `sudo cp -a ~/altura-dist/. /var/www/altura/`. Nginx servirá los archivos actualizados.

## Antes de usarlo como agencia real

Conecta el formulario a un servicio o API de reservas, reemplaza el contenido demostrativo por ofertas verificadas, revisa permisos de uso de las fotos y agrega un dominio con HTTPS.

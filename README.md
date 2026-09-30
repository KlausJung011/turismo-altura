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

## Publicar desde GitHub en Oracle Cloud (Ubuntu 22.04)

La VM puede descargar este repositorio público por HTTPS sin credenciales de GitHub. Necesitas **Git**, **Node.js 22.12 o superior** y **Nginx** en Ubuntu. La clave SSH privada solo se utiliza en tu computadora para entrar a la VM; nunca se sube a GitHub ni se copia al servidor. Asegúrate de que OCI permita SSH (22) y HTTP (80). El puerto 443 requiere configurar HTTPS por separado.

1. Conéctate por SSH a la VM como `ubuntu` con su IP pública y la clave privada asociada.
2. En Ubuntu, instala Git, Nginx y Node.js 22. Las [instrucciones de NodeSource](https://github.com/nodesource/distributions/blob/master/DEV_README.md) cubren Ubuntu 22.04.
3. Descarga y compila la web:

   ```bash
   cd ~
   git clone https://github.com/KlausJung011/turismo-altura.git
   cd ~/turismo-altura
   npm ci --include=dev
   npm run build
   sudo install -d -m 755 /var/www/altura
   sudo cp -a dist/. /var/www/altura/
   ```

4. Configura Nginx para servir `/var/www/altura` por HTTP:

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

   Guarda el bloque en `/etc/nginx/sites-available/altura`, actívalo en `sites-enabled`, desactiva el sitio predeterminado si sigue activo, ejecuta `sudo nginx -t` y luego `sudo systemctl reload nginx`.

   Comprueba también `sudo iptables -L INPUT -n --line-numbers`. En imágenes Ubuntu de OCI puede existir una regla `REJECT` que bloquee el puerto 80 aunque Nginx funcione y `ufw` esté inactivo. La regla que permite TCP 80 debe estar **antes** de `REJECT` y guardarse con `netfilter-persistent`. [Oracle indica revisar tanto las reglas de red de OCI como el cortafuegos de la instancia](https://docs.oracle.com/en-us/iaas/tools/oci-cli/latest/oci_cli_docs/cmdref/network/security-list.html) y [desaconseja usar UFW para editar las reglas de sus imágenes Ubuntu](https://docs.oracle.com/en-us/iaas/Content/Compute/References/bestpracticescompute.htm).

Para actualizar la web después de publicar cambios en GitHub:

```bash
cd ~/turismo-altura
git pull --ff-only origin main
npm ci --include=dev
npm run build
sudo cp -a dist/. /var/www/altura/
```

La versión detallada, con comandos para la instancia del curso y la explicación de cada uno, está en `COMANDOS_DESPLIEGUE_VM.md` **fuera de este repositorio**.

## Antes de usarlo como agencia real

Conecta el formulario a un servicio o API de reservas, reemplaza el contenido demostrativo por ofertas verificadas, revisa permisos de uso de las fotos y agrega un dominio con HTTPS.

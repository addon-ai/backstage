## Analisis detallado de componentes de Backstage

#### 👤 Actor

* **Developer:** El usuario final del sistema. Es un ingeniero o miembro del equipo de desarrollo que accede a la plataforma Backstage para descubrir, crear y gestionar software.

---

#### 🖥️ Backstage Platform (Web Browser)

El `Backstage Frontend` es la aplicación de una sola página (SPA) construida en React que se ejecuta en el navegador del desarrollador.

* **App Shell:** El componente principal de la interfaz de usuario. Es el "caparazón" de la aplicación que proporciona la estructura general, como la barra de navegación lateral, la barra de búsqueda y el enrutamiento. Carga todos los demás plugins de UI.
* **Catalog UI:** El plugin de UI que permite a los desarrolladores ver, buscar y filtrar el catálogo de software. Es la interfaz visual del `Catalog Backend`.
* **Scaffolder UI:** El plugin de UI que proporciona un formulario o "asistente" para que los desarrolladores creen nuevos proyectos o componentes a partir de plantillas predefinidas.
* **TechDocs UI:** El plugin de UI responsable de renderizar la documentación técnica (construida por el `TechDocs Backend`) para que los desarrolladores puedan leerla dentro de Backstage.
* **Plugin UIs:** Un componente genérico que representa las interfaces de usuario de todos los demás plugins de terceros o personalizados (ej. dashboards de CI/CD, estado de SRE, costos de la nube).

---

#### ⚙️ Backstage Platform (Backend)

El `Backstage Backend` es un servidor de Node.js que actúa como la capa de lógica de negocio, API y orquestación.

* **Core System:** El núcleo del backend que proporciona servicios compartidos para todos los plugins.
    * **Plugin Manager:** Carga y gestiona el ciclo de vida de todos los demás plugins de backend.
    * **API Gateway:** El punto de entrada para todas las solicitudes de la API del frontend. Enruta las solicitudes al plugin de backend correcto (ej. `/catalog`, `/scaffolder`).
    * **Auth Service:** Maneja la autenticación de usuarios. Se comunica con los `Auth Providers` externos para verificar la identidad y luego emite tokens para la sesión del usuario.
* **Catalog Backend:** El "corazón" de Backstage. Este plugin es responsable de escanear los `Git Providers` en busca de archivos `catalog-info.yaml`, procesar esa metadata y almacenarla en la base de datos (`Catalog Metadata`).
* **Scaffolder Backend:** Este plugin contiene la lógica para crear nuevo software. Recibe solicitudes de la UI, obtiene los `Templates` de Git, ejecuta la lógica de la plantilla (ej. crear un nuevo repo, configurar CI/CD) y registra el nuevo componente en el `Catalog Backend`.
* **TechDocs Backend:** Este plugin es responsable de encontrar la fuente de la documentación (`mkdocs.yml` en Git), construirla en un sitio estático y servirla a la `TechDocs UI`.
* **Backend Plugins:** Un componente genérico para todos los demás plugins de backend que se comunican con sistemas externos (ej. un plugin para consultar el estado de un build en `CI/CD Systems` o métricas de `Monitoring Tools`).
* **Database (PostgreSQL):** La capa de persistencia.
    * **Catalog Metadata:** La tabla (o conjunto de tablas) donde se almacena el catálogo de software procesado.
    * **User Data:** Almacena información relacionada con los usuarios y permisos.
    * **System Config:** Almacena configuraciones del sistema, estado de `TechDocs`, etc.

---

#### 🌎 External Systems & Repositories

Estos son los sistemas de terceros con los que Backstage interactúa. Backstage actúa como un "portal" o "fachada" para estos sistemas.

* **Auth Providers:** Servicios de identidad externos (como Okta, Google, LDAP) que Backstage utiliza para autenticar a los desarrolladores.
* **Git Providers:** Sistemas de gestión de código fuente (como GitHub, GitLab). Son la **fuente de verdad** para Backstage.
    * **catalog-info.yaml:** El archivo de manifiesto que los desarrolladores colocan en sus repositorios para describir su software y decirle a Backstage que lo ingeste.
    * **mkdocs.yml:** El archivo de configuración que define cómo `TechDocs` debe construir la documentación técnica de un componente.
    * **Templates:** Los archivos de plantilla (boilerplates) que el `Scaffolder` utiliza para crear nuevos proyectos.
* **CI/CD Systems:** Herramientas de integración y despliegue continuo (como Jenkins, GitHub Actions). Los `Backend Plugins` de Backstage se conectan a ellos para mostrar el estado de los builds y despliegues.
* **Monitoring Tools:** Plataformas de observabilidad (como Grafana, Datadog). Los `Backend Plugins` se conectan a ellas para mostrar métricas y dashboards de salud de los servicios.
* **Cloud Providers:** Plataformas de nube (como AWS, GCP). Los `Backend Plugins` se conectan a ellas para mostrar información sobre recursos en la nube (ej. costos, buckets S3, instancias) asociados a un servicio.
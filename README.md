# Descripción del proyecto

OmniCar es una aplicación para viajes compartidos en automóvil. Los usuarios conductores pueden publicar viajes para encontrar compañeros de ruta y ahorrar en combustible y peajes. Por otro lado, los usuarios pasajeros pueden publicar solicitudes de viajes para encontrar conductores que se dirijan en su misma dirección. Además, la idea de la aplicación busca contribuir a reducir la huella de carbono mediante el uso de viajes compartidos.

Otra funcionalidad destacada es la posibilidad de crear viajes por intereses, es decir, viajes para asistir a eventos específicos. Por ejemplo, un usuario conductor que planea asistir al partido de su equipo favorito o a un concierto puede publicar ese viaje para encontrar compañeros con los mismos intereses. Para estos eventos, se planea incluir una página con un calendario donde se mostrarán estos viajes destacados en el calendario (aún no implementado).

## Funciones implementadas hasta el momento:

### Registro

    •	Registro de usuarios (las funcionalidades aún no están separadas por roles).
    Modificación de perfil
    •	Edición del perfil y foto de usuario.

### Creación de viajes comúnes:

    1.	Página para crear rutas:
        •	Indicación de la ciudad de origen y destino.
        •	Selección de cantidad de plazas disponibles (de 1 a 4). Dependiendo de la cantidad de plazas, el costo sugerido por asiento se ajusta automáticamente.
        •	La aplicación incluye un calculador integrado que sugiere un precio basado en la distancia, el consumo promedio del vehículo (litros/100 km), el tipo de combustible y su precio. Actualmente, estos datos son estáticos (precio de referencia: 1000 pesos por litro y consumo promedio: 7 litros/100 km), aunque en el futuro se integrará una API para actualizar diariamente los precios de combustible, permitiendo al conductor especificar el tipo de combustible y consumo promedio.
        •	Tras ingresar las ciudades de Origen y Destino y la cantidad de plazas, se muestra una sección con los datos del viaje, el precio recomendado y un campo para que el usuario indique su propio precio. Esta información aparece debajo de la sección del mapa.
    2.	Página para detallar la fecha y hora de salida, descripción del viaje y opciones adicionales (se ampliarán en el futuro).

### Listado de viajes

    1.	Vista de lista de viajes:
        •	Muestra tarjetas con los detalles principales del viaje: conductor, precio, ciudades de salida y llegada, fecha y hora de salida, íconos con las opciones del viaje y un botón "Ver más".
    2.	Ventana modal:
        •	Presenta una vista detallada del viaje con todas sus características, incluyendo un mapa con la ruta, una sección para realizar preguntas públicas visibles para todos los usuarios y un botón para "Reservar asiento".

### Reserva de asiento

    1.	Reserva en el modal del viaje:
        •	Al presionar el botón "Reservar asiento", se abre una página de confirmación desde donde el usuario puede iniciar un chat privado con el conductor para discutir detalles del viaje.
        •	Además, al realizar una reserva exitosa, la cantidad de asientos disponibles en la tarjeta del viaje disminuye en 1.

### Lista de chats

    1.	Vista de chats activos:
        •	Muestra tarjetas con los chats activos, incluyendo el nombre y foto del usuario, junto con la hora del último mensaje enviado y un botón "Ir al chat".
    2.	Interfaz de chat:
        •	El botón "Ir al chat" abre el chat donde los usuarios pueden continuar su conversación.

### Mis viajes

    1.	Listado de viajes publicados por el usuario:
        •	Una vista que muestra todos los viajes creados por el usuario.

---

**Tecnologías utilizadas en el proyecto**  
Basándonos en las dependencias, se puede afirmar que el proyecto utiliza las siguientes tecnologías:

1. **Frontend**:

   - **Vue 3**: el framework principal para la construcción de la aplicación.
   - **Vue Router**: para la gestión de rutas en la aplicación.
   - **TailwindCSS**: framework CSS utilitario para la estilización.
   - **Heroicons**: iconos para la interfaz de usuario.
   - **Headless UI**: componentes de interfaz de usuario preconstruidos.

2. **Mapas y geolocalización**:

   - **Mapbox GL**: para el manejo de mapas.
   - **Mapbox Polyline**: para rutas y polilíneas.
   - **Mapbox Search**: para la búsqueda de ubicaciones.

3. **Librerías auxiliares**:

   - **Lodash**: para el manejo de datos.

4. **Backend/Integración**:

   - **Firebase**: para autenticación, base de datos y otras funcionalidades en la nube.

5. **Construcción y desarrollo**:
   - **Vite**: para la compilación del proyecto.
   - **PostCSS/Autoprefixer**: para el procesamiento de CSS.

###

No es necesario instalar bibliotecas o dependencias específicas, ya que ya están incluidas.
Solo será suficiente ejecutar los comandos:

npm install
npm run dev

---

### Reglas de Cloud Firestore

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {

    match /viajes/{document} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    match /users/{user} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && request.auth.uid == user;
    }

    match /private-chats/{chat} {
      allow read: if request.auth != null && request.auth.uid in resource.data.users;
      allow create: if request.auth != null && request.auth.uid in request.resource.data.users;

      match /messages/{message} {
        allow read: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/private-chats/$(chat)).data.users;
        allow create: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/private-chats/$(chat)).data.users && request.auth.uid == request.resource.data.user_id;
      }

    }
        match /comments/{comment} {
      allow read, write: if true;
      allow write: if request.auth != null;
    }


    match /viajes/{viaje} {
      allow read: if true;
      allow write: if request.auth != null;
    }

        match /trips/{tripId} {
      allow read, write: if request.auth != null;
    }

}
}

---

### Reglas de Storage

service firebase.storage {
match /b/{bucket}/o {
match /{allPaths=\*\*} {
allow read, write: if request.auth != null;
}
}
}

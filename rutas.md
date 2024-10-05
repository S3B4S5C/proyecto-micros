POST  **proyecto-micros.onrender.com/register**
//Recibe los datos del body, se pueden omitir algunos pero no se cuales es joel el q documenta 😛
//Devuelve un token en una cookie

body ejemplo:
{ "usuario": "JoelMaricon", 
"contraseña":"dragonball", 
"nombre":"Joel", 
"apellido": "Cuellar", 
"correo": "joelcuellar24@gmail.com", 
"sexo": "M", 
"fecha_de_nacimiento": "1999-01-08", 
"direccion": "Plan 3000", 
"carnet": "5782582-SC",
"telefonos": ["123425", "25325"]} 

POST  **proyecto-micros.onrender.com/login**

body ejemplo:
//Recibe usuarios y contraseña, devuelve un token en una cookie

{ "usuario": "JoelCuellar123445", 
"contraseña":"dragonball"}

POST **proyecto-micros.onrender.com/logout**
//No recibe nada y borra el token

PUT **proyecto-micros.onrender.com/usuarios/update**
//Recibe un usuario y la informacion que se quiera cambiar en el body

body ejemplo:
{ "usuario": "JoelMaricon",
"correo": "Nuevojoelcuellar24@gmail.com", 
"sexo": "por favor", 
"direccion": "Cuchilla"}

POST **proyecto-micros.onrender.com/usuarios/crearChofer**
//Recibe un usuario ya existente en el body y una categoria de licencia en el body
//Solo si el usuario es operador
body ejemplo:
{ "usuario": "JoelMaricon",
    "licencia": "A"
}

GET **proyecto-micros.onrender.com/usuarios/choferes**
//Devuelve todos los choferes


GET **proyecto-micros.onrender.com/usuarios/chofer/:usuario**
//Recibe un usuario en los params y devuelve el chofer asociado

**proyecto-micros.onrender.com/usuarios/chofer/:usuario**
//Recibe un usuario en los params y devuelve el chofer asociado
BODY { contraseña_actual, contraseña_nueva }

PUT **proyecto-micros.onrender.com/usuarios/actualizarPass**
//Recibe la contraseña nueva y la actual 

POST  **proyecto-micros.onrender.com/usuarios/registrarTelefono**
//Recibe un telefono nuevo
BODY { telefono }

POST **proyecto-micros.onrender.com/rutas/crearRuta**
BODY {id_linea}

POST **proyecto-micros.onrender.com/rutas/paradas/crear**
//Crea una parada
BODY { nombre, orden , ruta, latitud, longitud }

POST **micros.onrender.com/rutas/paradas/provisionales/crear**
//Crea una parada provisional 
BODY { fecha_inicio, fecha_fin, parada, latitud, longitud, id_parada_provisional } 

PUT **micros.onrender.com/rutas/paradas/provisionales/:id**
//Recibe el id de una parada provisional y la finaliza

DELETE **micros.onrender.com/rutas/paradas/eliminar/:id**
//Recibe el id de una parada y la elimina

GET **proyecto-micros.onrender.com/rutas**
// recibe un id de linea en el body y muestra todas sus rutas
BODY {id_linea}

GET **proyecto-micros.onrender.com/rutas/:id_ruta**
// recibe un id de ruta y muestra la ruta asociada

GET **proyecto-micros.onrender.com/rutas/paradas/:id_ruta**
// recibe un id de ruta y muestra las paradas asociadas

GET **proyecto-micros.onrender.com/rutas/paradas/provisionales/:id_parada**
// recibe un id de parada y muestra todas sus paradas provisionales asociadas

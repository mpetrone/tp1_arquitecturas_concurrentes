#Clase 3 - TP 1 - Ayudantes

https://docs.google.com/document/d/1j7agLiiWzoOAY3cmF2uevn8fvyrG0oDm0SzBkQru6A4/pub


##APIS

###Proceso listas

**POST** /docentes  -> registrar un nuevo docente
{
  "nombre": "arya stark"
}

**POST** /alumnos   -> registrar un nuevo alumno
{
  "nombre": "jon snow"
}

**POST** alumnos/{alumno}/consultas -> registrar una nueva consulta
{
  "descripcion": "what is the meaning of life the universe and everything?"
}

**POST** /docentes/{docente}/respuesta/start -> docente empieza a escribir una respuesta
{
  "consulta": 232524
}

**POST** /docentes/{docente}/respuesta/{respuests}/finish -> docente finaliza de escribir la respuesta
{
  "descripcion": "the answer is 42"
}

###Proceso docente

**POST** /docentes/{docente}/consultas -> enviar una nueva consulta a el docente correspondiente
{
  "id": 1234
  "descripcion": "what is the meaning of life the universe and everything?"
}

**POST** /doncentes/{docente}/respuesta/start -> aviso de que otro docente empezo a escribir una respuesta
{
  "docente": 343423,
  "consulta": 232524
}

**POST** /doncentes/{docente}/respuesta -> respuesta de una consulta de otro docente
{
  "respuesta": 154632,
  "consulta": 232524,
  "descripcion": "the answer is 42"
}

###Proceso alumno
 
**POST** /alumnos/{alumno}/consultas -> enviar una nueva consulta a el docente correspondiente
{
  "id": 1234
  "descripcion": "what is the meaning of life the universe and everything?"
}

**POST** /alumnos/{alumno}/respuesta -> respuesta de una consulta
*(igual a la misma api del docente)*

#Clase 3 - TP 1 - Ayudantes

https://docs.google.com/document/d/1j7agLiiWzoOAY3cmF2uevn8fvyrG0oDm0SzBkQru6A4/pub


##APIS

###Proceso listas

**POST** /docentes  
Registrar un nuevo docente
```json
{
  "nombre": "arya stark"
}
```

**POST** /alumnos  
Registrar un nuevo alumno
```json
{
  "nombre": "jon snow"
}
```

**POST** alumnos/{alumno}/consultas  
Registrar una nueva consulta
```json
{
  "descripcion": "what is the meaning of life the universe and everything?"
}
```

**POST** /docentes/{docente}/respuesta/start  
Docente empieza a escribir una respuesta
```json
{
  "consulta": 232524
}
```

**POST** /docentes/{docente}/respuesta/{respuests}/finish  
Docente finaliza de escribir la respuesta
```json
{
  "descripcion": "the answer is 42"
}
```

###Proceso docente

**POST** /docentes/{docente}/consultas  
Enviar una nueva consulta a el docente correspondiente
```json
{
  "id": 1234,
  "descripcion": "what is the meaning of life the universe and everything?"
}
```

**POST** /doncentes/{docente}/respuesta/start  
Aviso de que otro docente empezo a escribir una respuesta
```json
{
  "docente": 343423,
  "consulta": 232524
}
```

**POST** /doncentes/{docente}/respuesta  
Respuesta de una consulta de otro docente
```json
{
  "respuesta": 154632,
  "consulta": 232524,
  "descripcion": "the answer is 42"
}
```

###Proceso alumno
 
**POST** /alumnos/{alumno}/consultas  
Enviar una nueva consulta a el docente correspondiente
```json
{
  "id": 1234,
  "descripcion": "what is the meaning of life the universe and everything?"
}
```

**POST** /alumnos/{alumno}/respuesta
Respuesta de una consulta  
*(igual a la misma api del docente)*

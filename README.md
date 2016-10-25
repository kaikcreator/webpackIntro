#Webpack intro
Este proyecto está pensado como ejemplo para seguir el tutorial de mi blog [Introducción a Webpack]( http://blog.enriqueoriol.com/2016/10/intro-a-webpack.html)

El código original (antes de webpack) está en la carpeta **initialProject**, mientras que el código final al que deberías llegar después de configurar webpack se encuentra en la carpeta **webpackedProject**.

Aquí tienes el tutorial paso a paso (si tienes dudas sobre lo que estás haciendo, te recomiendo leer el artículo del blog, más detallado).

### Proyecto inicial (sin webpack)
Vamos con un ejemplo muy simple. Tengo una web con la siguiente estructura, de momento sin usar webpack:

```
|miProyecto
   |
   |app/
      |index.js
      |logger.js
   |style.css
   |index.html
```

El archivo `index.html` muestra un div con un párrafo vacío que el archivo `index.js`va a modificar (y lo indicará por consola, gracias al método *Logger* de `logger.js`. 

Veamos la vista:

**index.html**
```html
<!-- index.html -->
<!DOCTYPE html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- import javascript and css -->
    <script src="app/logger.js"></script>
    <script src="app/index.js"></script>
    <link rel="stylesheet" type="text/css" href="styles.css">
  </head>


  <body>
    <div>
      <p id="greeting"></p>
    </div>
  </body>

</html>
```

Si te fijas, aquí **index.html tiene que importar 2 archivos Javascript y 1 de CSS**. Y estamos con un ejemplo la mar de sencillo. Imagina si tienes un proyecto de verdad... No sufras, webpack viene al rescate.

Pero antes, veamos también el código para ponerte en situación:

**logger.js**
```
//  app/logger.js
//defining global function with improved console.log
var Logger = function(message){
	console.log(new Date(Date.now()), " - ", message);
}
```

**index.js**
```
//  app/index.js
//update content of greeting element when DOM has been loaded
(function(){
	document.addEventListener('DOMContentLoaded', function(){
		document.getElementById('greeting').innerHTML = "Hello my friend!";
		Logger("Greeting has been updated");
	})
})();
```

Y algo de estilo que le doy para parecer más *cool*:

**styles.css**
```
html, body{
	height: 100%;
}
body{
	margin: 0;
}

div {
    display: flex;
    height: 100%;
    background-color: #2eb398;
    color: white;
    font-size: 22px;
}

div p {
    flex: 1;
    text-align: center;
    margin-top: auto;
    margin-bottom: auto;
}
```

Como ves un proyecto así solo necesita un servidor para poder ejecutarse. Instalo SimpleHttpServer desde terminal con el comando:

```
$:  npm install simplehttpserver -g
```

Y ejecuto el servidor desde la carpeta del proyecto:

```
$:  cd webpackTest
$:  simplehttpserver ./
```

Si voy a `localhost:8000` y muestro el inspector de chrome para ver la consola, tengo el siguiente resultado:

![introducción a webpack](https://lh3.googleusercontent.com/ZMerB2PALfWua0ebwH0BcdmaztWETCiA1MQYLR67PEH0XxVbjYAmeZx24TdeFgeWtnz7t6b8Ow=s600 "introducción a webpack")

### Cargando el proyecto desde webpack
Sé que cuando empiece a echarle horas al proyecto va a crecer mucho y mi index.html será insufrible, así que me decido a empaquetarlo con webpack.

#### Instalación
Lo primero es instalarlo. Te recuerdo:

```bash
$:  cd miProyecto
$:  npm install webpack -g #(si no lo tengo ya instalado en global)
$:  npm install webpack webpack-dev-server -D
```

ahora, creo en el directorio principal el archivo **webpack.config.js** con el siguiente contenido:

**webpack.config.js**
```javascript
//  webpack.config.js 
module.exports = {
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: __dirname
	}
};
```

#### Importando código, sintaxis CommonJS
Si ejecuto **`webpack`** por consola, puedo ver como me crea ese nuevo archivo **bundle.js**, con algo de código de webpack y el contenido de mi `index.js` todo dentro de una función. En cambio, falta el contenido de `logger.js` y eso es por que en `index.js` no he indicado esta dependencia.

Esto en ES6 se soluciona con los *imports*, pero recuerda que de momento estoy usando ES5. 

Modifico `index.js` para quitar la función en la que englobaba mi código (ya lo hace webpack por mi). También aprovecho para importar Logger mediante sintaxis CommonJS:

**index.js**
```javascript
//  app/index.js

//import Logger
var Logger = require('./logger.js');

//update content of greeting element when DOM has been loaded
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('greeting').innerHTML = "Hello my friend!";
	Logger("Greeting has been updated");
})
```

Tengo que modificar ligeramente `logger.js` para exportar correctamente el código como módulo CommonJS (con **module.exports**):

**logger.js**
```
//  app/loger.js
module.exports = function(message){
	console.log(new Date(Date.now()), " - ", message);
}
```

Ahora sí, mis dependencias de javascript están correctamente definidas.

#### Generando el paquete *bundle.js*
Ya lo he adelantado antes. Para generar el *bundle.js* solo tienes que ir a terminal y ejecutar:
```
$:  webpack
```
Esto creará el output que he definido antes (en este caso *bundle.js*) con el input (*index.js*) y todas sus dependencias.

#### Cargando el bundle.js
Modifico `index.html` para que únicamente se incluya el JS de *bundle.js*. Fíjate en la sección `<head>`:
```
<!DOCTYPE html>

  <head>
    <!-- ... some meta tags -->
    <!-- import javascript and css -->
    <script src="bundle.js"></script>
    <link rel="stylesheet" type="text/css" href="styles.css">
  </head>

	<!-- ...body content... -->
</html>
```

####Ejecutando

De momento, como he generado el archivo *bundle.js*, puedo usar el servidor anterior para ejecutar la aplicación. Verás como lanzando por terminal
```
$:  simplehttpserver
```
Se carga la aplicación sin ningún problema.


### Ejecutando con webpack - scripts npm
Cuando trabajas con webpack, es interesante que cada vez que modificas tus archivos se ejecute webpack para actualizar el contenido del servidor de desarrollo. Lo podrías conseguir con `webpack --watch` y un servidor como *simplehttpserver*, pero en realidad te he hecho instalar una herramienta que ya se encarga de todo esto: **webpack-dev-server**.

Al principio del artículo he explicado el comando a ejecutar, pero para hacerlo más simple, **voy a asociar la instrucción "npm start" al comando necesario** para lanzar el servidor de desarrollo de webpack. 

Para eso, edito el archivo **package.json** del siguiente modo:

```javascript
{
  //...some stuff
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node node_modules/.bin/webpack-dev-server",
  },
  //...some stuff  
}
```

Ahora si ejecutas por terminal:

```
$:  npm start
```

Verás como te indica que ha creado un bundle válido a partir de app/index.js y app/logger.js, y que está disponible en localhost:8080/webpack_dev_server.

![webpack-dev-server](https://lh3.googleusercontent.com/gdkq88OWs9bPbUmcSbx8EkX0aMHtDavZUT0IVaaaMjwjNCeoShDECNysDllvbpl-kIeVpb2aDQ=s600 "webpack-dev-server")

Todo funciona correctamente, pero además, la vista muestra un indicador conforme la app está funcionando correctamente, como se muestra en la siguiente imagen.

![webpack-dev-server app running](https://lh3.googleusercontent.com/epMZVBe6MU0xfbffxr-05tfityMj2xfCL_8pi07QyDN_wyv2GXulrxnZgtgPy6QOnmwFRNOomA=s600 "webpack-dev-server app running")

### Importando SaSS con loaders

Lo siguiente que puedo hacer es importar también la hoja de estilos con Webpack. De hecho, puedo trabajar con SaSS, que es más *molón*, y aprovechar para encargarle también que me lo compile a css.

Para eso necesito instalar los loaders:

* sass-loader
* css-loader
* style-loader

Es decir:

```
npm install sass-loader css-loader style-loader -D
``` 

Además, necesitaré el compilador SaSS de node:
```
npm install node-sass --save-dev
```

Ahora que tengo los loaders, le indico a webpack que debe usarlos de forma encadenada (fíjate en que he cambiado la expresión regular de test a **.scss**, que es la extensión de SaSS):

**webpack.config.js**
```javascript
//  webpack.config.js 
module.exports = {
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: __dirname
	},
	module: {
		loaders: [
			{test:/\.scss$/, loader:'style!css!sass', exclude: /node_modules/}
		]
	}
};
```

Ahora ya puedo cambiar mis estilos para usar SaSS. 

Renombro el archivo `style.css` a `style.scss`, y le hago cambios para aprovechar SaSS, por ejemplo:

```css
div {
    display: flex;
    height: 100%;
    background-color: #2eb398;
    color: white;
    font-size: 22px;

    p {
	    flex: 1;
	    text-align: center;
	    margin-top: auto;
	    margin-bottom: auto;
	}
}
```

Solo falta eliminar la llamada a `styles.css` desde `index.html` , e importar mis estilos por código. Para esto último, voy a **index.js** y lo modifico así (fíjate en que la URL es relativa a index.js):

**index.js**
```javascript
//  app/index.js

//import CSS
require('../styles.scss');

//import Logger
var Logger = require('./logger.js');

//update content of greeting element when DOM has been loaded
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('greeting').innerHTML = "Hello my friend!";
	Logger("Greeting has been updated");
})
```

De nuevo, paro el servidor de desarrollo y vuelvo a ejecutarlo con `npm start`:  **funciona**.


### Debugando con WebPack

También he explicado antes que si abro el inspector de Chrome, de entrada veo todo el código Javascript entremezclado, como ves en la imagen.

![webpack bundled code](https://lh3.googleusercontent.com/VEPPOsMAMd2XJ4e-uLt6FnTJGl-YU_0lsFrSECBvSyhEPlaWtuzEJht2HWSR8WB6E-rSVZcXbw=s600 "webpack bundled code")

Para ahorrarme este dolor de cabeza, puedo crear *Source maps* que enlacen el código del *bundle* con los archivos originales.

Para eso, modifico **webpack.config.js** para añadir la propiedad **devtool**:

```javascript
//  webpack.config.js 
module.exports = {
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: __dirname
	},
	devtool: 'eval-source-map',
	module: {
		loaders: [
			{test:/\.scss$/, loader:'style!css!sass', exclude: /node_modules/}
		]
	}
};
```

Si paro el servidor y lo vuelvo a ejecutar, ahora sí puedo ver mis archivos originales (y usarlos para *debugar* el código con *breakpoints* y todo). Fíjate en la nueva carpeta que aparece en el Inspector de Chrome.

![webpack devtool](https://lh3.googleusercontent.com/8n01dA1QdpSNfYTdl6sMgjRnLp-nY14zxffGD2hTxz_tzYBlF_FSTenmA4AKLxJy6ExJQQtdaQ=s600 "webpack devtool")


### Transpilando ES6 con Babel
Pongamos que ahora me quiero modernizar (solo un poco), y se me ocurre actualizar mi código JS a ES6.

####Cambiando el código a ES6
Pues lo primero es lo primero. Modificaré mis archivos para usar Javascript moderno ¡guay!

**loader.js**

```javascript
// app/loader.js

//export as a regular ES6 module and as an arrow function
export default (message) =>{
	console.log(new Date(Date.now()), " - ", message);
}

```


**index.js**
```javascript
// app/index.js

//ES6 import Logger
import Logger from './logger.js';

//import CSS
require('../styles.scss');

//update content of greeting element when DOM has been loaded. Using arrow function.
document.addEventListener('DOMContentLoaded', () =>{
	document.getElementById('greeting').innerHTML = "Hello my friend!";
	Logger("Greeting has been updated");
})
```

#### Configurar e instalar el loader

Desde terminal, instalo el loader de babel para webpack (`babel-loader`). Necesito también la librería de babel para node (`babel-core`) y el paquete de ES6 (`babel-preset-es2015`):

```
$:  npm install babel-loader babel-core babel-preset-es2015 -D
```

Además, voy a mi **webpack.config.js** y añado **babel** a los loaders:

```javascript
//  webpack.config.js 
module.exports = {
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: __dirname
	},
	devtool: 'eval-source-map',
	module: {
		loaders: [
			{test:/\.js$/, loader:'babel', exclude: /node_modules/, query: { presets: ['es2015'] } },
			
			{test:/\.scss$/, loader:'style!css!sass', exclude: /node_modules/}
		]
	}
};
```

Fíjate que al loader le paso una nueva propiedad **query** con el parámetro **`presets: ['es2015']`**. Esto es imprescindible para que el loader de Babel sea capaz de detectar los imports de código de ES6 (también llamado ES2015).


#### Resultados

Si has seguido los pasos anteriores correctamente, solo tienes que cerrar y volver a lanzar el servidor de desarrollo y... ¡voilà! La app funciona y estás usando ES6. 

¡Incluso te has desecho de ese sucio `require('logger')` en CommonJS!

###Minificando el código
Ya has visto casi todo, y ahora solo me faltaría crear un *bundle.js* con el código minificado para que mi web se descargue más rápido.

Para eso, solo tengo que importar la librería *webpack* en el archivo de configuración, y añadir el plugin **UglifyJsPlugin**. Mi archivo queda así:

**webpack.config.js**
```javascript
//  webpack.config.js

var webpack = require('webpack');

module.exports = {
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: __dirname
	},
	
	devtool: 'eval-source-map',
	
	module: {
		loaders: [
			{test:/\.js$/, loader:'babel', exclude: /node_modules/, query: { presets: ['es2015'] } },
			{test:/\.scss$/, loader:'style!css!sass', exclude: /node_modules/}
		]
	},
	
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
};
```

¡Y ya está! Así de simple. 

Para el servidor de desarrollo, vuelve a lanzarlo y verás como se carga la web sin problemas. Pero fíjate en el código que revela el Inspector de Chrome, tu *bundle.js* ahora es una única linea de funciones compuestas por letras aisladas. Menos espacio. Más ilegible.

![webpack-minified-bundle](https://lh3.googleusercontent.com/GFwRDIVr8esNoDwQ3jIK-pOjI9VSxyzp2hPEIejU123QTj_dSHwZ_wEEV4ijs3VBcY6lFPlEmA=s600 "webpack-minified-bundle")
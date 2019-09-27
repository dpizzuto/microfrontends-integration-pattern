# Micro frontends
A Docker ready example on how to create micro frontend via integration pattern and web components.

Before going into details of this PoC, it's strongly reccomended to take a look on the theory about Micro Frontend. A great explanation by [Cam Jackson](https://camjackson.net/) on martinfowler.com blog, [here](https://martinfowler.com/articles/micro-frontends.html).

# Goal
A micro frontend architecture using integration pattern through three different applications: a _Bootstrap_ application which embeds two child applications, made in Angular and React, as a javascript single build file. Each application runs on a different Docker container (httpd based image).

![High level flow](/resources/flow_architecture.png "High level flow")


# Applications details
Let's start to explain each application and the important details. I'll go through each one and at the end the Docker part will be explained.

## Child Angular App
This is a SPA (Single Page Application) built with Angular 8.2.7.
The application itself has _MyCustomComponent_ which is the designated component to contain custom code.

On **app.module.ts**:

    const { injector } = this;

     // create custom elements from angular components
    const ngCustomElement = createCustomElement(MyCustomComponentComponent, { injector });

    // define in browser registry
    customElements.define('ng-el', ngCustomElement);

there's the component's definition as a CustomElement which will be injected within the Bootstrap app (we'll see detail about this later).

Since we need a single Javascript file, we should change the build phase within **package.json**:

```json
{
...
"build": "ng build --prod --output-hashing none --single-bundle true"
...
}
```
This command will produce a **main.js** file on **_dist_** directory.


## Child React App
This is a SPA built in React 16.9.
Within the application lies a custom component: **_MyCustomReactComponent_** defined as React.Component. The component contains the custom code to render on Bootstrap app. 

Here, an important note goes to the **render** and **mount** methods on **index.js**:

```javascript
    mount() {
      const propTypes = MyCustomReactComponent.propTypes ? MyCustomReactComponent.propTypes : {};
      const events = MyCustomReactComponent.propTypes ? MyCustomReactComponent.propTypes : {};
      const props = {
          ...this.getProps(this.attributes, propTypes),
          ...this.getEvents(events),
        children: this.parseHtmlToReact(this.innerHTML)
      };
      ReactDOM.render(<MyCustomReactComponent {...props} />, this);
    }
```
>The default **render** function is different from the actual **ReactDOM.render** function. 

Also here we found at the end of component the customElement definition:

```javascript
  customElements.define('react-el', ReactElement);
```
To let compiler interpret the code above you need _babel_ with various plugins and loaders.

The build here is more tricky because you can't use _yarn_ easily so instead we use _webpack_. To do that some changes are needed to **_package.json_** file. Here the most important:

```javascript
{
...
"scripts": {
    "webpack": "webpack",
    "start": "npm run build && serve -l 5002 dist",
    "build": "webpack --mode development"
  },
...
}
```

Also in this case, the build result will be a **_main.js_** file which contains the whole application. 

## Bootstrap
This application acts as a 'container' app: reference and inject within a single HTML file. Within the **index.html** there's the URL to the previous built main.js files. 
These files can be served in a multiple ways, but for the scope of the example they are referenced as a online resource: specifically served by a different httpd container (see next section).

Aside the CSS style and HTML, the core lies in these following lines:

```javascript
      // Child React App Element
      const reactEl = document.createElement('react-el');
      reactEl.setAttribute('name', name);
      reactEl.setAttribute('onHelloEvt', 'onHelloEvt');
      reactEl.addEventListener('onHelloEvt', (e) => helloEvent('React'));
      const reactElContainer =  document.getElementById('react-container')
      if (reactElContainer.children.length > 0) {
        reactElContainer.removeChild(reactElContainer.children[0]);
      }
      reactElContainer.appendChild(reactEl);

      //Child Angular child element
      const ngEl = document.createElement('ng-el');
      ngEl.setAttribute('name', name);
      ngEl.addEventListener('helloEvt', (e) => helloEvent('Angular'));
      const ngElContainer =  document.getElementById('ng-container')
      if (ngElContainer.children.length > 0) {
        ngElContainer.removeChild(ngElContainer.children[0]);
      }
      ngElContainer.appendChild(ngEl);
```
Where components are injected in the specific **div class**. Applications are referenced through javascript source:

```html
  <script src="http://localhost:8081/main.js"></script>
  <script src="http://localhost:8082/main.js"></script>
```

Don't get fooled by 'localhost': can be anything accesible from Bootstrap application and I'm going to explain this in the next section. 

# Docker 
The three application can be ran both through **_docker-compose_** and classical **_docker_** commands. 

Each application will run on a different container. The bootstrap application will reference the URL of main.js deployed into two different container. 

**NOTE**
>The _localhost_ reference within bootstrap application is correct because bootstrap application runs on client side (your browser) so, since the container have exposed port on your machine through Docker, the application will find _main.js_ on **localhost:port/main.js**.

Each application has a specific **Dockerfile** which can be used to run the application on a httpd:alpine container. The Dockerfile specifies the copy of **dist** content into the container.

Here's an example:
```yml
# Remove any files that may be in the public htdocs directory already.
RUN rm -r /usr/local/apache2/htdocs/*

# Copy all the files from the docker build context into the public htdocs of the apache container.
COPY ./ /usr/local/apache2/htdocs/
```

Let's note that if you want to run applications through docker-compose or simply docker, there are changes to make because the _context_ reference is different. 

**At this state** dockerfiles are ready for docker-compose: after installing dependencies for each application through 
```
npm install
```
and building application through:
```
npm run build 
```

it's possible to run containers, pointing to root dir where docker-compose.yml is saved, with:
```
docker-compose up -d --build
```
The option **--build** is needed the first time and then every time there are changes to applications.


# Acknowledgements
Thanks to Chris Kitson for his great [work](https://github.com/chriskitson/micro-frontends-with-web-components)  about micro frontend which helped me a lot!
# Micro frontends
A Docker ready example on how to create micro frontend via integration pattern and web components.

Before going into details of this PoC it's strongly reccomended to take a look on the theory about Micro Frontend. A great explanation by [Cam Jackson](https://camjackson.net/) on martinfowler.com blog, [here](https://martinfowler.com/articles/micro-frontends.html).

# Goal
A micro frontend architecture using integration pattern through three different applications: a _Bootstrap_ application which embeds two child applications, made in Angular and React, as a javascript single build file. Each application runs on a different Docker container (httpd based image).

![High level flow](/resources/flow_architecture.png "High level flow")


# Applications details
Let's start to explain each application and its important details. I'll go through each one and at the end will be explained the Docker part.

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

Once a single Javascript need to be produced by build phase, we should change the **package.json**:

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

Here, an important note goes to the **render** part and **mount** on **index.js**:

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
Notice that default **render** function is different from the actual **ReactDOM.render** function. 

Also here we found at the end of component the customElement definition:

```javascript
  customElements.define('react-el', ReactElement);
```
Note that to let compiler interpret the code above you need _babel_ with various plugins and loaders.

The build here is more tricky because you can't use _yarn_ easily so instead it's possible to use _webpack_. To do that some changes are needed to **_package.json_** file. Here the most important:

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

Aside the CSS style and HTML, the core lies in these following lines of code:

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
Where component are injected in the specific 'div class'. Applications are referenced through javascript source:

```html
  <script src="http://localhost:8081/main.js"></script>
  <script src="http://localhost:8082/main.js"></script>
```

Don't get fooled by 'localhost': can be anything accesible from Bootstrap application. 

# Docker 
//TODO


# Acknowledgement
Thanks to Chris Kitson for his great [work](https://github.com/chriskitson/micro-frontends-with-web-components) here about micro frontend which helped me a lot!
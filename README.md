# Vonag

**Vonag** stands for **V**imal's **O**wn **N**ode **A**pp **G**enerator.

## What is it?

**Vonag** does not intend to be a node.js framework. It purposes itself to serve as a tool for generating quick, hassle-free boilerplate service on top of which you and your team can build your APIs. It saves you the hassle of structuring your API service and writing multiple helpers in order to put things together, the goal of **Vonag** is to allow you to put all this stress aside and just focus on building APIs.

## Is it stable?

NO, it is not, at the moment. I (as in Vimal Sheoran) am making sure that this project is continously being developed and maintained as I plan to use it myself for building API services. All the inputs from the community, whether it be feature requests, bug reports or criticism will be acknowledged and will be addressed with high priority.

## Installation (temporary)

Clone the repository:

`$ git clone https://github.com/vimalsheoran/vonag`
`$ cd <your vonag directory>`

Install the node package

`npm install vonag -g`

**`npm` should be installed before doing this**


## Getting started

1. To setup basic application structure, use the following command

`$ vonag make app <name of your api service>`

Typing this command will give you a structure similar to the one below, it will also auto generate code for the following files `app.js`, `package.json`, `settings/modelHandler.js`, `settings/routeHandler.js`, `settings/modelConfig.js`

```
--- yourApp
	--- components
	--- helpers
	--- settings
	--- tests/
	--- app.js
	--- package.json
```

Now vonag structures it's application based on **components**. A **component** is a collection of ***controller***, ***routes*** and ***models***. a sample component would look something like this.

```
--- yourComponent
	--- yourComponent.controller.js
	--- yourComponent.routes.js
	--- yourComponent.models.js
```

To generate a component, use the following command.

`$ vonag make component <name of your component>`


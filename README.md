TravelBox UI is a photo gallery interface designed to work seamlessly with the [TravelBox API](https://github.com/Antrayguesn/TravelBoxApi). It allows you to visualize your photos as an interactive map or as a list.

This project is built using:

* React.js for the front-end framework.
* Ant Design for UI components.
* Parcel as the build tool for bundling assets.

The TravelBoxApi should be callable under /api url. (http://localhost/api)

---

## Build Instructions

### Build the JavaScript files

The built files will be placed in the `dist` directory.
Run the following command:

```
parcel build index.html
```

### Build the Docker image

To create a Docker image for the application, use:

```
docker build -t travel_box_ui .
```


---

## Development Mode

To serve your code locally during development, run:

```
parcel index.html
```

This will start a local development server for testing and debugging.

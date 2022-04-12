# WebGi starter project
A template for a vanilla(no ui-framework) project with webgi engine in typescript using parcel bundler.

For the latest version and documentation: [webgi manual](https://dist.pixotronics.com/webgi/manual/index.html).

### Running
First install the dependencies:
```bash
npm install
```

To run the project in development mode:
```bash
npm start
```
Then navigate to [http://localhost:1234/index.html](http://localhost:1234/index.html) in a web browser to see the default scene in a viewer.

The assets are stored in the `assets` directory.

To build the project for production:
```bash
npm run build
```

## Updates
Check the [webgi manual](https://dist.pixotronics.com/webgi/manual/index.html#status) for the latest version.
To use the different version:
* Update the version number in `package.json` file for both `webgi` and `@types/webgi`.
* Run `npm install` to update the dependencies.
* Delete `.cache` folder created by parcel bundler: `rm -rf .cache`
* Run `npm start` or `npm run build` to run or build the project.


## License 
For license and terms of use, see the [webgi manual](https://dist.pixotronics.com/webgi/manual/index.html#license-for-sdk).
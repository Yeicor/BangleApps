# Next turn

To build app.js after changes to app-*.js, run:

```bash
npx parcel build --dist-dir ./dist --no-source-maps app-index.js && mv dist/app-index.js app.js && rmdir dist
```

## License

[MIT License](LICENSE)

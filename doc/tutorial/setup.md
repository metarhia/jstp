# Setup

## Node.js

To proceed with this tutorial and start working with JSTP, follow
these steps:

1. Make sure you have version `6.x` or later of Node.js installed.
2. Follow the [installation][installation] instructions for JSTP.

From that point, all dependencies are installed and you are free to use JSTP
by requiring `jstp` module:

```javascript
const jstp = reqiure('@metarhia/jstp');
```

## Browser

If you are working in a web browser environment, there is an alternative
[UMD][umd] bundle, which you can add to your page via a `<script>` tag, like
here:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/@metarhia/jstp@latest/dist/jstp.umd.js"></script>
  </head>
  <body>
    <!-- Now you can use jstp module here by accessing window.api.jstp -->
  </body>
</html>
```

Alternatively, you can also use module bundlers like Webpack and Browserify for
more convenient development.

[installation]: ../README.md#installation
[umd]: https://unpkg.com/@metarhia/jstp@latest/dist/jstp.umd.js

# Contribute to Polaris
This section includes details on how you can contribute to Polaris code and documentation.

## Code

To follow.

## Documentation

We welcome documentation contributions. Our documentation can be viewed live at [nearform.github.io/polaris][docs]

### Run Documentation Locally

You can run our Polaris documentation locally by serving the docs folder at a given port.
If you have node installed, you can use `docsfiy-cli`.

From the root folder on a command console, enter the following:

```sh
npm run doc:serve
```

This displays the following:

```sh
> polaris@x.y.z doc:serve /path/to/your/repo/polaris
> docsify serve -p 4000 docs

Serving /path/to/your/repo/polaris/docs now.
Listening at http://localhost:4000
```

The documentation is now served on localhost:4000.

#### Serve in Other Ways

Our documentation builds on the fly. All you need to do is serve the docs folder. Any program or cli tool used for serving a folder will work; **as long as it handles hash routing**.

Another popular module for serving files is `serve` on npm. To run this, with hash router support, use the following command:

```sh
npx serve -s -l 4000 docs
```

This displays the following:

```sh
┌──────────────────────────────────────────────────┐
│                                                  │
│   Serving!                                       │
│                                                  │
│   - Local:            http://localhost:4000      │
│   - On Your Network:  http://192.168.1.60:4000   │
│                                                  │
│   Copied local address to clipboard!             │
│                                                  │
└──────────────────────────────────────────────────┘
```

The documentation is served on localhost:4000 in this case.

[docs]: https://nearform.github.io/polaris

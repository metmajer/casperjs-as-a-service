# CasperJS-as-a-Service

[CasperJS](http://casperjs.org/) is a navigation scripting and testing utility for [PhantomJS](http://phantomjs.org/) and [SlimerJS](https://slimerjs.org/) written in JavaScript. [CasperJS-as-a-Service](https://github.com/metmajer/casperjs-as-a-service) makes CasperJS available as a web service. Dockerfile included.

## How to run CasperJS-as-a-Service in Docker?

The following command makes *CasperJS-as-a-Service* available at `127.0.0.1:31337`:

```
export HOSTPORT=31337
docker run -d --name casperjs -p 127.0.0.1:$HOSTPORT:80 metmajer/casperjs-as-a-service
```

## How to issue a CasperJS script job?

*CasperJS-as-a-service* makes a `/job` endpoint available, which serves requests via HTTP POST:

```
curl -f -H "Content-Type: application/json" http://127.0.0.1:$HOSTPORT/job -d '{
    "git": {
      "uri": "https://github.com/casperjs/casperjs.git",
      "contextDir": "samples"
    },
    "casper": {
      "script": "dynamic.js"
    }
  }'
```

## How to issue a CasperJS test job?

*CasperJS-as-a-service* makes a `/job` endpoint available, which serves requests via HTTP POST:

```
curl -f -H "Content-Type: application/json" http://127.0.0.1:$HOSTPORT/job -d '{
    "git": {
     "uri": "https://github.com/casperjs/casperjs.git",
      "contextDir": "samples"
    },
    "casper": {
      "mode": "test",
      "script": "googletesting.js"
    }
  }'
```

You can advise *CasperJS-as-a-Service* to run all tests inside `git.contextDir` when `casper.mode` is set to `test` and `casper.script` is left `undefined`.

```
curl -f -H "Content-Type: application/json" http://127.0.0.1:$HOSTPORT/job -d '{ \
    "git": {
      "uri": "https://github.com/casperjs/casperjs.git",
      "contextDir": "samples"
    },
    "casper": {
      "mode": "test"
    }
  }'
```

Note that this will only work with directories that do not contain navigation scripts (with CasperJS, navigation scripts and tests service a different purpose and have to be invoked in different ways). In the above example, *casperjs* will fail with the following error:

```
Test file: /tmp/92e6b4e3-4eb2-4838-a13d-a2f6c1b6b73c/samples/bbcshots.js
FAIL Fatal: you can't override the preconfigured casper instance in a test environment.
#    type: error
#    file: /tmp/92e6b4e3-4eb2-4838-a13d-a2f6c1b6b73c/samples/bbcshots.js
#    subject: false
#    error: "Fatal: you can't override the preconfigured casper instance in a test environment."
#    stack: in create() in phantomjs://platform/casper.js:54
```

## Options

### Git

- `git.uri`: a URI to a Git repository (required)
- `git.branch`: a branch name (optional, defaults to `master`)
- `git.contextDir`: a relative path to a directory inside the (cloned) repo (optional, defaults to `/`)

### CasperJS

- `casper.options`: a string containing options to be passed to `casperjs` (optional)
- `casper.mode`: setting this to `test` will result in an execution of `casperjs test` (optional)
- `casper.script`: a path fragment to a script underneath `git.contextDir` (required if mode is not `test`)

# LICENSE

Licensed under the MIT License. See the LICENSE file for details.
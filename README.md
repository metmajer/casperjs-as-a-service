# casperjs-as-a-service

A CasperJS web service for scraping the web.

## How to start the service?

```
export HOSTPORT=36000
docker run -p 127.0.0.1:$HOSTPORT:80 \
  metmajer/casperjs-as-a-service
```

## How to issue jobs?

### Example

```
curl -f -H "Content-Type: application/json" http://127.0.0.1:$HOSTPORT/job \
  -d '{ "git": { "uri": "https://github.com/metmajer/casperjs-test.git", "contextDir": "tests"}, "casper": { "mode": "test" }}'
```

### Git Options

- `git.uri`: a URI to a Git repository
- `git.branch`(optional): a branch name (defaults to `master`)
- `git.contextDir` (optional): a relative path to a directory inside the repo

### Casper Options

- `casper.mode` (optional): `''` or `'test'`

# LICENSE

Licensed under the MIT License. See the LICENSE file for details.
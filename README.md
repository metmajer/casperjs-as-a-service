# casperjs-as-a-service

A CasperJS web service for scraping the web.

## How to start the service?

```
docker run -p 127.0.0.1:$HOSTPORT:80 \
  metmajer/casperjs-as-a-service
```

## How to issue jobs?

```
curl -f -H "Content-Type: application/json" http://localhost/job \
  -d '{"source": "https://github.com/metmajer/casperjs-test.git", "branch": "master", "contextDir": "tests"}'
```

Where `source` is a URI to a Git repository, `branch` is an *optional* branch name and `contextDir` is an optional, relative path to a directory inside the Git repository.

# LICENSE

Licensed under the MIT License. See the LICENSE file for details.
'use strict';

var express = require('express'),
    Git = require("nodegit"),
    parser = require('body-parser'),
    spawnSync = require('child_process').spawnSync,
    sync = require('synchronize'),
    uuid = require('node-uuid');

var app = express();

app.post('/job', parser.json(), function(request, response) {
  sync.fiber(function() {
    var defer = sync.defer();

    if (!request.body.source) {
      response.status(500).send({ error: 'source property required' });
    }

    var config = {
      source: request.body.source,
      branch: request.body.branch || undefined,
      contextDir: request.body.contextDir || undefined
    };

    var targetDirectory = '/tmp/' + uuid.v4();
    console.log('Cloning ' + config.source + ' into ' + targetDirectory);

    sync.await(
      Git.Clone(config.source, targetDirectory, { checkoutBranch: config.branch })
        .then(function(repo) {
          defer.apply(undefined, repo);
        })
    );

    var scriptsDirectory = targetDirectory;
    if (config.contextDir) {
      scriptsDirectory += '/' + config.contextDir;
    }

    var casper = spawnSync('casperjs', ['test', scriptsDirectory]);
    if (casper.status == 0) {
      process.stdout.write(casper.stdout)
      response.status(200);
    } else {
      process.stderr.write(casper.stderr)
      response.status(500).send({ error: casper.stderr });
    }

    response.end();
  });
});

app.listen(80);
'use strict';

var express = require('express'),
    Git = require("nodegit"),
    parser = require('body-parser'),
    spawnSync = require('child_process').spawnSync,
    sync = require('synchronize'),
    uuid = require('node-uuid');

function buildCasperCmdArgs(config) {
  var result = [];

  if (config.mode) {
    result.push(config.mode);

    if (config.mode == 'test') {
      result.push(config.contextDir);
    }
  }

  return result;
}

function getConfig(data) {
  if (!data.git.uri) {
    throw 'git.uri property required';
  }

  var result = {};

  result.git = {
    uri: data.git.uri,
    branch: data.git.branch || 'master',
    targetDir: '/tmp/' + uuid.v4(),
    contextDir: data.git.contextDir || ''
  };

  result.casper = {
    mode: data.casper ? data.casper.mode : '',
    contextDir: result.git.targetDir + '/' + result.git.contextDir
  };

  return result;
}

var app = express();

app.post('/job', parser.json(), function(request, response) {
  sync.fiber(function() {
    var defer = sync.defer();

    var config;
    try {
      config = getConfig(request.body);
    } catch (e) {
      response.status(500).send({ error: e });
    }

    var config = getConfig(request.body);
    console.log('Cloning ' + config.git.uri + ' into ' + config.git.targetDir);

    sync.await(
      Git.Clone(config.git.uri, config.git.targetDir, { checkoutBranch: config.git.branch })
        .then(function(repo) {
          defer.apply(undefined, repo);
        })
    );

    var casper = spawnSync('casperjs', buildCasperCmdArgs(config.casper));
    if (casper.status == 0) {
      process.stdout.write(casper.stdout);
      response.status(200);
    } else {
      process.stderr.write(casper.stderr);
      response.status(500).send({ error: casper.stderr });
    }

    response.end();
  });
});

app.listen(80);
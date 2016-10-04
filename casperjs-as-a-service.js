'use strict';

var express = require('express'),
    Git = require("nodegit"),
    parser = require('body-parser'),
    exec = require('child_process').exec,
    uuid = require('node-uuid');

function buildCasperCmd(config) {
  var result = ['casperjs'];

  if (config.mode) {
    result.push(config.mode);

    if (config.mode == 'test') {
      result.push(config.contextDir);
    }
  }

  return result.join(' ');
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
  var config;
  try {
    config = getConfig(request.body);
  } catch (e) {
    response.status(500).send({ error: e });
  }

  var config = getConfig(request.body);
  console.log('Cloning ' + config.git.uri + ' into ' + config.git.targetDir);

  Git.Clone(config.git.uri, config.git.targetDir, { checkoutBranch: config.git.branch })
    .then(function() {
      exec(buildCasperCmd(config.casper), undefined, function(error, stdout, stderr) {
        if (!error) {
          process.stdout.write(stdout);
          response.status(200).send();
        } else {
          process.stderr.write(stderr);
          response.status(500).send({ error: stderr });
        }
      });
    });
});

app.listen(80);
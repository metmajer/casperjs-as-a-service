'use strict';

var express = require('express'),
    Git = require("nodegit"),
    parser = require('body-parser'),
    exec = require('child_process').exec,
    uuid = require('node-uuid');

function buildCasperCmd(config) {
  var result = ['casperjs'];

  if (config.options) {
    result.push(config.options);
  }

  if (config.mode) {
    result.push(config.mode);
  }

  if (config.mode == 'test' && !config.script) {
    result.push(config.contextDir);
  }

  if (config.script) {
    result.push(config.contextDir + '/' + config.script);
  }

  return result.join(' ');
}

function getConfig(data) {
  if (!data.git || !data.git.uri) {
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
    options: data.casper ? data.casper.options : '',
    mode: data.casper ? data.casper.mode : '',
    contextDir: result.git.targetDir + '/' + result.git.contextDir,
    script: data.casper ? data.casper.script : undefined
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
      var cmd = buildCasperCmd(config.casper);
      console.log('Executing ' + cmd);
      exec(cmd, undefined, function(error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        if (!error) {
          response.status(200).send({ stdout: stdout });
        } else {
          response.status(500).send({ stderr: stderr });
        }

        console.log('Removing directory ' + config.git.targetDir);
        exec('rm -rf ' + (config.git.targetDir), undefined, undefined);
      });
    });
});

app.listen(80);
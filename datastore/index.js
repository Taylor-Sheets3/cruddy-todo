const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let filePath = exports.dataDir + '/' + id + '.txt';
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        console.log('error writing file', err);
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('error reading file');
    } else {
      //readFiles should be an array with {id, text}
      var readFiles = _.map(files, (file) => {
        // call readFile and assign to a var
        fs.readFile(file, (err, text) => {
          if (err) {
            callback(new Error('error reading file'));
          } else {
            let id = file.slice(0, 5);
            callback(null, {id: id, text: text.toString()});
          }
        });
        // let X = file.slice(0, 5);
        // file = {id: X, text: X};
        // return file;
      });
      callback(null, readFiles);
    }
  });
};

exports.readOne = (id, callback) => {
  let filePath = exports.dataDir + '/' + id + '.txt';
  fs.readFile(filePath, (err, text) => {
    if (err) {
      callback(new Error('error reading file'));
    } else {
      callback(null, {id: id, text: text.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('error reading file');
    } else {
      let searchParam = id + '.txt';
      if (!files.includes(searchParam)) {
        callback(new Error('file does not exist'));
      } else {
        let filePath = exports.dataDir + '/' + id + '.txt';
        fs.writeFile(filePath, text, (err) => {
          if (err) {
            console.log('error writing file', err);
          } else {
            callback(null, {id, text});
          }
        });
      }
    }
  });
};


exports.delete = (id, callback) => {
  let filePath = exports.dataDir + '/' + id + '.txt';
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error('file does not exist'));
    } else {
      callback();
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

'use strict';

var fs   = require('fs')

  , writeFile = fs.writeFile, unlink = fs.unlink

  , pg = __dirname + '/__playground';

module.exports = function (t, a, d) {
	var output = pg + '/build.js';
	t(pg + '/lib/program.js', function (err, result) {
		if (err) {
			d(err);
			return;
		}

		writeFile(output, 'module.exports = ' + result, function (err) {
			if (err) {
				d(err);
				return;
			}

			var program = require(output);
			a(program.x.name, "x", "Same path require");
			a(program.x.getZ().name, "z", "Deferred call");
			a(program.x.getZ(), program.x.getZ(),
				"Requiring same object twice, should return same object");
			a(program.y.z.name, "z", "Require within required module");
			a(program.y.z.y.name, "y", "Circular dependency");
			a(program.outer.name, "outer", "Require module up tree");
			a(program.external.other.name, "external-other", "Require module from other package");
			a(program.external.main.name, "external-main", "Require main module from other package");
			a(program.external.main.module.name, "module", "Require module within other package");

			unlink(output, d);
		});
	});
};
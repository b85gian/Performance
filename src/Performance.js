let Performance = () => {
	'use strict'

	let options, t, records = {};

	const checkOptions = (opts) => {
		const defaults = {
			verbose: false,
			reliable: true,
			interval: 1000,
			tests: 5
		};

		if (opts && Object.keys(opts).length) {
			return {
				verbose: opts.verbose != "undefined" && typeof opts.verbose == "boolean" ?
                 			 opts.verbose : defaults.verbose,
				reliable: opts.reliable != "undefined" && typeof opts.reliable == "boolean" ?
					  opts.reliable : defaults.reliable,
				interval: opts.interval && typeof opts.interval == "number" ?
					  opts.interval : defaults.interval,
				tests:	opts.tests && opts.tests > 2 && typeof opts.tests == "number" ?
					opts.tests : defaults.tests
			}
		}

		return defaults
	};

	const isReliable = (t_arr) => {
		var max = Math.max(...t_arr),
			  min = Math.min(...t_arr);

		t.excludedValues = {
			max: max,
			min: min
		};

		t_arr.splice(t_arr.indexOf(max), 1);
		t_arr.splice(t_arr.indexOf(min), 1);
	};

	const mean = (t_arr) => {
		return t_arr.reduce(function(acc, cur) { return acc + cur }) / t_arr.length
	};

  const performTests = () => {
		if (t.timings.length < options.tests) {
			t.timings.push(test(callback, args));
		} else {
			t.callback = callback.name;
			postProc();
			printResults();
			clearInterval(timeout);
		}
  };

	const main = (callback, args, opts) => {
		options = checkOptions(opts);
		t = { timings: [], outputs: [] };

		console.clear();
		console.log("Testing...");
		const timeout = setInterval(performTests, options.interval);
	}

	const test = (callback, args) => {
		let t0, t1, res;

		t0 	= performance.now();
		res = callback.apply(this, args);
		t1 	= performance.now();

		t.outputs.push(res);

		return t1 - t0;
	}

	const postProc = () => {
		if (options.reliable)
			isReliable(t.timings);

		t.max  = Math.max(...t.timings);
		t.min  = Math.min(...t.timings);
		t.mean = mean(t.timings);
		t.reliable = options.reliable;
		t.interval = options.interval;
		t.tests = options.tests;

		records["Test_"+(Object.keys(records).length + 1)] = t;

		return true;
	}

	const printResults = () => {
		console.clear();

		if (options.verbose) {
			t.outputs.forEach(function(el, i) {
				console.log("Output #" + (i + 1));
				console.log(el + "\n\n");
			});
    }

		console.log(
				"%cExecution timings (statistically " +
				(options.reliable ? "RELIABLE" : "UNRELIABLE") +
				"):\n", 
				"color: yellow"
			);
		console.log("--------------------------------------------------------");
		console.log(
                "\n%cTiming mean value: " +
                t.mean + "ms" +
                " (%cMAX%c " + t.max + "ms | %cMIN%c " +
                t.min + "ms%c)",
                "font-style: italic;",
                "color: white; background: red;",
                "color: white",
                "color: white; background: green",
                "color: white",
                "color: white"
              );

		return true;
	}

	const removeRecord = (i) => {
		delete records["Test_"+Object.keys(records)[i]];

		return records;
	}

	const clearAllRecords = () => {
		Object.keys(records).forEach(function(el) {
			delete records[el];
		});
	}

	return {
		add: (callback, args, opts) => main(callback, args, opts),
		remove: (i) => removeRecord(i),
		list: () => records,
		getEntryByIndex: (i) => records["Test_"+i],
		getEntriesByCallback: (name) => {
			let res = { tests: [] };

			Object.keys(records).forEach(
				item => records[item].callback != name || res.tests.push(records[item])
			);
			return res.tests.length ? res : "Test not found.";
		},
		getMeansByCallback: (name) => {
			let res = {};
			res[name] = [];

			Object.keys(records).forEach(
				item => records[item].callback != name || res[name].push(records[item].mean)
			);
			return res[name].length ? res : "Test not found.";
		},
		getPerformances: () => {
			let res = {};

			Object.keys(records).forEach(
				item => res[records[item].callback] = records[item].mean
			);

			return res;
		},
		clearAllRecords: () => clearAllRecords()
	}
};

((w) => {
  w.ExtendedPerformance = Performance;
})(window);

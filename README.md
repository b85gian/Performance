# Performance.js

### Scope
It's an articulated snippet of code to test the performance of JS code.

### What it does
The snippet can be run in e.g. `Chrome DevTools` and attaches the interface `ExtendedPerformance` to the global namespace. It relies on the `Performance` interface API and returns the high-precision execution time of JS code run within a callback function, after performing multiple tests.

### Basic usage
The snippet can be run in `Chrome DevTools` and needs be passed your code through a callback function with arguments, if any are present.
The interface provides multiple methods to handle and customize the tests performed.

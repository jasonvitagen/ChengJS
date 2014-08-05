'use strict';
(function () {
	/**
	 * cheng internal api
	 * @return {obj} expose api(s)
	 */
	function cheng () {
		var modules = [];
		var queues = [];
		function mergeServicesFromRequiredModules (m, modules, modulesNameList) {
			var i = modulesNameList.length;
			for (var i = 0, len = modulesNameList.length; i < len; i++) {
				var moduleName = modulesNameList[i];
				for (var j = 0, len2 = modules.length; j < len2; j++) {
					var module = modules[j];
					if (moduleName == module.getName()) {
						m.setExternalServices(module.getServices());
					}
				}
			}
			return m;
		}
		function module (name, modulesNameList) {
			var m = new Module(name, modulesNameList);
			mergeServicesFromRequiredModules(m, modules, modulesNameList);
			modules.push(m);
			return m;
		}
		return {
			module : module
		};
	}
	/**
	 * Module constructor
	 * @param {string} 	name  Module's name
	 */
	function Module (name, modulesNameList) {
		var name = name;
		var modulesNameList = modulesNameList;
		var services = [];
		var extServices = [];
		function getToBeInjectedServices (services, extServices, servicesNameList) {
			var toBeInjectedServices = [];
			var allServices = services.concat(extServices);
			var i = servicesNameList.length;
			for (var i = 0, len = servicesNameList.length; i < len; i++) {
				var serviceName = servicesNameList[i];
				for (var j = 0, len2 = allServices.length; j < len2; j++) {
					var service = allServices[j];
					if (serviceName == service.getName()) {
						toBeInjectedServices.push(service.getApis());
					}
				}
			}
			return toBeInjectedServices;
		}
		this.getName = function () {
			return name;
		}
		this.factory = function (name, servicesNameList, callback) {
			var service = new Service(name, servicesNameList);
			var toBeInjectedServices = getToBeInjectedServices(services, extServices, servicesNameList);
			var apis = callback.apply(null, toBeInjectedServices);
			service.setApis(apis);
			services.push(service);
		}
		this.getServices = function () {
			return services;
		}
		this.setExternalServices = function (servicesList) {
			extServices = extServices.concat(servicesList);
		}
		this.controller = function (name, servicesNameList, callback) {
			var toBeInjectedServices = getToBeInjectedServices(services, extServices, servicesNameList);
			callback.apply(null, toBeInjectedServices);
		}
	}
	/**
	 * Service constructor
	 * @param {string}   name          Service's name
	 * @param {array}    dependencies  List of services dependencies
	 * @param {function} callback      Service's callback
	 */
	function Service (name, servicesNameList) {
		var name = name;
		var dependencies = servicesNameList;
		var apis;
		this.getName = function () {
			return name;
		}
		this.setApis = function (apisList) {
			apis = apisList;
		}
		this.getApis = function () {
			return apis;
		}
	}
	// expose cheng global object
	window.cheng = cheng();
})();

var startTime, endTime;

startTime = new Date().getTime();
var myApp = cheng.module('app1', ['app2']);

myApp.factory('utilities', [], function () {

	function multiply (x, y) {
		return x * y;
	}
	function divide (x, y) {
		return x / y;
	}

	return {
		multiply : multiply,
		divide : divide
	}

});

myApp.controller('mainCtrl', ['utilities'], function (utilities) {
	console.log(utilities.multiply(5, 4));

	console.log(utilities.divide(20, 4));
});

var myApp2 = cheng.module('app2', ['app1']);

myApp2.factory('utilites2', ['utilities'], function (utilities) {
	console.log(utilities.multiply(2,5));

	return {
		a : function () { console.log('fsaf'); }
	}
});

myApp.factory('fsfsdf', ['utilities2'], function (utilities2) {
	
});

endTime = new Date().getTime();
console.log(startTime);
console.log(endTime);
console.log(endTime - startTime);
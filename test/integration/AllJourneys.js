/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"MTK/ZUMPUP0001/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"MTK/ZUMPUP0001/test/integration/pages/Worklist",
	"MTK/ZUMPUP0001/test/integration/pages/Object",
	"MTK/ZUMPUP0001/test/integration/pages/NotFound",
	"MTK/ZUMPUP0001/test/integration/pages/Browser",
	"MTK/ZUMPUP0001/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "MTK.ZUMPUP0001.view."
	});

	sap.ui.require([
		"MTK/ZUMPUP0001/test/integration/WorklistJourney",
		"MTK/ZUMPUP0001/test/integration/ObjectJourney",
		"MTK/ZUMPUP0001/test/integration/NavigationJourney",
		"MTK/ZUMPUP0001/test/integration/NotFoundJourney",
		"MTK/ZUMPUP0001/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});
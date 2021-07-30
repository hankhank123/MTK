sap.ui.define([
		"MTK/ZUMPUP0002/ZUMPUP0002/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("MTK.ZUMPUP0002.ZUMPUP0002.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);
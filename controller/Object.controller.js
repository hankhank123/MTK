/*global location*/
sap.ui.define([
	"MTK/ZUMPUP0002/ZUMPUP0002/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"MTK/ZUMPUP0002/ZUMPUP0002/model/formatter",
	"sap/m/PDFViewer",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/ushell/services/UserInfo"
], function(
	BaseController,
	JSONModel,
	History,
	formatter,
	PDFViewer,
	Filter,
	MessageToast
) {
	"use strict";

	return BaseController.extend("MTK.ZUMPUP0002.ZUMPUP0002.controller.Object", {

		formatter: formatter,

		onInit: function() {
			
			this.getView().setModel(new sap.ui.model.json.JSONModel({}), "cData");
			this.getView().setModel(new sap.ui.model.json.JSONModel({}), "cView"); //cData->cView
			//			this.getView().setModel(new JSONModel({ "items":[]}), "cAttach");    //0710 Add
			if (window.location.href.search("localhost") < 0 && window.location.href.search("PurchaseOrder-displayPoDetail") < 0) {
				this.getRouter().getRoute("object2").attachPatternMatched(this._onObjectMatched, this);
			} else {
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			}

			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		getHeaderData: function(sObjectId) {

			var oModel = this.getView().getModel();
			var sPath = "/ZI_epo_hd(pi_ebeln='" + sObjectId + "')/Set";

			oModel.read(sPath, {
				success: function(oData) {
					this.getView().getModel("cData").setProperty("/hd", oData.results[0]);

					var aText = this.getView().getModel("cData").getProperty("/hd/text");
					var bText = aText.replace(/\\n/g, "\n");
					this.getView().byId("TextArea1").setValue(bText);
					
					this.getVisiableData();
				}.bind(this),

				error: function(e) {

				}
			});
		},

		getItemData: function(sObjectId) {
			var oModel = this.getView().getModel();
			var sPath = "/ZI_epo_it(pi_ebeln='" + sObjectId + "')/Set";
			oModel.read(sPath, {
				success: function(oData) {
					this.getView().getModel("cData").setProperty("/it", oData.results);

				}.bind(this),

				error: function(e) {

				}
			});

		},

		getAttachmentData: function(sObjectId) {

			var oModel = this.getView().getModel();
			var sPath = "/ZI_epo_att(pi_ebeln='" + sObjectId + "')/Set";
			var upload = this.getView().byId("UploadSet");

			oModel.read(sPath, {
				success: function(oAttach) {
					//*0710 add
					//					this.getView().getModel("cData").setProperty("/att", oData.results);
//20210730 remove space					
					this.getView().byId("UploadSet").removeAllItems();
				 	this.getView().byId("UploadSet").removeAllIncompleteItems();

					this.getView().getModel("cData").setProperty("/att", oAttach.results);
					
					for (var i = 0; i < oAttach.results.length; i++) {

						var atts = [{
							"title": "Uploaded date",
							"text": oAttach.results[i].cdate,
							"active": true
						}, {
							"title": "Uploaded time",
							"text": oAttach.results[i].ctime,
							"active": true
						}, {
							"title": "Uploaded by",
							"text": oAttach.results[i].cname,
							"active": true
						}, {
							"title": "File Size",
							"text": oAttach.results[i].fsize,
							"active": true
						}];

						//0711		
						var sPre = "/sap/opu/odata/SAP/ZEPO_EXTENSION_SRV/FileSet(",
							sCom = "'",
							sVal = ")/$value",
							sUrl = sPre + sCom + oAttach.results[i].documentid + sCom + sVal;
						//                     	sUrl = "/sap/opu/odata/sap/ZEPO_EXTENSION_SRV/FileSet('FOL33000000000004EXT45000000771525')/$value";						
						var cAttach = new sap.m.upload.UploadSetItem({
							"documentId": oAttach.results[i].documentid,
							"fileName": oAttach.results[i].filename + "." + oAttach.results[i].type,
							"mimeType": oAttach.results[i].type,
							"thumbnailUrl": "",
							"size": oAttach.results[i].fsize,
							"url": sUrl,
							"uploadState": "Complete",
							"attributes": atts

						});
						// 0719 modify 				
						// 						this.getView().byId("UploadSet").addItem(cAttach);
						var str;
						str = oAttach.results[i].filename.substr(0, 6);

						if (str.toUpperCase() === "REPORT" && oAttach.results[i].type === 'PDF') {
							this.getView().byId("myPdfViewer").setSource(sUrl); //("/sap/opu/odata/SAP/ZEPO_EXTENSION_SRV/FileSet('FOL33000000000004EXT45000000355280')/$value");//("/sap/opu/odata/sap/ZEPO_EXTENSION_SRV/FileSet('smart@4500042710')/$value");
							this.getView().byId("myPdfViewer").setTitle(oAttach.results[i].filename);
							this.getView().byId("myPdfViewer").setHeight("600px");
							/*this.getView().byId("myPdfViewer").setVisible(true);*/
						} else {
							this.getView().byId("UploadSet").addItem(cAttach);
						}
						//						if (oAttach.results[i].filename.substr(0, 6) === "Report") {

						//						}

						//0716 add						
						setTimeout(function() {
							this.refreshDisplay();
						}.bind(this), 1000);
					}

				}.bind(this),

				error: function(e) {

				}
			});
		},

		getApprovalHis: function(sObjectId) {
			var oModel = this.getView().getModel();
			var sPath = "/ZI_epo_his(pi_ebeln='" + sObjectId + "')/Set";

			oModel.read(sPath, {
				success: function(oData) {
					this.getView().getModel("cData").setProperty("/his", oData.results);
				}.bind(this),

				error: function(e) {

				}
			});
		},

		//*0711  add		 
		onDraft: function(oEvent) {
			var beln = this.getView().getModel("cData").getProperty("/hd/ebeln");
			var sPre = "/sap/opu/odata/sap/ZEPO_EXTENSION_SRV/FileSet(",
				sCom = "'",
				sVal = ")/$value",
				sDocID = "smart" + "@" + beln,
				sUrl = "";

			sUrl = sPre + sCom + sDocID + sCom + sVal;
			//				sUrl = "/sap/opu/odata/sap/ZEPO_EXTENSION_SRV/FileSet('smart@4500041833')/$value";

			var opdfViewer = new PDFViewer();
			this.getView().addDependent(opdfViewer);
			opdfViewer.setSource(sUrl);
			opdfViewer.setTitle("My PDF");
			opdfViewer.open();

		},

		getVisiableData: function() {
			
			this.getView().setModel(new JSONModel({
				"visible": {
					"basictitle": false,
					"sf": false,
					/*"panel1": true,*/
					"paymentterms": true,
					"tradeterms": true,
					"purchasetype": true,
					"vendorselection": true,
					"contractinformation": true,
					"yoy": true,
					"buyercomment": true

				},
				"editable": {
					"attach": false
				}
			}), "cView");

			var oModel = this.getView().getModel();
			var oDocument_id = this.getView().getModel("cData").getProperty("/hd/bsart");
			var oFilter = [new Filter("BSART", "EQ", oDocument_id)];

			oModel.read("/ZI_epo_vis", {
				filters: oFilter,
				success: function(oData) {

					/*	this.getView().getModel("cView").setProperty("/visible", oData.results);*/

					for (var i = 0; i < oData.results.length; i++) {
						var visible = "";
						visible = "/visible/" + oData.results[i].FLDNM.toLowerCase();
						if (oData.results[i].PO_HIDE === '') {
							this.getView().getModel("cView").setProperty(visible, true);
							if (visible !== "/visible/yoy") {
								this.getView().getModel("cView").setProperty("/visible/basictitle", true);
							}
							this.getView().getModel("cView").setProperty("/visible/sf", true);
						} else {
							this.getView().getModel("cView").setProperty(visible, false); //hide
						}
					}
					
					if (oData.results.length !== "0") {
						/*						var vData = this.getView().getModel("cView").getProperty("/visible");
												if (vData.paymentterms === false && vData.tradeterms === false) {
													this.getView().getModel("cView").setProperty("/visible/panel1", false);
												} else {
													if (vData.purchasetype === false && vData.vendorselection === false && vData.contractinformation === false) {
														this.getView().getModel("cView").setProperty("/visible/panel1", false);
													}
												}*/

					} else {
						this.getView().getModel("cView").setProperty("/visible/basictitle", true);
						this.getView().getModel("cView").setProperty("/visible/sf", true);
					}

				}.bind(this),

				error: function(e) {

				}
			});

		},

		onLink: function() {
			
			var po = this.getView().getModel("cData").getProperty("/hd/ebeln");
			var link = {
				url: this.i18n("linkurl")
			};

			var linkurl = link.url + po;
			sap.m.MessageBox.success(this.i18n("copy") + linkurl);

			
		},

		i18n: function(txt) {
			return this.getView().getModel("i18n").getResourceBundle().getText(txt);
		},

		//0716 add			
		refreshDisplay: function() {
			

			//*		var oUser = new sap.ushell.services.UserInfo();
			//*		var userID ="";
			//*			userID =  oUser.getId();
			/*			this.getView().setModel(new JSONModel({

							"editable": {
								"attach": false
							}

						}), "cView");*/

			
			var i;
			var upload = this.getView().byId("UploadSet");
			if (upload.getUploadEnabled() === false) {
				for (i = 0; i < upload.getItems().length; i++) {
					var att = this.getView().getModel("cData").getProperty("/att");
					var uploaditemId = upload.getItems()[i].getId();
					$("#" + uploaditemId + "-editButton").hide();
					//					if( userID !== att.creatid )
					//					{
					$("#" + uploaditemId + "-deleteButton").hide();
					//					}
				}
			}
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();
			
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Ebeln,
				sObjectName = oObject.Ebeln;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#PurchaseOrder-displayPoDetail&/ZI_epo_list/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		onBpop: function(e) {
			
			var sPath =
				this.getView().getBindingContext().getPath();

			var s1 = sPath.replace("/ZI_epo_list('", '');
			var s2 = s1.replace("')", '');

			var p = e.getParameters();
			p.setSemanticAttributes({
				PurchaseOrder: s2
			});
			p.open();

		},

		onVpop: function(e) {
			
			var vendor = this.getView().getModel("cData").getProperty("/hd/lifnr");

			var p = e.getParameters();
			p.setSemanticAttributes({
				BusinessPartner: vendor
			});
			p.open();

		},

		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			/*if (sObjectId.length <= 0) {*/
			if (sObjectId === undefined) {
				var id = oEvent.getParameters().arguments.wfInstanceId;
				this.getView().getModel("cView").setProperty("/wfid", id);
				var compData = this.getOwnerComponent().getComponentData();
				this.getView().getModel("cView").setProperty("/wfpo", compData.startupParameters.data[0]);
				sObjectId = compData.startupParameters.data[0];

			}

			this.getHeaderData(sObjectId);
			this.getItemData(sObjectId);
			this.getApprovalHis(sObjectId);
			this.getAttachmentData(sObjectId);
			//			this.refreshDisplay();

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("ZI_epo_list", {
					Ebeln: sObjectId
				});
				
				this._bindView("/" + sObjectPath);
			}.bind(this));
		}

	});

});